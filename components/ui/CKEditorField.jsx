// 'use client';
// import dynamic from 'next/dynamic';
// import { useEffect, useState } from 'react';

// // Load CKEditor component only on client
// const CKEditor = dynamic(() => import('@ckeditor/ckeditor5-react').then((mod) => mod.CKEditor), { ssr: false });

// export default function CKEditorField({ value, onChange }) {
//     const [editor, setEditor] = useState(null);

//     useEffect(() => {
//         import('@ckeditor/ckeditor5-build-classic').then((mod) => {
//             setEditor(() => mod.default);
//         });
//     }, []);

//     if (!editor) return null; 

//     return (
//         <CKEditor
//             editor={editor}
//             data={value}
//             onChange={(event, editorInstance) => {
//                 const data = editorInstance.getData();
//                 onChange(data);
//             }}
//         />
//     );
// }



'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const CKEditor = dynamic(
  () => import('@ckeditor/ckeditor5-react').then(mod => mod.CKEditor),
  { ssr: false }
);

export default function CKEditorField({ value, onChange }) {
  const [editor, setEditor] = useState(null);

  useEffect(() => {
    import('@ckeditor/ckeditor5-build-classic').then(mod => {
      setEditor(() => mod.default);
    });
  }, []);

  if (!editor) return null;

  return (
    <CKEditor
      editor={editor}
      data={value}
      onChange={(event, editorInstance) => {
        onChange(editorInstance.getData());
      }}
    />
  );
}