import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import { openDB } from "idb";
import { syncRecipe } from "./reducers/recipeSlice";
import { useAppDispatch } from "../src/store/store";


interface NetworkContextType {
  isOnline: boolean;
  saveDataLocally: (data: any) => void;
  syncDataWithServer: () => void;
}

export interface Step {
  step: string;
  des: string;
}

export interface Ingredients {
  item: string;
  quantity: number;
  unit: string;
}

export interface Recipe {
  _id: string;
  id: number;
  name: string;
  size: number;
  ingredients: Ingredients[];
  steps: Step[];
  category: string;
  image: string | null;
  checked: boolean;
  cookCount: number;
  favorites: boolean; // Added favorite field
}

const NetworkContext = createContext<NetworkContextType>({
  isOnline: true,
  saveDataLocally: () => {},
  syncDataWithServer: () => {},
});

const DATABASE_NAME = "offlineDataDB";
const STORE_NAME = "recipes";

const initializeDB = async () => {
  const db = await openDB(DATABASE_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { autoIncrement: true });
      }
    },
  });
  return db;
};

export const NetworkProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const dispatch = useAppDispatch();

  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncDataWithServer();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const saveDataLocally = async (data: any) => {
    try {
      const db = await initializeDB();
      const tx = db.transaction(STORE_NAME, "readwrite");
      await tx.objectStore(STORE_NAME).add(data);
      await tx.done;
    } catch (error) {
      console.error("Error saving data locally:", error);
    }
  };

  const loadOfflineData = async () => {
    try {
      const db = await initializeDB();
      const tx = db.transaction(STORE_NAME, "readonly");
      const allData = await tx.objectStore(STORE_NAME).getAll();
      return allData;
    } catch (error) {
      console.error("Error loading offline data:", error);
      return [];
    }
  };

  const clearOfflineData = async () => {
    try {
      const db = await initializeDB();
      const tx = db.transaction(STORE_NAME, "readwrite");
      await tx.objectStore(STORE_NAME).clear();
      await tx.done;
    } catch (error) {
      console.error("Error clearing offline data:", error);
    }
  };

  const base64ToBlob = (base64: string, mime: string): Blob => {
    const byteCharacters = atob(base64.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mime });
  };
  
  const syncDataWithServer = async () => {
    const offlineData: Partial<Recipe>[] = await loadOfflineData();
    if (offlineData.length > 0) {
      try {
        await Promise.all(
          offlineData.map(async (data: Partial<Recipe>) => {
            if (data.image && data.image.startsWith('data:image')) {
              const match = data.image.match(/data:(.*);base64,/);
              if (match) {
                const mimeType = match[1];
                const blob = base64ToBlob(data.image, mimeType);
                const formData = new FormData();
                formData.append('image', blob, 'upload.png');
  
                try {
                  const response = await fetch('http://localhost:5000/upload', {
                    method: 'POST',
                    body: formData,
                  });
  
                  if (!response.ok) {
                    console.error('Image re-upload failed:', response.statusText);
                  } else {
                    const responseData = await response.json();
                    data.image = responseData.filePath; // Update image URL from server response
                  }
                } catch (error) {
                  console.error('Error uploading image:', error);
                }
              }
            }
  
            await dispatch(syncRecipe(data));
          })
        );
        await clearOfflineData();
      } catch (error) {
        console.error('Error syncing data:', error);
      }
    }
  };
  
  return (
    <NetworkContext.Provider
      value={{ isOnline, saveDataLocally, syncDataWithServer }}
    >
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = () => useContext(NetworkContext);
