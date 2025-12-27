import { ResumeData, ResumeSettings, DEFAULT_RESUME_DATA, DEFAULT_SETTINGS } from '@/types/resume';

const DB_NAME = 'ResumeBuilderDB';
const DB_VERSION = 1;

let db: IDBDatabase | null = null;

export async function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;
      
      // Resumes store
      if (!database.objectStoreNames.contains('resumes')) {
        const resumeStore = database.createObjectStore('resumes', { keyPath: 'id' });
        resumeStore.createIndex('updatedAt', 'updatedAt', { unique: false });
      }
      
      // Settings store
      if (!database.objectStoreNames.contains('settings')) {
        database.createObjectStore('settings', { keyPath: 'id' });
      }
      
      // Current resume store
      if (!database.objectStoreNames.contains('current')) {
        database.createObjectStore('current', { keyPath: 'key' });
      }
    };
  });
}

export async function saveResume(resume: ResumeData): Promise<void> {
  const database = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['resumes'], 'readwrite');
    const store = transaction.objectStore('resumes');
    
    const updatedResume = {
      ...resume,
      updatedAt: new Date(),
    };
    
    const request = store.put(updatedResume);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

export async function getResume(id: string): Promise<ResumeData | null> {
  const database = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['resumes'], 'readonly');
    const store = transaction.objectStore('resumes');
    const request = store.get(id);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result || null);
  });
}

export async function getAllResumes(): Promise<ResumeData[]> {
  const database = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['resumes'], 'readonly');
    const store = transaction.objectStore('resumes');
    const request = store.getAll();
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const resumes = request.result || [];
      resumes.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      resolve(resumes);
    };
  });
}

export async function deleteResume(id: string): Promise<void> {
  const database = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['resumes'], 'readwrite');
    const store = transaction.objectStore('resumes');
    const request = store.delete(id);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

export async function duplicateResume(id: string): Promise<ResumeData> {
  const original = await getResume(id);
  
  if (!original) {
    throw new Error('Resume not found');
  }
  
  const duplicate: ResumeData = {
    ...original,
    id: crypto.randomUUID(),
    name: `${original.name} (Copy)`,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  await saveResume(duplicate);
  return duplicate;
}

export async function saveSettings(settings: ResumeSettings): Promise<void> {
  const database = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['settings'], 'readwrite');
    const store = transaction.objectStore('settings');
    
    const request = store.put({ id: 'default', ...settings });
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

export async function getSettings(): Promise<ResumeSettings> {
  const database = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['settings'], 'readonly');
    const store = transaction.objectStore('settings');
    const request = store.get('default');
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      if (request.result) {
        const { id, ...settings } = request.result;
        resolve(settings as ResumeSettings);
      } else {
        resolve(DEFAULT_SETTINGS);
      }
    };
  });
}

export async function setCurrentResumeId(id: string): Promise<void> {
  const database = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['current'], 'readwrite');
    const store = transaction.objectStore('current');
    
    const request = store.put({ key: 'currentResumeId', value: id });
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

export async function getCurrentResumeId(): Promise<string | null> {
  const database = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['current'], 'readonly');
    const store = transaction.objectStore('current');
    const request = store.get('currentResumeId');
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      resolve(request.result?.value || null);
    };
  });
}

export function createNewResume(): ResumeData {
  return {
    ...DEFAULT_RESUME_DATA,
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
