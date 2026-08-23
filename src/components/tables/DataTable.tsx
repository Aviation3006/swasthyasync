import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, ArrowUpDown, Search } from 'lucide-react';
import { EmptyState } from '../common/EmptyState';

export interface Column<T> {
  header: string;
  accessor?: keyof T | ((row: T) => React.ReactNode);
  cell?: (row: T) => React.ReactNode;
  sortable?: boolean;
  sortKey?: keyof T;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (row: T) => string;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchFilter?: (row: T, query: string) => boolean;
  pageSize?: number;
  emptyTitle?: string;
  emptyDescription?: string;
  onRowClick?: (row: T) => void;
  actions?: React.ReactNode;
}

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  searchable = true,
  searchPlaceholder = 'Search records...',
  searchFilter,
  pageSize = 8,
  emptyTitle = 'No records found',
  emptyDescription = 'There are no items matching your criteria.',
  onRowClick,
  actions
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ key: keyof T | null; direction: 'asc' | 'desc' }>({
    key: null,
    direction: 'asc'
  });

  // Filtered data
  const filteredData = useMemo(() => {
    let result = data;
    if (searchQuery.trim()) {
      if (searchFilter) {
        result = result.filter((item) => searchFilter(item, searchQuery));
      } else {
        const query = searchQuery.toLowerCase();
        result = result.filter((item) => {
          return Object.values(item as Record<string, unknown>).some((val) => {
            if (val === null || val === undefined) return false;
            return String(val).toLowerCase().includes(query);
          });
        });
      }
    }

    if (sortConfig.key) {
      result = [...result].sort((a, b) => {
        const aVal = a[sortConfig.key!];
        const bVal = b[sortConfig.key!];
        if (aVal === bVal) return 0;
        if (aVal === null || aVal === undefined) return 1;
        if (bVal === null || bVal === undefined) return -1;
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        return sortConfig.direction === 'asc' ? 1 : -1;
      });
    }

    return result;
  }, [data, searchQuery, searchFilter, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const handleSort = (col: Column<T>) => {
    const key = col.sortKey || (typeof col.accessor === 'string' ? (col.accessor as keyof T) : null);
    if (!key) return;

    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  return (
    <div className="w-full space-y-3">
      {/* Top Bar */}
      {(searchable || actions) && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {searchable && (
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder={searchPlaceholder}
                className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3.5 py-1.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-health-500 focus:border-health-500"
              />
            </div>
          )}
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}

      {/* Table Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50/80 font-semibold text-slate-700">
              <tr>
                {columns.map((col, idx) => (
                  <th
                    key={idx}
                    scope="col"
                    className={`px-4 sm:px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-600 ${
                      col.className || ''
                    } ${col.sortable ? 'cursor-pointer select-none hover:text-slate-900' : ''}`}
                    onClick={() => col.sortable && handleSort(col)}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{col.header}</span>
                      {col.sortable && (
                        <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {paginatedData.length > 0 ? (
                paginatedData.map((row) => (
                  <tr
                    key={keyExtractor(row)}
                    onClick={() => onRowClick && onRowClick(row)}
                    className={`transition-colors ${
                      onRowClick
                        ? 'cursor-pointer hover:bg-health-50/40'
                        : 'hover:bg-slate-50/70'
                    }`}
                  >
                    {columns.map((col, idx) => (
                      <td key={idx} className={`px-4 sm:px-6 py-3.5 text-slate-700 text-sm ${col.className || ''}`}>
                        {col.cell
                          ? col.cell(row)
                          : typeof col.accessor === 'function'
                          ? col.accessor(row)
                          : col.accessor
                          ? (row[col.accessor] as React.ReactNode)
                          : null}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-10">
                    <EmptyState title={emptyTitle} description={emptyDescription} />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {filteredData.length > pageSize && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-6 py-3 border-t border-slate-100 bg-slate-50/50 text-xs text-slate-500">
            <div>
              Showing <span className="font-semibold text-slate-700">{(currentPage - 1) * pageSize + 1}</span> to{' '}
              <span className="font-semibold text-slate-700">
                {Math.min(currentPage * pageSize, filteredData.length)}
              </span>{' '}
              of <span className="font-semibold text-slate-700">{filteredData.length}</span> entries
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2 font-medium text-slate-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
