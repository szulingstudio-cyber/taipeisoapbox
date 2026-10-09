import React from 'react';
import { 
  Layers, 
  MessageSquare, 
  Compass, 
  Waves, 
  Search, 
  Award,
  ScrollText,
  LayoutGrid,
  Share2
} from 'lucide-react';

export interface NavbarProps {
  currentTab: 'map' | 'soapbox' | 'heart' | 'currents' | 'share';
  onSelectTab: (tab: 'map' | 'soapbox' | 'heart' | 'currents' | 'share') => void;
  onOpenSearch: () => void;
  onOpenAchievement: () => void;
  viewMode: 'tabs' | 'scroll';
  onToggleViewMode: () => void;
  readCount: number;
  totalCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenSearch,
  onOpenAchievement,
  viewMode,
  onToggleViewMode,
  readCount,
  totalCount
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-orange-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar Contract: Zone 1 (Wordmark) — Zone 2 (Nav Links) — Zone 3 (Primary Action) */}
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => onSelectTab('map')}
            className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-hidden"
          >
            <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-orange-600 via-orange-500 to-amber-400 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform duration-200">
              <span className="font-black text-base tracking-tighter">洋</span>
            </div>
            <div>
              <span className="text-base sm:text-lg font-black tracking-tight text-neutral-900 group-hover:text-orange-600 transition-colors">
                市長你給我聽好
              </span>
              <span className="hidden sm:inline-block ml-1.5 text-xs text-orange-600 font-semibold tracking-wide">
                街頭肥皂箱整理 · HEART 政策核心
              </span>
            </div>
          </button>

          {/* Zone 2: Clean text navigation links */}
          <nav className="hidden lg:flex items-center gap-1 sm:gap-1.5">
            <button
              onClick={() => onSelectTab('map')}
              className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                currentTab === 'map'
                  ? 'bg-orange-600 text-white font-bold shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>12 區地圖</span>
            </button>
            <button
              onClick={() => onSelectTab('soapbox')}
              className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                currentTab === 'soapbox'
                  ? 'bg-orange-600 text-white font-bold shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>街頭肥皂箱</span>
            </button>
            <button
              onClick={() => onSelectTab('heart')}
              className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                currentTab === 'heart'
                  ? 'bg-orange-600 text-white font-bold shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>市政白皮書</span>
            </button>
            <button
              onClick={() => onSelectTab('currents')}
              className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                currentTab === 'currents'
                  ? 'bg-orange-600 text-white font-bold shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              <Waves className="w-3.5 h-3.5" />
              <span>金句</span>
            </button>
            <button
              onClick={() => onSelectTab('share')}
              className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                currentTab === 'share'
                  ? 'bg-orange-600 text-white font-bold shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>轉發討論</span>
            </button>
          </nav>

          {/* Zone 3: Interactive Search, View Mode & Achievement Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Global Search Button */}
            <button
              onClick={onOpenSearch}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors cursor-pointer"
              title="搜尋政見與議題 (快捷鍵)"
            >
              <Search className="w-3.5 h-3.5 text-orange-600" />
              <span className="hidden sm:inline">搜尋政見</span>
            </button>

            {/* Achievement Progress Trigger Badge */}
            <button
              onClick={onOpenAchievement}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-orange-800 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-xl transition-colors cursor-pointer"
              title="查看探索進度與勳章"
            >
              <Award className="w-3.5 h-3.5 text-orange-600" />
              <span className="font-mono tabular-nums font-bold">
                {readCount}/{totalCount}
              </span>
            </button>

            {/* View Mode Switcher: One-page scroll vs Tab mode */}
            <button
              onClick={onToggleViewMode}
              className={`inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                viewMode === 'scroll'
                  ? 'bg-neutral-800 text-white shadow-xs'
                  : 'bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200'
              }`}
              title={viewMode === 'scroll' ? '切換為分頁模式' : '切換為一頁長卷全覽'}
            >
              {viewMode === 'scroll' ? (
                <>
                  <LayoutGrid className="w-3.5 h-3.5 text-amber-300" />
                  <span className="hidden md:inline">分頁模式</span>
                </>
              ) : (
                <>
                  <ScrollText className="w-3.5 h-3.5 text-orange-600" />
                  <span className="hidden md:inline">一頁全覽</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="flex lg:hidden items-center justify-between overflow-x-auto py-2 border-t border-neutral-100 gap-1 scrollbar-none">
          <button
            onClick={() => onSelectTab('map')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg shrink-0 ${
              currentTab === 'map' ? 'bg-orange-600 text-white' : 'text-neutral-600'
            }`}
          >
            12 區地圖
          </button>
          <button
            onClick={() => onSelectTab('soapbox')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg shrink-0 ${
              currentTab === 'soapbox' ? 'bg-orange-600 text-white' : 'text-neutral-600'
            }`}
          >
            街頭肥皂箱
          </button>
          <button
            onClick={() => onSelectTab('heart')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg shrink-0 ${
              currentTab === 'heart' ? 'bg-orange-600 text-white' : 'text-neutral-600'
            }`}
          >
            市政白皮書
          </button>
          <button
            onClick={() => onSelectTab('currents')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg shrink-0 ${
              currentTab === 'currents' ? 'bg-orange-600 text-white' : 'text-neutral-600'
            }`}
          >
            金句
          </button>
          <button
            onClick={() => onSelectTab('share')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg shrink-0 ${
              currentTab === 'share' ? 'bg-orange-600 text-white' : 'text-neutral-600'
            }`}
          >
            轉發討論
          </button>
        </div>
      </div>
    </header>
  );
};
