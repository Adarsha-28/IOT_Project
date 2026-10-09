import React, { useState } from 'react';
import {
  AlertTriangle,
  Flame,
  CheckCircle2,
  Clock,
  Filter,
  Search,
  Download,
} from 'lucide-react';

export default function WarningTable({ warnings = [] }) {
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Status badge styling helper
  const getStatusBadge = (status) => {
    switch (status) {
      case 'HIGH TEMPERATURE':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <Flame className="w-3.5 h-3.5 text-rose-600" />
            HIGH TEMPERATURE
          </span>
        );
      case 'WARNING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            WARNING
          </span>
        );
      case 'NORMAL':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            NORMAL
          </span>
        );
    }
  };

  // Filtered warnings
  const filteredWarnings = warnings.filter((item) => {
    const matchesStatus =
      filterStatus === 'ALL' || item.status === filterStatus;
    const matchesSearch =
      (item.message && item.message.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.status && item.status.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.temperature && String(item.temperature).includes(searchTerm));
    return matchesStatus && matchesSearch;
  });

  // Calculate summary counts
  const highTempCount = warnings.filter((w) => w.status === 'HIGH TEMPERATURE').length;
  const warningCount = warnings.filter((w) => w.status === 'WARNING').length;
  const normalCount = warnings.filter((w) => w.status === 'NORMAL').length;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header and stats */}
      <div className="p-5 border-b border-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">
                Warning History
              </h3>
              <p className="text-xs text-slate-500">
                Chronological log of threshold exceedance events and recovery records
              </p>
            </div>
          </div>

          {/* Quick Counter Summary */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              High: {highTempCount}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Warning: {warningCount}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Normal: {normalCount}
            </span>
          </div>
        </div>

        {/* Filter bar and search */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
            {['ALL', 'HIGH TEMPERATURE', 'WARNING', 'NORMAL'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
                  filterStatus === st
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st === 'ALL' ? 'All Events' : st}
              </button>
            ))}
          </div>

          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search warning logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 bg-slate-50 focus:bg-white"
            />
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-200">
            <tr>
              <th className="py-3 px-5">Time</th>
              <th className="py-3 px-5">Temperature</th>
              <th className="py-3 px-5">Humidity</th>
              <th className="py-3 px-5">Status</th>
              <th className="py-3 px-5">Message</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {filteredWarnings.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-8 text-center text-slate-400">
                  No matching warning events found.
                </td>
              </tr>
            ) : (
              filteredWarnings.map((item, index) => {
                const dateObj = new Date(item.timestamp);
                const timeString = dateObj.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: true,
                });
                const dateString = dateObj.toLocaleDateString([], {
                  month: 'short',
                  day: 'numeric',
                });

                return (
                  <tr
                    key={item._id || index}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="py-3.5 px-5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 font-mono text-slate-800 font-medium">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {timeString}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {dateString}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 font-mono font-bold text-slate-900 text-sm">
                      {Number(item.temperature).toFixed(1)}°C
                    </td>
                    <td className="py-3.5 px-5 font-mono text-slate-700">
                      {Number(item.humidity).toFixed(1)}%
                    </td>
                    <td className="py-3.5 px-5 whitespace-nowrap">
                      {getStatusBadge(item.status)}
                    </td>
                    <td className="py-3.5 px-5 font-medium text-slate-700">
                      {item.message}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <span>Showing {filteredWarnings.length} recorded events</span>
        <span className="font-mono">Collection: ServerRoomMonitoring.warnings</span>
      </div>
    </div>
  );
}
