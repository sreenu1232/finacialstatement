import { PDFTemplateFormat } from '../types';

export const getTemplateStyles = (templateFormat: PDFTemplateFormat, primaryColor: string, secondaryColor: string) => {
  const baseStyles = {
    classic: {
      headerGradient: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #2563eb 100%)',
      headerPadding: '35mm 20mm 25mm 20mm',
      fontSize: '9pt',
      titleSize: '32pt',
      borderStyle: '2pt solid #1e293b',
      tableHeaderBg: '#f1f5f9',
      tableBorderColor: '#cbd5e1',
      spacing: 'normal'
    },
    modern: {
      headerGradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
      headerPadding: '40mm 20mm 30mm 20mm',
      fontSize: '9pt',
      titleSize: '36pt',
      borderStyle: '1pt solid #e2e8f0',
      tableHeaderBg: '#f8fafc',
      tableBorderColor: '#e2e8f0',
      spacing: 'relaxed'
    },
    professional: {
      headerGradient: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%)',
      headerPadding: '35mm 20mm 25mm 20mm',
      fontSize: '9pt',
      titleSize: '32pt',
      borderStyle: '2pt solid #1e293b',
      tableHeaderBg: '#eff6ff',
      tableBorderColor: '#bfdbfe',
      spacing: 'normal'
    },
    minimal: {
      headerGradient: 'linear-gradient(135deg, #64748b 0%, #94a3b8 50%, #cbd5e1 100%)',
      headerPadding: '25mm 20mm 20mm 20mm',
      fontSize: '8.5pt',
      titleSize: '28pt',
      borderStyle: '1pt solid #cbd5e1',
      tableHeaderBg: '#ffffff',
      tableBorderColor: '#e2e8f0',
      spacing: 'compact'
    },
    corporate: {
      headerGradient: 'linear-gradient(135deg, #0c4a6e 0%, #0369a1 50%, #0284c7 100%)',
      headerPadding: '38mm 20mm 28mm 20mm',
      fontSize: '9.5pt',
      titleSize: '34pt',
      borderStyle: '2.5pt solid #0c4a6e',
      tableHeaderBg: '#f0f9ff',
      tableBorderColor: '#bae6fd',
      spacing: 'normal'
    },
    elegant: {
      headerGradient: 'linear-gradient(135deg, #4c1d95 0%, #6d28d9 50%, #8b5cf6 100%)',
      headerPadding: '42mm 20mm 32mm 20mm',
      fontSize: '9pt',
      titleSize: '35pt',
      borderStyle: '1.5pt solid #6d28d9',
      tableHeaderBg: '#faf5ff',
      tableBorderColor: '#d8b4fe',
      spacing: 'relaxed'
    },
    formal: {
      headerGradient: 'linear-gradient(135deg, #18181b 0%, #27272a 50%, #3f3f46 100%)',
      headerPadding: '35mm 20mm 25mm 20mm',
      fontSize: '10pt',
      titleSize: '32pt',
      borderStyle: '2pt solid #18181b',
      tableHeaderBg: '#f4f4f5',
      tableBorderColor: '#d4d4d8',
      spacing: 'normal'
    },
    creative: {
      headerGradient: 'linear-gradient(135deg, #be123c 0%, #e11d48 50%, #f43f5e 100%)',
      headerPadding: '40mm 20mm 30mm 20mm',
      fontSize: '9pt',
      titleSize: '36pt',
      borderStyle: '2pt solid #be123c',
      tableHeaderBg: '#fff1f2',
      tableBorderColor: '#fecdd3',
      spacing: 'relaxed'
    },
    compact: {
      headerGradient: 'linear-gradient(135deg, #374151 0%, #4b5563 50%, #6b7280 100%)',
      headerPadding: '20mm 15mm 15mm 15mm',
      fontSize: '8pt',
      titleSize: '24pt',
      borderStyle: '1pt solid #374151',
      tableHeaderBg: '#f9fafb',
      tableBorderColor: '#d1d5db',
      spacing: 'compact'
    },
    detailed: {
      headerGradient: 'linear-gradient(135deg, #065f46 0%, #047857 50%, #059669 100%)',
      headerPadding: '45mm 20mm 35mm 20mm',
      fontSize: '10pt',
      titleSize: '38pt',
      borderStyle: '2.5pt solid #065f46',
      tableHeaderBg: '#f0fdf4',
      tableBorderColor: '#bbf7d0',
      spacing: 'spacious'
    }
  };

  const template = baseStyles[templateFormat] || baseStyles.professional;

  return {
    ...template,
    // Use primary color if provided
    headerGradient: primaryColor !== '#2563eb' 
      ? `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 50%, ${primaryColor}aa 100%)`
      : template.headerGradient
  };
};

export const generatePrintStyles = (templateFormat: PDFTemplateFormat, primaryColor: string, secondaryColor: string, fontSize: number) => {
  const styles = getTemplateStyles(templateFormat, primaryColor, secondaryColor);
  
  // Font size adjustments based on spacing
  const baseFontSize = {
    compact: fontSize - 1,
    normal: fontSize,
    relaxed: fontSize + 0.5,
    spacious: fontSize + 1
  }[styles.spacing] || fontSize;

  return `
    @page {
      size: A4;
      margin: 15mm 15mm 20mm 15mm;
    }
    
    @media print {
      /* Reset everything */
      * {
        box-sizing: border-box;
      }
      
      html, body {
        width: 210mm;
        margin: 0 !important;
        padding: 0 !important;
        background: white !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        font-size: ${styles.fontSize} !important;
      }
      
      /* Hide all non-print elements */
      .no-print,
      .print\\:hidden,
      button:not(.print-show),
      input,
      select,
      textarea,
      nav,
      header:not(.print-header),
      [class*="sidebar"],
      [class*="Sidebar"] {
        display: none !important;
      }
      
      /* Report container */
      #full-report-content {
        width: 100% !important;
        max-width: none !important;
        margin: 0 !important;
        padding: 0 !important;
        box-shadow: none !important;
        border-radius: 0 !important;
        background: white !important;
      }
      
      /* Cover Page */
      .cover-page {
        page-break-after: auto !important;
        break-after: auto !important;
        display: block !important;
        background: white !important;
        padding: 0 !important;
        height: auto !important;
        min-height: 0 !important;
      }

      .cover-hero {
        position: relative !important;
        background: ${styles.headerGradient} !important;
        padding: ${styles.headerPadding} !important;
        color: white !important;
        overflow: hidden !important;
        page-break-inside: avoid !important;
      }

      .cover-hero::before {
        content: '' !important;
        position: absolute !important;
        top: -35mm !important;
        right: -30mm !important;
        width: 110mm !important;
        height: 110mm !important;
        border-radius: 50% !important;
        background: rgba(255,255,255,0.08) !important;
      }

      .cover-hero::after {
        content: '' !important;
        position: absolute !important;
        bottom: -18mm !important;
        left: -20mm !important;
        width: 80mm !important;
        height: 80mm !important;
        border-radius: 18mm !important;
        transform: rotate(12deg) !important;
        background: rgba(255,255,255,0.12) !important;
      }

      .cover-hero-content {
        max-width: 180mm !important;
        margin: 0 auto !important;
        position: relative !important;
        z-index: 2 !important;
        text-align: left !important;
      }

      .cover-logo-row {
        margin-bottom: 10mm !important;
      }

      .cover-logo {
        max-height: 30mm !important;
        max-width: 110mm !important;
        object-fit: contain !important;
        display: block !important;
        background: rgba(255,255,255,0.12) !important;
        padding: 3mm 5mm !important;
        border-radius: 6mm !important;
      }

      .cover-logo-placeholder {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        width: 60mm !important;
        height: 20mm !important;
        border: 1pt dashed rgba(255,255,255,0.6) !important;
        border-radius: 6mm !important;
        font-size: 9pt !important;
        text-transform: uppercase !important;
        letter-spacing: 1pt !important;
      }

      .cover-title {
        font-size: ${styles.titleSize} !important;
        font-weight: ${templateFormat === 'elegant' ? '600' : '700'} !important;
        margin: 0 0 4mm 0 !important;
        letter-spacing: ${templateFormat === 'minimal' ? '0.3pt' : '0.6pt'} !important;
        text-shadow: 0 2px 6px rgba(0,0,0,0.18) !important;
      }

      .cover-subtitle {
        font-size: ${templateFormat === 'compact' ? '12pt' : '14pt'} !important;
        font-weight: 600 !important;
        text-transform: uppercase !important;
        letter-spacing: 2pt !important;
        opacity: 0.9 !important;
        margin-bottom: 6mm !important;
      }

      .cover-year {
        font-size: ${templateFormat === 'compact' ? '12pt' : '15pt'} !important;
        font-weight: 500 !important;
        opacity: 0.95 !important;
      }

      .cover-badges {
        display: flex !important;
        flex-wrap: wrap !important;
        gap: 4mm !important;
        margin-top: 10mm !important;
      }

      .cover-badge {
        font-size: 8.5pt !important;
        padding: 2mm 4mm !important;
        border-radius: 8mm !important;
        background: rgba(255,255,255,0.18) !important;
        border: 1pt solid rgba(255,255,255,0.35) !important;
      }

      .cover-hero-accent {
        position: absolute !important;
        right: 20mm !important;
        bottom: 16mm !important;
        display: flex !important;
        gap: 4mm !important;
        z-index: 1 !important;
      }

      .cover-card {
        width: 26mm !important;
        height: 34mm !important;
        border-radius: 4mm !important;
        background: rgba(255,255,255,0.18) !important;
        border: 1pt solid rgba(255,255,255,0.35) !important;
        backdrop-filter: blur(1mm) !important;
      }

      .cover-card-primary {
        transform: translateY(-4mm) !important;
      }

      .cover-card-secondary {
        transform: translateY(4mm) !important;
      }

      .cover-card-tertiary {
        transform: translateY(-2mm) !important;
      }

      .cover-details {
        background: ${templateFormat === 'minimal' ? '#ffffff' : '#f8fafc'} !important;
        padding: ${styles.spacing === 'compact' ? '14mm 18mm 18mm 18mm' : '18mm 20mm 22mm 20mm'} !important;
      }

      .cover-details-grid {
        display: grid !important;
        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
        gap: 6mm !important;
      }

      .cover-detail-card {
        border: 1pt solid #e2e8f0 !important;
        border-left: 3pt solid ${primaryColor} !important;
        border-radius: 4mm !important;
        background: white !important;
        padding: 5mm 6mm !important;
      }

      .cover-detail-label {
        font-size: 8pt !important;
        text-transform: uppercase !important;
        letter-spacing: 1pt !important;
        color: #64748b !important;
        margin-bottom: 2mm !important;
      }

      .cover-detail-value {
        font-size: 10pt !important;
        font-weight: 600 !important;
        color: #111827 !important;
      }

      .cover-footer-note {
        margin-top: 8mm !important;
        font-size: 8.5pt !important;
        color: ${secondaryColor} !important;
        text-align: center !important;
      }
      
      .cover-details-row:last-child {
        border-bottom: none !important;
        margin-bottom: 0 !important;
      }
      
      .cover-detail-label {
        font-size: ${styles.spacing === 'compact' ? '10pt' : '11pt'} !important;
        font-weight: 600 !important;
        color: #475569 !important;
        min-width: 45mm !important;
        text-transform: uppercase !important;
        letter-spacing: 0.3pt !important;
      }
      
      .cover-detail-value {
        font-size: ${styles.spacing === 'compact' ? '10pt' : '11pt'} !important;
        color: #1e293b !important;
        font-weight: 400 !important;
        flex: 1 !important;
      }
      
      .cover-details-grid {
        display: grid !important;
        grid-template-columns: 1fr 1fr !important;
        gap: ${styles.spacing === 'compact' ? '6mm' : '8mm'} !important;
        margin: ${styles.spacing === 'compact' ? '6mm 0 8mm 0' : '8mm 0 10mm 0'} !important;
      }
      
      .cover-detail-box {
        background: white !important;
        border: ${templateFormat === 'minimal' ? '1pt' : '1.5pt'} solid #cbd5e1 !important;
        border-radius: ${templateFormat === 'formal' ? '0pt' : '4pt'} !important;
        padding: ${styles.spacing === 'compact' ? '4mm 4mm' : '6mm 5mm'} !important;
        box-shadow: ${templateFormat === 'minimal' ? 'none' : '0 2pt 4pt rgba(0,0,0,0.05)'} !important;
      }
      
      .cover-detail-box-label {
        font-size: ${styles.spacing === 'compact' ? '8pt' : '9pt'} !important;
        font-weight: 600 !important;
        color: #64748b !important;
        text-transform: uppercase !important;
        letter-spacing: 0.5pt !important;
        margin-bottom: 3mm !important;
      }
      
      .cover-detail-box-value {
        font-size: ${styles.spacing === 'compact' ? '9pt' : '10pt'} !important;
        color: #1e293b !important;
        font-weight: 500 !important;
        word-break: break-all !important;
      }

      /* Professional Balance Sheet styling */
      .professional-balance-sheet {
        page-break-before: auto !important;
        margin-top: 0 !important;
        padding-top: 0 !important;
      }

      /* Section headers - Template-Specific styling */
      .section-header {
        display: block !important;
        background: white !important;
        border-bottom: ${styles.borderStyle} !important;
        padding: ${styles.spacing === 'compact' ? '12pt 0 6pt 0' : '16pt 0 8pt 0'} !important;
        margin-bottom: ${styles.spacing === 'compact' ? '15pt' : '20pt'} !important;
        page-break-after: avoid !important;
        page-break-inside: avoid !important;
      }

      .section-header .section-title {
        font-size: ${styles.spacing === 'compact' ? '14pt' : '16pt'} !important;
        font-weight: 700 !important;
        color: #1e293b !important;
        text-transform: uppercase !important;
        letter-spacing: 0.5pt !important;
      }

      /* Table styling */
      table {
        width: 100% !important;
        border-collapse: collapse !important;
        margin-bottom: ${styles.spacing === 'compact' ? '15pt' : '20pt'} !important;
        page-break-inside: auto !important;
      }

      table thead {
        background: ${styles.tableHeaderBg} !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }

      table thead th {
        font-size: ${styles.spacing === 'compact' ? '8pt' : '9pt'} !important;
        font-weight: 700 !important;
        padding: ${styles.spacing === 'compact' ? '6pt 4pt' : '8pt 6pt'} !important;
        text-align: left !important;
        border: 1pt solid ${styles.tableBorderColor} !important;
        color: #1e293b !important;
        text-transform: uppercase !important;
        letter-spacing: 0.3pt !important;
      }

      table tbody td {
        font-size: ${styles.fontSize} !important;
        padding: ${styles.spacing === 'compact' ? '4pt 4pt' : '6pt 6pt'} !important;
        border: 1pt solid ${styles.tableBorderColor} !important;
        color: #1e293b !important;
        vertical-align: top !important;
      }

      table tbody tr {
        page-break-inside: avoid !important;
      }

      /* Totals and subtotals */
      .row-total,
      .row-subtotal,
      tr.font-bold {
        background: ${templateFormat === 'minimal' ? '#fafafa' : '#f8fafc'} !important;
        font-weight: 700 !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }

      /* Text alignment */
      .text-right {
        text-align: right !important;
      }

      .text-center {
        text-align: center !important;
      }

      /* Page breaks */
      .page-break-before {
        page-break-before: always !important;
        break-before: page !important;
      }

      .report-first-section {
        page-break-before: always !important;
        break-before: page !important;
      }

      .page-break-after {
        page-break-after: always !important;
        break-after: page !important;
      }

      .avoid-break {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }

      /* Statement headers */
      .report-statement-header {
        text-align: center !important;
        margin-bottom: ${styles.spacing === 'compact' ? '15pt' : '20pt'} !important;
        padding-bottom: ${styles.spacing === 'compact' ? '10pt' : '12pt'} !important;
        border-bottom: ${styles.borderStyle} !important;
        page-break-after: avoid !important;
      }

      .report-company {
        font-weight: 700 !important;
        margin-bottom: 8pt !important;
        color: #1e293b !important;
      }

      .report-title {
        font-size: ${styles.spacing === 'compact' ? '12pt' : '14pt'} !important;
        font-weight: 700 !important;
        text-transform: uppercase !important;
        margin: 8pt 0 !important;
        color: #1e293b !important;
      }

      .report-subtitle {
        font-size: 10pt !important;
        color: #475569 !important;
        margin: 4pt 0 !important;
      }

      .report-unit-note {
        font-size: 8pt !important;
        color: #64748b !important;
        font-style: italic !important;
        margin-top: 6pt !important;
      }

      /* Footer signatures */
      .report-footer-signature {
        margin-top: ${styles.spacing === 'compact' ? '25pt' : '30pt'} !important;
        padding-top: ${styles.spacing === 'compact' ? '15pt' : '20pt'} !important;
        border-top: 1pt solid #cbd5e1 !important;
        page-break-inside: avoid !important;
      }

      .report-signatures-grid {
        display: grid !important;
        grid-template-columns: repeat(auto-fit, minmax(60mm, 1fr)) !important;
        gap: ${styles.spacing === 'compact' ? '15mm' : '20mm'} !important;
      }

      .report-signature {
        text-align: center !important;
      }

      .report-signature .line {
        border-top: 1pt solid #000 !important;
        margin-bottom: 6pt !important;
      }

      /* Hide interactive elements */
      [contenteditable="true"] {
        border: none !important;
        outline: none !important;
      }
    }
  `;
};
