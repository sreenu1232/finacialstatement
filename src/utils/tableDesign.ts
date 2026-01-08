const TABLE_CLASS_MAP = {
  classic: 'border-collapse border',
  modern: 'border-separate border-spacing-0 shadow-lg rounded-xl overflow-hidden',
  minimal: 'border-collapse border border-gray-200 shadow',
  striped: 'border-collapse border shadow',
  elegant: 'border-separate border-spacing-y-0.5 shadow-md rounded-xl overflow-hidden backdrop-blur-sm',
  material: 'border-separate border-spacing-0 shadow-xl rounded-2xl overflow-hidden',
  glass: 'border-separate border-spacing-0 shadow-lg rounded-2xl overflow-hidden bg-white/70 backdrop-blur',
  contrast: 'border-collapse border shadow-lg rounded-lg overflow-hidden'
} as const;

const TABLE_HEAD_CLASS_MAP = {
  classic: 'bg-gray-100',
  modern: 'bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100',
  minimal: 'bg-white',
  striped: 'bg-gray-100',
  elegant: 'bg-gradient-to-r from-slate-900/90 via-slate-800/80 to-slate-900/90 text-white',
  material: 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white',
  glass: 'bg-white/60 backdrop-blur-md text-slate-700',
  contrast: 'bg-slate-900 text-white'
} as const;

const TABLE_ACCENT_CLASS_MAP = {
  blue: 'table-accent-blue',
  emerald: 'table-accent-emerald',
  violet: 'table-accent-violet',
  amber: 'table-accent-amber',
  slate: 'table-accent-slate',
  rose: 'table-accent-rose'
} as const;

const TABLE_ACCENT_ROW_CLASS_MAP = {
  blue: {
    soft: 'bg-blue-50',
    strong: 'bg-blue-100'
  },
  emerald: {
    soft: 'bg-emerald-50',
    strong: 'bg-emerald-100'
  },
  violet: {
    soft: 'bg-violet-50',
    strong: 'bg-violet-100'
  },
  amber: {
    soft: 'bg-amber-50',
    strong: 'bg-amber-100'
  },
  slate: {
    soft: 'bg-slate-50',
    strong: 'bg-slate-100'
  },
  rose: {
    soft: 'bg-rose-50',
    strong: 'bg-rose-100'
  }
} as const;

const TABLE_DENSITY_CLASS_MAP = {
  comfortable: 'table-density-comfortable',
  compact: 'table-density-compact',
  spacious: 'table-density-spacious'
} as const;

type TableDesignKey = keyof typeof TABLE_CLASS_MAP;
type TableAccentKey = keyof typeof TABLE_ACCENT_CLASS_MAP;
type TableDensityKey = keyof typeof TABLE_DENSITY_CLASS_MAP;

export const getTableDesignClasses = (
  tableDesign?: TableDesignKey,
  tableAccent?: TableAccentKey,
  tableDensity?: TableDensityKey
) => {
  const designKey: TableDesignKey = tableDesign ?? 'classic';
  const accentKey: TableAccentKey = tableAccent ?? 'blue';
  const densityKey: TableDensityKey = tableDensity ?? 'comfortable';
  return {
    tableClassName: `w-full text-sm ${TABLE_CLASS_MAP[designKey]} table-design-${designKey} ${TABLE_ACCENT_CLASS_MAP[accentKey]} ${TABLE_DENSITY_CLASS_MAP[densityKey]}`,
    theadClassName: TABLE_HEAD_CLASS_MAP[designKey],
    accentSoftRowClass: TABLE_ACCENT_ROW_CLASS_MAP[accentKey].soft,
    accentStrongRowClass: TABLE_ACCENT_ROW_CLASS_MAP[accentKey].strong
  };
};

