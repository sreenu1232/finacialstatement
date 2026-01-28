import { Company } from '../types';
import { formatINR } from './formatters';

export const getNoteTemplate = (noteId: string, title: string, company: Company): string => {
    const commonStyles = `
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
    margin-bottom: 10px;
    font-size: 12px;
  `;
    const thStyles = `
    border: 1px solid #e5e7eb;
    padding: 8px;
    background-color: #f9fafb;
    text-align: left;
    font-weight: 600;
  `;
    const tdStyles = `
    border: 1px solid #e5e7eb;
    padding: 8px;
  `;
    const rightAlign = `text-align: right;`;

    // Helper to format number
    const fmt = (val: number) => formatINR(val, 'full-number');

    // 1. Corporate Information
    if (noteId === 'corporate-info') {
        return `
      <p><strong>1. Corporate Information</strong></p>
      <p>${company.name} ("the Company") is a public limited company domiciled in India and incorporated under the provisions of the Companies Act, 2013. The registered office of the Company is located at ${company.address}.</p>
      <p>The Company is primarily engaged in the business of ${company.sector} sector (${company.specifications}).</p>
    `;
    }

    // 2. Significant Accounting Policies
    if (noteId === 'accounting-policies') {
        return `
      <p><strong>2. Significant Accounting Policies</strong></p>
      <p><strong>2.1 Basis of Preparation</strong></p>
      <p>The financial statements of the Company have been prepared in accordance with Indian Accounting Standards (Ind AS) notified under the Companies (Indian Accounting Standards) Rules, 2015 (as amended).</p>
      <p><strong>2.2 Use of Estimates</strong></p>
      <p>The preparation of financial statements requires management to make judgments, estimates and assumptions that affect the application of accounting policies and the reported amounts of assets, liabilities, income and expenses.</p>
      <p><strong>2.3 Property, Plant and Equipment</strong></p>
      <p>Property, plant and equipment are stated at cost less accumulated depreciation and impairment losses, if any.</p>
    `;
    }

    // Share Capital Template
    if (title.includes('Share capital')) {
        const current = company.balanceSheet.equity.equityShareCapital.current;
        const previous = company.balanceSheet.equity.equityShareCapital.previous;
        return `
      <p><strong>${title}</strong></p>
      <table style="${commonStyles}">
        <thead>
          <tr>
            <th style="${thStyles}">Particulars</th>
            <th style="${thStyles} ${rightAlign}">As at ${company.yearEnd}</th>
            <th style="${thStyles} ${rightAlign}">As at ${company.prevYearEnd}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="${tdStyles}"><strong>Authorised Share Capital</strong><br>... Equity Shares of ₹... each</td>
            <td style="${tdStyles} ${rightAlign}">-</td>
            <td style="${tdStyles} ${rightAlign}">-</td>
          </tr>
          <tr>
            <td style="${tdStyles}"><strong>Issued, Subscribed and Paid-up</strong><br>... Equity Shares of ₹... each fully paid up</td>
            <td style="${tdStyles} ${rightAlign}">${fmt(current)}</td>
            <td style="${tdStyles} ${rightAlign}">${fmt(previous)}</td>
          </tr>
          <tr>
            <td style="${tdStyles}"><strong>Total</strong></td>
            <td style="${tdStyles} ${rightAlign}"><strong>${fmt(current)}</strong></td>
            <td style="${tdStyles} ${rightAlign}"><strong>${fmt(previous)}</strong></td>
          </tr>
        </tbody>
      </table>
      <p><strong>(a) Reconciliation of shares outstanding at the beginning and at the end of the reporting period</strong></p>
      <table style="${commonStyles}">
        <thead>
          <tr>
            <th style="${thStyles}">Particulars</th>
            <th style="${thStyles} ${rightAlign}">No. of Shares</th>
            <th style="${thStyles} ${rightAlign}">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="${tdStyles}">At the beginning of the period</td>
            <td style="${tdStyles} ${rightAlign}">-</td>
            <td style="${tdStyles} ${rightAlign}">-</td>
          </tr>
          <tr>
            <td style="${tdStyles}">Issued during the period</td>
            <td style="${tdStyles} ${rightAlign}">-</td>
            <td style="${tdStyles} ${rightAlign}">-</td>
          </tr>
          <tr>
            <td style="${tdStyles}">Outstanding at the end of the period</td>
            <td style="${tdStyles} ${rightAlign}">-</td>
            <td style="${tdStyles} ${rightAlign}">-</td>
          </tr>
        </tbody>
      </table>
      <p><strong>(b) Details of shareholders holding more than 5% shares in the company</strong></p>
      <table style="${commonStyles}">
        <thead>
          <tr>
            <th style="${thStyles}">Name of Shareholder</th>
            <th style="${thStyles} ${rightAlign}">No. of Shares</th>
            <th style="${thStyles} ${rightAlign}">% Holding</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="${tdStyles}">-</td>
            <td style="${tdStyles} ${rightAlign}">-</td>
            <td style="${tdStyles} ${rightAlign}">-</td>
          </tr>
        </tbody>
      </table>
    `;
    }

    // Borrowings Template
    if (title.includes('Borrowings')) {
        return `
      <p><strong>${title}</strong></p>
      <table style="${commonStyles}">
        <thead>
          <tr>
            <th style="${thStyles}">Particulars</th>
            <th style="${thStyles} ${rightAlign}">As at ${company.yearEnd}</th>
            <th style="${thStyles} ${rightAlign}">As at ${company.prevYearEnd}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="${tdStyles}"><strong>Secured</strong></td>
            <td style="${tdStyles} ${rightAlign}"></td>
            <td style="${tdStyles} ${rightAlign}"></td>
          </tr>
          <tr>
            <td style="${tdStyles} padding-left: 20px;">Term Loans from Banks</td>
            <td style="${tdStyles} ${rightAlign}">-</td>
            <td style="${tdStyles} ${rightAlign}">-</td>
          </tr>
          <tr>
            <td style="${tdStyles}"><strong>Unsecured</strong></td>
            <td style="${tdStyles} ${rightAlign}"></td>
            <td style="${tdStyles} ${rightAlign}"></td>
          </tr>
          <tr>
            <td style="${tdStyles} padding-left: 20px;">Loans from related parties</td>
            <td style="${tdStyles} ${rightAlign}">-</td>
            <td style="${tdStyles} ${rightAlign}">-</td>
          </tr>
          <tr>
            <td style="${tdStyles}"><strong>Total</strong></td>
            <td style="${tdStyles} ${rightAlign}"><strong>-</strong></td>
            <td style="${tdStyles} ${rightAlign}"><strong>-</strong></td>
          </tr>
        </tbody>
      </table>
      <p><em>Nature of security and terms of repayment for secured borrowings:</em></p>
      <p>...</p>
    `;
    }

    // Trade Payables Template (Ageing Schedule)
    if (title.includes('Trade Payables')) {
        return `
      <p><strong>${title}</strong></p>
      <table style="${commonStyles}">
        <thead>
          <tr>
            <th style="${thStyles}">Particulars</th>
            <th style="${thStyles} ${rightAlign}">As at ${company.yearEnd}</th>
            <th style="${thStyles} ${rightAlign}">As at ${company.prevYearEnd}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="${tdStyles}">Total outstanding dues of micro enterprises and small enterprises</td>
            <td style="${tdStyles} ${rightAlign}">-</td>
            <td style="${tdStyles} ${rightAlign}">-</td>
          </tr>
          <tr>
            <td style="${tdStyles}">Total outstanding dues of creditors other than micro enterprises and small enterprises</td>
            <td style="${tdStyles} ${rightAlign}">-</td>
            <td style="${tdStyles} ${rightAlign}">-</td>
          </tr>
           <tr>
            <td style="${tdStyles}"><strong>Total</strong></td>
            <td style="${tdStyles} ${rightAlign}"><strong>-</strong></td>
            <td style="${tdStyles} ${rightAlign}"><strong>-</strong></td>
          </tr>
        </tbody>
      </table>
      <p><strong>Trade Payables Ageing Schedule</strong></p>
      <table style="${commonStyles}">
        <thead>
          <tr>
            <th style="${thStyles}" rowspan="2">Particulars</th>
            <th style="${thStyles} text-align: center;" colspan="5">Outstanding for following periods from due date of payment</th>
            <th style="${thStyles} ${rightAlign}" rowspan="2">Total</th>
          </tr>
          <tr>
            <th style="${thStyles} ${rightAlign}">Less than 1 yr</th>
            <th style="${thStyles} ${rightAlign}">1-2 years</th>
            <th style="${thStyles} ${rightAlign}">2-3 years</th>
            <th style="${thStyles} ${rightAlign}">More than 3 yrs</th>
            <th style="${thStyles} ${rightAlign}">Not due</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="${tdStyles}">(i) MSME</td>
            <td style="${tdStyles} ${rightAlign}">-</td>
            <td style="${tdStyles} ${rightAlign}">-</td>
            <td style="${tdStyles} ${rightAlign}">-</td>
            <td style="${tdStyles} ${rightAlign}">-</td>
            <td style="${tdStyles} ${rightAlign}">-</td>
            <td style="${tdStyles} ${rightAlign}">-</td>
          </tr>
          <tr>
            <td style="${tdStyles}">(ii) Others</td>
            <td style="${tdStyles} ${rightAlign}">-</td>
            <td style="${tdStyles} ${rightAlign}">-</td>
            <td style="${tdStyles} ${rightAlign}">-</td>
            <td style="${tdStyles} ${rightAlign}">-</td>
            <td style="${tdStyles} ${rightAlign}">-</td>
            <td style="${tdStyles} ${rightAlign}">-</td>
          </tr>
          <tr>
            <td style="${tdStyles}">(iii) Disputed dues - MSME</td>
            <td style="${tdStyles} ${rightAlign}">-</td>
            <td style="${tdStyles} ${rightAlign}">-</td>
            <td style="${tdStyles} ${rightAlign}">-</td>
            <td style="${tdStyles} ${rightAlign}">-</td>
            <td style="${tdStyles} ${rightAlign}">-</td>
            <td style="${tdStyles} ${rightAlign}">-</td>
          </tr>
          <tr>
            <td style="${tdStyles}">(iv) Disputed dues - Others</td>
            <td style="${tdStyles} ${rightAlign}">-</td>
            <td style="${tdStyles} ${rightAlign}">-</td>
            <td style="${tdStyles} ${rightAlign}">-</td>
            <td style="${tdStyles} ${rightAlign}">-</td>
            <td style="${tdStyles} ${rightAlign}">-</td>
            <td style="${tdStyles} ${rightAlign}">-</td>
          </tr>
        </tbody>
      </table>
    `;
    }

    // Property, Plant and Equipment - only show heading
    // (the PPE breakdown table is handled separately)
    if (title.includes('Property, Plant and Equipment')) {
        return `<p><strong>${title}</strong></p>`;
    }

    // Balance Sheet notes that use BreakdownTable component - only show heading
    const notesWithBreakdownTable = [
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

    if (notesWithBreakdownTable.includes(noteId)) {
        // Return only the title heading - the BreakdownTable component handles the data display
        return `<p><strong>${title}</strong></p>`;
    }

    // Default Template for other notes (P&L, Cash Flow, etc.)
    return `
    <p><strong>${title}</strong></p>
    <table style="${commonStyles}">
      <thead>
        <tr>
          <th style="${thStyles}">Particulars</th>
          <th style="${thStyles} ${rightAlign}">As at ${company.yearEnd}</th>
          <th style="${thStyles} ${rightAlign}">As at ${company.prevYearEnd}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="${tdStyles}">...</td>
          <td style="${tdStyles} ${rightAlign}">-</td>
          <td style="${tdStyles} ${rightAlign}">-</td>
        </tr>
        <tr>
          <td style="${tdStyles}"><strong>Total</strong></td>
          <td style="${tdStyles} ${rightAlign}"><strong>-</strong></td>
          <td style="${tdStyles} ${rightAlign}"><strong>-</strong></td>
        </tr>
      </tbody>
    </table>
  `;
};
