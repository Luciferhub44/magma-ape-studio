
import { ApeMetadata } from "../types";

export async function fetchApeMetadata(apeId: string): Promise<ApeMetadata> {
  const response = await fetch(`https://ipfs.io/ipfs/QmYiqbFQynqB4jY65fepccx8M9SivnSjoUR8wfN5r3A7bE/${apeId}`);
  if (!response.ok) throw new Error("Ape DNA not found in IPFS registry.");
  return await response.json();
}

export async function imageToBase64(url: string): Promise<string> {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
