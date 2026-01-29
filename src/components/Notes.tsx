import React, { useState } from 'react';
import { Company, BreakdownItem, BorrowingsData, TradePayablesData } from '../types';
import { buildNoteIndex, getFinancialPath } from '../utils/noteHelpers';
import { useApp } from '../context/AppContext';
import { getNoteTemplate } from '../utils/NoteTemplates';
import BreakdownTable from './BreakdownTable';
import PPEBreakdownTable from './PPEBreakdownTable';
import EPSBreakdownTable from './EPSBreakdownTable';
import ShareCapitalBreakdown from './ShareCapitalBreakdown';
import BorrowingsBreakdown from './BorrowingsBreakdown';
import TradePayablesBreakdown from './TradePayablesBreakdown';
import RichTextEditor from './RichTextEditor';
import { calculatePLTotal, compressSpaces } from '../utils/formatters';
import { FileText, ChevronDown, ChevronRight, Search } from 'lucide-react';

interface NotesProps {
  company: Company;
  modeOverride?: 'edit' | 'view' | 'report';
}

const PPE_NOTE_ID = '1';
const SHARE_CAPITAL_NOTE_ID = '22';
const BORROWINGS_NOTE_ID = '24';
const CURRENT_BORROWINGS_NOTE_ID = '32';
const TRADE_PAYABLES_MSME_NOTE_ID = '26';
const TRADE_PAYABLES_OTHERS_NOTE_ID = '27';
const CURRENT_TRADE_PAYABLES_MSME_NOTE_ID = '34';
const CURRENT_TRADE_PAYABLES_OTHERS_NOTE_ID = '35';
const EPS_NOTES = ['64', '65', '66', '67', '68', '69']; // EPS notes

// Notes that should NOT show any pre-built HTML tables inside the editor
// PPE and Share Capital have their own specialized breakdown components
// Notes 2-21, 23, and 24 use the generic BreakdownTable component
const notesWithoutTemplateTable: string[] = [
  PPE_NOTE_ID,
  SHARE_CAPITAL_NOTE_ID,
  '2',  // Capital work-in-progress
  '3',  // Investment Property
  '4',  // Goodwill
  '5',  // Other Intangible assets
  '6',  // Intangible assets under development
  '7',  // Biological Assets
  '8',  // Financial Assets - Investments (Non-current)
  '9',  // Financial Assets - Trade receivables (Non-current)
  '10', // Financial Assets - Loans (Non-current)
  '11', // Deferred tax assets
  '12', // Other non-current assets
  '13', // Inventories
  '14', // Financial Assets - Investments (Current)
  '15', // Financial Assets - Trade receivables (Current)
  '16', // Financial Assets - Cash and cash equivalents
  '17', // Financial Assets - Bank balances
  '18', // Financial Assets - Loans (Current)
  '19', // Financial Assets - Others
  '20', // Current Tax Assets
  '21', // Other current assets
  '23', // Other Equity
  '24', // Non-current Borrowings
  '26', // Non-current Trade Payables (MSME)
  '27', // Non-current Trade Payables (Others)
  '25', // Lease liabilities
  '28', // Other financial liabilities
  '29', // Non-current Provisions
  '30', // Deferred tax liabilities
  '31', // Other non-current liabilities
  '32', // Current Borrowings
  '33', // Lease liabilities (current)
  '34', // Current Trade Payables (MSME)
  '35', // Current Trade Payables (Others)
  '36', '37', '38', '39', '40', '41', '42', '43', '44', '45',
  '46', '47', '48', '49', '50', '51', '52', '53', '54', '55',
  '56', '57', '58', '59', '60', '61', '62', '63', '64', '65',
  '66', '67', '68', '69',
];

const removeTablesFromContent = (htmlContent: string): string => {
  if (!htmlContent) return htmlContent;

  let cleaned = htmlContent;
  let previousLength = -1;

  while (cleaned.length !== previousLength) {
    previousLength = cleaned.length;
    cleaned = cleaned.replace(/<table[^>]*>[\s\S]*?<\/table>/gi, '');
  }

  cleaned = cleaned.replace(/<\/?(?:thead|tbody|tfoot|tr|th|td)[^>]*>/gi, '');
  return cleaned.trim();
};

const removeHeadingFromContent = (htmlContent: string, title: string): string => {
  if (!htmlContent || !title) return htmlContent;

  // Remove leading/trailing whitespace and normalize
  let cleaned = htmlContent.trim();
  const normalizedTitle = title.trim();

  // Escape special regex characters in title
  const escapedTitle = normalizedTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // Pattern 1: Remove <p><strong>title</strong></p> at the start (with optional whitespace)
  // This handles cases like <p><strong>(a) Property, Plant and Equipment</strong></p>
  const pattern1 = new RegExp(
    `^<p>\\s*<strong>\\s*${escapedTitle}\\s*</strong>\\s*</p>\\s*`,
    'i'
  );
  cleaned = cleaned.replace(pattern1, '');

  // Pattern 2: Remove <p><strong>number. title</strong></p> at the start
  // This handles cases where the number is included in the content
  const pattern2 = new RegExp(
    `^<p>\\s*<strong>\\s*\\d+\\.\\s*${escapedTitle}\\s*</strong>\\s*</p>\\s*`,
    'i'
  );
  cleaned = cleaned.replace(pattern2, '');

  // Pattern 3: Remove <strong>title</strong> wrapped in any tag at the start
  const pattern3 = new RegExp(
    `^<[^>]+>\\s*<strong>\\s*${escapedTitle}\\s*</strong>\\s*</[^>]+>\\s*`,
    'i'
  );
  cleaned = cleaned.replace(pattern3, '');

  // Pattern 4: Remove standalone <strong>title</strong> at the start (not wrapped in p tag)
  const pattern4 = new RegExp(
    `^<strong>\\s*${escapedTitle}\\s*</strong>\\s*`,
    'i'
  );
  cleaned = cleaned.replace(pattern4, '');

  return cleaned.trim();
};

const Notes: React.FC<NotesProps> = ({ company, modeOverride }) => {
  const { updateCompany, viewMode } = useApp();
  const { fontStyle, fontSize, primaryColor, secondaryColor } =
    company.settings.template;

  const { list: resolvedNotes } = buildNoteIndex(company);
  const effectiveViewMode = modeOverride || viewMode;
  const isEditable = effectiveViewMode === 'edit';

  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set(resolvedNotes.map(n => n.number)));
  const [searchQuery, setSearchQuery] = useState('');

  const plTotals = calculatePLTotal(company.profitLoss);

  const calculatedPLNotes: Record<string, { current: number; previous: number }> = {
    '52': {
      current: plTotals.profitForThePeriod,
      previous: plTotals.profitForThePeriodPrev,
    },
    '55': {
      current: plTotals.profitLossFromDiscontinuedOperationsAfterTax,
      previous: plTotals.profitLossFromDiscontinuedOperationsAfterTaxPrev,
    },
    '56': {
      current: plTotals.profitLossForThePeriod,
      previous: plTotals.profitLossForThePeriodPrev,
    },
  };

  const getDefaultBreakdownItems = (noteId: string): BreakdownItem[] => {
    // For EPS notes, only ABC Limited gets pre-filled values, others get 0
    if (EPS_NOTES.includes(noteId)) {
      // Only ABC Limited gets the default values (19200000/4000000 = 4.8)
      if (company.name === 'ABC Limited') {
        return [
          { id: 'net-profit', description: 'Net profit', current: 19200000, previous: 0 },
          { id: 'equity-shares', description: 'No.of Equity Shares', current: 4000000, previous: 0 }
        ];
      } else {
        // All other companies (including new ones) get 0 values
        return [
          { id: 'net-profit', description: 'Net profit', current: 0, previous: 0 },
          { id: 'equity-shares', description: 'No.of Equity Shares', current: 0, previous: 0 }
        ];
      }
    }

    if (calculatedPLNotes[noteId]) {
      const { current, previous } = calculatedPLNotes[noteId];
      return [{ id: `default-${noteId}`, description: 'Total', current, previous }];
    }

    const bsPath = getFinancialPath(noteId);
    if (!bsPath) return [];

    const keys = bsPath.split('.');
    const isBalanceSheetPath =
      bsPath.startsWith('nonCurrentAssets') ||
      bsPath.startsWith('currentAssets') ||
      bsPath.startsWith('equity') ||
      bsPath.startsWith('nonCurrentLiabilities') ||
      bsPath.startsWith('currentLiabilities');

    let obj: any = isBalanceSheetPath ? company.balanceSheet : company.profitLoss;

    for (let i = 0; i < keys.length - 1; i += 1) {
      if (!obj[keys[i]]) return [];
      obj = obj[keys[i]];
    }

    const finalKey = keys[keys.length - 1];
    const value = obj[finalKey];

    if (!value || typeof value.current !== 'number' || typeof value.previous !== 'number') {
      return [];
    }

    return [{ id: `default-${noteId}`, description: 'Total', current: value.current, previous: value.previous }];
  };

  const handleNoteChange = (noteId: string, content: string) => {
    updateCompany(company.id, { noteDetails: { ...company.noteDetails, [noteId]: content } });
  };

  const handleBreakdownUpdate = (
    noteId: string,
    bsPath: string,
    items: BreakdownItem[],
    totalCurrent: number,
    totalPrevious: number
  ) => {
    const calculatedNotes = ['52', '55', '56'];
    const updatedCompany: Company = {
      ...company,
      breakdowns: { ...(company.breakdowns || {}), [noteId]: items },
    };

    if (!calculatedNotes.includes(noteId) && bsPath) {
      const keys = bsPath.split('.');
      const isBalanceSheetPath =
        bsPath.startsWith('nonCurrentAssets') ||
        bsPath.startsWith('currentAssets') ||
        bsPath.startsWith('equity') ||
        bsPath.startsWith('nonCurrentLiabilities') ||
        bsPath.startsWith('currentLiabilities');

      const rootKey = isBalanceSheetPath ? 'balanceSheet' : 'profitLoss';
      
      // Create a proper deep copy by recursively copying nested objects
      const rootObj: any = { ...(updatedCompany as any)[rootKey] };
      
      // Build the nested path with proper copying
      const path: any[] = [rootObj];
      let current = rootObj;
      
      for (let i = 0; i < keys.length - 1; i += 1) {
        const k = keys[i];
        if (!current[k]) {
          current[k] = {};
        } else {
          current[k] = { ...current[k] };
        }
        current = current[k];
        path.push(current);
      }

      const finalKey = keys[keys.length - 1];
      // Preserve existing note field if it exists, update current and previous values
      const existingNote = current[finalKey]?.note || noteId;
      current[finalKey] = { 
        ...(current[finalKey] || {}), 
        current: totalCurrent, 
        previous: totalPrevious,
        note: existingNote
      };

      // Update the company with the modified root object
      (updatedCompany as any)[rootKey] = rootObj;
    }

    // Only update the changed properties to ensure React detects the change
    const updatePayload: Partial<Company> = {
      breakdowns: updatedCompany.breakdowns
    };
    
    if (!calculatedNotes.includes(noteId) && bsPath) {
      const isBalanceSheetPath =
        bsPath.startsWith('nonCurrentAssets') ||
        bsPath.startsWith('currentAssets') ||
        bsPath.startsWith('equity') ||
        bsPath.startsWith('nonCurrentLiabilities') ||
        bsPath.startsWith('currentLiabilities');
      
      const rootKey = isBalanceSheetPath ? 'balanceSheet' : 'profitLoss';
      (updatePayload as any)[rootKey] = (updatedCompany as any)[rootKey];
    }
    
    updateCompany(company.id, updatePayload);
  };

  const handlePPEBreakdownUpdate = (
    noteId: string,
    bsPath: string,
    items: any[],
    totalGrossBlock: number,
    totalDepreciation: number,
    totalNetBlock: number
  ) => {
    const updatedCompany: Company = {
      ...company,
      ppeBreakdowns: { ...(company.ppeBreakdowns || {}), [noteId]: items },
    };

    if (bsPath) {
      const keys = bsPath.split('.');
      const rootObj: any = { ...updatedCompany.balanceSheet };
      let obj = rootObj;

      for (let i = 0; i < keys.length - 1; i += 1) {
        const k = keys[i];
        obj[k] = obj[k] ? { ...obj[k] } : {};
        obj = obj[k];
      }

      const finalKey = keys[keys.length - 1];
      if (obj[finalKey]) {
        obj[finalKey] = { ...obj[finalKey], current: totalNetBlock, previous: obj[finalKey].previous };
      }

      updatedCompany.balanceSheet = rootObj;
    }

    updateCompany(company.id, updatedCompany);
  };

  const handleShareCapitalUpdate = (noteId: string, data: any) => {
    // Calculate total from issued shares - use currentAmount and previousAmount directly
    const totalCurrent = (data.issued || []).reduce((sum: number, item: any) => 
      sum + (Number(item.currentAmount) || 0), 0);
    const totalPrevious = (data.issued || []).reduce((sum: number, item: any) => 
      sum + (Number(item.previousAmount) || 0), 0);
    
    // Update balance sheet
    const bsPath = getFinancialPath(noteId);
    if (!bsPath) {
      // If no path, just update the share capital details
      updateCompany(company.id, {
        shareCapitalDetails: { ...(company.shareCapitalDetails || {}), [noteId]: data },
      });
      return;
    }
    
    // Deep clone the balance sheet to avoid mutation
    const updatedBalanceSheet = JSON.parse(JSON.stringify(company.balanceSheet));
    const keys = bsPath.split('.');
    let obj: any = updatedBalanceSheet;
    
    // Navigate to the parent object
    for (let i = 0; i < keys.length - 1; i++) {
      if (!obj[keys[i]]) {
        obj[keys[i]] = {};
      }
      obj = obj[keys[i]];
    }
    
    // Update the final value
    const finalKey = keys[keys.length - 1];
    obj[finalKey] = { 
      ...(obj[finalKey] || {}), 
      current: totalCurrent, 
      previous: totalPrevious 
    };
    
    // Update company with both share capital details and balance sheet
    updateCompany(company.id, {
      shareCapitalDetails: { ...(company.shareCapitalDetails || {}), [noteId]: data },
      balanceSheet: updatedBalanceSheet,
    });
  };

  const handleBorrowingsUpdate = (noteId: string, data: BorrowingsData) => {
    // Calculate total from secured + unsecured
    const totalCurrent = 
      (data.secured || []).reduce((sum, item) => sum + (Number(item.currentAmount) || 0), 0) +
      (data.unsecured || []).reduce((sum, item) => sum + (Number(item.currentAmount) || 0), 0);
    const totalPrevious = 
      (data.secured || []).reduce((sum, item) => sum + (Number(item.previousAmount) || 0), 0) +
      (data.unsecured || []).reduce((sum, item) => sum + (Number(item.previousAmount) || 0), 0);
    
    // Update balance sheet
    const bsPath = getFinancialPath(noteId);
    let updatedBalanceSheet = { ...company.balanceSheet };
    
    if (bsPath) {
      const keys = bsPath.split('.');
      let obj: any = updatedBalanceSheet;
      for (let i = 0; i < keys.length - 1; i++) {
        obj[keys[i]] = { ...obj[keys[i]] };
        obj = obj[keys[i]];
      }
      const finalKey = keys[keys.length - 1];
      if (obj[finalKey]) {
        obj[finalKey] = { ...obj[finalKey], current: totalCurrent, previous: totalPrevious };
      }
    }
    
    updateCompany(company.id, {
      borrowingsDetails: { ...(company.borrowingsDetails || {}), [noteId]: data },
      balanceSheet: updatedBalanceSheet,
    });
  };

  // Generic handler to update balance sheet values directly from summary table
  const handleBalanceSheetValueUpdate = (noteId: string, current: number, previous: number) => {
    const bsPath = getFinancialPath(noteId);
    if (!bsPath) return;

    const keys = bsPath.split('.');
    const isBalanceSheetPath =
      bsPath.startsWith('nonCurrentAssets') ||
      bsPath.startsWith('currentAssets') ||
      bsPath.startsWith('equity') ||
      bsPath.startsWith('nonCurrentLiabilities') ||
      bsPath.startsWith('currentLiabilities');

    if (isBalanceSheetPath) {
      let updatedBalanceSheet = { ...company.balanceSheet };
      let obj: any = updatedBalanceSheet;
      for (let i = 0; i < keys.length - 1; i++) {
        obj[keys[i]] = { ...obj[keys[i]] };
        obj = obj[keys[i]];
      }
      const finalKey = keys[keys.length - 1];
      if (obj[finalKey]) {
        obj[finalKey] = { ...obj[finalKey], current, previous };
      }
      updateCompany(company.id, { balanceSheet: updatedBalanceSheet });
    } else {
      // P&L path
      let updatedProfitLoss = { ...company.profitLoss };
      let obj: any = updatedProfitLoss;
      for (let i = 0; i < keys.length - 1; i++) {
        obj[keys[i]] = { ...obj[keys[i]] };
        obj = obj[keys[i]];
      }
      const finalKey = keys[keys.length - 1];
      if (obj[finalKey]) {
        obj[finalKey] = { ...obj[finalKey], current, previous };
      }
      updateCompany(company.id, { profitLoss: updatedProfitLoss });
    }
  };

  const handleTradePayablesUpdate = (noteId: string, data: TradePayablesData) => {
    // Calculate total from all sections
    const calculateSectionTotal = (items: any[], field: string) => 
      (items || []).reduce((sum, item) => {
        return sum + 
          (Number(item.lessThan1Year) || 0) + 
          (Number(item.oneToTwoYears) || 0) + 
          (Number(item.twoToThreeYears) || 0) + 
          (Number(item.moreThan3Years) || 0) + 
          (Number(item.notDue) || 0);
      }, 0);
    
    const totalCurrent = 
      calculateSectionTotal(data.msme, 'current') +
      calculateSectionTotal(data.others, 'current') +
      calculateSectionTotal(data.disputedMsme, 'current') +
      calculateSectionTotal(data.disputedOthers, 'current');
    
    // For previous year, we don't have that data in current structure
    // Keep existing previous value
    const bsPath = getFinancialPath(noteId);
    let updatedBalanceSheet = { ...company.balanceSheet };
    let existingPrevious = 0;
    
    if (bsPath) {
      const keys = bsPath.split('.');
      let obj: any = company.balanceSheet;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!obj[keys[i]]) break;
        obj = obj[keys[i]];
      }
      const finalKey = keys[keys.length - 1];
      if (obj?.[finalKey]) {
        existingPrevious = obj[finalKey].previous || 0;
      }
    }
    
    if (bsPath) {
      const keys = bsPath.split('.');
      let obj: any = updatedBalanceSheet;
      for (let i = 0; i < keys.length - 1; i++) {
        obj[keys[i]] = { ...obj[keys[i]] };
        obj = obj[keys[i]];
      }
      const finalKey = keys[keys.length - 1];
      if (obj[finalKey]) {
        obj[finalKey] = { ...obj[finalKey], current: totalCurrent, previous: existingPrevious };
      }
    }
    
    updateCompany(company.id, {
      tradePayablesDetails: { ...(company.tradePayablesDetails || {}), [noteId]: data },
      balanceSheet: updatedBalanceSheet,
    });
  };

  const toggleNote = (noteNumber: string) => {
    setExpandedNotes(prev => {
      const next = new Set(prev);
      if (next.has(noteNumber)) {
        next.delete(noteNumber);
      } else {
        next.add(noteNumber);
      }
      return next;
    });
  };

  const expandAll = () => setExpandedNotes(new Set(resolvedNotes.map(n => n.number)));
  const collapseAll = () => setExpandedNotes(new Set());

  const filteredNotes = resolvedNotes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.number.includes(searchQuery)
  );

  // In report mode, expand all notes for printing
  const isReportMode = modeOverride === 'report';
  
  return (
    <div
      className="max-w-5xl mx-auto print:py-0 print:max-w-none"
      style={{ fontFamily: fontStyle, fontSize: `${fontSize}px` }}
    >
      {/* Header - Hidden in report mode (shown in section header) */}
      {!isReportMode && (
        <div className="text-center mb-8 print:mb-6">
          <h2
            className="text-2xl font-bold mb-1 tracking-tight"
            style={{ color: primaryColor }}
          >
            {company.name}
          </h2>
          <p className="text-base font-medium" style={{ color: secondaryColor }}>
            Notes to Accounts
          </p>
          <p className="text-sm text-slate-500 mt-1">
            Financial Year: {company.financialYear}
          </p>
        </div>
      )}

      {/* Controls - Hidden in print and report mode */}
      {isEditable && !isReportMode && (
        <div className="flex items-center justify-between gap-4 mb-6 print:hidden no-print">
          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Expand/Collapse */}
          <div className="flex items-center gap-2">
            <button
              onClick={expandAll}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
            >
              Expand All
            </button>
            <button
              onClick={collapseAll}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
            >
              Collapse All
            </button>
          </div>
        </div>
      )}

      {/* Notes Count - Hidden in print and report mode */}
      {!isReportMode && (
        <div className="flex items-center gap-2 mb-4 text-sm text-slate-500 print:hidden no-print">
          <FileText size={16} />
          <span>{filteredNotes.length} notes</span>
        </div>
      )}

      {/* Empty State - Hidden in report mode */}
      {filteredNotes.length === 0 && !isReportMode && (
        <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-200 print:hidden">
          <FileText size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500 font-medium">No notes found</p>
          <p className="text-slate-400 text-sm mt-1">Try adjusting your search query</p>
        </div>
      )}

      {/* Notes List */}
      <div className="space-y-4">
        {filteredNotes.map((note) => {
          const { number, title, originalNote, bsPath } = note;
          const isExpanded = expandedNotes.has(number);

          let noteContent =
            company.noteDetails?.[originalNote]?.trim() ||
            getNoteTemplate(originalNote, title, company);

          noteContent = compressSpaces(noteContent);

          if (notesWithoutTemplateTable.includes(originalNote)) {
            noteContent = removeTablesFromContent(noteContent);
          }

          // In report mode, remove duplicate heading from content since header already shows it
          if (isReportMode) {
            noteContent = removeHeadingFromContent(noteContent, title);
          }

          const breakdownItems =
            company.breakdowns?.[originalNote] || getDefaultBreakdownItems(originalNote);

          const isPPENote = originalNote === PPE_NOTE_ID;
          const isShareCapitalNote = originalNote === SHARE_CAPITAL_NOTE_ID;
          const isBorrowingsNote = originalNote === BORROWINGS_NOTE_ID || originalNote === CURRENT_BORROWINGS_NOTE_ID;
          const isTradePayablesNote = originalNote === TRADE_PAYABLES_MSME_NOTE_ID || originalNote === TRADE_PAYABLES_OTHERS_NOTE_ID || originalNote === CURRENT_TRADE_PAYABLES_MSME_NOTE_ID || originalNote === CURRENT_TRADE_PAYABLES_OTHERS_NOTE_ID;
          const isEPSNote = EPS_NOTES.includes(originalNote);

          const ppeTable = isPPENote ? (
            <PPEBreakdownTable
              items={company.ppeBreakdowns?.[originalNote] || [
                { id: '1', description: 'Land', grossBlock: 0, depreciation: 0 },
                { id: '2', description: 'Buildings', grossBlock: 0, depreciation: 0 },
                { id: '3', description: 'Plant and Equipment', grossBlock: 0, depreciation: 0 },
                { id: '4', description: 'Furniture and Fixtures', grossBlock: 0, depreciation: 0 },
                { id: '5', description: 'Vehicles', grossBlock: 0, depreciation: 0 },
                { id: '6', description: 'Office Equipment', grossBlock: 0, depreciation: 0 },
              ]}
              onUpdate={(items, totalGrossBlock, totalDepreciation, totalNetBlock) =>
                handlePPEBreakdownUpdate(originalNote, bsPath || '', items, totalGrossBlock, totalDepreciation, totalNetBlock)
              }
              isEditable={isEditable}
              company={company}
            />
          ) : null;

          const shareCapitalTable = isShareCapitalNote ? (
            <ShareCapitalBreakdown
              data={company.shareCapitalDetails?.[originalNote] || {
                authorised: [],
                issued: [],
                reconciliation: [],
                shareholders: [],
                promoters: []
              }}
              onUpdate={(data) => handleShareCapitalUpdate(originalNote, data)}
              isEditable={isEditable}
              company={company}
              onBalanceSheetUpdate={(current, previous) => handleBalanceSheetValueUpdate(originalNote, current, previous)}
            />
          ) : null;

          const borrowingsTable = isBorrowingsNote ? (
            <BorrowingsBreakdown
              data={company.borrowingsDetails?.[originalNote] || {
                secured: [],
                unsecured: [],
                securityDetails: ''
              }}
              onUpdate={(data) => handleBorrowingsUpdate(originalNote, data)}
              isEditable={isEditable}
              company={company}
              noteId={originalNote}
              onBalanceSheetUpdate={(current, previous) => handleBalanceSheetValueUpdate(originalNote, current, previous)}
            />
          ) : null;

          const tradePayablesTable = isTradePayablesNote ? (
            <TradePayablesBreakdown
              data={company.tradePayablesDetails?.[originalNote] || {
                msme: [],
                others: [],
                disputedMsme: [],
                disputedOthers: [],
                disclosures: ''
              }}
              onUpdate={(data) => handleTradePayablesUpdate(originalNote, data)}
              isEditable={isEditable}
              company={company}
              noteId={originalNote}
              onBalanceSheetUpdate={(current, previous) => handleBalanceSheetValueUpdate(originalNote, current, previous)}
            />
          ) : null;

          const epsTable = isEPSNote ? (
            <EPSBreakdownTable
              items={breakdownItems}
              onUpdate={(items, totalCurrent, totalPrevious) =>
                handleBreakdownUpdate(originalNote, bsPath || '', items, totalCurrent, totalPrevious)
              }
              isEditable={isEditable}
              company={company}
            />
          ) : null;

          const defaultTable = (!isPPENote && !isShareCapitalNote && !isBorrowingsNote && !isTradePayablesNote && !isEPSNote && bsPath) ? (
            <BreakdownTable
              items={breakdownItems}
              onUpdate={(items, totalCurrent, totalPrevious) =>
                handleBreakdownUpdate(originalNote, bsPath, items, totalCurrent, totalPrevious)
              }
              isEditable={isEditable}
              company={company}
            />
          ) : null;

          // In report mode, always show expanded
          const showContent = isReportMode || isExpanded;
          
          return (
            <div
              key={number}
              id={`note-${number}`}
              className={`bg-white overflow-hidden transition-all duration-200 ${
                isReportMode 
                  ? 'border-b border-slate-200 print:border-b print:border-slate-300 mb-4' 
                  : 'rounded-xl border border-slate-200 shadow-sm hover:shadow-md print:shadow-none print:border-slate-300 print:rounded-none print:border-b'
              }`}
            >
              {/* Note Header */}
              {isReportMode ? (
                <div className="flex items-center gap-3 py-3 border-b border-slate-100 print:py-2">
                  <span className="font-bold text-blue-600 text-sm">{number}.</span>
                  <h3 className="flex-1 font-semibold text-slate-800 text-sm print:text-xs">
                    {title}
                  </h3>
                </div>
              ) : (
                <button
                  onClick={() => toggleNote(number)}
                  className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-slate-50 transition-colors print:hover:bg-white print:px-2 print:py-2"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600 font-semibold text-sm shrink-0 print:w-6 print:h-6 print:text-xs">
                    {number}
                  </div>
                  <h3 className="flex-1 font-semibold text-slate-800 text-base print:text-sm">
                    {title}
                  </h3>
                  <div className="text-slate-400 print:hidden no-print">
                    {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                  </div>
                </button>
              )}

              {/* Note Content */}
              {showContent && (
                <div className={`${isReportMode ? 'py-2 print:py-1' : 'px-5 pb-5 border-t border-slate-100'}`}>
                  <div className={`${isReportMode ? '' : 'pt-4'}`}>
                    {isEditable && !isReportMode ? (
                      <RichTextEditor
                        value={noteContent}
                        onChange={content => {
                          const cleanedContent = notesWithoutTemplateTable.includes(originalNote)
                            ? removeTablesFromContent(content)
                            : content;
                          handleNoteChange(originalNote, compressSpaces(cleanedContent));
                        }}
                        placeholder="Enter note content..."
                        minHeight={120}
                      >
                        {ppeTable || shareCapitalTable || borrowingsTable || tradePayablesTable || epsTable || defaultTable ? (
                          <div className="space-y-4">
                            {ppeTable}
                            {shareCapitalTable}
                            {borrowingsTable}
                            {tradePayablesTable}
                            {epsTable}
                            {defaultTable}
                          </div>
                        ) : null}
                      </RichTextEditor>
                    ) : (
                      <div className="space-y-4">
                        <div
                          className="prose prose-sm prose-slate max-w-none leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: noteContent }}
                        />
                        {ppeTable}
                        {shareCapitalTable}
                        {borrowingsTable}
                        {tradePayablesTable}
                        {epsTable}
                        {defaultTable}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Cash Flow Explanation */}
      <div className="mt-8 pt-6 border-t border-slate-300 print:mt-6 print:pt-4">
        <div className="prose prose-sm prose-slate max-w-none leading-relaxed">
          <p className="text-sm text-slate-700 print:text-xs">
            <strong>Cash Flow Statement:</strong> The cash flow statement presents the movement in cash and cash equivalents during the reporting period, classified into operating, investing, and financing activities. Operating activities represent the principal revenue-producing activities of the Company and other activities that are not investing or financing activities. Investing activities are the acquisition and disposal of long-term assets and other investments not included in cash equivalents. Financing activities are activities that result in changes in the size and composition of the equity capital and borrowings of the Company.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Notes;
