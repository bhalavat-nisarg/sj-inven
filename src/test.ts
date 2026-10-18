// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { IonRouterOutlet } from '@ionic/angular';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
  { errorOnUnknownElements: true, errorOnUnknownProperties: true }
);

beforeEach(() => {
  const snapshot = jasmine.createSpyObj<firebase.firestore.QuerySnapshot>(
    'query snapshot', ['forEach'], { docs: [], empty: true, size: 0 }
  );
  const documentSnapshot = jasmine.createSpyObj<firebase.firestore.DocumentSnapshot>(
    'document snapshot', ['get', 'data'], { exists: false }
  );
  documentSnapshot.get.and.returnValue(0);
  documentSnapshot.data.and.returnValue(undefined);
  const document = jasmine.createSpyObj<firebase.firestore.DocumentReference>(
    'document', ['get']
  );
  document.get.and.returnValue(Promise.resolve(documentSnapshot));
  const collection = jasmine.createSpyObj<firebase.firestore.CollectionReference>(
    'collection', ['get', 'orderBy', 'where', 'doc']
  );
  collection.get.and.returnValue(Promise.resolve(snapshot));
  collection.orderBy.and.returnValue(collection);
  collection.where.and.returnValue(collection);
  collection.doc.and.returnValue(document);
  const firestore = jasmine.createSpyObj<firebase.firestore.Firestore>(
    'firestore', ['collection']
  );
  firestore.collection.and.returnValue(collection);
  const originalFirestore = firebase.firestore;
  const firestoreSpy = spyOn(firebase, 'firestore').and.returnValue(firestore);
  Object.assign(firestoreSpy, originalFirestore);
  const app = jasmine.createSpyObj<firebase.app.App>('firebase app', ['delete']);
  spyOn(firebase, 'initializeApp').and.returnValue(app);

  getTestBed().configureTestingModule({
    imports: [FormsModule],
    providers: [
      provideRouter([]),
      {
        provide: IonRouterOutlet,
        useValue: jasmine.createSpyObj<IonRouterOutlet>('router outlet', ['canGoBack']),
      },
    ],
  });
});
