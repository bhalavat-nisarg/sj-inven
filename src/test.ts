import { afterEach, beforeEach, vi } from 'vitest';
import { getTestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { IonRouterOutlet } from '@ionic/angular';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

beforeEach(() => {
  const snapshot = { forEach: vi.fn(), docs: [], empty: true, size: 0 };
  const documentSnapshot = {
    get: vi.fn().mockReturnValue(0),
    data: vi.fn(),
    exists: false,
  };
  const document = { get: vi.fn().mockResolvedValue(documentSnapshot) };
  const collection = {
    get: vi.fn().mockResolvedValue(snapshot),
    orderBy: vi.fn(),
    where: vi.fn(),
    doc: vi.fn().mockReturnValue(document),
  };
  collection.orderBy.mockReturnValue(collection);
  collection.where.mockReturnValue(collection);
  const firestore = { collection: vi.fn().mockReturnValue(collection) };
  const originalFirestore = firebase.firestore;
  const firestoreSpy = vi.spyOn(firebase, 'firestore')
    .mockReturnValue(firestore as unknown as firebase.firestore.Firestore);
  Object.assign(firestoreSpy, originalFirestore);
  vi.spyOn(firebase, 'initializeApp')
    .mockReturnValue({ delete: vi.fn() } as unknown as firebase.app.App);

  getTestBed().configureTestingModule({
    imports: [FormsModule],
    providers: [
      provideRouter([]),
      {
        provide: IonRouterOutlet,
        useValue: { canGoBack: vi.fn() },
      },
    ],
  });

});

afterEach(() => vi.restoreAllMocks());
