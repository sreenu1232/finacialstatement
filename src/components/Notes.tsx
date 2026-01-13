import React from 'react';
import { Company, BreakdownItem } from '../types';
import { buildNoteIndex, getFinancialPath } from '../utils/noteHelpers';
import { useApp } from '../context/AppContext';
import { getNoteTemplate } from '../utils/NoteTemplates';
import BreakdownTable from './BreakdownTable';
import RichTextEditor from './RichTextEditor';
import { calculatePLTotal } from '../utils/formatters';

const Notes: React.FC<{ company: Company; modeOverride?: 'edit' | 'view' | 'report' }> = ({ company, modeOverride }) => {
  const { updateCompany, viewMode } = useApp();
  const { fontStyle, fontSize, primaryColor, secondaryColor } = company.settings.template;
  const { list: resolvedNotes } = buildNoteIndex(company);
  const effectiveViewMode = modeOverride || viewMode;
  const isEditable = effectiveViewMode === 'edit';
  const plTotals = calculatePLTotal(company.profitLoss);

  // Notes that should not show template tables (only breakdown table)
  // Note: 7, 11, 22 and 23 are excluded - they should show both tables
  // Note 2: (b) Capital work-in-progress
  // Note 3: (c) Investment Property  
  // Note 9: (h)(ii) Financial Assets - Trade receivables
  const notesWithoutTemplateTable = ['2', '3', '4', '5', '6', '8', '9', '10', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21'];

  // Function to remove tables from HTML content
  const removeTablesFromContent = (htmlContent: string): string => {
    if (!htmlContent) return htmlContent;
    // Remove all table tags and their content (including nested tables)
    // This regex matches <table>...</table> including all nested content
    let cleaned = htmlContent;
    let previousLength = 0;
    // Keep removing tables until no more are found (handles nested tables)
    while (cleaned.length !== previousLength) {
      previousLength = cleaned.length;
      cleaned = cleaned.replace(/<table[^>]*>[\s\S]*?<\/table>/gi, '');
    }
    // Also remove any orphaned table-related tags
    cleaned = cleaned.replace(/<\/?(?:thead|tbody|tfoot|tr|th|td)[^>]*>/gi, '');
    return cleaned.trim();
  };

  const getDefaultBreakdownItems = (noteId: string): BreakdownItem[] => {
    // Check if this is a calculated Profit & Loss note
    const calculatedPLNotes: Record<string, { current: number; previous: number }> = {
      '52': { current: plTotals.profitForThePeriod, previous: plTotals.profitForThePeriodPrev }, // IX. Profit from continuing operations
      '55': { current: plTotals.profitLossFromDiscontinuedOperationsAfterTax, previous: plTotals.profitLossFromDiscontinuedOperationsAfterTaxPrev }, // XII. Profit from discontinued operations after tax
      '56': { current: plTotals.profitLossForThePeriod, previous: plTotals.profitLossForThePeriodPrev } // XIII. Profit for the period
    };

    // If it's a calculated note, use the calculated value
    if (calculatedPLNotes[noteId]) {
      return [{
        id: `default-${noteId}`,
        description: 'Total',
        current: calculatedPLNotes[noteId].current,
        previous: calculatedPLNotes[noteId].previous
      }];
    }

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
    // Notes 52, 55, and 56 are auto-calculated, so we don't update their stored values
    const calculatedNotes = ['52', '55', '56'];
    if (calculatedNotes.includes(noteId)) {
      // Only update breakdowns for calculated notes, don't update the stored financial statement values
      const updatedCompany = { ...company };
      updatedCompany.breakdowns = { ...(updatedCompany.breakdowns || {}), [noteId]: items };
      updateCompany(company.id, updatedCompany);
      return;
    }

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
    <div className="py-8 max-w-4xl mx-auto print:py-4" style={{ fontFamily: fontStyle, fontSize: `${fontSize}px` }}>
      <h2 className="text-2xl mb-2 text-center notes-title print:text-center print:mb-6" style={{ color: primaryColor }}>{company.name}</h2>
      <p className="text-lg mb-6 text-center print:text-center print:mb-6" style={{ color: secondaryColor }}>Notes to Accounts</p>

      {resolvedNotes.length === 0 && (
        <p className="mt-4 text-gray-500 text-center">No notes available.</p>
      )}

      <div className="space-y-6">
        {resolvedNotes.map((note: { number: string; title: string; originalNote: string; bsPath?: string }) => {
          const { number, title, originalNote, bsPath } = note;
          let noteContent = company.noteDetails?.[originalNote]?.trim() || getNoteTemplate(originalNote, title, company);
          
          // Remove tables from content for specific notes
          if (notesWithoutTemplateTable.includes(originalNote)) {
            noteContent = removeTablesFromContent(noteContent);
          }
          
          const breakdownItems = company.breakdowns?.[originalNote] || getDefaultBreakdownItems(originalNote);

          return (
            <div key={number} id={`note-${number}`} className="break-inside-avoid">
              <h3 className="text-lg text-gray-800 mb-3 border-b border-gray-300 pb-2">Note {number}: {title}</h3>

              {/* Description / Text Content */}
              <div className="mb-4">
                {isEditable ? (
                  <RichTextEditor
                    value={noteContent}
                    onChange={(content) => {
                      // When saving, also remove tables for these notes
                      const cleanedContent = notesWithoutTemplateTable.includes(originalNote) 
                        ? removeTablesFromContent(content) 
                        : content;
                      handleNoteChange(originalNote, cleanedContent);
                    }}
                    placeholder="Enter note content..."
                    minHeight={150}
                  />
                ) : (
                  <div
                    className="prose max-w-none text-sm leading-relaxed whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ __html: noteContent }}
                  />
                )}
              </div>

              {/* Breakdown Table (only if mapped to BS) */}
              {bsPath && (
                <div className="mt-4">
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
