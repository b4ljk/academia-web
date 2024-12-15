'use client';
import { useState } from 'react';
import { useEffect } from 'react';
import { EditorProps } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import htmlToDraft from 'html-to-draftjs';
import dynamic from 'next/dynamic';
// import { Editor } from 'react-draft-wysiwyg';
// const Editor = dynamic(
//   () => import('react-draft-wysiwyg').then((mod) => mod.Editor),
//   { ssr: false }
// );
const Editor = dynamic<EditorProps>(
  () => import('react-draft-wysiwyg').then((mod) => mod.Editor),
  { ssr: false }
);

export default function RichTextEditor({
  defaultValue,
  setHtml
}: {
  defaultValue?: string;
  setHtml: (html: string) => void;
}) {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  useEffect(() => {
    const blocksFromHtml = htmlToDraft(defaultValue || '');
    const { contentBlocks, entityMap } = blocksFromHtml;
    const contentState = ContentState.createFromBlockArray(
      contentBlocks,
      entityMap
    );
    setEditorState(EditorState.createWithContent(contentState));
    setHtml(defaultValue as any);
  }, [defaultValue]);

  const onEditorStateChange = (editorState: any) => {
    setEditorState(editorState);
    setHtml(draftToHtml(convertToRaw(editorState.getCurrentContent())));
  };

  return (
    <div className="p-4 shadow border border-gray-200 rounded-lg default-font">
      <Editor
        editorState={editorState as any}
        toolbarClassName="toolbarClassName"
        wrapperClassName="wrapperClassName"
        editorClassName="editorClassName"
        onEditorStateChange={(editorState: any) => {
          onEditorStateChange(editorState);
        }}
        toolbar={{
          image: {
            previewImage: true,
            uploadCallback: (file: any) => {
              return new Promise((resolve, reject) => {
                // fetch to upload image
                fetch('/api/upload', {
                  method: 'POST',
                  body: file,
                  headers: {
                    'Content-Type': file.type,
                    'X-Filename': file.name
                  }
                })
                  .then((res) => res.json())
                  .then((res) => {
                    resolve({ data: { link: res.url } });
                  })
                  .catch((err) => {
                    reject(err);
                  });
              });
            },

            alt: { present: true, mandatory: false }
          },
          fontFamily: {
            options: ['Plus Jakarta Sans']
          }
        }}
      />
    </div>
  );
}
