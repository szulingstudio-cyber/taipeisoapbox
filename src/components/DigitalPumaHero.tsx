import React, { useState, useEffect } from 'react';
import { 
  Waves, 
  ChevronLeft, 
  ChevronRight, 
  Quote, 
  Award, 
  RotateCcw, 
  Compass, 
  Volume2, 
  Layers,
  Copy,
  Check,
  Play,
  Pause,
  MapPin,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { ENRICHED_CAMPAIGN_QUOTES } from '../data/policies';
import { usePolicyProgress } from '../hooks/usePolicyProgress';
import { TaipeiDistrict } from '../types';
import { APP_REAL_URL, APP_LINE_URL, PUMA_SPEAKS_UP_URL } from '../config/urls';

interface DigitalPumaHeroProps {
  onExploreMap: () => void;
  onExploreSoapbox: () => void;
  onExploreTheme: () => void;
  onSelectDistrict?: (districtId: TaipeiDistrict) => void;
  onOpenAchievement?: () => void;
  progress: ReturnType<typeof usePolicyProgress>;
}

export const DigitalPumaHero: React.FC<DigitalPumaHeroProps> = ({
  onExploreMap,
  onExploreSoapbox,
  onExploreTheme,
  onSelectDistrict,
  onOpenAchievement,
  progress
}) => {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

  const currentQuote = ENRICHED_CAMPAIGN_QUOTES[quoteIndex] || ENRICHED_CAMPAIGN_QUOTES[0];

  // Auto carousel rotation (6 seconds)
  useEffect(() => {
    if (!isAutoPlay) return;
    const timer = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % ENRICHED_CAMPAIGN_QUOTES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isAutoPlay]);

  const handlePrev = () => {
    setQuoteIndex((prev) => (prev - 1 + ENRICHED_CAMPAIGN_QUOTES.length) % ENRICHED_CAMPAIGN_QUOTES.length);
  };

  const handleNext = () => {
    setQuoteIndex((prev) => (prev + 1) % ENRICHED_CAMPAIGN_QUOTES.length);
  };

  const handleCopyQuote = () => {
    const text = `「${currentQuote.quote}」\n\n—— 沈伯洋（${currentQuote.context}）\n\n👉 台北 12 行政區政見地圖：${APP_REAL_URL}\n如果有其他市政建議想提出，請至官方「市長，你給我聽好」留言\nhttps://puma.taipei/taipeispeaksup\n#沈伯洋 #台北順起來 #${currentQuote.topic}`;
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2200);
  };

  const handleJumpToPolicy = () => {
    if (currentQuote.districtId && onSelectDistrict) {
      onSelectDistrict(currentQuote.districtId);
    } else {
      onExploreMap();
    }
  };

  return (
    <div className="relative overflow-hidden bg-linear-to-b from-orange-50/70 via-white to-neutral-50/40 pt-8 pb-10 sm:pt-10 sm:pb-12 border-b border-orange-100">
      {/* Background Flowing Wave Currents SVG */}
      <div className="absolute inset-0 pointer-events-none opacity-35">
        <svg className="w-full h-full" viewBox="0 0 1440 320" fill="none" preserveAspectRatio="none">
          <path
            fill="#FED7AA"
            fillOpacity="0.4"
            d="M0,64L48,80C96,96,192,128,288,149.3C384,171,480,181,576,160C672,139,768,85,864,80C960,75,1056,117,1152,138.7C1248,160,1344,160,1392,160L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
          <path
            fill="#BAE6FD"
            fillOpacity="0.3"
            d="M0,192L48,181.3C96,171,192,149,288,154.7C384,160,480,192,576,181.3C672,171,768,117,864,112C960,107,1056,149,1152,165.3C1248,181,1344,171,1392,165.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Civic Vision & Exploration Progress Tracker (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Metadata Line */}
            <div className="flex items-center gap-2 text-xs font-semibold text-orange-600 tracking-wide uppercase flex-wrap">
              <span className="flex items-center gap-1.5 bg-orange-100 text-orange-800 px-2.5 py-1 rounded-md">
                <Waves className="w-3.5 h-3.5 text-orange-600" />
                洋流湧動 · 台北順起來
              </span>
              <span aria-hidden="true" className="text-neutral-300">·</span>
              <span className="text-neutral-600">台北市 12 行政區資訊圖表</span>
              <span aria-hidden="true" className="text-neutral-300">·</span>
              <span className="text-neutral-600">公開互動政見庫</span>
            </div>

            {/* Headline */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-neutral-900 tracking-tight leading-tight">
                走入 12 行政區探索
                <span className="block mt-1 bg-linear-to-r from-orange-600 via-orange-500 to-amber-500 bg-clip-text text-transparent">
                  市民站上肥皂箱，城市迎來新洋流
                </span>
              </h1>
              <p className="text-sm sm:text-base text-neutral-600 leading-relaxed max-w-2xl">
                台北市 12 行政區街頭肥皂箱實錄與市政解方。點選地圖直接在圖表上探索該區政策類別，
                依各區特色與民生痛點清楚呈現，任何人皆可自由點選與探索！
              </p>
            </div>

            {/* Achievement Progress Bar Card (視覺化探索成就進度條) */}
            <div className="p-4 bg-white rounded-2xl border border-orange-200/90 shadow-sm space-y-2.5">
              <div 
                onClick={onOpenAchievement}
                className="flex items-center justify-between text-xs cursor-pointer hover:opacity-85 transition-opacity"
                title="點擊展開成就儀表板"
              >
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-orange-600" />
                  <span className="font-bold text-neutral-900">
                    你的政見探索進度：
                  </span>
                  <span className="font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md hover:bg-orange-100 transition-colors">
                    {progress.currentTier.badge} ↗
                  </span>
                </div>
                <div className="flex items-center gap-2 text-neutral-500">
                  <span className="font-mono tabular-nums font-bold text-neutral-900">
                    {progress.readCount} / {progress.totalCount}
                  </span>
                  <span>({progress.overallPercent}%)</span>
                </div>
              </div>

              {/* Progress Bar with smooth animation */}
              <div className="w-full bg-neutral-100 rounded-full h-3 overflow-hidden p-0.5 border border-neutral-200/80">
                <div
                  className="bg-linear-to-r from-orange-500 via-amber-500 to-teal-500 h-full rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${Math.max(progress.overallPercent, 4)}%` }}
                />
              </div>

              {/* Actions below progress bar */}
              <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-0.5">
                <span>{progress.currentTier.description}</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={progress.markAllAsRead}
                    className="text-orange-600 hover:text-orange-700 font-semibold cursor-pointer"
                  >
                    全部解鎖
                  </button>
                  <span className="text-neutral-300">·</span>
                  <button
                    onClick={progress.resetProgress}
                    className="text-neutral-400 hover:text-neutral-600 flex items-center gap-0.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>重設</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Navigation Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={onExploreMap}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer active:scale-98"
              >
                <Compass className="w-4 h-4" />
                <span>探索 12 區地圖中心</span>
              </button>
              <button
                onClick={onExploreSoapbox}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-neutral-800 bg-white hover:bg-orange-50 border border-orange-200 rounded-xl shadow-2xs hover:border-orange-300 transition-all duration-200 cursor-pointer"
              >
                <span>街頭肥皂箱實錄</span>
              </button>
              <button
                onClick={onExploreTheme}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-all duration-200 cursor-pointer"
              >
                <Layers className="w-4 h-4 text-orange-600" />
                <span>主題市政白皮書</span>
              </button>
            </div>
          </div>

          {/* Right Column: Symbolic Ocean Currents & Civic Voice Quote Carousel (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div 
              onMouseEnter={() => setIsAutoPlay(false)}
              onMouseLeave={() => setIsAutoPlay(true)}
              className="relative w-full max-w-sm sm:max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-xl border border-orange-200/90 group"
            >
              {/* Dynamic Aura Gradient */}
              <div className="absolute -top-3 -right-3 w-20 h-20 bg-orange-400/20 rounded-full blur-xl pointer-events-none" />
              <div className="absolute -bottom-3 -left-3 w-20 h-20 bg-teal-400/20 rounded-full blur-xl pointer-events-none" />

              {/* Ocean Currents & Voice Frequency Visual Metaphor (純意象設計，無任何人物肖像) */}
              <div className="relative rounded-2xl p-5 bg-linear-to-br from-orange-500 via-orange-600 to-amber-600 text-white overflow-hidden shadow-inner flex flex-col justify-between min-h-[250px]">
                {/* Stylized concentric current soundwaves & ripple lines */}
                <svg className="absolute inset-0 w-full h-full opacity-25 pointer-events-none" viewBox="0 0 300 220" fill="none">
                  <circle cx="150" cy="110" r="45" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="4 4" />
                  <circle cx="150" cy="110" r="80" stroke="#FFFFFF" strokeWidth="1.5" />
                  <circle cx="150" cy="110" r="120" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="6 6" />
                  <path d="M 0,170 Q 75,130 150,160 T 300,150" stroke="#FFFFFF" strokeWidth="3" opacity="0.6" />
                  <path d="M 0,195 Q 75,150 150,180 T 300,170" stroke="#FFFFFF" strokeWidth="2" opacity="0.4" />
                </svg>

                {/* Card Top: Topic Badge, Carousel Counter & AutoPlay Toggle */}
                <div className="flex items-center justify-between z-10 gap-2">
                  <div className="flex items-center gap-1.5 bg-black/25 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-bold text-orange-100">
                    <Volume2 className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                    <span>#{currentQuote.topic}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setIsAutoPlay(!isAutoPlay)}
                      className="p-1 rounded-md bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
                      title={isAutoPlay ? '暫停輪播' : '繼續自動輪播'}
                    >
                      {isAutoPlay ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    </button>
                    <span className="text-xs font-mono font-bold bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-md text-white tabular-nums">
                      0{quoteIndex + 1} / 0{ENRICHED_CAMPAIGN_QUOTES.length}
                    </span>
                  </div>
                </div>

                {/* Central Quote Display */}
                <div className="my-3 z-10 space-y-2">
                  <Quote className="w-6 h-6 text-orange-200/60" />
                  <blockquote className="text-base sm:text-lg font-black leading-snug tracking-tight text-white drop-shadow-xs min-h-[72px] flex items-center">
                    {currentQuote.quote}
                  </blockquote>
                  <p className="text-[11px] text-orange-100 flex items-center gap-1 font-medium pt-1 border-t border-white/20">
                    <Sparkles className="w-3 h-3 text-amber-200 shrink-0" />
                    <span className="line-clamp-1">{currentQuote.context}</span>
                  </p>
                </div>

                {/* Card Bottom: Animated Sound Frequency Bars & Quick Action */}
                <div className="flex items-center justify-between z-10 pt-2 border-t border-white/20">
                  <div className="flex items-center gap-1">
                    <span className="w-1 h-3 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1 h-5 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    <span className="w-1 h-6 bg-white rounded-full animate-bounce" style={{ animationDelay: '450ms' }} />
                    <span className="w-1 h-4 bg-white/90 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                    <span className="text-[10px] text-orange-100 ml-1 font-medium">沈伯洋金句 · 洋流理念共振中</span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap justify-end">
                    <a
                      href={`https://www.threads.net/intent/post?text=${encodeURIComponent(
                        `「${currentQuote.quote}」\n\n—— 沈伯洋（${currentQuote.context}）\n\n👉 台北市政見探索所：${APP_REAL_URL}\n#沈伯洋 #台北順起來 #${currentQuote.topic}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 bg-black/50 hover:bg-black/80 text-white text-[11px] font-bold px-2 py-1 rounded-lg backdrop-blur-md transition-colors cursor-pointer"
                      title="以 Threads 轉發此金句"
                    >
                      <span className="font-mono font-bold">@</span>
                      <span>Threads</span>
                    </a>
                    <a
                      href={`https://line.me/R/msg/text/?${encodeURIComponent(
                        `【台北市政見金句】\n「${currentQuote.quote}」\n\n—— 沈伯洋（${currentQuote.context}）\n\n👉 線上探索 12 區政見：${APP_LINE_URL}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 bg-emerald-500/80 hover:bg-emerald-500 text-white text-[11px] font-bold px-2 py-1 rounded-lg backdrop-blur-md transition-colors cursor-pointer"
                      title="以 LINE 轉發此金句"
                    >
                      <span className="font-bold text-[10px]">L</span>
                      <span>LINE</span>
                    </a>
                    <button
                      onClick={handleCopyQuote}
                      className="inline-flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white text-[11px] font-bold px-2 py-1 rounded-lg backdrop-blur-md transition-colors cursor-pointer"
                      title="複製金句"
                    >
                      {isCopied ? <Check className="w-3 h-3 text-amber-200" /> : <Copy className="w-3 h-3" />}
                      <span>{isCopied ? '已複製' : '複製'}</span>
                    </button>
                    {currentQuote.districtId && (
                      <button
                        onClick={handleJumpToPolicy}
                        className="inline-flex items-center gap-1 bg-amber-400/30 hover:bg-amber-400/50 text-white text-[11px] font-bold px-2 py-1 rounded-lg backdrop-blur-md transition-colors cursor-pointer"
                        title="查看該區地圖政見"
                      >
                        <MapPin className="w-3 h-3 text-amber-200" />
                        <span>地圖政見</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Carousel Controls & Dot Indicators */}
              <div className="mt-4 flex items-center justify-between px-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {ENRICHED_CAMPAIGN_QUOTES.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => setQuoteIndex(i)}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        quoteIndex === i ? 'w-6 bg-orange-600' : 'w-2 bg-neutral-200 hover:bg-neutral-300'
                      }`}
                      title={`${q.topic} - 金句 ${i + 1}`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={handlePrev}
                    className="p-1.5 rounded-lg bg-neutral-100 hover:bg-orange-100 text-neutral-600 hover:text-orange-700 transition-colors cursor-pointer"
                    title="上一句"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="p-1.5 rounded-lg bg-neutral-100 hover:bg-orange-100 text-neutral-600 hover:text-orange-700 transition-colors cursor-pointer"
                    title="下一句"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Footer Note */}
              <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500">
                <span className="flex items-center gap-1 text-orange-600 font-medium">
                  <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
                  主視覺意象：活力暖橘 × 洋流浪潮
                </span>
                <span className="text-neutral-400">公眾發布版 · 資訊圖表化</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
