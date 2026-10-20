import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, onSnapshot, getDoc } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { AppStateData } from './storage';

// Initialize Firebase SDK
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

const ACADEMY_STATE_DOC = 'state';
const ACADEMY_COLLECTION = 'academy';

export interface CloudSyncStatus {
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncedAt: string | null;
  error: string | null;
}

/**
 * Save current state to Firebase Firestore
 */
export async function syncStateToFirestore(data: AppStateData): Promise<boolean> {
  try {
    const docRef = doc(db, ACADEMY_COLLECTION, ACADEMY_STATE_DOC);
    await setDoc(docRef, {
      ...data,
      lastUpdatedAt: new Date().toISOString(),
    }, { merge: true });
    return true;
  } catch (err: unknown) {
    console.warn('Firestore sync write skipped/failed:', err);
    return false;
  }
}

/**
 * Subscribe to real-time changes from Firestore
 */
export function subscribeToFirestoreState(
  onStateChange: (cloudData: AppStateData) => void,
  onStatusChange: (status: Partial<CloudSyncStatus>) => void
): () => void {
  try {
    const docRef = doc(db, ACADEMY_COLLECTION, ACADEMY_STATE_DOC);
    
    onStatusChange({ isSyncing: true });

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      onStatusChange({ isSyncing: false });

      if (docSnap.exists()) {
        const cloudData = docSnap.data();
        if (cloudData && Array.isArray(cloudData.students)) {
          const validatedState: AppStateData = {
            students: cloudData.students || [],
            classes: cloudData.classes || [],
            units: cloudData.units || [],
            attendances: cloudData.attendances || [],
            consultations: cloudData.consultations || [],
            exams: cloudData.exams || [],
            assignments: cloudData.assignments || [],
            invoices: cloudData.invoices || [],
            clinics: cloudData.clinics || [],
            notifications: cloudData.notifications || [],
          };
          onStatusChange({
            isOnline: true,
            lastSyncedAt: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            error: null,
          });
          onStateChange(validatedState);
        }
      } else {
        // Document does not exist yet on cloud, we are ready to write
        onStatusChange({ isOnline: true, error: null });
      }
    }, (error) => {
      console.warn('Firestore real-time subscription error:', error);
      onStatusChange({
        isOnline: false,
        isSyncing: false,
        error: error.message || '클라우드 동기화 연결 대기 중',
      });
    });

    return unsubscribe;
  } catch (err: unknown) {
    console.warn('Firestore subscription initialization error:', err);
    onStatusChange({
      isOnline: false,
      isSyncing: false,
      error: '클라우드 DB 초기화 오류',
    });
    return () => {};
  }
}
