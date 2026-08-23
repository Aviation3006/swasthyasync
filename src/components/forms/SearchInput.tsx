import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  onClear?: () => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Search by name, ID, or keywords...',
  className = '',
  onClear
}) => {
  return (
    <div className={`relative flex items-center w-full ${className}`}>
      <div className="absolute left-3 text-slate-400 pointer-events-none">
        <Search className="w-4 h-4" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-9 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-health-600 focus:outline-none focus:ring-2 focus:ring-health-100 shadow-subtle transition-all"
      />
      {value && (
        <button
          type="button"
          onClick={() => {
            onChange('');
            if (onClear) onClear();
          }}
          className="absolute right-2.5 p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          aria-label="Clear search"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
