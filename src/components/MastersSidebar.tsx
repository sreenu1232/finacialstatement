import React, { useState } from 'react';
import { 
  Settings, 
  Palette, 
  FileText, 
  PenTool, 
  Hash, 
  Ruler,
  ChevronDown,
  ChevronRight,
  Upload,
  Plus,
  Trash2
} from 'lucide-react';
import { Company, TemplateSettings, FormattingSettings, SignatureBlock, PaperSize, FontStyle, UnitOfMeasurement, TableDesign, TableAccent, TableDensity } from '../types';

interface MastersSidebarProps {
  company: Company;
  onSettingsUpdate: (settings: { template: TemplateSettings; formatting: FormattingSettings }) => void;
}

const MastersSidebar: React.FC<MastersSidebarProps> = ({ company, onSettingsUpdate }) => {
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    templates: true,
    notes: false,
    signatures: false,
    dsc: false,
    decimals: false,
    units: false,
    numberStyle: false,
    tableDesign: false
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const updateTemplateSettings = (updates: Partial<TemplateSettings>) => {
    onSettingsUpdate({
      template: { ...company.settings.template, ...updates },
      formatting: company.settings.formatting
    });
  };

  const updateFormattingSettings = (updates: Partial<FormattingSettings>) => {
    onSettingsUpdate({
      template: company.settings.template,
      formatting: { ...company.settings.formatting, ...updates }
    });
  };

  const addSignatureBlock = () => {
    const newSignature: SignatureBlock = {
      id: Date.now().toString(),
      title: 'Director',
      name: '',
      designation: 'Director',
      showDSC: false
    };
    
    updateFormattingSettings({
      signatureBlocks: [...company.settings.formatting.signatureBlocks, newSignature]
    });
  };

  const updateSignatureBlock = (id: string, updates: Partial<SignatureBlock>) => {
    const updatedSignatures = company.settings.formatting.signatureBlocks.map(sig =>
      sig.id === id ? { ...sig, ...updates } : sig
    );
    updateFormattingSettings({ signatureBlocks: updatedSignatures });
  };

  const removeSignatureBlock = (id: string) => {
    const updatedSignatures = company.settings.formatting.signatureBlocks.filter(sig => sig.id !== id);
    updateFormattingSettings({ signatureBlocks: updatedSignatures });
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        updateTemplateSettings({ logo: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 h-full overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Settings size={20} />
          Masters
        </h2>
      </div>

      <div className="p-4 space-y-4">
        {/* 1. Choose from different templates */}
        <div className="space-y-2">
          <button
            onClick={() => toggleSection('templates')}
            className="w-full flex items-center justify-between p-3 text-left bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Palette size={16} />
              <span className="font-medium">Template Settings</span>
            </div>
            {expandedSections.templates ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>

          {expandedSections.templates && (
            <div className="ml-4 space-y-3 p-3 bg-gray-50 rounded-lg">
              {/* Logo Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Logo</label>
                <div className="space-y-3">
                  {company.settings.template.logo && (
                    <div className="flex flex-col items-center space-y-2">
                      <img
                        src={company.settings.template.logo}
                        alt="Company Logo"
                        className="w-20 h-20 object-contain border-2 border-gray-200 rounded-lg bg-gray-50"
                      />
                    </div>
                  )}
                  <div className="flex gap-2">
                    <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors">
                      <Upload size={16} />
                      {company.settings.template.logo ? 'Change Logo' : 'Upload Logo'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </label>
                    {company.settings.template.logo && (
                      <button
                        onClick={() => updateTemplateSettings({ logo: undefined })}
                        className="flex items-center justify-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        <Trash2 size={16} />
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Primary Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                <input
                  type="color"
                  value={company.settings.template.primaryColor}
                  onChange={(e) => updateTemplateSettings({ primaryColor: e.target.value })}
                  className="w-full h-10 border border-gray-300 rounded-lg"
                />
              </div>

              {/* Secondary Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
                <input
                  type="color"
                  value={company.settings.template.secondaryColor}
                  onChange={(e) => updateTemplateSettings({ secondaryColor: e.target.value })}
                  className="w-full h-10 border border-gray-300 rounded-lg"
                />
              </div>

              {/* Font Style */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Font Style</label>
                <select
                  value={company.settings.template.fontStyle}
                  onChange={(e) => updateTemplateSettings({ fontStyle: e.target.value as FontStyle })}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value="arial">Arial</option>
                  <option value="times-new-roman">Times New Roman</option>
                  <option value="calibri">Calibri</option>
                  <option value="helvetica">Helvetica</option>
                  <option value="georgia">Georgia</option>
                </select>
              </div>

              {/* Font Size */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Font Size (px)</label>
                <input
                  type="number"
                  min="8"
                  max="24"
                  value={company.settings.template.fontSize}
                  onChange={(e) => updateTemplateSettings({ fontSize: parseInt(e.target.value) })}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>

              {/* Paper Size */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Paper Size</label>
                <select
                  value={company.settings.template.paperSize}
                  onChange={(e) => updateTemplateSettings({ paperSize: e.target.value as PaperSize })}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value="A4">A4</option>
                  <option value="single-continuous">Single Continuous</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* 2. Customize each note format/table */}
        <div className="space-y-2">
          <button
            onClick={() => toggleSection('notes')}
            className="w-full flex items-center justify-between p-3 text-left bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <FileText size={16} />
              <span className="font-medium">Note Format Customization</span>
            </div>
            {expandedSections.notes ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>

          {expandedSections.notes && (
            <div className="ml-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-3">Customize table formats for:</p>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">Balance Sheet Tables</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">P&L Statement Tables</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">Cash Flow Statement Tables</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">Notes to Accounts Tables</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* 3. Signature Blocks */}
        <div className="space-y-2">
          <button
            onClick={() => toggleSection('signatures')}
            className="w-full flex items-center justify-between p-3 text-left bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <PenTool size={16} />
              <span className="font-medium">Signature Blocks</span>
            </div>
            {expandedSections.signatures ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>

          {expandedSections.signatures && (
            <div className="ml-4 space-y-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Enable Signature Blocks</span>
                <input
                  type="checkbox"
                  checked={company.settings.formatting.showSignatureBlocks}
                  onChange={(e) => updateFormattingSettings({ showSignatureBlocks: e.target.checked })}
                  className="rounded"
                />
              </div>

              {company.settings.formatting.showSignatureBlocks && (
                <div className="space-y-3">
                  {company.settings.formatting.signatureBlocks.map((signature) => (
                    <div key={signature.id} className="p-3 border border-gray-300 rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Signature Block</span>
                        <button
                          onClick={() => removeSignatureBlock(signature.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      
                      <input
                        type="text"
                        placeholder="Title (e.g., Director, MD, CFO)"
                        value={signature.title}
                        onChange={(e) => updateSignatureBlock(signature.id, { title: e.target.value })}
                        className="w-full p-2 text-sm border border-gray-300 rounded"
                      />
                      
                      <input
                        type="text"
                        placeholder="Name"
                        value={signature.name}
                        onChange={(e) => updateSignatureBlock(signature.id, { name: e.target.value })}
                        className="w-full p-2 text-sm border border-gray-300 rounded"
                      />
                      
                      <input
                        type="text"
                        placeholder="Designation"
                        value={signature.designation}
                        onChange={(e) => updateSignatureBlock(signature.id, { designation: e.target.value })}
                        className="w-full p-2 text-sm border border-gray-300 rounded"
                      />
                      
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={signature.showDSC}
                          onChange={(e) => updateSignatureBlock(signature.id, { showDSC: e.target.checked })}
                          className="rounded"
                        />
                        <span className="text-sm">Show DSC Sign</span>
                      </label>
                    </div>
                  ))}
                  
                  <button
                    onClick={addSignatureBlock}
                    className="w-full flex items-center justify-center gap-2 p-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-800"
                  >
                    <Plus size={16} />
                    Add Signature Block
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 4. DSC Sign */}
        <div className="space-y-2">
          <button
            onClick={() => toggleSection('dsc')}
            className="w-full flex items-center justify-between p-3 text-left bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <PenTool size={16} />
              <span className="font-medium">DSC Sign</span>
            </div>
            {expandedSections.dsc ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>

          {expandedSections.dsc && (
            <div className="ml-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium">Enable DSC Sign</span>
                <input
                  type="checkbox"
                  checked={company.settings.formatting.showDSCSign}
                  onChange={(e) => updateFormattingSettings({ showDSCSign: e.target.checked })}
                  className="rounded"
                />
              </div>
              
              {company.settings.formatting.showDSCSign && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">DSC Certificate</label>
                  <input
                    type="file"
                    accept=".p12,.pfx"
                    className="w-full p-2 text-sm border border-gray-300 rounded"
                  />
                  <p className="text-xs text-gray-500">Upload DSC certificate file (.p12 or .pfx)</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 5. Decimal Points */}
        <div className="space-y-2">
          <button
            onClick={() => toggleSection('decimals')}
            className="w-full flex items-center justify-between p-3 text-left bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Hash size={16} />
              <span className="font-medium">Decimal Points</span>
            </div>
            {expandedSections.decimals ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>

          {expandedSections.decimals && (
            <div className="ml-4 p-3 bg-gray-50 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">Number of Decimal Places</label>
              <select
                value={company.settings.formatting.decimalPoints}
                onChange={(e) => updateFormattingSettings({ decimalPoints: parseInt(e.target.value) })}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value={0}>0 (e.g., 5)</option>
                <option value={1}>1 (e.g., 5.0)</option>
                <option value={2}>2 (e.g., 5.00)</option>
                <option value={3}>3 (e.g., 5.000)</option>
              </select>
            </div>
          )}
        </div>

        {/* 6. Unit of Measurement */}
        <div className="space-y-2">
          <button
            onClick={() => toggleSection('units')}
            className="w-full flex items-center justify-between p-3 text-left bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Ruler size={16} />
              <span className="font-medium">Unit of Measurement</span>
            </div>
            {expandedSections.units ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>

          {expandedSections.units && (
            <div className="ml-4 p-3 bg-gray-50 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">Display Units</label>
              <select
                value={company.settings.formatting.unitOfMeasurement}
                onChange={(e) => updateFormattingSettings({ unitOfMeasurement: e.target.value as UnitOfMeasurement })}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="full-number">Full Number</option>
                <option value="thousands">Thousands</option>
                <option value="ten-thousands">Ten Thousands</option>
                <option value="lakhs">Lakhs</option>
                <option value="crores">Crores</option>
                <option value="ten-crores">Ten Crores</option>
                <option value="hundred-crores">100 Crores</option>
              </select>
            </div>
          )}
        </div>

        {/* 7. Number Style */}
        <div className="space-y-2">
          <button
            onClick={() => toggleSection('numberStyle')}
            className="w-full flex items-center justify-between p-3 text-left bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Hash size={16} />
              <span className="font-medium">Number Style</span>
            </div>
            {expandedSections.numberStyle ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>

          {expandedSections.numberStyle && (
            <div className="ml-4 p-3 bg-gray-50 rounded-lg space-y-3">
              <label className="block text-sm font-medium text-gray-700">Choose number style</label>
              <select
                value={company.settings.formatting.numberStyle}
                onChange={(e) => updateFormattingSettings({ numberStyle: e.target.value as any })}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="indian">Indian (12,34,56,789)</option>
                <option value="international">International (123,456,789)</option>
                <option value="none">None (no separators)</option>
                <option value="custom">Custom grouping</option>
              </select>

              {company.settings.formatting.numberStyle === 'custom' && (
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Custom grouping pattern</label>
                  <input
                    type="text"
                    value={company.settings.formatting.customNumberGrouping || ''}
                    onChange={(e) => updateFormattingSettings({ customNumberGrouping: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    placeholder="e.g., 3,2 (first group 3, then 2 repeating)"
                  />
                  <p className="text-xs text-gray-500 mt-1">Examples: "3" → 123,456,789 | "3,2" → 12,34,56,789</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 8. Table Design */}
        <div className="space-y-2">
          <button
            onClick={() => toggleSection('tableDesign')}
            className="w-full flex items-center justify-between p-3 text-left bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <PenTool size={16} />
              <span className="font-medium">Table Design</span>
            </div>
            {expandedSections.tableDesign ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>

          {expandedSections.tableDesign && (
            <div className="ml-4 p-3 bg-gray-50 rounded-lg space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Choose a table style</label>
                <div className="space-y-2">
                  {([
                    { value: 'classic', label: 'Classic grid', description: 'Structured layout with clear borders.' },
                    { value: 'modern', label: 'Modern cards', description: 'Floating cards with soft shadows.' },
                    { value: 'minimal', label: 'Minimal lines', description: 'Clean layout with subtle separators.' },
                    { value: 'striped', label: 'Striped rows', description: 'Alternating row shades for legibility.' },
                    { value: 'elegant', label: 'Elegant gradient', description: 'Premium gradient header with depth.' },
                    { value: 'material', label: 'Material', description: 'Bold header with material-inspired layers.' },
                    { value: 'glass', label: 'Glassmorphism', description: 'Frosted glass effect with blur and glow.' },
                    { value: 'contrast', label: 'High contrast', description: 'Dark header with vibrant totals.' }
                  ] as { value: TableDesign; label: string; description: string }[]).map((design) => (
                    <label
                      key={design.value}
                      className={`flex items-start gap-3 rounded-lg border p-3 transition-colors cursor-pointer ${
                        company.settings.formatting.tableDesign === design.value
                          ? 'border-blue-500 bg-white shadow-sm'
                          : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="tableDesign"
                        value={design.value}
                        checked={company.settings.formatting.tableDesign === design.value}
                        onChange={(e) => updateFormattingSettings({ tableDesign: e.target.value as TableDesign })}
                        className="mt-1 rounded-full"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-800">{design.label}</p>
                        <p className="text-xs text-gray-500">{design.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Accent palette</label>
                <div className="flex flex-wrap gap-2">
                  {([
                    { value: 'blue', label: 'Pacific', gradient: 'from-sky-500 via-blue-500 to-indigo-500' },
                    { value: 'emerald', label: 'Emerald', gradient: 'from-emerald-500 via-teal-500 to-green-500' },
                    { value: 'violet', label: 'Aurora', gradient: 'from-violet-500 via-purple-500 to-fuchsia-500' },
                    { value: 'amber', label: 'Sunset', gradient: 'from-amber-500 via-orange-500 to-rose-500' },
                    { value: 'slate', label: 'Slate', gradient: 'from-slate-600 via-slate-700 to-slate-800' },
                    { value: 'rose', label: 'Rosé', gradient: 'from-rose-500 via-pink-500 to-amber-400' }
                  ] as { value: TableAccent; label: string; gradient: string }[]).map((accent) => {
                    const isActive = company.settings.formatting.tableAccent === accent.value;
                    return (
                      <button
                        key={accent.value}
                        type="button"
                        onClick={() => updateFormattingSettings({ tableAccent: accent.value })}
                        className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                          isActive
                            ? 'border-blue-500 bg-white shadow-sm'
                            : 'border-transparent bg-white/70 hover:border-gray-300'
                        }`}
                      >
                        <span
                          className={`h-6 w-6 rounded-full bg-gradient-to-r ${accent.gradient} shadow-inner`}
                        ></span>
                        <span>{accent.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Density</label>
                <div className="inline-flex rounded-full border border-gray-200 bg-white p-1 text-xs shadow-inner">
                  {([
                    { value: 'compact', label: 'Compact' },
                    { value: 'comfortable', label: 'Comfort' },
                    { value: 'spacious', label: 'Spacious' }
                  ] as { value: TableDensity; label: string }[]).map((density) => {
                    const isActive = company.settings.formatting.tableDensity === density.value;
                    return (
                      <button
                        key={density.value}
                        type="button"
                        onClick={() => updateFormattingSettings({ tableDensity: density.value })}
                        className={`px-3 py-1 rounded-full transition-colors ${
                          isActive ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {density.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MastersSidebar;
