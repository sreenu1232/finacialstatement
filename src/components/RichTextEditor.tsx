import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Type,
  Highlighter,
  Link as LinkIcon,
  Table as TableIcon,
  Undo,
  Redo,
  Minus,
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
  children?: React.ReactNode;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Start typing...',
  minHeight = 200,
  children
}) => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isInternallyUpdating, setIsInternallyUpdating] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);

  const textColors = ['#000000', '#374151', '#DC2626', '#2563EB', '#059669', '#7C3AED', '#D97706'];
  const highlightColors = ['transparent', '#FEF08A', '#BBF7D0', '#BFDBFE', '#FBCFE8', '#FED7AA', '#E9D5FF'];

  useEffect(() => {
    if (!editorRef.current) return;
    if (isInternallyUpdating) return;

    const currentHTML = editorRef.current.innerHTML;
    if (currentHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value, isInternallyUpdating]);

  const execCommand = useCallback((command: string, arg?: string) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    try {
      document.execCommand(command, false, arg);
    } catch {
      // execCommand is deprecated but still widely supported
    }
  }, []);

  const syncContentToState = () => {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;
    setIsInternallyUpdating(true);
    onChange(html);
    setTimeout(() => setIsInternallyUpdating(false), 0);
  };

  const handleInput = () => syncContentToState();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault();
      execCommand('insertHTML', '<br>');
      syncContentToState();
    }
  };

  const insertLink = () => {
    const url = window.prompt('Enter URL:');
    if (url) {
      execCommand('createLink', url);
      syncContentToState();
    }
  };

  const changeFontSize = (size: string) => {
    const px = size.replace(/[^0-9]/g, '');
    if (!px) return;

    execCommand('fontSize', '4');
    const fontTags = editorRef.current?.querySelectorAll('font[size="4"]') ?? [];
    fontTags.forEach(node => {
      const span = document.createElement('span');
      span.style.fontSize = `${px}px`;
      span.innerHTML = (node as HTMLElement).innerHTML;
      node.parentNode?.replaceChild(span, node);
    });
    syncContentToState();
  };

  const insertSimpleTable = () => {
    const tableHTML = `
      <table style="border-collapse: collapse; width: 100%; margin: 12px 0; border: 1px solid #e5e7eb;">
        <thead>
          <tr style="background: #f9fafb;">
            <th style="padding: 8px 12px; border: 1px solid #e5e7eb; text-align: left; font-weight: 600;">Column 1</th>
            <th style="padding: 8px 12px; border: 1px solid #e5e7eb; text-align: left; font-weight: 600;">Column 2</th>
            <th style="padding: 8px 12px; border: 1px solid #e5e7eb; text-align: left; font-weight: 600;">Column 3</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 8px 12px; border: 1px solid #e5e7eb;"></td>
            <td style="padding: 8px 12px; border: 1px solid #e5e7eb;"></td>
            <td style="padding: 8px 12px; border: 1px solid #e5e7eb;"></td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; border: 1px solid #e5e7eb;"></td>
            <td style="padding: 8px 12px; border: 1px solid #e5e7eb;"></td>
            <td style="padding: 8px 12px; border: 1px solid #e5e7eb;"></td>
          </tr>
        </tbody>
      </table>
    `;
    execCommand('insertHTML', tableHTML);
    syncContentToState();
  };

  const ToolbarButton: React.FC<{
    onClick: () => void;
    icon: React.ReactNode;
    title: string;
    active?: boolean;
  }> = ({ onClick, icon, title, active }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`
        relative p-1.5 rounded-md transition-all duration-150
        ${active 
          ? 'bg-blue-100 text-blue-700' 
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
        }
      `}
    >
      {icon}
    </button>
  );

  const ToolbarDivider = () => (
    <div className="w-px h-5 bg-slate-200 mx-1" />
  );

  return (
    <div className={`
      rounded-lg overflow-hidden bg-white transition-all duration-200
      ${isFocused 
        ? 'ring-2 ring-blue-500 ring-offset-1 border-transparent' 
        : 'border border-slate-200 hover:border-slate-300'
      }
    `}>
      {/* Toolbar */}
      <div className="bg-slate-50 border-b border-slate-200 px-2 py-1.5 flex flex-wrap items-center gap-0.5">
        {/* Undo/Redo */}
        <ToolbarButton
          onClick={() => { execCommand('undo'); syncContentToState(); }}
          icon={<Undo size={15} />}
          title="Undo"
        />
        <ToolbarButton
          onClick={() => { execCommand('redo'); syncContentToState(); }}
          icon={<Redo size={15} />}
          title="Redo"
        />

        <ToolbarDivider />

        {/* Text Formatting */}
        <ToolbarButton
          onClick={() => { execCommand('bold'); syncContentToState(); }}
          icon={<Bold size={15} />}
          title="Bold (Ctrl+B)"
        />
        <ToolbarButton
          onClick={() => { execCommand('italic'); syncContentToState(); }}
          icon={<Italic size={15} />}
          title="Italic (Ctrl+I)"
        />
        <ToolbarButton
          onClick={() => { execCommand('underline'); syncContentToState(); }}
          icon={<Underline size={15} />}
          title="Underline (Ctrl+U)"
        />

        <ToolbarDivider />

        {/* Font Size Dropdown */}
        <select
          onChange={(e) => changeFontSize(e.target.value)}
          className="h-7 px-2 text-xs bg-white border border-slate-200 rounded-md text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
          defaultValue=""
        >
          <option value="" disabled>Size</option>
          <option value="10">10px</option>
          <option value="12">12px</option>
          <option value="14">14px</option>
          <option value="16">16px</option>
          <option value="18">18px</option>
          <option value="24">24px</option>
        </select>

        <ToolbarDivider />

        {/* Text Color */}
        <div className="relative">
          <ToolbarButton
            onClick={() => { setShowColorPicker(!showColorPicker); setShowHighlightPicker(false); }}
            icon={
              <div className="flex flex-col items-center">
                <Type size={14} />
                <div className="w-3.5 h-1 bg-red-500 rounded-sm mt-0.5" />
              </div>
            }
            title="Text Color"
          />
          {showColorPicker && (
            <div className="absolute top-full left-0 mt-1 p-2 bg-white rounded-lg shadow-lg border border-slate-200 z-50 flex gap-1">
              {textColors.map(color => (
                <button
                  key={color}
                  onClick={() => {
                    execCommand('foreColor', color);
                    syncContentToState();
                    setShowColorPicker(false);
                  }}
                  className="w-6 h-6 rounded border border-slate-200 hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Highlight Color */}
        <div className="relative">
          <ToolbarButton
            onClick={() => { setShowHighlightPicker(!showHighlightPicker); setShowColorPicker(false); }}
            icon={<Highlighter size={15} />}
            title="Highlight"
          />
          {showHighlightPicker && (
            <div className="absolute top-full left-0 mt-1 p-2 bg-white rounded-lg shadow-lg border border-slate-200 z-50 flex gap-1">
              {highlightColors.map((color, i) => (
                <button
                  key={i}
                  onClick={() => {
                    execCommand('backColor', color);
                    syncContentToState();
                    setShowHighlightPicker(false);
                  }}
                  className="w-6 h-6 rounded border border-slate-200 hover:scale-110 transition-transform"
                  style={{ backgroundColor: color === 'transparent' ? '#fff' : color }}
                >
                  {color === 'transparent' && <Minus size={12} className="text-slate-400 mx-auto" />}
                </button>
              ))}
            </div>
          )}
        </div>

        <ToolbarDivider />

        {/* Alignment */}
        <ToolbarButton
          onClick={() => { execCommand('justifyLeft'); syncContentToState(); }}
          icon={<AlignLeft size={15} />}
          title="Align Left"
        />
        <ToolbarButton
          onClick={() => { execCommand('justifyCenter'); syncContentToState(); }}
          icon={<AlignCenter size={15} />}
          title="Align Center"
        />
        <ToolbarButton
          onClick={() => { execCommand('justifyRight'); syncContentToState(); }}
          icon={<AlignRight size={15} />}
          title="Align Right"
        />

        <ToolbarDivider />

        {/* Lists */}
        <ToolbarButton
          onClick={() => { execCommand('insertUnorderedList'); syncContentToState(); }}
          icon={<List size={15} />}
          title="Bullet List"
        />
        <ToolbarButton
          onClick={() => { execCommand('insertOrderedList'); syncContentToState(); }}
          icon={<ListOrdered size={15} />}
          title="Numbered List"
        />

        <ToolbarDivider />

        {/* Link & Table */}
        <ToolbarButton
          onClick={insertLink}
          icon={<LinkIcon size={15} />}
          title="Insert Link"
        />
        <ToolbarButton
          onClick={insertSimpleTable}
          icon={<TableIcon size={15} />}
          title="Insert Table"
        />
      </div>

      {/* Editor Area */}
      <div
        ref={editorRef}
        contentEditable
        className="p-4 outline-none text-sm text-slate-800 leading-relaxed min-h-[120px] prose prose-sm max-w-none
          [&:empty]:before:content-[attr(data-placeholder)] [&:empty]:before:text-slate-400"
        style={{ minHeight }}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onFocus={() => { setIsFocused(true); setShowColorPicker(false); setShowHighlightPicker(false); }}
        onBlur={() => { setIsFocused(false); syncContentToState(); }}
        suppressContentEditableWarning
        data-placeholder={placeholder}
      />

      {/* Children (Tables, etc.) */}
      {children && (
        <div className="px-4 pb-4 border-t border-slate-100 pt-4 bg-slate-50/50">
          {children}
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;
