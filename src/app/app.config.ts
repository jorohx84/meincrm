import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideFirebaseApp(() => initializeApp({ projectId: "meincrm", appId: "1:905641959941:web:5cb71edc0af2246abeb26c", storageBucket: "meincrm.firebasestorage.app", apiKey: "AIzaSyDRUI58Yt-w7BDXIouolk3ff_jw6XPCzAQ", authDomain: "meincrm.firebaseapp.com", messagingSenderId: "905641959941" })), provideAuth(() => getAuth()), provideFirestore(() => getFirestore())]
};
