'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import { useEffect } from 'react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { Link } from '@tiptap/extension-link';
import { TextAlign } from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Highlight } from '@tiptap/extension-highlight';
import { Subscript } from '@tiptap/extension-subscript';
import { Superscript } from '@tiptap/extension-superscript';
export default function RichTextEditor({ value = '', onChange, placeholder = 'Start typing...' }) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            TextStyle,
            Color,
            Highlight,
            Subscript,
            Superscript,
            Link.configure({ openOnClick: false }),
            TextAlign.configure({
                types: ['heading', 'paragraph']
            })
        ],
        content: value,
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            onChange && onChange(editor.getHTML());
        }
    });

    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value || '');
        }
    }, [value, editor]);

    if (!editor) return null;

    const setLink = () => {
        const url = prompt('Enter URL');
        if (url) {
            editor.chain().focus().setLink({ href: url }).run();
        }
    };

    return (
        <div className="rich-editor border rounded">
            {/* TOOLBAR */}
            <div className="editor-toolbar border-bottom p-2 d-flex flex-wrap align-items-center gap-2">
                {/* Text Formatting */}
                <button
                    type="button"
                    className={`editor-btn ${editor.isActive('bold') ? 'active' : ''}`}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                >
                    <b>B</b>
                </button>

                <button
                    type="button"
                    className={`editor-btn ${editor.isActive('italic') ? 'active' : ''}`}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                >
                    <i>I</i>
                </button>

                <button
                    type="button"
                    className={`editor-btn ${editor.isActive('underline') ? 'active' : ''}`}
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                >
                    <u>U</u>
                </button>

                <button
                    type="button"
                    className={`editor-btn ${editor.isActive('strike') ? 'active' : ''}`}
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                >
                    S
                </button>

                {/* Divider */}
                <div className="editor-divider"></div>

                {/* Headings */}
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

                <div className="editor-divider"></div>

                {/* Lists */}
                <button
                    type="button"
                    className={`editor-btn ${editor.isActive('bulletList') ? 'active' : ''}`}
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                >
                    •
                </button>

                <button
                    type="button"
                    className={`editor-btn ${editor.isActive('orderedList') ? 'active' : ''}`}
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                >
                    1.
                </button>

                <div className="editor-divider"></div>

                {/* Alignment */}
                <button type="button" className="editor-btn" onClick={() => editor.chain().focus().setTextAlign('left').run()}>
                    ⬅
                </button>

                <button type="button" className="editor-btn" onClick={() => editor.chain().focus().setTextAlign('center').run()}>
                    ⬌
                </button>

                <button type="button" className="editor-btn" onClick={() => editor.chain().focus().setTextAlign('right').run()}>
                    ➡
                </button>

                <div className="editor-divider"></div>

                {/* Color */}
                <input type="color" className="editor-color" onChange={(e) => editor.chain().focus().setColor(e.target.value).run()} />

                <button
                    type="button"
                    className={`editor-btn ${editor.isActive('highlight') ? 'active' : ''}`}
                    onClick={() => editor.chain().focus().toggleHighlight().run()}
                >
                    🖍
                </button>

                <div className="editor-divider"></div>

                {/* Link */}
                <button
                    type="button"
                    className="editor-btn"
                    onClick={() => {
                        const url = prompt('Enter URL');
                        if (url) editor.chain().focus().setLink({ href: url }).run();
                    }}
                >
                    🔗
                </button>

                <button type="button" className="editor-btn" onClick={() => editor.chain().focus().unsetLink().run()}>
                    ❌
                </button>

                <div className="editor-divider"></div>

                {/* Undo / Redo */}
                <button type="button" className="editor-btn" onClick={() => editor.chain().focus().undo().run()}>
                    ↺
                </button>

                <button type="button" className="editor-btn" onClick={() => editor.chain().focus().redo().run()}>
                    ↻
                </button>

                <button
                    type="button"
                    className="editor-btn text-danger"
                    onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
                >
                    Clear
                </button>
            </div>

            {/* EDITOR */}
            <div className="editor-content p-3">
                <EditorContent editor={editor} />
            </div>
        </div>
    );
}
