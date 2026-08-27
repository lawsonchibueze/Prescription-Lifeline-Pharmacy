'use client';

import Image from 'next/image';
import { useRef, useState, type ChangeEvent, type DragEvent } from 'react';
import { TrashIcon } from '../icons';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
}

export function ImageUploader({ value, onChange }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  async function upload(file: File) {
    setUploading(true);
    setError(null);
    try {
      const body = new FormData();
      body.append('file', file);
      const res = await fetch(`${API_URL}/admin/uploads`, {
        method: 'POST',
        credentials: 'include',
        body,
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { message?: string } | null;
        setError(data?.message ?? `Upload failed (${res.status})`);
        return;
      }
      const data = (await res.json()) as { url: string };
      onChange(data.url);
    } catch {
      setError('Could not reach the API — make sure it is running.');
    } finally {
      setUploading(false);
    }
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) void upload(file);
    event.target.value = '';
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) void upload(file);
  }

  if (value) {
    return (
      <div className="flex items-center gap-4">
        <div className="relative size-20 shrink-0 overflow-hidden rounded-lg border border-line bg-brand-green-light">
          <Image src={value} alt="Product" fill sizes="80px" className="object-cover" />
        </div>
        <button
          type="button"
          onClick={() => onChange('')}
          className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
        >
          <TrashIcon className="size-3.5" />
          Remove image
        </button>
      </div>
    );
  }

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed px-4 py-6 text-center transition-colors ${
          dragging ? 'border-brand-green bg-brand-green-light' : 'border-line hover:border-brand-green/50'
        }`}
      >
        <span className="text-sm font-bold text-ink-soft">
          {uploading ? 'Uploading…' : 'Click to upload or drag an image here'}
        </span>
        <span className="text-xs text-ink-faint">JPEG, PNG, WEBP or GIF, up to 5MB</span>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleInputChange}
          className="hidden"
        />
      </div>
      {error && <p className="mt-2 text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}
