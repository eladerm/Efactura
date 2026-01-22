'use client';
import { useState } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useFirebase } from '@/firebase';

export function useUploadFile() {
  const { firebaseApp } = useFirebase();
  const [progress, setProgress] = useState(0);
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const uploadFile = (file: File, path: string = 'uploads') => {
    if (!firebaseApp) {
        setError("Firebase no está inicializado.");
        return;
    }
    const storage = getStorage(firebaseApp);
    const storageRef = ref(storage, `${path}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    setIsUploading(true);
    setIsSuccess(false);
    setError(null);
    setProgress(0);
    setUrl(null);

    return new Promise<string>((resolve, reject) => {
        uploadTask.on(
        'state_changed',
        (snapshot) => {
            const currentProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(currentProgress);
        },
        (error) => {
            console.error("Error al subir archivo:", error);
            setError(`Error al subir el archivo: ${error.message}`);
            setIsUploading(false);
            reject(error.message);
        },
        async () => {
            try {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                setUrl(downloadURL);
                setIsSuccess(true);
                resolve(downloadURL);
            } catch (e: any) {
                console.error("Error al obtener URL de descarga:", e);
                setError(`Error al obtener URL: ${e.message}`);
                reject(e.message);
            } finally {
                setIsUploading(false);
            }
        }
        );
    });
  };

  return { progress, url, error, isUploading, isSuccess, uploadFile };
}
