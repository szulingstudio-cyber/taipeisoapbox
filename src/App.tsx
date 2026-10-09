/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { DigitalPumaHero } from './components/DigitalPumaHero';
import { CivicRoleMatcher } from './components/CivicRoleMatcher';
import { MobileShareBar } from './components/MobileShareBar';
import { TaipeiMapExplorer } from './components/TaipeiMapExplorer';
import { SoapboxExplorer } from './components/SoapboxExplorer';
import { ThemeExplorer } from './components/ThemeExplorer';
import { PumaDigitalInteractive } from './components/PumaDigitalInteractive';
import { CitizenVoiceWall } from './components/CitizenVoiceWall';
import { PolicyForwardingHub } from './components/PolicyForwardingHub';
import { SearchModal } from './components/SearchModal';
import { AchievementModal } from './components/AchievementModal';
import { Footer } from './components/Footer';
import { TaipeiDistrict } from './types';
import { usePolicyProgress } from './hooks/usePolicyProgress';
import { ArrowUp, Compass, MessageSquare, Layers, Waves, Award, Share2 } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'map' | 'soapbox' | 'heart' | 'currents' | 'share'>('map');
  const [viewMode, setViewMode] = useState<'tabs' | 'scroll'>('tabs');
  const [selectedDistrictId, setSelectedDistrictId] = useState<TaipeiDistrict>('shilin');
  const [selectedPolicyIdForShare, setSelectedPolicyIdForShare] = useState<string | undefined>(undefined);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [autoOpenShare, setAutoOpenShare] = useState(false);
  const [isAchievementOpen, setIsAchievementOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const progress = usePolicyProgress();

  // Robust scrolling function that accounts for sticky navbar and React re-rendering
  const scrollToTarget = (targetId: string) => {
    let attempts = 0;
    const maxAttempts = 35;

    const runScroll = () => {
      attempts++;
      const el = document.getElementById(targetId) || document.getElementById(targetId.replace('-section', ''));
      if (el) {
        const navOffset = 76;
        const rect = el.getBoundingClientRect();
        const targetY = window.pageYOffset + rect.top - navOffset;
        window.scrollTo({
          top: Math.max(0, targetY),
          behavior: 'smooth'
        });
      } else if (attempts < maxAttempts) {
        setTimeout(runScroll, 40);
      }
    };

    setTimeout(runScroll, 20);
  };

  // Handle direct navigation to Share Hub with a specific policy:
  // Seamlessly leads directly to that policy in SoapboxExplorer and opens the in-place forwarding workshop
  const handleNavigateToShare = (policyId: string, districtId: TaipeiDistrict) => {
    setSelectedDistrictId(districtId);
    setSelectedPolicyIdForShare(policyId);
    setAutoOpenShare(true);
    setCurrentTab('soapbox');
    scrollToTarget('inline-share-workshop');
  };

  // Scroll listener for back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard shortcut (Cmd+K / Ctrl+K) to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavSelectTab = (tab: 'map' | 'soapbox' | 'heart' | 'currents' | 'share') => {
    if (tab === 'map') {
      setCurrentTab('map');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (tab === 'share') {
      setCurrentTab('soapbox');
      setAutoOpenShare(true);
      scrollToTarget('inline-share-workshop');
      return;
    }

    setCurrentTab(tab);

    const sectionMap: Record<string, string> = {
      soapbox: 'soapbox-section',
      heart: 'theme-section',
      currents: 'currents-section',
    };

    const targetId = sectionMap[tab];
    if (targetId) {
      scrollToTarget(targetId);
    }
  };

  const handleExploreMap = () => {
    handleNavSelectTab('map');
  };

  const handleExploreSoapbox = () => {
    handleNavSelectTab('soapbox');
  };

  const handleExploreTheme = () => {
    handleNavSelectTab('heart');
  };

  const handleSelectDistrictOnMap = (districtId: TaipeiDistrict) => {
    setSelectedDistrictId(districtId);
    if (viewMode === 'tabs') {
      setCurrentTab('map');
      const mapEl = document.getElementById('main-map-centerpiece');
      if (mapEl) {
        mapEl.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      const el = document.getElementById('map-section');
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSearchSelectPolicy = (districtId: TaipeiDistrict) => {
    handleSelectDistrictOnMap(districtId);
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900 font-sans selection:bg-orange-500 selection:text-white relative">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={handleNavSelectTab}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAchievement={() => setIsAchievementOpen(true)}
        viewMode={viewMode}
        onToggleViewMode={() => setViewMode(viewMode === 'tabs' ? 'scroll' : 'tabs')}
        readCount={progress.readCount}
        totalCount={progress.totalCount}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* 1. TOP CENTERPIECE: 台北市 12 行政區政見地圖 (放在最上面呈現，讓民眾直接點選) */}
        <div id="map-section" className="scroll-mt-20">
          <TaipeiMapExplorer
            progress={progress}
            initialDistrictId={selectedDistrictId}
            onSelectDistrict={handleSelectDistrictOnMap}
            onNavigateToShare={handleNavigateToShare}
          />
        </div>

        {/* 2. Civic Role Matcher & Social Share Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 my-6 space-y-6">
          <CivicRoleMatcher onSelectDistrict={handleSelectDistrictOnMap} />
          <MobileShareBar currentDistrictId={selectedDistrictId} />
        </div>

        {/* 3. Visual Intro & Overview Hero Carousel */}
        <div className="border-t border-orange-100">
          <DigitalPumaHero
            onExploreMap={handleExploreMap}
            onExploreSoapbox={handleExploreSoapbox}
            onExploreTheme={handleExploreTheme}
            onSelectDistrict={handleSelectDistrictOnMap}
            onOpenAchievement={() => setIsAchievementOpen(true)}
            progress={progress}
          />
        </div>

        {/* MODE A: TAB VIEW (Focused secondary exploration) */}
        {viewMode === 'tabs' && (
          <div id="tab-content-area" className="space-y-8 scroll-mt-20">
            {/* In-Page Quick Tab Switcher: 讓民眾在滾動到此區時也能直覺一鍵切換所有主題 */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
              <div className="bg-white p-2 rounded-2xl border border-neutral-200 shadow-2xs flex items-center justify-between gap-1 overflow-x-auto scrollbar-none">
                <button
                  onClick={() => handleNavSelectTab('map')}
                  className={`px-3 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    currentTab === 'map'
                      ? 'bg-orange-600 text-white shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>12 區地圖</span>
                </button>
                <button
                  onClick={() => handleNavSelectTab('soapbox')}
                  className={`px-3 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    currentTab === 'soapbox'
                      ? 'bg-orange-600 text-white shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>街頭肥皂箱</span>
                </button>
                <button
                  onClick={() => handleNavSelectTab('heart')}
                  className={`px-3 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    currentTab === 'heart'
                      ? 'bg-orange-600 text-white shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>市政白皮書</span>
                </button>
                <button
                  onClick={() => handleNavSelectTab('currents')}
                  className={`px-3 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    currentTab === 'currents'
                      ? 'bg-orange-600 text-white shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                  }`}
                >
                  <Waves className="w-3.5 h-3.5" />
                  <span>金句</span>
                </button>
                <button
                  onClick={() => handleNavSelectTab('share')}
                  className={`px-3 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    currentTab === 'share'
                      ? 'bg-orange-600 text-white shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                  }`}
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>轉發討論</span>
                </button>
              </div>
            </div>

            {/* Tab 0: 若民眾點選「台北地圖政見」，顯示回到頂部地圖指示 */}
            {currentTab === 'map' && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-orange-50/70 border border-orange-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <Compass className="w-4 h-4 text-orange-600 shrink-0" />
                    <span className="font-bold text-neutral-900">
                      地圖已置頂於頁面頂端！點選上方 12 行政區即可即時更新政見與統計圖表。
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      const el = document.getElementById('map-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold cursor-pointer transition-colors shrink-0"
                  >
                    回到頂部地圖 ↗
                  </button>
                </div>
              </div>
            )}

            {/* Tab 1: 街頭肥皂箱市民開講實錄 · 延續同頁面轉發討論 (Soapbox & Forwarding) */}
            {(currentTab === 'soapbox' || currentTab === 'share') && (
              <div className="scroll-mt-24">
                <SoapboxExplorer
                  onSelectDistrictOnMap={handleSelectDistrictOnMap}
                  progress={progress}
                  initialPolicyId={selectedPolicyIdForShare}
                  autoOpenShare={autoOpenShare || Boolean(selectedPolicyIdForShare)}
                />
              </div>
            )}

            {/* Tab 2: 主題式政見探索系統 (Theme Explorer) */}
            {currentTab === 'heart' && (
              <div className="scroll-mt-24">
                <ThemeExplorer
                  onSelectDistrictOnMap={handleSelectDistrictOnMap}
                  onGoToSoapbox={handleExploreSoapbox}
                  onSelectPolicyForShare={handleNavigateToShare}
                  progress={progress}
                />
              </div>
            )}

            {/* Tab 3: 沈伯洋金句、洋流理念 */}
            {currentTab === 'currents' && (
              <div className="scroll-mt-24">
                <PumaDigitalInteractive
                  onSelectDistrictOnMap={handleSelectDistrictOnMap}
                />
              </div>
            )}

            {/* Citizen Soapbox Message Wall (Present on main views) */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
              <CitizenVoiceWall />
            </div>
          </div>
        )}

        {/* MODE B: ONE-PAGE CONTINUOUS SCROLL VIEW (Full story flow) */}
        {viewMode === 'scroll' && (
          <div className="space-y-12 pt-6">
            {/* Section 2: Soapbox Archive with in-place forwarding */}
            <div className="scroll-mt-24">
              <SoapboxExplorer
                onSelectDistrictOnMap={handleSelectDistrictOnMap}
                progress={progress}
                initialPolicyId={selectedPolicyIdForShare}
                autoOpenShare={autoOpenShare || Boolean(selectedPolicyIdForShare)}
              />
            </div>

            {/* Section 3: Thematic Whitepaper */}
            <div className="scroll-mt-24">
              <ThemeExplorer
                onSelectDistrictOnMap={handleSelectDistrictOnMap}
                onGoToSoapbox={handleExploreSoapbox}
                onSelectPolicyForShare={handleNavigateToShare}
                progress={progress}
              />
            </div>

            {/* Section 4: 沈伯洋金句、洋流理念與圖卡工坊 */}
            <div className="scroll-mt-24">
              <PumaDigitalInteractive
                onSelectDistrictOnMap={handleSelectDistrictOnMap}
              />
            </div>

            {/* Section 5: Citizen Message Wall */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
              <CitizenVoiceWall />
            </div>
          </div>
        )}
      </main>

      {/* Floating Action Buttons: Back to top and quick modal shortcuts */}
      <div className="fixed bottom-6 right-6 z-30 flex flex-col items-end gap-2.5">
        {/* Floating Achievement Badge Trigger */}
        <button
          onClick={() => setIsAchievementOpen(true)}
          className="bg-white/95 backdrop-blur-md hover:bg-orange-50 text-orange-800 p-3 rounded-full shadow-lg border border-orange-200 transition-all hover:scale-105 cursor-pointer flex items-center gap-1.5"
          title="我的探索進度"
        >
          <Award className="w-5 h-5 text-orange-600" />
          <span className="text-xs font-mono font-bold pr-1">
            {progress.overallPercent}%
          </span>
        </button>

        {/* Back to top button */}
        {showBackToTop && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-neutral-900/90 hover:bg-neutral-900 text-white p-3 rounded-full shadow-lg transition-all hover:scale-105 cursor-pointer"
            title="回到頂端"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Global Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectPolicy={handleSearchSelectPolicy}
      />

      {/* Exploration Achievements Modal */}
      <AchievementModal
        isOpen={isAchievementOpen}
        onClose={() => setIsAchievementOpen(false)}
        progress={progress}
        onSelectDistrict={handleSelectDistrictOnMap}
      />

      {/* Footer */}
      <Footer onSelectTab={handleNavSelectTab} />
    </div>
  );
}
