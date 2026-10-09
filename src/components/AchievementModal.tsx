import React, { useState } from 'react';
import { 
  X, 
  Award, 
  CheckCircle2, 
  MapPin, 
  Share2, 
  RotateCcw, 
  Sparkles, 
  Check, 
  Copy,
  Layers,
  Compass
} from 'lucide-react';
import { usePolicyProgress, PROGRESS_TIERS } from '../hooks/usePolicyProgress';
import { TAIPEI_DISTRICTS, SOAPBOX_POLICIES } from '../data/policies';
import { TaipeiDistrict } from '../types';
import { APP_REAL_URL, APP_LINE_URL, PUMA_SPEAKS_UP_URL } from '../config/urls';

interface AchievementModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: ReturnType<typeof usePolicyProgress>;
  onSelectDistrict: (districtId: TaipeiDistrict) => void;
}

export const AchievementModal: React.FC<AchievementModalProps> = ({
  isOpen,
  onClose,
  progress,
  onSelectDistrict
}) => {
  const [copiedShare, setCopiedShare] = useState(false);

  if (!isOpen) return null;

  const handleShareBadge = () => {
    const text = `🌊 我在【台北市政見探索所】已解鎖 ${progress.readCount}/${progress.totalCount} 條政見（達成率 ${progress.overallPercent}%）！\n目前榮獲公民稱號：${progress.currentTier.badge} · ${progress.currentTier.title}\n\n👉 12 行政區政見地圖：${APP_REAL_URL}\n如果有其他市政建議想提出，請至官方「市長，你給我聽好」留言\nhttps://puma.taipei/taipeispeaksup\n（資料來源引用：沈伯洋公開政策發言）\n#沈伯洋 #台北順起來 #公民探索`;
    navigator.clipboard.writeText(text);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="fixed inset-0 -z-10" onClick={onClose} />

      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-orange-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-neutral-100 flex items-center justify-between bg-linear-to-r from-orange-50 via-white to-amber-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-600 text-white flex items-center justify-center shadow-xs">
              <Award className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-neutral-900">
                市民政見探索成就儀表板
              </h3>
              <p className="text-xs text-neutral-500">
                探索 12 行政區在地解方，解鎖公民榮譽徽章！
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Current Tier Banner */}
          <div className="bg-linear-to-br from-orange-500 via-orange-600 to-amber-600 text-white rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-orange-200 tracking-wider uppercase">
                當前公民等級
              </span>
              <span className="text-xs bg-white/20 px-2.5 py-0.5 rounded-md font-mono font-bold">
                達成率 {progress.overallPercent}%
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-2xl font-black">
                  {progress.currentTier.badge}
                </h4>
                <p className="text-xs text-orange-100 mt-1">
                  {progress.currentTier.description}
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black font-mono">
                  {progress.readCount}
                </span>
                <span className="text-xs text-orange-200 ml-1">/ {progress.totalCount} 則</span>
              </div>
            </div>

            {/* Progress Track */}
            <div className="w-full bg-black/20 rounded-full h-2.5 overflow-hidden p-0.5">
              <div
                className="bg-amber-300 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.max(progress.overallPercent, 5)}%` }}
              />
            </div>
          </div>

          {/* District Unlock Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
                12 行政區政見解鎖清單：
              </span>
              <span className="text-xs text-neutral-400 font-medium">
                點選行政區可直接前往地圖
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {TAIPEI_DISTRICTS.map((d) => {
                const dProg = progress.getDistrictProgress(d.id);
                const isComplete = dProg.percent === 100;

                return (
                  <button
                    key={d.id}
                    onClick={() => {
                      onSelectDistrict(d.id);
                      onClose();
                    }}
                    className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between min-h-[75px] ${
                      isComplete
                        ? 'border-emerald-300 bg-emerald-50/70 hover:bg-emerald-100/60'
                        : dProg.read > 0
                        ? 'border-orange-300 bg-orange-50/50 hover:bg-orange-100/50'
                        : 'border-neutral-200 bg-neutral-50/80 hover:bg-neutral-100'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-bold text-neutral-900">
                        {d.name}
                      </span>
                      {isComplete ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <span className="text-[10px] font-mono font-bold text-neutral-400">
                          {dProg.read}/{dProg.total}
                        </span>
                      )}
                    </div>
                    <div className="w-full bg-neutral-200/80 rounded-full h-1.5 overflow-hidden mt-2">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isComplete ? 'bg-emerald-500' : 'bg-orange-500'
                        }`}
                        style={{ width: `${dProg.percent}%` }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tier Milestones Checklist */}
          <div className="space-y-2.5 pt-2 border-t border-neutral-100">
            <span className="text-xs font-bold text-neutral-700 uppercase tracking-wider block">
              探索里程碑：
            </span>
            <div className="space-y-2">
              {PROGRESS_TIERS.map((tier, idx) => {
                const isReached = progress.overallPercent >= tier.minPercent;
                return (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                      isReached
                        ? 'bg-orange-50/60 border-orange-200 text-orange-950 font-bold'
                        : 'bg-neutral-50 border-neutral-200 text-neutral-400'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {isReached ? (
                        <CheckCircle2 className="w-4 h-4 text-orange-600" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-neutral-300" />
                      )}
                      <span>{tier.badge}</span>
                      <span className="text-neutral-500 font-normal">（{tier.description}）</span>
                    </div>
                    <span className="font-mono">{tier.minPercent}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={progress.markAllAsRead}
              className="text-xs text-orange-600 hover:text-orange-700 font-semibold cursor-pointer"
            >
              全部標記已讀
            </button>
            <span className="text-neutral-300">·</span>
            <button
              onClick={progress.resetProgress}
              className="text-xs text-neutral-400 hover:text-neutral-600 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>重設</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Threads Share - Priority 1 */}
            <a
              href={`https://www.threads.net/intent/post?text=${encodeURIComponent(
                `🌊 我在【台北市政見探索所】已解鎖 ${progress.readCount}/${progress.totalCount} 條政見（達成率 ${progress.overallPercent}%）！\n目前榮獲稱號：${progress.currentTier.badge} · ${progress.currentTier.title}\n\n👉 12 區互動地圖：${APP_REAL_URL}\n#沈伯洋 #台北順起來 #政見探索`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black text-white bg-neutral-950 hover:bg-black shadow-xs transition-all cursor-pointer border border-neutral-800"
              title="以 Threads 轉發探索成就（首選推薦）"
            >
              <span className="font-mono text-xs font-bold">@</span>
              <span>Threads</span>
            </a>

            {/* LINE Share - Non-blocking */}
            <a
              href={`https://line.me/R/msg/text/?${encodeURIComponent(
                `🌊 我在【台北市政見探索所】已探索 ${progress.readCount}/${progress.totalCount} 條政見（達成率 ${progress.overallPercent}%）！榮獲「${progress.currentTier.title}」稱號！\n👉 點此線上瀏覽 12 區政見地圖：${APP_LINE_URL}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 shadow-xs transition-all cursor-pointer"
              title="以 LINE 轉發給好友"
            >
              <span className="font-bold text-[10px]">L</span>
              <span>LINE</span>
            </a>

            <button
              onClick={handleShareBadge}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 shadow-xs transition-all cursor-pointer"
            >
              {copiedShare ? <Check className="w-3.5 h-3.5 text-amber-200" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedShare ? '已複製成就文' : '複製成就短文'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
