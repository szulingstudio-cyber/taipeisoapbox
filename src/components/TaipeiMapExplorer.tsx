import React, { useState, useMemo } from 'react';
import { 
  MapPin, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle, 
  MessageSquare, 
  Compass, 
  Building, 
  Copy, 
  Check, 
  Tag, 
  Filter, 
  Award, 
  ChevronDown, 
  ChevronUp,
  Waves,
  Eye,
  CheckCircle,
  BarChart3,
  ExternalLink,
  TrendingUp,
  CheckSquare,
  ListOrdered,
  FileText,
  Share2,
  Image as ImageIcon
} from 'lucide-react';
import { TAIPEI_DISTRICTS, SOAPBOX_POLICIES, CATEGORY_TAGS, POLICY_THEMES, DistrictInfo } from '../data/policies';
import { TaipeiDistrict, SoapboxPolicy, PolicyTheme } from '../types';
import { usePolicyProgress } from '../hooks/usePolicyProgress';
import { APP_REAL_URL, APP_LINE_URL, PUMA_SPEAKS_UP_URL } from '../config/urls';
import { buildThreadsUrl, buildLineUrl, buildThreadsShareText } from '../utils/shareFormatter';
import { DistrictPolicyChart } from './DistrictPolicyChart';
import { PolicyImageModal } from './PolicyImageModal';

interface TaipeiMapExplorerProps {
  progress: ReturnType<typeof usePolicyProgress>;
  initialDistrictId?: TaipeiDistrict;
  onSelectDistrict?: (districtId: TaipeiDistrict) => void;
  onNavigateToShare?: (policyId: string, districtId: TaipeiDistrict) => void;
}

export const TaipeiMapExplorer: React.FC<TaipeiMapExplorerProps> = ({ 
  progress, 
  initialDistrictId,
  onSelectDistrict,
  onNavigateToShare 
}) => {
  const [selectedDistrictId, setSelectedDistrictId] = useState<TaipeiDistrict>(initialDistrictId || 'shilin');
  const [hoveredDistrictId, setHoveredDistrictId] = useState<TaipeiDistrict | null>(null);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [selectedThemeId, setSelectedThemeId] = useState<string | null>(null);
  const [copiedPolicyId, setCopiedPolicyId] = useState<string | null>(null);
  const [expandedFaqPolicyId, setExpandedFaqPolicyId] = useState<string | null>(null);
  const [expandedPolicyIds, setExpandedPolicyIds] = useState<Set<string>>(new Set());
  const [imageModalPolicy, setImageModalPolicy] = useState<{ policy: SoapboxPolicy; districtName: string } | null>(null);

  const handleDistrictChange = (dId: TaipeiDistrict) => {
    setSelectedDistrictId(dId);
    setSelectedThemeId(null);
    if (onSelectDistrict) {
      onSelectDistrict(dId);
    }
  };

  React.useEffect(() => {
    if (initialDistrictId) {
      setSelectedDistrictId(initialDistrictId);
      setActiveTag(null);
      setSelectedThemeId(null);
    }
  }, [initialDistrictId]);

  // Selected district info
  const selectedDistrict =
    TAIPEI_DISTRICTS.find((d) => d.id === selectedDistrictId) || TAIPEI_DISTRICTS[1];

  // Policies in selected district
  const districtPolicies = useMemo(() => {
    return SOAPBOX_POLICIES.filter((p) => p.districtId === selectedDistrictId);
  }, [selectedDistrictId]);

  // Tag-filtered policies (cross-district aggregation)
  const tagFilteredPolicies = useMemo(() => {
    if (!activeTag) return [];
    return SOAPBOX_POLICIES.filter((p) =>
      p.tags.some((t) => t.toLowerCase() === activeTag.toLowerCase()) ||
      p.themeName.includes(activeTag) ||
      p.title.includes(activeTag)
    );
  }, [activeTag]);

  // Districts that match active tag
  const matchingDistrictIds = useMemo(() => {
    if (!activeTag) return new Set<TaipeiDistrict>();
    const set = new Set<TaipeiDistrict>();
    tagFilteredPolicies.forEach((p) => set.add(p.districtId));
    return set;
  }, [activeTag, tagFilteredPolicies]);

  // District progress calculation
  const currentDistrictProg = progress.getDistrictProgress(selectedDistrictId);

  // Handle Tag click
  const handleSelectTag = (tag: string) => {
    if (activeTag === tag) {
      setActiveTag(null);
    } else {
      setActiveTag(tag);
      const matching = SOAPBOX_POLICIES.filter((p) =>
        p.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
      );
      if (matching.length > 0) {
        setSelectedDistrictId(matching[0].districtId);
      }
    }
  };

  // Instant Copy Policy Summary with clean formatting (no corrupting emojis)
  const handleCopyPolicy = (policy: SoapboxPolicy) => {
    const text = buildThreadsShareText({
      districtName: policy.area,
      title: policy.title,
      citizenQuestion: policy.citizenQuestion,
      pumaQuote: policy.pumaQuote,
    });

    navigator.clipboard.writeText(text);
    setCopiedPolicyId(policy.id);
    setTimeout(() => setCopiedPolicyId(null), 2000);
  };

  // Toggle long text read expansion
  const togglePolicyExpanded = (policyId: string) => {
    setExpandedPolicyIds((prev) => {
      const next = new Set(prev);
      if (next.has(policyId)) {
        next.delete(policyId);
      } else {
        next.add(policyId);
      }
      return next;
    });
  };

  // When user opens/views district policy, automatically mark read
  const handlePolicyClick = (policyId: string) => {
    progress.markAsRead(policyId);
  };

  // Filtered policies list based on active tag or selected category from chart
  const displayedPolicies = useMemo(() => {
    if (activeTag) return tagFilteredPolicies;
    if (selectedThemeId) {
      const filtered = districtPolicies.filter((p) => p.theme === selectedThemeId);
      if (filtered.length > 0) return filtered;
    }
    return districtPolicies;
  }, [activeTag, tagFilteredPolicies, districtPolicies, selectedThemeId]);

  // Stylized SVG polygon boundaries for Taipei's 12 districts
  const districtPaths: Record<TaipeiDistrict, string> = {
    beitou: "M 80,45 L 165,25 L 225,65 L 210,125 L 130,135 L 70,85 Z",
    shilin: "M 130,135 L 210,125 L 225,65 L 290,105 L 300,165 L 235,175 L 170,170 Z",
    neihu: "M 235,175 L 300,165 L 380,155 L 420,215 L 345,235 L 265,220 Z",
    nangang: "M 345,235 L 420,215 L 460,255 L 410,295 L 325,275 Z",
    songshan: "M 245,210 L 295,200 L 345,220 L 325,265 L 255,255 Z",
    zhongshan: "M 185,175 L 235,175 L 245,210 L 255,255 L 200,250 L 185,205 Z",
    datong: "M 135,185 L 185,175 L 185,205 L 180,255 L 135,245 Z",
    zhongzheng: "M 155,255 L 205,255 L 215,315 L 165,325 L 145,285 Z",
    wanhua: "M 105,255 L 155,255 L 145,285 L 165,325 L 125,335 L 95,285 Z",
    daan: "M 205,255 L 265,255 L 275,335 L 215,330 Z",
    xinyi: "M 265,255 L 325,265 L 345,325 L 275,335 Z",
    wenshan: "M 185,330 L 275,335 L 345,325 L 355,395 L 255,435 L 185,385 Z"
  };

  return (
    <div className="py-8 bg-neutral-50/70" id="main-map-centerpiece">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Infographic Header Bar (Zero Candidate Photos, Pure Symbolic Visuals & Data) */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-orange-200/90 shadow-md flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          {/* Decorative ocean wave stream in background */}
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-linear-to-l from-orange-100/30 via-orange-50/10 to-transparent pointer-events-none" />

          {/* Left: Symbolic Ocean Currents Emblem & Infographic Title */}
          <div className="flex items-center gap-5 z-10 w-full md:w-auto">
            {/* Visual Wave Currents Graphic Emblem (No Photo) */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-linear-to-tr from-orange-600 via-orange-500 to-amber-400 p-0.5 shadow-md shrink-0 flex items-center justify-center">
              <div className="w-full h-full bg-white rounded-[14px] flex flex-col items-center justify-center text-center p-2">
                <Waves className="w-6 h-6 text-orange-600" />
                <span className="text-[10px] font-black text-neutral-900 tracking-tighter mt-0.5">
                  洋流地圖
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-orange-700 bg-orange-100 px-2.5 py-0.5 rounded-md">
                  台北市 12 行政區 · 街頭肥皂箱市民開講實錄
                </span>
                <span className="text-xs text-orange-600 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                  HEART 五大政策核心
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
                市長你給我聽好，街頭肥皂箱整理
              </h1>
              <p className="text-xs sm:text-sm text-neutral-600 mt-1 max-w-xl leading-relaxed">
                全面整理現場上台開講市民之身分背景與尖銳提問，結合沈伯洋具體政策回答、三大落地方針與法規承諾。點選 12 行政區互動地圖即時探索！
              </p>
            </div>
          </div>

          {/* Right: Infographic Progress Summary Badge */}
          <div className="w-full md:w-auto bg-neutral-50/80 p-4 rounded-2xl border border-neutral-200/80 z-10 flex flex-col justify-between min-w-[240px]">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-bold text-neutral-800 flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5 text-orange-600" />
                <span>全站政見探索度</span>
              </span>
              <span className="font-mono font-bold text-orange-600 tabular-nums">
                {progress.overallPercent}%
              </span>
            </div>

            {/* Visual Mini Progress Bar */}
            <div className="w-full bg-neutral-200 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-linear-to-r from-orange-500 to-teal-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.max(progress.overallPercent, 3)}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-neutral-500 mt-2">
              <span>已解鎖 {progress.readCount} / {progress.totalCount} 則</span>
              <span className="font-semibold text-neutral-700">{progress.currentTier.badge}</span>
            </div>
          </div>
        </div>

        {/* Category Tag Cloud with Visual Reading Progress Bars */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-neutral-200/90 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs text-neutral-600">
            <span className="font-bold flex items-center gap-1.5 text-neutral-900">
              <Tag className="w-3.5 h-3.5 text-orange-600" />
              <span>政策類別標籤（附探索進度條，點選可跨區整合查詢）：</span>
            </span>
            {activeTag && (
              <button
                onClick={() => setActiveTag(null)}
                className="text-xs font-semibold text-orange-600 hover:text-orange-800 cursor-pointer underline"
              >
                清除標籤篩選，回到區域檢視
              </button>
            )}
          </div>

          {/* Tags with Visual Progress indicators */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTag(null)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTag === null
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
              }`}
            >
              全部區域總覽
            </button>

            {CATEGORY_TAGS.map((tag) => {
              const isActive = activeTag === tag;
              const catProg = progress.getCategoryProgress(tag);

              return (
                <button
                  key={tag}
                  onClick={() => handleSelectTag(tag)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 border ${
                    isActive
                      ? 'bg-orange-500 text-white border-orange-600 shadow-xs scale-102 ring-2 ring-orange-200'
                      : 'bg-neutral-50 hover:bg-orange-50/80 hover:text-orange-900 text-neutral-700 border-neutral-200/80'
                  }`}
                >
                  <span>#{tag}</span>
                  {/* Category Progress Chip */}
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono tabular-nums ${
                      isActive
                        ? 'bg-orange-700/60 text-white'
                        : catProg.percent === 100
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-neutral-200/80 text-neutral-600'
                    }`}
                    title={`該類別已讀 ${catProg.read}/${catProg.total}`}
                  >
                    {catProg.percent === 100 ? '✓' : `${catProg.percent}%`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Centerpiece Layout: Left Visual Interactive Map (6 cols), Right District Policy Panel (6 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Visual Map Centerpiece */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200/90 shadow-sm flex flex-col items-center">
            
            {/* Map Header Status & District Progress Bar */}
            <div className="w-full flex flex-col gap-2 mb-3">
              <div className="flex items-center justify-between text-xs text-neutral-500">
                <div className="flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-orange-600" />
                  <span className="font-bold text-neutral-900">
                    {activeTag ? `標籤【#${activeTag}】涵蓋行政區` : `點擊地圖區塊探索該區政見`}
                  </span>
                </div>
                <span className="font-bold text-orange-600">
                  目前選定：{selectedDistrict.name}
                </span>
              </div>

              {/* Selected District Progress Bar */}
              <div className="bg-orange-50/80 p-2.5 rounded-xl border border-orange-200/60 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-orange-600" />
                  <span className="font-bold text-neutral-900">
                    {selectedDistrict.name} 探索進度：
                  </span>
                  <div className="w-24 bg-neutral-200 rounded-full h-2 overflow-hidden inline-block ml-1">
                    <div
                      className="bg-orange-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${currentDistrictProg.percent}%` }}
                    />
                  </div>
                </div>
                <span className="font-mono font-bold text-orange-800 tabular-nums">
                  {currentDistrictProg.read} / {currentDistrictProg.total} 已讀 ({currentDistrictProg.percent}%)
                </span>
              </div>
            </div>

            {/* Mobile Direct District Selector (Optimized for one-hand smartphone tapping) */}
            <div className="w-full sm:hidden mb-3">
              <span className="text-[11px] font-bold text-neutral-500 block mb-1.5">
                📱 手機快捷選區（點選即看）：
              </span>
              <div className="grid grid-cols-4 gap-1.5">
                {TAIPEI_DISTRICTS.map((d) => {
                  const isSelected = selectedDistrictId === d.id;
                  const dProg = progress.getDistrictProgress(d.id);
                  return (
                    <button
                      key={d.id}
                      onClick={() => handleDistrictChange(d.id)}
                      className={`py-2 px-1 rounded-xl text-center text-xs font-bold transition-all cursor-pointer flex flex-col items-center justify-center ${
                        isSelected
                          ? 'bg-orange-600 text-white shadow-xs scale-102'
                          : 'bg-neutral-100 text-neutral-800 hover:bg-orange-50'
                      }`}
                    >
                      <span>{d.name.replace('區', '')}</span>
                      <span className={`text-[9px] font-mono ${isSelected ? 'text-orange-200' : 'text-neutral-400'}`}>
                        {dProg.percent === 100 ? '✓' : `${dProg.percent}%`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Stylized Responsive Map Canvas */}
            <div className="w-full aspect-4/3 relative flex items-center justify-center p-3 bg-neutral-50/70 rounded-2xl border border-neutral-200/80 shadow-inner">
              <svg
                viewBox="50 10 420 435"
                className="w-full h-full drop-shadow-sm select-none"
              >
                {/* River waterlines: Tamsui River and Keelung River (淡水河、基隆河) */}
                <path
                  d="M 60,185 Q 190,130 350,225 T 460,305"
                  fill="none"
                  stroke="#BAE6FD"
                  strokeWidth="5"
                  opacity="0.8"
                  strokeLinecap="round"
                />
                <path
                  d="M 80,325 Q 240,285 410,385"
                  fill="none"
                  stroke="#BAE6FD"
                  strokeWidth="4"
                  opacity="0.6"
                  strokeLinecap="round"
                />

                {/* Render District Polygons */}
                {TAIPEI_DISTRICTS.map((d) => {
                  const isSelected = selectedDistrictId === d.id;
                  const isHovered = hoveredDistrictId === d.id;
                  const matchesTag = activeTag ? matchingDistrictIds.has(d.id) : false;
                  const dProg = progress.getDistrictProgress(d.id);
                  const isFullyRead = dProg.percent === 100;
                  const path = districtPaths[d.id];

                  // Fill color logic
                  let fillColor = '#FED7AA'; // Default warm cream
                  if (isSelected) {
                    fillColor = '#FF6B00'; // Active selection
                  } else if (matchesTag) {
                    fillColor = '#FB923C'; // Tag match glowing
                  } else if (isHovered) {
                    fillColor = '#FDBA74';
                  } else if (activeTag && !matchesTag) {
                    fillColor = '#F5F5F4'; // Subtle fade when tag is filtered
                  }

                  return (
                    <g
                      key={d.id}
                      onClick={() => handleDistrictChange(d.id)}
                      onMouseEnter={() => setHoveredDistrictId(d.id)}
                      onMouseLeave={() => setHoveredDistrictId(null)}
                      className="cursor-pointer transition-transform duration-150"
                    >
                      <path
                        d={path}
                        fill={fillColor}
                        stroke={isSelected ? '#9A3412' : matchesTag ? '#EA580C' : '#FFFFFF'}
                        strokeWidth={isSelected ? '3.5' : matchesTag ? '2.5' : '1.8'}
                        className="transition-colors duration-200"
                        style={{
                          filter: isSelected
                            ? 'drop-shadow(0 4px 8px rgba(234, 88, 12, 0.35))'
                            : matchesTag
                            ? 'drop-shadow(0 2px 4px rgba(249, 115, 22, 0.25))'
                            : 'none'
                        }}
                      />

                      {/* District Station Pulse Point */}
                      {(isSelected || matchesTag) && (
                        <circle
                          cx={d.cx}
                          cy={d.cy - 12}
                          r="4"
                          fill="#FFFFFF"
                          stroke={isSelected ? '#9A3412' : '#EA580C'}
                          strokeWidth="2"
                        />
                      )}

                      {/* Read Status Checkmark Marker on Map */}
                      {isFullyRead && (
                        <circle
                          cx={d.cx + 18}
                          cy={d.cy - 10}
                          r="5"
                          fill="#10B981"
                          stroke="#FFFFFF"
                          strokeWidth="1.5"
                        />
                      )}

                      {/* District Text Name */}
                      <text
                        x={d.cx}
                        y={d.cy + 2}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill={isSelected ? '#FFFFFF' : matchesTag ? '#431407' : activeTag ? '#A8A29E' : '#7C2D12'}
                        fontSize="13"
                        fontWeight={isSelected || matchesTag ? '900' : '700'}
                        pointerEvents="none"
                      >
                        {d.name.replace('區', '')}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Quick District Buttons Row with Individual Visual Progress Bars */}
            <div className="w-full mt-4 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {TAIPEI_DISTRICTS.map((d) => {
                const isSelected = selectedDistrictId === d.id;
                const matchesTag = activeTag ? matchingDistrictIds.has(d.id) : false;
                const dProg = progress.getDistrictProgress(d.id);

                return (
                  <button
                    key={d.id}
                    onClick={() => handleDistrictChange(d.id)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-orange-600 text-white shadow-xs'
                        : matchesTag
                        ? 'bg-orange-100 text-orange-900 border border-orange-300 font-bold'
                        : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                    }`}
                  >
                    <span>{d.name}</span>
                    {/* Visual District Mini Progress Indicator */}
                    <span
                      className={`text-[10px] px-1 py-0.2 rounded font-mono ${
                        isSelected
                          ? 'bg-orange-800 text-white'
                          : dProg.percent === 100
                          ? 'bg-emerald-100 text-emerald-800 font-bold'
                          : 'bg-neutral-200 text-neutral-500'
                      }`}
                    >
                      {dProg.percent === 100 ? '✓' : `${dProg.percent}%`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Policies Panel (Direct in-place exploration) */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* Condition A: Cross-District Tag Aggregation Mode */}
            {activeTag && (
              <div className="bg-orange-500 text-white rounded-3xl p-5 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-orange-100">
                    <Filter className="w-3.5 h-3.5" />
                    <span>標籤跨區整合模式</span>
                  </div>
                  <button
                    onClick={() => setActiveTag(null)}
                    className="text-xs bg-white/20 hover:bg-white/30 text-white px-2.5 py-1 rounded-lg cursor-pointer"
                  >
                    返回區域檢視
                  </button>
                </div>
                <h3 className="text-xl font-black">
                  #{activeTag} · 跨區政見整合
                </h3>
                <p className="text-xs text-orange-100 leading-relaxed">
                  目前已為您整合涵蓋此標籤的全部行政區政見（共 {tagFilteredPolicies.length} 則政見）。
                </p>
              </div>
            )}

            {/* Condition B: District Header Info with District Progress Bar & Category Chart */}
            {!activeTag && (
              <div className="space-y-4">
                <div className="bg-white rounded-3xl p-5 sm:p-6 border border-neutral-200/90 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-orange-600">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{selectedDistrict.location} · 核心地標：{selectedDistrict.landmark}</span>
                    </div>
                    <span className="text-xs text-neutral-400 font-mono uppercase">{selectedDistrict.enName}</span>
                  </div>

                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h2 className="text-2xl font-black text-neutral-900 tracking-tight">
                      {selectedDistrict.name} · 街頭肥皂箱開講實錄與市政解方
                    </h2>

                    {/* District Progress Badge */}
                    <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 px-3 py-1 rounded-xl text-xs">
                      <Award className="w-3.5 h-3.5 text-orange-600" />
                      <span className="font-bold text-orange-950 font-mono">
                        該區已讀：{currentDistrictProg.read}/{currentDistrictProg.total} ({currentDistrictProg.percent}%)
                      </span>
                    </div>
                  </div>

                  {/* Concise Bullet Points Summary (清楚簡潔列點 · 提升吸收與舒適度) */}
                  <div className="bg-orange-50/50 rounded-2xl p-4 border border-orange-100 text-xs space-y-2">
                    <div className="flex items-center gap-1.5 font-bold text-orange-950">
                      <ListOrdered className="w-3.5 h-3.5 text-orange-600" />
                      <span>行政區現況要點整理：</span>
                    </div>
                    <ul className="space-y-1.5 text-neutral-700">
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0" />
                        <span><strong>在地特色：</strong>{selectedDistrict.features}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                        <span><strong>急迫課題：</strong>{selectedDistrict.keyIssues}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                        <span><strong>核心方針：</strong>以制度化、透明化與人本安全優先，有憑有據推動自治條例，拒絕口號治理。</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Interactive District Policy Category Breakdown Chart (長條圖 / 雷達圖切換) */}
                <DistrictPolicyChart
                  district={selectedDistrict}
                  policies={districtPolicies}
                  selectedThemeId={selectedThemeId}
                  onSelectTheme={(themeId) => setSelectedThemeId(themeId)}
                />

                {/* Category Filter active pill */}
                {selectedThemeId && (
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-orange-100/70 border border-orange-200 text-xs">
                    <div className="flex items-center gap-2">
                      <Filter className="w-3.5 h-3.5 text-orange-700" />
                      <span className="font-bold text-orange-900">
                        目前已依圖表篩選類別：{POLICY_THEMES.find((t) => t.id === selectedThemeId)?.name}
                      </span>
                    </div>
                    <button
                      onClick={() => setSelectedThemeId(null)}
                      className="text-[11px] font-bold text-orange-700 hover:text-orange-950 underline cursor-pointer"
                    >
                      顯示全部類別
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* List of Policies: Minimalist Storytelling by default + Click to expand full detail */}
            <div className="space-y-4">
              {displayedPolicies.map((policy) => {
                const isExpanded = expandedPolicyIds.has(policy.id);
                const isFaqOpen = expandedFaqPolicyId === policy.id;
                const isCopied = copiedPolicyId === policy.id;
                const isRead = progress.isRead(policy.id);

                return (
                  <div
                    key={policy.id}
                    onClick={() => handlePolicyClick(policy.id)}
                    className={`bg-white rounded-3xl p-6 border transition-all duration-200 space-y-4 ${
                      isRead
                        ? 'border-orange-200/90 shadow-2xs'
                        : 'border-neutral-200/90 hover:border-orange-300 shadow-sm'
                    }`}
                  >
                    {/* Header Badges & Read Toggle Button */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-md bg-orange-100 text-orange-800 text-xs font-bold">
                          {policy.area}
                        </span>
                        <span className="text-xs text-neutral-500 font-medium">
                          {policy.station}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 text-xs font-bold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                          <span>{policy.themeName}</span>
                        </span>
                      </div>

                      {/* Visual Read Status Toggle Badge */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          progress.toggleRead(policy.id);
                        }}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isRead
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-neutral-100 hover:bg-orange-50 text-neutral-600 hover:text-orange-700'
                        }`}
                        title="點擊切換已讀/未讀狀態"
                      >
                        {isRead ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>已解鎖閱讀</span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-3.5 h-3.5 text-neutral-400" />
                            <span>標記為已讀</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Policy Title & Crisp Summary */}
                    <div>
                      <h3 className="text-lg sm:text-xl font-black text-neutral-900 leading-snug">
                        {policy.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-neutral-600 mt-1.5 leading-relaxed">
                        {policy.summary}
                      </p>
                    </div>

                    {/* Citizen Question Box (極簡清晰原音呈現) */}
                    <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200/70 text-xs space-y-1.5">
                      <div className="flex items-center gap-1.5 font-bold text-amber-900">
                        <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
                        <span>市民現場發問 ({policy.citizenName} · {policy.citizenRole})：</span>
                      </div>
                      <blockquote className="italic text-neutral-800 leading-relaxed font-medium">
                        「{policy.citizenQuestion}」
                      </blockquote>
                    </div>

                    {/* Puma's Crisp Response Quote (沈伯洋核心解方金句 · 一目瞭然引起興趣) */}
                    <div className="bg-orange-50/70 p-4 rounded-2xl border border-orange-200/80 text-xs space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold text-[10px]">
                          答
                        </div>
                        <span className="font-bold text-neutral-900">沈伯洋核心承諾：</span>
                      </div>
                      <p className="font-black text-orange-950 text-sm leading-snug pl-1">
                        {policy.pumaQuote}
                      </p>
                    </div>

                    {/* Expandable Long-Form Details: 點選展開長文，兼顧極簡視讀與深度了解 */}
                    <div className="pt-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePolicyExpanded(policy.id);
                        }}
                        className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                          isExpanded
                            ? 'bg-orange-100 text-orange-950 border border-orange-200'
                            : 'bg-neutral-100/90 hover:bg-orange-50 text-neutral-700 hover:text-orange-900 border border-neutral-200/80'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <CheckSquare className="w-4 h-4 text-orange-600" />
                          <span>
                            {isExpanded
                              ? '收合詳細方案與法規依據 ▴'
                              : '點此看完整三大具體落地方針、法規依據與QA (展開長文) ▾'}
                          </span>
                        </span>
                        <span className="text-[11px] font-mono text-neutral-400">
                          {isExpanded ? '收合' : '詳細閱讀'}
                        </span>
                      </button>

                      {/* Long-form detailed section when expanded */}
                      {isExpanded && (
                        <div className="mt-3 p-4 bg-orange-50/40 rounded-2xl border border-orange-200/70 space-y-3.5 animate-in fade-in duration-200">
                          <div className="text-[11px] font-bold text-orange-900 flex items-center gap-1">
                            <CheckSquare className="w-3.5 h-3.5 text-orange-600" />
                            <span>具體落地解方與實施步驟（清楚列點）：</span>
                          </div>

                          <ul className="space-y-2 text-neutral-700">
                            {policy.solutions.map((sol, idx) => (
                              <li
                                key={idx}
                                className="flex items-start gap-2.5 bg-white p-3 rounded-xl border border-orange-200/60 shadow-2xs"
                              >
                                <span className="w-5 h-5 rounded-md bg-orange-600 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                                  0{idx + 1}
                                </span>
                                <div className="space-y-0.5 text-xs">
                                  <span className="text-neutral-900 font-bold block">
                                    {sol.point}
                                  </span>
                                  <p className="text-neutral-600 leading-relaxed">
                                    {sol.detail}
                                  </p>
                                </div>
                              </li>
                            ))}
                          </ul>

                          {/* Grounding & Legal Source Note */}
                          <div className="pt-2 border-t border-orange-200/60 text-xs text-neutral-600 space-y-1">
                            <p>
                              <strong className="text-orange-950">法規與行政推動依據：</strong>
                              {policy.groundingDetail}
                            </p>
                            <p className="text-[11px] text-neutral-400 font-mono">
                              引用來源：沈伯洋公開街頭肥皂箱開講記錄 · 台北市長給我聽好
                            </p>
                          </div>

                          {/* Expandable FAQs inside long text */}
                          {policy.faqs && policy.faqs.length > 0 && (
                            <div className="pt-2 border-t border-orange-200/60">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setExpandedFaqPolicyId(isFaqOpen ? null : policy.id);
                                }}
                                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white hover:bg-neutral-50 text-xs font-bold text-neutral-800 transition-colors cursor-pointer border border-neutral-200"
                              >
                                <span className="flex items-center gap-1.5">
                                  <HelpCircle className="w-3.5 h-3.5 text-orange-600" />
                                  <span>常見問題與深入回應 ({policy.faqs.length} 則)</span>
                                </span>
                                <ChevronDown
                                  className={`w-3.5 h-3.5 transition-transform ${
                                    isFaqOpen ? 'rotate-180' : ''
                                  }`}
                                />
                              </button>

                              {isFaqOpen && (
                                <div className="mt-2 space-y-2 p-3 bg-white rounded-xl border border-neutral-200">
                                  {policy.faqs.map((faq, fIdx) => (
                                    <div key={fIdx} className="text-xs space-y-1">
                                      <p className="font-bold text-neutral-900">{faq.question}</p>
                                      <p className="text-neutral-600 bg-neutral-50 p-2.5 rounded-lg border border-neutral-200 leading-relaxed">
                                        {faq.answer}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Policy Category Tags & Clean Social Forwarding (No emoji garbling, space for discussion) */}
                    <div className="flex items-center justify-between pt-3 border-t border-neutral-100 flex-wrap gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {policy.tags.map((t, idx) => (
                          <button
                            key={idx}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectTag(t);
                            }}
                            className="text-[11px] font-semibold text-neutral-600 hover:text-orange-600 bg-neutral-100 hover:bg-orange-50 px-2 py-0.5 rounded-md transition-colors cursor-pointer"
                          >
                            #{t}
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Threads Share - Clean text without emoji distortion, space for discussion */}
                        <a
                          href={buildThreadsUrl({
                            districtName: policy.area,
                            title: policy.title,
                            citizenQuestion: policy.citizenQuestion,
                            pumaQuote: policy.pumaQuote,
                          })}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-neutral-900 hover:bg-black rounded-xl transition-all cursor-pointer active:scale-98 shadow-2xs"
                          title="在 Threads 發布討論（格式純淨不亂碼）"
                        >
                          <span className="font-mono text-xs font-bold">@</span>
                          <span>Threads 轉發討論</span>
                        </a>

                        {/* Image Card Export Button (以圖轉出 · 直覺 LINE / 社群圖卡) */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setImageModalPolicy({ policy, districtName: policy.area });
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-orange-950 bg-orange-100 hover:bg-orange-200 border border-orange-200 rounded-xl transition-all cursor-pointer active:scale-98 shadow-2xs"
                          title="產生高畫質政見圖卡傳至 LINE 或儲存"
                        >
                          <ImageIcon className="w-3.5 h-3.5 text-orange-600" />
                          <span>以圖轉出 / 傳LINE</span>
                        </button>

                        {/* LINE Share - Clean text format */}
                        <a
                          href={buildLineUrl({
                            districtName: policy.area,
                            title: policy.title,
                            citizenQuestion: policy.citizenQuestion,
                            pumaQuote: policy.pumaQuote,
                          })}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl transition-all cursor-pointer active:scale-98 shadow-2xs"
                          title="LINE 轉發純文字給好友"
                        >
                          <span className="font-bold text-[10px]">L</span>
                          <span>LINE 轉傳</span>
                        </a>

                        {/* Fast Copy Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyPolicy(policy);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-neutral-700 bg-neutral-100 hover:bg-orange-100 hover:text-orange-900 rounded-xl transition-all cursor-pointer active:scale-98"
                          title="複製極簡文字重點"
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-700">已複製</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>複製文字</span>
                            </>
                          )}
                        </button>

                        {/* Direct Jump to Dedicated Share Hub */}
                        {onNavigateToShare && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onNavigateToShare(policy.id, policy.districtId);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-orange-900 bg-orange-100/80 hover:bg-orange-200 border border-orange-300 rounded-xl transition-all cursor-pointer active:scale-98"
                            title="前往專屬轉發討論分頁"
                          >
                            <Share2 className="w-3.5 h-3.5 text-orange-700" />
                            <span>前往轉發專區 ↗</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Official Feedback CTA Banner */}
            <div className="mt-6 p-4 rounded-2xl bg-linear-to-r from-orange-500 to-amber-500 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
              <div>
                <p className="text-xs sm:text-sm font-black">
                  如果有其他市政建議想提出？
                </p>
                <p className="text-[11px] text-orange-100 mt-0.5">
                  請至官方「市長，你給我聽好」留言：<span className="font-mono underline font-bold">https://puma.taipei/taipeispeaksup</span>
                </p>
              </div>
              <a
                href="https://puma.taipei/taipeispeaksup"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-xl bg-white text-orange-700 hover:bg-orange-50 font-black text-xs transition-colors shrink-0 flex items-center gap-1 shadow-2xs self-end sm:self-auto cursor-pointer"
              >
                <span>前往官方留言 ↗</span>
              </a>
            </div>
          </div>
        </div>

        {/* Policy Image Share Card Modal (以圖轉出 · 直覺 LINE 分享) */}
        <PolicyImageModal
          isOpen={!!imageModalPolicy}
          onClose={() => setImageModalPolicy(null)}
          policy={imageModalPolicy?.policy || null}
          districtName={imageModalPolicy?.districtName || ''}
        />

      </div>
    </div>
  );
};
