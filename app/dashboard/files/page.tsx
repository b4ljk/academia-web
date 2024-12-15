'use client';
import { FileList } from './file-table';

export default async function SettingsPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <FileList />
    </main>
  );
}
