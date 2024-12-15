import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const uploadFileViaXHR = ({
  file,
  uploadUrl,
  setUploadProgress
}: {
  file: File;
  uploadUrl: string;
  setUploadProgress: (progress: number) => void;
}): Promise<string> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open('PUT', uploadUrl, true);

    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(percentComplete);
      }
    });

    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        setUploadProgress(0);
        resolve('Upload completed successfully');
      } else {
        setUploadProgress(0);
        reject('Upload failed');
      }
    };
    xhr.send(file);
  });
};
