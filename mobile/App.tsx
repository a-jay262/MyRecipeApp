// App.tsx
import React, {useEffect} from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import PushNotification from 'react-native-push-notification';
import { store, persistor } from './src/store/store'; 
import { ToastProvider } from 'react-native-toast-notifications';
import FlashMessage from 'react-native-flash-message';

const App: React.FC = () => {
  PushNotification.createChannel(
    {
      channelId: 'recipe-channel11', // Unique channel ID
      channelName: 'Recipe Notifications', // Visible channel name
      channelDescription: 'A channel to categorize recipe notifications',
      playSound: true,
      soundName: 'default', // Default sound
      importance: 4, // High importance level
      vibrate: true,
    },
    created => console.log(`CreateChannel returned '${created}'`) // Log the result
  );
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
        <ToastProvider>
        <FlashMessage position="bottom" />
          <AppNavigator />
        </ToastProvider>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
