'use client';

import { useEffect, useRef, useState } from 'react';
import { useEditor, useEditorState, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import css from './RichTextEditor.module.css';

const normalizeUrl = (url: string) => {
  if (/^[a-z][a-z0-9+.-]*:/i.test(url) || url.startsWith('/')) {
    return url;
  }
  return `https://${url}`;
};

const isWordChar = (char: string) => /[\p{L}\p{N}'’-]/u.test(char);

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  className?: string;
  counter?: React.ReactNode;
}

const ToolbarButton = ({
  onClick,
  isActive,
  isDisabled,
  label,
  children,
}: {
  onClick: () => void;
  isActive?: boolean;
  isDisabled?: boolean;
  label: string;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    className={`${css.toolbarButton} ${isActive ? css.toolbarButtonActive : ''}`}
    onClick={onClick}
    disabled={isDisabled}
    aria-label={label}
    aria-pressed={isActive}
  >
    {children}
  </button>
);

const RichTextEditor = ({
  value,
  onChange,
  onBlur,
  placeholder,
  className,
  counter,
}: RichTextEditorProps) => {
  const capsModeRef = useRef(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        link: { openOnClick: false, autolink: true },
      }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: css.content,
        ...(placeholder ? { 'data-placeholder': placeholder } : {}),
      },
      handleTextInput: (view, from, to, text) => {
        if (!capsModeRef.current) return false;
        const upper = text.toUpperCase();
        if (upper === text) return false;
        view.dispatch(view.state.tr.insertText(upper, from, to));
        return true;
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    onBlur: () => {
      onBlur?.();
    },
  });
  const state = useEditorState({
    editor,
    selector: ({ editor }) => {
      if (!editor) return null;

      return {
        canUndo: editor.can().undo(),
        canRedo: editor.can().redo(),
        isBold: editor.isActive('bold'),
        isItalic: editor.isActive('italic'),
        isUnderline: editor.isActive('underline'),
        isStrike: editor.isActive('strike'),
        isBulletList: editor.isActive('bulletList'),
        isOrderedList: editor.isActive('orderedList'),
        isLink: editor.isActive('link'),
        isAlignLeft: editor.isActive({ textAlign: 'left' }),
        isAlignCenter: editor.isActive({ textAlign: 'center' }),
        isAlignRight: editor.isActive({ textAlign: 'right' }),
      };
    },
  });

  const [isCapsMode, setIsCapsMode] = useState(false);
  const [isLinkPopoverOpen, setLinkPopoverOpen] = useState(false);
  const [linkText, setLinkText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const linkPopoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLinkPopoverOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (linkPopoverRef.current && !linkPopoverRef.current.contains(event.target as Node)) {
        setLinkPopoverOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isLinkPopoverOpen]);

  if (!editor) {
    return null;
  }

  const toolbarState = state ?? {
    canUndo: false,
    canRedo: false,
    isBold: false,
    isItalic: false,
    isUnderline: false,
    isStrike: false,
    isBulletList: false,
    isOrderedList: false,
    isLink: false,
    isAlignLeft: false,
    isAlignCenter: false,
    isAlignRight: false,
  };

  const openLinkPopover = () => {
    const { from, to, empty } = editor.state.selection;
    const selectedText = empty ? '' : editor.state.doc.textBetween(from, to, ' ');
    const existingUrl = (editor.getAttributes('link').href as string | undefined) ?? '';

    setLinkText(selectedText);
    setLinkUrl(existingUrl);
    setLinkPopoverOpen(true);
  };

  const applyLink = () => {
    const rawUrl = linkUrl.trim();

    if (!rawUrl) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      setLinkPopoverOpen(false);
      return;
    }

    const url = normalizeUrl(rawUrl);
    const text = linkText.trim() || rawUrl;

    editor
      .chain()
      .focus()
      .insertContent({
        type: 'text',
        text,
        marks: [{ type: 'link', attrs: { href: url } }],
      })
      .unsetMark('link')
      .run();

    setLinkPopoverOpen(false);
  };

  const changeSelectionCase = (transform: (segment: string) => string) => {
    editor
      .chain()
      .focus()
      .command(({ tr, dispatch }) => {
        const { from, to, empty } = tr.selection;
        if (empty) return false;
        const segments: { from: number; to: number; text: string }[] = [];
        tr.doc.nodesBetween(from, to, (node, pos) => {
          if (!node.isText || !node.text) return;
          const segFrom = Math.max(pos, from);
          const segTo = Math.min(pos + node.nodeSize, to);
          const original = node.text.slice(segFrom - pos, segTo - pos);
          segments.push({ from: segFrom, to: segTo, text: transform(original) });
        });

        if (dispatch) {
          segments
            .slice()
            .reverse()
            .forEach(({ from: segFrom, to: segTo, text }) => {
              tr.insertText(text, segFrom, segTo);
            });
        }

        return true;
      })
      .run();
  };

  const wrapSelectionInQuotes = () => {
    editor
      .chain()
      .focus()
      .command(({ tr, dispatch }) => {
        let { from, to } = tr.selection;
        const { empty } = tr.selection;

        if (empty) {
          const $pos = tr.doc.resolve(from);
          const blockStart = $pos.start();
          const text = $pos.parent.textContent;
          const offset = from - blockStart;

          let start = offset;
          let end = offset;
          while (start > 0 && isWordChar(text[start - 1])) start--;
          while (end < text.length && isWordChar(text[end])) end++;

          if (start === end) return false;

          from = blockStart + start;
          to = blockStart + end;
        }
        const before = tr.doc.textBetween(Math.max(0, from - 1), from);
        const after = tr.doc.textBetween(to, Math.min(tr.doc.content.size, to + 1));
        const quotedOutside = before === '“' && after === '”';

        const firstInside = to > from ? tr.doc.textBetween(from, from + 1) : '';
        const lastInside = to > from ? tr.doc.textBetween(to - 1, to) : '';
        const quotedInside = to - from >= 2 && firstInside === '“' && lastInside === '”';

        if (dispatch) {
          if (quotedOutside) {
            tr.delete(to, to + 1);
            tr.delete(from - 1, from);
          } else if (quotedInside) {
            tr.delete(to - 1, to);
            tr.delete(from, from + 1);
          } else {
            tr.insertText('”', to);
            tr.insertText('“', from);
          }
        }

        return true;
      })
      .run();
  };

  const toggleCapsMode = () => {
    const next = !capsModeRef.current;
    capsModeRef.current = next;
    setIsCapsMode(next);
    changeSelectionCase(segment => (next ? segment.toUpperCase() : segment.toLowerCase()));
  };

  const toolbar = (
    <div className={css.toolbar}>
      <ToolbarButton
        label="Undo"
        isDisabled={!toolbarState.canUndo}
        onClick={() => editor.chain().focus().undo().run()}
      >
        ↶
      </ToolbarButton>
      <ToolbarButton
        label="Redo"
        isDisabled={!toolbarState.canRedo}
        onClick={() => editor.chain().focus().redo().run()}
      >
        ↷
      </ToolbarButton>

      <span className={css.divider} aria-hidden />

      <ToolbarButton
        label="Bold"
        isActive={toolbarState.isBold}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <strong>B</strong>
      </ToolbarButton>
      <ToolbarButton
        label="Italic"
        isActive={toolbarState.isItalic}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <em>I</em>
      </ToolbarButton>
      <ToolbarButton
        label="Underline"
        isActive={toolbarState.isUnderline}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <u>U</u>
      </ToolbarButton>
      <ToolbarButton
        label="Strikethrough"
        isActive={toolbarState.isStrike}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <s>S</s>
      </ToolbarButton>

      <span className={css.divider} aria-hidden />

      <ToolbarButton label="Uppercase" isActive={isCapsMode} onClick={toggleCapsMode}>
        <svg width="18" height="14" viewBox="0 0 18 14" aria-hidden="true">
          <text x="0" y="11" fontSize="12" fontWeight="700" fill="currentColor">
            A
          </text>
          <text x="10" y="13" fontSize="9" fontWeight="700" fill="currentColor">
            a
          </text>
        </svg>
      </ToolbarButton>
      <ToolbarButton
        label="Bullet list"
        isActive={toolbarState.isBulletList}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        •‏•‏•
      </ToolbarButton>
      <ToolbarButton
        label="Numbered list"
        isActive={toolbarState.isOrderedList}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        1.2.3.
      </ToolbarButton>
      <ToolbarButton label="Quote" onClick={wrapSelectionInQuotes}>
        &ldquo;&rdquo;
      </ToolbarButton>
      <span className={css.linkButtonWrapper}>
        <ToolbarButton label="Link" isActive={toolbarState.isLink} onClick={openLinkPopover}>
          🔗
        </ToolbarButton>
        {isLinkPopoverOpen && (
          <div className={css.linkPopover} ref={linkPopoverRef}>
            <label className={css.linkPopoverField}>
              <span className={css.linkPopoverIcon} aria-hidden>
                Aa
              </span>
              <input
                type="text"
                value={linkText}
                onChange={event => setLinkText(event.target.value)}
                placeholder="Text"
                className={css.linkPopoverInput}
              />
            </label>
            <label className={css.linkPopoverField}>
              <span className={css.linkPopoverIcon} aria-hidden>
                🔗
              </span>
              <input
                type="text"
                value={linkUrl}
                onChange={event => setLinkUrl(event.target.value)}
                placeholder="Enter or paste a link"
                className={css.linkPopoverInput}
                autoFocus
                onKeyDown={event => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    applyLink();
                  }
                  if (event.key === 'Escape') {
                    setLinkPopoverOpen(false);
                  }
                }}
              />
            </label>
            <button type="button" className={css.linkPopoverApply} onClick={applyLink}>
              Apply
            </button>
          </div>
        )}
      </span>

      <span className={css.divider} aria-hidden />

      <ToolbarButton
        label="Align left"
        isActive={toolbarState.isAlignLeft}
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
      >
        <svg width="16" height="12" viewBox="0 0 16 12" aria-hidden="true">
          <rect x="0" y="0" width="16" height="2" rx="1" fill="currentColor" />
          <rect x="0" y="5" width="10" height="2" rx="1" fill="currentColor" />
          <rect x="0" y="10" width="13" height="2" rx="1" fill="currentColor" />
        </svg>
      </ToolbarButton>
      <ToolbarButton
        label="Align center"
        isActive={toolbarState.isAlignCenter}
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
      >
        <svg width="16" height="12" viewBox="0 0 16 12" aria-hidden="true">
          <rect x="0" y="0" width="16" height="2" rx="1" fill="currentColor" />
          <rect x="3" y="5" width="10" height="2" rx="1" fill="currentColor" />
          <rect x="1.5" y="10" width="13" height="2" rx="1" fill="currentColor" />
        </svg>
      </ToolbarButton>
      <ToolbarButton
        label="Align right"
        isActive={toolbarState.isAlignRight}
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
      >
        <svg width="16" height="12" viewBox="0 0 16 12" aria-hidden="true">
          <rect x="0" y="0" width="16" height="2" rx="1" fill="currentColor" />
          <rect x="6" y="5" width="10" height="2" rx="1" fill="currentColor" />
          <rect x="3" y="10" width="13" height="2" rx="1" fill="currentColor" />
        </svg>
      </ToolbarButton>
    </div>
  );

  return (
    <div className={`${css.wrapper} ${className ?? ''}`}>
      {toolbar}
      <div className={css.contentArea}>
        <EditorContent editor={editor} />
        {counter}
      </div>
    </div>
  );
};

export default RichTextEditor;
