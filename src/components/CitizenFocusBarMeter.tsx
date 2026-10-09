import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  Flame, 
  Heart, 
  Check, 
  MapPin, 
  ArrowRight, 
  ExternalLink, 
  Sparkles, 
  SlidersHorizontal,
  Compass,
  MessageSquare,
  Users
} from 'lucide-react';
import { SOAPBOX_POLICIES, TAIPEI_DISTRICTS } from '../data/policies';
import { TaipeiDistrict, PolicyTheme } from '../types';
import { useCitizenFocus } from '../hooks/useCitizenFocus';

interface CitizenFocusBarMeterProps {
  onSelectDistrictOnMap: (districtId: TaipeiDistrict) => void;
  focusState?: ReturnType<typeof useCitizenFocus>;
}

export const CitizenFocusBarMeter: React.FC<CitizenFocusBarMeterProps> = ({
  onSelectDistrictOnMap,
  focusState
}) => {
  const localFocus = useCitizenFocus();
  const focus = focusState || localFocus;

  const [activeFilter, setActiveFilter] = useState<'all' | PolicyTheme>('all');
  const [justVotedId, setJustVotedId] = useState<string | null>(null);

  // Filter and sort policies by real-time vote count
  const sortedPolicies = useMemo(() => {
    let list = [...SOAPBOX_POLICIES];
    if (activeFilter !== 'all') {
      list = list.filter((p) => p.theme === activeFilter);
    }
    return list.sort((a, b) => focus.getVoteCount(b.id) - focus.getVoteCount(a.id));
  }, [activeFilter, focus]);

  const handleVote = (policyId: string) => {
    focus.toggleFocus(policyId);
    setJustVotedId(policyId);
    setTimeout(() => setJustVotedId(null), 1500);
  };

  const THEME_FILTERS: { id: 'all' | PolicyTheme; label: string; icon: string }[] = [
    { id: 'all', label: '全部關注排行', icon: '🔥' },
    { id: 'housing', label: '居住與都更', icon: '🏠' },
    { id: 'transit', label: '交通與人行', icon: '🚇' },
    { id: 'youth', label: '青年與心理', icon: '🌱' },
    { id: 'healthcare', label: '長照與全齡', icon: '❤️' },
    { id: 'digital', label: '數位與透明', icon: '📊' }
  ];

  return (
    <section className="bg-white rounded-3xl p-6 sm:p-8 border border-orange-200/90 shadow-md space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-100 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold mb-2">
            <BarChart3 className="w-3.5 h-3.5 text-orange-600" />
            <span>市民線上參與 · 關注動向條狀圖</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
            市民熱門關注排行 · 線上即時互動
          </h3>
          <p className="text-xs sm:text-sm text-neutral-600 mt-1">
            以一目瞭然的極簡條狀圖案呈現台北市民關注度，點選「+1 關注」立即參與，感受平滑流暢的民意動向！
          </p>
        </div>

        {/* Global Participation Status Pill */}
        <div className="flex items-center gap-3 shrink-0 self-start md:self-auto">
          <div className="p-3 bg-linear-to-br from-orange-50 to-amber-50 rounded-2xl border border-orange-200 text-right">
            <span className="text-[10px] text-neutral-500 block font-medium">全站累積關注互動</span>
            <div className="flex items-center gap-1 text-sm sm:text-base font-black text-orange-600 font-mono">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-pulse" />
              <span>{focus.totalInteractions.toLocaleString()}</span>
              <span className="text-xs text-neutral-600 font-normal">次</span>
            </div>
          </div>

          <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200 text-right">
            <span className="text-[10px] text-neutral-500 block font-medium">你已關注議題</span>
            <div className="flex items-center gap-1 text-sm sm:text-base font-black text-neutral-900 font-mono">
              <Heart className={`w-4 h-4 ${focus.totalUserFocused > 0 ? 'text-red-500 fill-red-500' : 'text-neutral-400'}`} />
              <span>{focus.totalUserFocused}</span>
              <span className="text-xs text-neutral-500 font-normal">項</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
        {THEME_FILTERS.map((tf) => {
          const isActive = activeFilter === tf.id;
          return (
            <button
              key={tf.id}
              onClick={() => setActiveFilter(tf.id)}
              className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                isActive
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
              }`}
            >
              <span>{tf.icon}</span>
              <span>{tf.label}</span>
            </button>
          );
        })}
      </div>

      {/* Minimalist Bar Items List (一目瞭然的極簡條狀圖案) */}
      <div className="space-y-3.5">
        {sortedPolicies.map((policy, index) => {
          const count = focus.getVoteCount(policy.id);
          const percent = focus.getPercentage(policy.id);
          const hasVoted = focus.isFocused(policy.id);
          const isJustVoted = justVotedId === policy.id;

          return (
            <div
              key={policy.id}
              className={`p-4 rounded-2xl border transition-all duration-300 ${
                hasVoted 
                  ? 'bg-orange-50/40 border-orange-300 shadow-xs' 
                  : 'bg-neutral-50/50 hover:bg-white border-neutral-200/80 hover:border-orange-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-2.5">
                {/* Policy Label & District */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-mono font-black text-xs ${
                    index < 3 
                      ? 'bg-orange-600 text-white shadow-xs' 
                      : 'bg-neutral-200 text-neutral-700'
                  }`}>
                    {index + 1}
                  </span>

                  <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-white text-orange-700 border border-orange-200">
                    {policy.area}
                  </span>

                  <h4 className="text-xs sm:text-sm font-black text-neutral-900 line-clamp-1">
                    {policy.title}
                  </h4>
                </div>

                {/* Real-time Percentage & Interactive +1 Button */}
                <div className="flex items-center gap-2.5 self-end sm:self-auto shrink-0">
                  <div className="text-right">
                    <span className="text-xs font-mono font-black text-orange-600">
                      {percent}%
                    </span>
                    <span className="text-[10px] text-neutral-400 block font-mono">
                      {count.toLocaleString()} 人關注
                    </span>
                  </div>

                  <button
                    onClick={() => handleVote(policy.id)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                      hasVoted
                        ? 'bg-orange-600 text-white shadow-2xs'
                        : 'bg-white hover:bg-orange-100 text-neutral-700 hover:text-orange-900 border border-neutral-300'
                    } ${isJustVoted ? 'scale-105 ring-2 ring-orange-400' : ''}`}
                    title={hasVoted ? '點擊取消關注' : '點擊送出 +1 關注'}
                  >
                    <Heart className={`w-3.5 h-3.5 ${hasVoted ? 'fill-white text-white' : 'text-neutral-500'}`} />
                    <span>{hasVoted ? '已關注' : '+1 關注'}</span>
                  </button>

                  <button
                    onClick={() => onSelectDistrictOnMap(policy.districtId)}
                    className="p-1.5 rounded-xl bg-white hover:bg-neutral-100 text-neutral-500 hover:text-neutral-800 border border-neutral-200 transition-colors cursor-pointer"
                    title="在地圖中查看完整解方"
                  >
                    <MapPin className="w-3.5 h-3.5 text-orange-600" />
                  </button>
                </div>
              </div>

              {/* Minimalist Linear Bar (平滑條狀進度動畫) */}
              <div className="w-full bg-neutral-200/70 rounded-full h-2.5 overflow-hidden p-0.5 border border-neutral-200/50">
                <div
                  className="bg-linear-to-r from-orange-500 via-amber-500 to-teal-500 h-full rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${Math.max(percent, 4)}%` }}
                />
              </div>

              {/* Brief quote or summary */}
              <p className="text-[11px] text-neutral-500 line-clamp-1 mt-2">
                💬 市民原音：「{policy.citizenQuestion}」
              </p>
            </div>
          );
        })}
      </div>

      {/* Smooth Linear Destination Card: taipeispeaksup Official Feedback Link */}
      <div className="mt-8 bg-linear-to-br from-neutral-900 via-neutral-950 to-orange-950 text-white rounded-3xl p-6 sm:p-7 border border-orange-500/30 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-300 text-[11px] font-bold border border-orange-500/30">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>線上留線性參與 · 終點站</span>
            </div>
            <h4 className="text-lg sm:text-xl font-black tracking-tight text-white">
              如果有其他市政建議想提出？
            </h4>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              看完了 12 行政區市民關注動向，你想為台北留下最真實的在地心聲與市政提案？
              請至官方「市長，你給我聽好」留言！
            </p>
          </div>

          <a
            href="https://puma.taipei/taipeispeaksup"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-2xl bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs sm:text-sm shadow-lg hover:shadow-orange-500/20 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer active:scale-98 self-start sm:self-auto"
          >
            <span>至官方「市長，你給我聽好」留言</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] text-neutral-400">
          <span className="font-mono text-orange-300">
            官方留言：https://puma.taipei/taipeispeaksup
          </span>
          <span className="text-neutral-300">線上 12 區政見互動所即開即用</span>
        </div>
      </div>
    </section>
  );
};
