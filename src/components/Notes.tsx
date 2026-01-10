import React from 'react';
import { Company, BreakdownItem } from '../types';
import { buildNoteIndex, getFinancialPath } from '../utils/noteHelpers';
import { useApp } from '../context/AppContext';
import RichTextEditor from './RichTextEditor';
import { getNoteTemplate } from '../utils/NoteTemplates';
import BreakdownTable from './BreakdownTable';

const Notes: React.FC<{ company: Company }> = ({ company }) => {
  const { updateCompany, viewMode } = useApp();
  const { fontStyle, fontSize, primaryColor, secondaryColor } = company.settings.template;
  const { list: resolvedNotes } = buildNoteIndex(company);
  const isEditable = viewMode === 'edit';

  const getDefaultBreakdownItems = (noteId: string): BreakdownItem[] => {
    // Get the financial value for this note
    const bsPath = getFinancialPath(noteId);
    if (!bsPath) return [];

    const keys = bsPath.split('.');
    let obj: any = bsPath.startsWith('nonCurrentAssets') ||
      bsPath.startsWith('currentAssets') ||
      bsPath.startsWith('equity') ||
      bsPath.startsWith('nonCurrentLiabilities') ||
      bsPath.startsWith('currentLiabilities') ? company.balanceSheet : company.profitLoss;

    // Navigate to the correct nested object
    for (let i = 0; i < keys.length - 1; i++) {
      if (!obj[keys[i]]) return [];
      obj = obj[keys[i]];
    }

    const finalKey = keys[keys.length - 1];
    const value = obj[finalKey];
    if (!value || typeof value.current !== 'number' || typeof value.previous !== 'number') return [];

    // Create a default breakdown item with the financial statement value
    return [{
      id: `default-${noteId}`,
      description: 'Total',
      current: value.current,
      previous: value.previous
    }];
  };

  const handleNoteChange = (noteId: string, content: string) => {
    const updatedNoteDetails = { ...company.noteDetails, [noteId]: content };
    updateCompany(company.id, { noteDetails: updatedNoteDetails });
  };

  const handleBreakdownUpdate = (noteId: string, bsPath: string, items: BreakdownItem[], totalCurrent: number, totalPrevious: number) => {
    // Update both breakdowns and financial statement totals in one operation
    const updatedCompany = { ...company };

    // 1. Update breakdowns
    updatedCompany.breakdowns = { ...(updatedCompany.breakdowns || {}), [noteId]: items };

    // 2. Update Financial Statement total (BS or PL)
    if (bsPath) {
      const keys = bsPath.split('.');
      let obj: any = bsPath.startsWith('nonCurrentAssets') ||
        bsPath.startsWith('currentAssets') ||
        bsPath.startsWith('equity') ||
        bsPath.startsWith('nonCurrentLiabilities') ||
        bsPath.startsWith('currentLiabilities') ? updatedCompany.balanceSheet : updatedCompany.profitLoss;

      // Navigate to the correct nested object
      for (let i = 0; i < keys.length - 1; i++) {
        if (!obj[keys[i]]) {
          obj[keys[i]] = {};
        }
        obj = obj[keys[i]];
      }

      // Update the final property
      const finalKey = keys[keys.length - 1];
      if (obj[finalKey]) {
        obj[finalKey] = { ...obj[finalKey], current: totalCurrent, previous: totalPrevious };
      }
    }

    updateCompany(company.id, updatedCompany);
  };

  return (
    <div className="py-8 max-w-4xl mx-auto" style={{ fontFamily: fontStyle, fontSize: `${fontSize}px` }}>
      <h2 className="text-2xl font-bold mb-2 text-center" style={{ color: primaryColor }}>{company.name}</h2>
      <p className="text-lg mb-6 text-center" style={{ color: secondaryColor }}>Notes to Accounts</p>

      {resolvedNotes.length === 0 && (
        <p className="mt-4 text-gray-500 text-center">No notes available.</p>
      )}

      <div className="space-y-8">
        {resolvedNotes.map((note: { number: string; title: string; originalNote: string; bsPath?: string }) => {
          const { number, title, originalNote, bsPath } = note;
          const noteContent = company.noteDetails?.[originalNote]?.trim() || getNoteTemplate(originalNote, title, company);
          const breakdownItems = company.breakdowns?.[originalNote] || getDefaultBreakdownItems(originalNote);

          return (
            <div key={number} id={`note-${number}`} className="p-4 border rounded-lg bg-white shadow-sm break-inside-avoid">
              <div className="flex items-baseline justify-between mb-4 border-b pb-2">
                <h3 className="text-lg font-bold text-gray-800">Note {number}: {title}</h3>
                <span className="text-xs text-gray-500">Ref: {originalNote}</span>
              </div>

              {/* Description / Text Content */}
              <div className="mb-4">
                {isEditable ? (
                  <RichTextEditor
                    value={noteContent}
                    onChange={(content) => handleNoteChange(originalNote, content)}
                    minHeight={150}
                  />
                ) : (
                  <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: noteContent }}
                  />
                )}
              </div>

              {/* Breakdown Table (only if mapped to BS) */}
              {bsPath && (
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-gray-600 mb-2">Breakdown Details</h4>
                  <BreakdownTable
                    items={breakdownItems}
                    onUpdate={(items, totalCurrent, totalPrevious) => handleBreakdownUpdate(originalNote, bsPath, items, totalCurrent, totalPrevious)}
                    isEditable={isEditable}
                    company={company}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Notes;
