import React, { useState, useMemo } from 'react';
import { Search, X, MapPin, ArrowRight, Tag, MessageSquare, CheckCircle2 } from 'lucide-react';
import { SOAPBOX_POLICIES, TAIPEI_DISTRICTS } from '../data/policies';
import { SoapboxPolicy, TaipeiDistrict } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPolicy: (districtId: TaipeiDistrict, policyId: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectPolicy
}) => {
  const [query, setQuery] = useState('');

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.trim().toLowerCase();
    return SOAPBOX_POLICIES.filter((p) => {
      return (
        p.title.toLowerCase().includes(q) ||
        p.area.toLowerCase().includes(q) ||
        p.station.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q) ||
        p.citizenQuestion.toLowerCase().includes(q) ||
        p.pumaQuote.toLowerCase().includes(q) ||
        p.themeName.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        p.solutions.some(
          (s) => s.point.toLowerCase().includes(q) || s.detail.toLowerCase().includes(q)
        )
      );
    });
  }, [query]);

  const quickHotTags = [
    '社會住宅',
    '智慧交通',
    '連續人行道',
    '公托幼兒',
    '心理諮商',
    '老屋危老',
    '首都防衛',
    '動物友善'
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      {/* Click outside to close */}
      <div className="fixed inset-0 -z-10" onClick={onClose} />

      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-orange-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-neutral-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-orange-600 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜尋全台北 12 區政見、關鍵字（例如：社宅、人行道、塞車、長照）..."
            className="flex-1 text-sm sm:text-base text-neutral-900 bg-transparent border-none outline-hidden placeholder:text-neutral-400 font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs bg-neutral-100 hover:bg-neutral-200 text-neutral-500 rounded-full p-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Hot Suggestions when query is empty */}
        {!query.trim() && (
          <div className="p-6 space-y-4">
            <div>
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block mb-2">
                熱門市政關鍵字：
              </span>
              <div className="flex flex-wrap gap-2">
                {quickHotTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-xs font-bold text-orange-800 transition-colors cursor-pointer"
                  >
                    <Tag className="w-3 h-3 text-orange-600" />
                    <span>#{tag}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-neutral-100">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block mb-2">
                依行政區快速瀏覽：
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {TAIPEI_DISTRICTS.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => {
                      onSelectPolicy(d.id, '');
                      onClose();
                    }}
                    className="p-2 text-left rounded-xl bg-neutral-50 hover:bg-neutral-100 text-xs font-semibold text-neutral-700 flex items-center justify-between cursor-pointer"
                  >
                    <span>{d.name}</span>
                    <MapPin className="w-3 h-3 text-orange-500" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Results List */}
        {query.trim() && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-neutral-100">
            {searchResults.length === 0 ? (
              <div className="py-12 text-center text-neutral-500 space-y-2">
                <p className="text-sm">查無符合「{query}」的政見結果</p>
                <p className="text-xs text-neutral-400">試試看不同的關鍵字，或從地圖探索 12 行政區</p>
              </div>
            ) : (
              searchResults.map((policy) => (
                <div
                  key={policy.id}
                  onClick={() => {
                    onSelectPolicy(policy.districtId, policy.id);
                    onClose();
                  }}
                  className="py-3.5 first:pt-0 last:pb-0 hover:bg-orange-50/50 -mx-2 px-3 rounded-2xl transition-colors cursor-pointer space-y-1.5"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold bg-orange-100 text-orange-800 px-2 py-0.5 rounded-md">
                      {policy.area}
                    </span>
                    <span className="text-xs text-neutral-400">
                      {policy.station}
                    </span>
                    <span className="text-xs text-neutral-400 ml-auto">
                      #{policy.themeName}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-neutral-900 line-clamp-1">
                    {policy.title}
                  </h4>
                  <p className="text-xs text-neutral-600 line-clamp-2">
                    {policy.summary}
                  </p>
                  <div className="flex items-center justify-between pt-1 text-[11px]">
                    <span className="text-orange-700 font-medium flex items-center gap-1">
                      <MessageSquare className="w-3 h-3 text-orange-600" />
                      市民：{policy.citizenRole}
                    </span>
                    <span className="inline-flex items-center gap-1 text-orange-600 font-bold">
                      <span>跳轉查看</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Modal Footer */}
        <div className="p-3 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500 px-5">
          <span>共收錄全台北 12 行政區街頭肥皂箱政見</span>
          <span className="font-mono text-[11px]">ESC 鍵或點擊背景關閉</span>
        </div>
      </div>
    </div>
  );
};
