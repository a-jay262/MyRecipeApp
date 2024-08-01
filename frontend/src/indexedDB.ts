import { openDB } from 'idb';

const DATABASE_NAME = 'offlineDataDB';
const STORE_NAME = 'recipes';

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

export const addRecipeToIndexedDB = async (recipe: any) => {
  const db = await initializeDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  await tx.objectStore(STORE_NAME).add(recipe);
  await tx.done;
};

export const getAllRecipesFromIndexedDB = async (): Promise<any[]> => {
  const db = await initializeDB();
  return await db.getAll(STORE_NAME);
};

export const deleteRecipeFromIndexedDB = async (id: number) => {
  const db = await initializeDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  await tx.objectStore(STORE_NAME).delete(id);
  await tx.done;
};
