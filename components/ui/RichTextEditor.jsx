'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import { useEffect, useState } from 'react';
import StarterKit from '@tiptap/starter-kit';

import { TextAlign } from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Highlight } from '@tiptap/extension-highlight';
import { Subscript } from '@tiptap/extension-subscript';
import { Superscript } from '@tiptap/extension-superscript';
import Image from '@tiptap/extension-image';

export default function RichTextEditor({ value = '', onChange, height = 300 }) {
    const [htmlMode, setHtmlMode] = useState(false);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2, 3, 4, 5, 6] }
            }),
            TextStyle,
            Color,
            Highlight,
            Subscript,
            Superscript,
            Image,
            // Link.configure({ openOnClick: false }),
            TextAlign.configure({
                types: ['heading', 'paragraph']
            })
        ],

        content: value,
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            let html = editor.getHTML();
            if (html === '<p></p>') html = '';
            onChange && onChange(html);
        }
    });

    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value || '');
        }
    }, [value, editor]);

    if (!editor) return null;

    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('Enter URL', previousUrl || '');

        if (url === null) return;

        if (url === '') {
            editor.chain().focus().unsetLink().run();
            return;
        }

        editor.chain().focus().setLink({ href: url }).run();
    };
    const insertImage = () => {
        const url = window.prompt('Enter Image URL');

        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };
    return (
        <div className="border rounded">
            {/* ===== TOOLBAR ===== */}
            <div className="border-bottom p-2 d-flex flex-wrap align-items-center gap-2">
                {/* HTML TOGGLE */}
                <button
                    type="button"
                    className={`btn btn-sm ${htmlMode ? 'btn-dark' : 'btn-light'}`}
                    onClick={() => setHtmlMode(!htmlMode)}
                >
                    HTML
                </button>

                {!htmlMode && (
                    <>
                        {/* Bold */}
                        <button
                            type="button"
                            className={`btn btn-sm ${editor.isActive('bold') ? 'btn-dark' : 'btn-light'}`}
                            onClick={() => editor.chain().focus().toggleBold().run()}
                        >
                            B
                        </button>

                        {/* Italic */}
                        <button
                            type="button"
                            className={`btn btn-sm ${editor.isActive('italic') ? 'btn-dark' : 'btn-light'}`}
                            onClick={() => editor.chain().focus().toggleItalic().run()}
                        >
                            I
                        </button>

                        {/* Underline */}
                        <button
                            type="button"
                            className={`btn btn-sm ${editor.isActive('underline') ? 'btn-dark' : 'btn-light'}`}
                            onClick={() => editor.chain().focus().toggleUnderline().run()}
                        >
                            U
                        </button>

                        {/* Strike */}
                        <button
                            type="button"
                            className={`btn btn-sm ${editor.isActive('strike') ? 'btn-dark' : 'btn-light'}`}
                            onClick={() => editor.chain().focus().toggleStrike().run()}
                        >
                            S
                        </button>

                        {/* Heading Dropdown */}
                        <select
                            className="form-select form-select-sm w-auto"
                            onChange={(e) => {
                                const level = Number(e.target.value);
                                if (level === 0) {
                                    editor.chain().focus().setParagraph().run();
                                } else {
                                    editor.chain().focus().toggleHeading({ level }).run();
                                }
                            }}
                        >
                            <option value="0">Paragraph</option>
                            <option value="1">H1</option>
                            <option value="2">H2</option>
                            <option value="3">H3</option>
                            <option value="4">H4</option>
                            <option value="5">H5</option>
                            <option value="6">H6</option>
                        </select>

                        {/* Lists */}
                        <button
                            type="button"
                            className={`btn btn-sm ${editor.isActive('bulletList') ? 'btn-dark' : 'btn-light'}`}
                            onClick={() => editor.chain().focus().toggleBulletList().run()}
                        >
                            •
                        </button>

                        <button
                            type="button"
                            className={`btn btn-sm ${editor.isActive('orderedList') ? 'btn-dark' : 'btn-light'}`}
                            onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        >
                            1.
                        </button>

                        {/* Alignment */}
                        <button
                            type="button"
                            className="btn btn-sm btn-light"
                            onClick={() => editor.chain().focus().setTextAlign('left').run()}
                        >
                            ⬅
                        </button>

                        <button
                            type="button"
                            className="btn btn-sm btn-light"
                            onClick={() => editor.chain().focus().setTextAlign('center').run()}
                        >
                            ⬌
                        </button>

                        <button
                            type="button"
                            className="btn btn-sm btn-light"
                            onClick={() => editor.chain().focus().setTextAlign('right').run()}
                        >
                            ➡
                        </button>

                        {/* Color */}
                        <input
                            type="color"
                            className="form-control form-control-color form-control-sm"
                            onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
                        />

                        {/* Highlight */}
                        <button
                            type="button"
                            className={`btn btn-sm ${editor.isActive('highlight') ? 'btn-dark' : 'btn-light'}`}
                            onClick={() => editor.chain().focus().toggleHighlight().run()}
                        >
                            🖍
                        </button>

                        {/* Sub / Super */}
                        <button
                            type="button"
                            className="btn btn-sm btn-light"
                            onClick={() => editor.chain().focus().toggleSubscript().run()}
                        >
                            X₂
                        </button>

                        <button
                            type="button"
                            className="btn btn-sm btn-light"
                            onClick={() => editor.chain().focus().toggleSuperscript().run()}
                        >
                            X²
                        </button>

                        {/* Link */}
                        <button type="button" className="btn btn-sm btn-light" onClick={setLink}>
                            🔗
                        </button>

                        {/* Image */}
                        <button type="button" className="btn btn-sm btn-light" onClick={insertImage}>
                            🖼
                        </button>

                        {/* <button type="button" className="btn btn-sm btn-light" onClick={() => editor.chain().focus().unsetLink().run()}>
                            ❌
                        </button> */}

                        {/* Undo / Redo */}
                        <button type="button" className="btn btn-sm btn-light" onClick={() => editor.chain().focus().undo().run()}>
                            ↺
                        </button>

                        <button type="button" className="btn btn-sm btn-light" onClick={() => editor.chain().focus().redo().run()}>
                            ↻
                        </button>
                    </>
                )}
            </div>

            {/* ===== CONTENT AREA ===== */}
            <div className="p-3" style={{ minHeight: height }}>
                {htmlMode ? (
                    <textarea
                        className="form-control"
                        style={{ minHeight: height, fontFamily: 'monospace' }}
                        value={editor.getHTML()}
                        onChange={(e) => {
                            editor.commands.setContent(e.target.value);
                            onChange && onChange(e.target.value);
                        }}
                    />
                ) : (
                    <EditorContent editor={editor} />
                )}
            </div>
        </div>
    );
}
