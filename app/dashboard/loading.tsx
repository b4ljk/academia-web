import { LoaderCircle } from 'lucide-react';

export default function Loading() {
  return (
    <div className="h-full w-full flex justify-center items-center">
      <LoaderCircle className="animate-spin h-10 w-10" />
    </div>
  );
}
