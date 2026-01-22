'use client';
import { useState } from 'react';
import { useUploadFile } from '@/hooks/use-upload-file';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, UploadCloud } from 'lucide-react';
import { Label } from '../ui/label';

export function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const { progress, url, error, isUploading, isSuccess, uploadFile } = useUploadFile();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (file) {
        await uploadFile(file, 'certs');
    }
  };

  return (
    <div className="space-y-4">
        <div className="space-y-2">
            <Label htmlFor="file-upload">Sube tu certificado (.p12)</Label>
            <div className="flex items-center gap-2">
                <Input id="file-upload" type="file" onChange={handleFileChange} accept=".p12" className="flex-grow" />
                <Button onClick={handleUpload} disabled={!file || isUploading}>
                    <UploadCloud className="mr-2 h-4 w-4" />
                    {isUploading ? 'Subiendo...' : 'Subir'}
                </Button>
            </div>
        </div>

      {isUploading && <Progress value={progress} className="w-full" />}
      
      {isSuccess && url && (
        <Alert variant="default" className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700">
          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertTitle className="text-green-800 dark:text-green-300">Subida Exitosa</AlertTitle>
          <AlertDescription className="text-green-700 dark:text-green-400">
            El archivo se ha subido correctamente.
            <p className="text-xs font-mono mt-2 break-all">URL: {url}</p>
          </AlertDescription>
        </Alert>
      )}
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error en la Subida</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
