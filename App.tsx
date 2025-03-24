import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { auth } from './src/services/firebase';

export default function App() {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        signInAnonymously(auth)
          .then(() => console.log('Anonim kullanıcı girişi başarılı'))
          .catch((error) => console.log('Anonim giriş hatası:', error));
      } else {
        console.log('Giriş yapılmış UID:', user.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}