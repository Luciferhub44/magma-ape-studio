
import { GeneratedAsset } from "../types";

const DB_NAME = "MagmaApeStudioDB";
const STORE_NAME = "assets";
const DB_VERSION = 1;

export async function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveAsset(asset: GeneratedAsset): Promise<void> {
  // Pre-process the URL outside the transaction to avoid auto-commit issues
  let storableUrl = asset.url;
  if (asset.url.startsWith('blob:')) {
    try {
      const response = await fetch(asset.url);
      const blob = await response.blob();
      storableUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error("Failed to read blob for storage"));
        reader.readAsDataURL(blob);
      });
    } catch (e) {
      console.error("Error converting blob for storage:", e);
      // Fallback to existing URL if conversion fails, though it won't persist across sessions
    }
  }

  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);

    const request = store.put({ ...asset, url: storableUrl });
    
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    request.onerror = () => reject(request.error);
  });
}

export async function getAllAssets(): Promise<GeneratedAsset[]> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      const assets = request.result as GeneratedAsset[];
      resolve(assets.sort((a, b) => b.timestamp - a.timestamp));
    };
    request.onerror = () => reject(request.error);
  });
}

export async function removeAsset(id: string): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const request = store.delete(id);
    
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    request.onerror = () => reject(request.error);
  });
}
