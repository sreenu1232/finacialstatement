import React, { useState, useRef, useEffect } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  List,
  Type,
  Palette,
  Link
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ 
  value, 
  onChange, 
  placeholder = "Start typing...",
  minHeight = 200 
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleContentChange();
  };

  const handleContentChange = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault();
      execCommand('insertHTML', '<br>');
    }
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const insertList = () => {
    execCommand('insertUnorderedList');
  };

  const insertOrderedList = () => {
    execCommand('insertOrderedList');
  };

  const changeFontSize = () => {
    const size = prompt('Enter font size (e.g., 12px, 14px, 16px):');
    if (size) {
      execCommand('fontSize', '7');
      execCommand('foreColor', '#000000');
      // Apply custom font size
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const span = document.createElement('span');
        span.style.fontSize = size;
        try {
          range.surroundContents(span);
        } catch (e) {
          // If surroundContents fails, insert the span
          range.insertNode(span);
        }
        handleContentChange();
      }
    }
  };

  const changeTextColor = () => {
    const color = prompt('Enter color (e.g., #ff0000, red, blue):');
    if (color) {
      execCommand('foreColor', color);
    }
  };

  const changeBackgroundColor = () => {
    const color = prompt('Enter background color (e.g., #ffff00, yellow, lightblue):');
    if (color) {
      execCommand('backColor', color);
    }
  };

  const insertHeader = (level: number) => {
    execCommand('formatBlock', `h${level}`);
  };

  const ToolbarButton: React.FC<{
    onClick: () => void;
    icon: React.ReactNode;
    title: string;
    isActive?: boolean;
  }> = ({ onClick, icon, title, isActive = false }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-2 rounded hover:bg-gray-200 ${
        isActive ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
      }`}
    >
      {icon}
    </button>
  );

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-1">
        {/* Text Formatting */}
        <div className="flex border-r border-gray-300 pr-2 mr-2">
          <ToolbarButton
            onClick={() => execCommand('bold')}
            icon={<Bold size={16} />}
            title="Bold (Ctrl+B)"
          />
          <ToolbarButton
            onClick={() => execCommand('italic')}
            icon={<Italic size={16} />}
            title="Italic (Ctrl+I)"
          />
          <ToolbarButton
            onClick={() => execCommand('underline')}
            icon={<Underline size={16} />}
            title="Underline (Ctrl+U)"
          />
        </div>

        {/* Headers */}
        <div className="flex border-r border-gray-300 pr-2 mr-2">
          <ToolbarButton
            onClick={() => insertHeader(1)}
            icon={<span className="text-xs font-bold">H1</span>}
            title="Header 1"
          />
          <ToolbarButton
            onClick={() => insertHeader(2)}
            icon={<span className="text-xs font-bold">H2</span>}
            title="Header 2"
          />
          <ToolbarButton
            onClick={() => insertHeader(3)}
            icon={<span className="text-xs font-bold">H3</span>}
            title="Header 3"
          />
        </div>

        {/* Alignment */}
        <div className="flex border-r border-gray-300 pr-2 mr-2">
          <ToolbarButton
            onClick={() => execCommand('justifyLeft')}
            icon={<AlignLeft size={16} />}
            title="Align Left"
          />
          <ToolbarButton
            onClick={() => execCommand('justifyCenter')}
            icon={<AlignCenter size={16} />}
            title="Align Center"
          />
          <ToolbarButton
            onClick={() => execCommand('justifyRight')}
            icon={<AlignRight size={16} />}
            title="Align Right"
          />
        </div>

        {/* Lists */}
        <div className="flex border-r border-gray-300 pr-2 mr-2">
          <ToolbarButton
            onClick={insertList}
            icon={<List size={16} />}
            title="Bullet List"
          />
          <ToolbarButton
            onClick={insertOrderedList}
            icon={<span className="text-xs font-bold">1.</span>}
            title="Numbered List"
          />
        </div>

        {/* Font & Colors */}
        <div className="flex border-r border-gray-300 pr-2 mr-2">
          <ToolbarButton
            onClick={changeFontSize}
            icon={<Type size={16} />}
            title="Font Size"
          />
          <ToolbarButton
            onClick={changeTextColor}
            icon={<Palette size={16} />}
            title="Text Color"
          />
          <ToolbarButton
            onClick={changeBackgroundColor}
            icon={<div className="w-4 h-4 border border-gray-400" style={{ backgroundColor: '#ffff00' }} />}
            title="Background Color"
          />
        </div>

        {/* Links */}
        <div className="flex">
          <ToolbarButton
            onClick={insertLink}
            icon={<Link size={16} />}
            title="Insert Link"
          />
        </div>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        className={`p-4 outline-none ${isFocused ? 'bg-white' : 'bg-white'}`}
        style={{ minHeight: `${minHeight}px` }}
        onInput={handleContentChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        suppressContentEditableWarning={true}
        data-placeholder={placeholder}
      />
    </div>
  );
};

export default RichTextEditor;




