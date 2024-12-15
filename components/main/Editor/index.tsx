'use client';
import Image from '@tiptap/extension-image';

Image.configure({
  inline: true,
  allowBase64: false,
  HTMLAttributes: {
    class: 'rounded-md'
  }
});
