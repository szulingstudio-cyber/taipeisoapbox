import React, { useState, useMemo, useEffect } from 'react';
import { 
  Share2, 
  MapPin, 
  MessageCircle, 
  Copy, 
  Check, 
  Download, 
  Image as ImageIcon, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Filter,
  CheckSquare,
  Search,
  Compass,
  Building2,
  Navigation,
  HeartPulse,
  ShieldAlert,
  Cpu,
  Quote,
  Edit3,
  RotateCcw
} from 'lucide-react';
import { TAIPEI_DISTRICTS, SOAPBOX_POLICIES, POLICY_THEMES } from '../data/policies';
import { TaipeiDistrict, SoapboxPolicy, PolicyTheme } from '../types';
import { buildThreadsUrl, buildLineUrl, buildThreadsShareText, buildLineShareText } from '../utils/shareFormatter';
import { generatePolicyCardBlob } from '../utils/cardImageGenerator';

interface PolicyForwardingHubProps {
  initialDistrictId?: TaipeiDistrict;
  initialPolicyId?: string;
  onSelectDistrictOnMap?: (districtId: TaipeiDistrict) => void;
}

export const PolicyForwardingHub: React.FC<PolicyForwardingHubProps> = ({
  initialDistrictId = 'shilin',
  initialPolicyId,
  onSelectDistrictOnMap,
}) => {
  // District filter: specific district or 'all'
  const [selectedDistrictId, setSelectedDistrictId] = useState<TaipeiDistrict | 'all'>(initialDistrictId);
  const [selectedThemeFilter, setSelectedThemeFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Keep in sync with incoming props
  useEffect(() => {
    if (initialDistrictId) {
      setSelectedDistrictId(initialDistrictId);
    }
  }, [initialDistrictId]);

  // Selected policy to forward
  const [selectedPolicyId, setSelectedPolicyId] = useState<string>(
    initialPolicyId || SOAPBOX_POLICIES.find((p) => p.districtId === initialDistrictId)?.id || SOAPBOX_POLICIES[0].id
  );

  useEffect(() => {
    if (initialPolicyId) {
      setSelectedPolicyId(initialPolicyId);
      const found = SOAPBOX_POLICIES.find((p) => p.id === initialPolicyId);
      if (found) {
        setSelectedDistrictId(found.districtId);
      }
    }
  }, [initialPolicyId]);

  // Filtered policies list based on District + Theme + Search
  const availablePolicies = useMemo(() => {
    return SOAPBOX_POLICIES.filter((p) => {
      // District filter
      if (selectedDistrictId !== 'all' && p.districtId !== selectedDistrictId) {
        return false;
      }
      // Theme filter
      if (selectedThemeFilter && p.theme !== selectedThemeFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchArea = p.area.toLowerCase().includes(q);
        const matchCitizen = p.citizenName.toLowerCase().includes(q) || p.citizenRole.toLowerCase().includes(q);
        const matchQuestion = p.citizenQuestion.toLowerCase().includes(q);
        const matchPuma = p.pumaQuote.toLowerCase().includes(q);
        const matchStation = p.station.toLowerCase().includes(q);
        const matchTheme = p.themeName.toLowerCase().includes(q);
        return matchTitle || matchArea || matchCitizen || matchQuestion || matchPuma || matchStation || matchTheme;
      }
      return true;
    });
  }, [selectedDistrictId, selectedThemeFilter, searchQuery]);

  // Active policy object
  const activePolicy = useMemo(() => {
    const found = SOAPBOX_POLICIES.find((p) => p.id === selectedPolicyId);
    if (found) return found;
    return availablePolicies[0] || SOAPBOX_POLICIES[0];
  }, [selectedPolicyId, availablePolicies]);

  // Active district for current policy
  const activeDistrictName = activePolicy.area;

  // Quote customization options: user can choose which part of Puma's reply to feature on the card
  const [selectedQuoteType, setSelectedQuoteType] = useState<string>('quote');
  const [customQuoteInput, setCustomQuoteInput] = useState<string>('');
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);

  // When policy changes, reset to default quote candidate
  useEffect(() => {
    setSelectedQuoteType('quote');
    setIsCustomMode(false);
    setCustomQuoteInput('');
  }, [activePolicy.id]);

  // Available candidate quotes from Puma's reply for this policy
  const quoteCandidates = useMemo(() => {
    const list = [
      {
        id: 'quote',
        title: '現場招牌金句',
        badge: '原汁原味',
        icon: '🎙️',
        desc: '沈伯洋現場開講最直率、最有力度的承諾',
        text: activePolicy.pumaQuote,
      },
      {
        id: 'summary',
        title: '核心解方精要',
        badge: '解題重點',
        icon: '💡',
        desc: '高度提煉的關鍵政策解題方向與制度解方',
        text: activePolicy.pumaSummary,
      },
      {
        id: 'sol1',
        title: '落地方針第一步',
        badge: '首要步驟',
        icon: '🚀',
        desc: activePolicy.solutions[0]?.point || '首要落地方針',
        text: activePolicy.solutions[0] ? `【${activePolicy.solutions[0].point}】${activePolicy.solutions[0].detail}` : '',
      },
      {
        id: 'sol2',
        title: '落地方針第二步',
        badge: '配套執行',
        icon: '📌',
        desc: activePolicy.solutions[1]?.point || '配套執行策略',
        text: activePolicy.solutions[1] ? `【${activePolicy.solutions[1].point}】${activePolicy.solutions[1].detail}` : '',
      },
      {
        id: 'threads',
        title: '社群犀利引言',
        badge: '討論亮點',
        icon: '📢',
        desc: '適合 Threads 及年輕族群引發公共議題辯論之摘要',
        text: activePolicy.threadsExcerpt || activePolicy.pumaQuote,
      },
      {
        id: 'grounding',
        title: '法規行政承諾',
        badge: '制度保障',
        icon: '⚖️',
        desc: '結合地方自治法規與行政推動步驟之嚴謹承諾',
        text: activePolicy.groundingDetail || activePolicy.pumaSummary,
      },
    ];
    return list.filter((item) => item.text && item.text.trim().length > 0);
  }, [activePolicy]);

  // Derived current quote text to display in preview and render onto canvas
  const currentQuoteText = useMemo(() => {
    if (isCustomMode && customQuoteInput.trim().length > 0) {
      return customQuoteInput.trim();
    }
    const matched = quoteCandidates.find((c) => c.id === selectedQuoteType);
    return matched?.text || activePolicy.pumaQuote;
  }, [isCustomMode, customQuoteInput, selectedQuoteType, quoteCandidates, activePolicy]);

  // Active forwarding format view: 'image' (圖卡) | 'line' (LINE文字) | 'threads' (Threads討論)
  const [shareTab, setShareTab] = useState<'image' | 'line' | 'threads'>('image');

  // Image generation state
  const [cardImageUrl, setCardImageUrl] = useState<string | null>(null);
  const [cardImageBlob, setCardImageBlob] = useState<Blob | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState<boolean>(false);
  const [copiedImage, setCopiedImage] = useState<boolean>(false);
  const [copiedText, setCopiedText] = useState<boolean>(false);

  // Generate image whenever active policy or quote changes
  useEffect(() => {
    let isMounted = true;
    setIsGeneratingImage(true);
    generatePolicyCardBlob({
      districtName: activeDistrictName,
      policy: activePolicy,
      customQuote: currentQuoteText,
    })
      .then((blob) => {
        if (!isMounted) return;
        setCardImageBlob(blob);
        const url = URL.createObjectURL(blob);
        setCardImageUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return url;
        });
        setIsGeneratingImage(false);
      })
      .catch((err) => {
        console.error('Failed to generate image', err);
        if (isMounted) setIsGeneratingImage(false);
      });

    return () => {
      isMounted = false;
    };
  }, [activePolicy, activeDistrictName, currentQuoteText]);

  // When switching district, update selected policy to first in that district
  const handleSelectDistrict = (dId: TaipeiDistrict | 'all') => {
    setSelectedDistrictId(dId);
    if (dId !== 'all') {
      const inDist = SOAPBOX_POLICIES.filter((p) => p.districtId === dId);
      if (inDist.length > 0) {
        setSelectedPolicyId(inDist[0].id);
      }
      if (onSelectDistrictOnMap) {
        onSelectDistrictOnMap(dId);
      }
    }
  };

  // Download image
  const handleDownloadImage = () => {
    if (!cardImageUrl) return;
    const a = document.createElement('a');
    a.href = cardImageUrl;
    a.download = `沈伯洋台北市政見圖卡-${activeDistrictName}-${activePolicy.id}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Copy image to clipboard
  const handleCopyImage = async () => {
    if (!cardImageBlob) return;
    try {
      // @ts-ignore
      await navigator.clipboard.write([
        new ClipboardItem({
          'image/png': cardImageBlob,
        }),
      ]);
      setCopiedImage(true);
      setTimeout(() => setCopiedImage(false), 2200);
    } catch (err) {
      console.warn('Clipboard write image not supported, downloading instead', err);
      handleDownloadImage();
    }
  };

  // Copy clean plain text
  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2200);
  };

  // Formatted Texts (Clean, zero corrupting emojis, designed for civic discussion)
  const lineShareText = useMemo(() => {
    return buildLineShareText({
      districtName: activeDistrictName,
      title: activePolicy.title,
      citizenQuestion: activePolicy.citizenQuestion,
      pumaQuote: currentQuoteText,
    });
  }, [activeDistrictName, activePolicy, currentQuoteText]);

  const lineShareUrl = useMemo(() => {
    return buildLineUrl({
      districtName: activeDistrictName,
      title: activePolicy.title,
      citizenQuestion: activePolicy.citizenQuestion,
      pumaQuote: currentQuoteText,
    });
  }, [activeDistrictName, activePolicy, currentQuoteText]);

  const threadsShareText = useMemo(() => {
    return buildThreadsShareText({
      districtName: activeDistrictName,
      title: activePolicy.title,
      citizenQuestion: activePolicy.citizenQuestion,
      pumaQuote: currentQuoteText,
    });
  }, [activeDistrictName, activePolicy, currentQuoteText]);

  const threadsShareUrl = useMemo(() => {
    return buildThreadsUrl({
      districtName: activeDistrictName,
      title: activePolicy.title,
      citizenQuestion: activePolicy.citizenQuestion,
      pumaQuote: currentQuoteText,
    });
  }, [activeDistrictName, activePolicy, currentQuoteText]);

  return (
    <div className="py-8 bg-neutral-50/60" id="share-hub-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-orange-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-linear-to-tr from-orange-600 via-orange-500 to-amber-400 p-0.5 shadow-md shrink-0 flex items-center justify-center">
              <div className="w-full h-full bg-white rounded-[14px] flex flex-col items-center justify-center text-center p-2">
                <Share2 className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-xs font-bold text-orange-700 bg-orange-100 px-2.5 py-0.5 rounded-md">
                  獨立專屬分頁 · 社群轉發與討論工坊
                </span>
                <span className="text-xs text-neutral-500">
                  台北 12 行政區 36 則肥皂箱實錄自由選擇 · 零亂碼保證
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
                政見轉發與社群討論中心
              </h1>
              <p className="text-xs sm:text-sm text-neutral-600 mt-1 max-w-2xl leading-relaxed">
                全面收錄「市長你給我聽好」各區上台民眾發問與沈伯洋解方。支援<strong>「LINE 以圖轉出」</strong>、<strong>「LINE 純文字轉傳」</strong>與<strong>「Threads 轉發討論」</strong>，以清晰純淨文字呈現，預留市民交流空間！
              </p>
            </div>
          </div>

          <div className="text-xs text-neutral-600 bg-orange-50/80 p-3.5 rounded-2xl border border-orange-200 flex flex-col gap-1.5 shrink-0">
            <span className="font-bold text-orange-950 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-orange-600" />
              <span>本機極速繪製 · 隱私安全</span>
            </span>
            <span className="text-neutral-500 text-[11px]">完全無需登入 · 絕不收集任何個人資料</span>
          </div>
        </div>

        {/* STEP 1: District & Thematic Selector */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-neutral-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-orange-600 text-white flex items-center justify-center font-mono font-bold text-xs">
                1
              </span>
              <h2 className="text-sm sm:text-base font-black text-neutral-900">
                第一步：直覺選擇行政區或搜尋政見（12 行政區 36 則開講實錄皆可選）
              </h2>
            </div>
            <div className="text-xs text-neutral-500 font-mono flex items-center gap-2">
              <span>當前選擇範圍：</span>
              <span className="font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200">
                {selectedDistrictId === 'all' ? '全台北市 (12 區全覽)' : `【${TAIPEI_DISTRICTS.find(d => d.id === selectedDistrictId)?.name || '士林區'}】`}
              </span>
            </div>
          </div>

          {/* Quick Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="快速搜尋：輸入關鍵字（例如：社宅、內科、長照、人行道、公托、防災、陳先生...）"
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs sm:text-sm text-neutral-800 placeholder-neutral-400 focus:outline-hidden focus:border-orange-500 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-700 cursor-pointer"
              >
                清除
              </button>
            )}
          </div>

          {/* 12 Districts Grid + "All" option */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
            {/* All districts pill */}
            <button
              onClick={() => handleSelectDistrict('all')}
              className={`p-3 rounded-2xl text-left transition-all cursor-pointer border flex flex-col justify-between ${
                selectedDistrictId === 'all'
                  ? 'bg-neutral-900 text-white border-neutral-950 shadow-sm font-bold scale-102'
                  : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-800 border-neutral-200/80'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-black text-sm">全台北市</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                  selectedDistrictId === 'all' ? 'bg-neutral-700 text-white' : 'bg-neutral-200 text-neutral-600'
                }`}>
                  36 則
                </span>
              </div>
              <span className={`text-[10px] line-clamp-1 ${
                selectedDistrictId === 'all' ? 'text-neutral-300' : 'text-neutral-500'
              }`}>
                全部肥皂箱實錄
              </span>
            </button>

            {/* 12 individual districts */}
            {TAIPEI_DISTRICTS.map((d) => {
              const isSelected = selectedDistrictId === d.id;
              const policyCount = SOAPBOX_POLICIES.filter((p) => p.districtId === d.id).length;

              return (
                <button
                  key={d.id}
                  onClick={() => handleSelectDistrict(d.id)}
                  className={`p-3 rounded-2xl text-left transition-all cursor-pointer border flex flex-col justify-between ${
                    isSelected
                      ? 'bg-orange-600 text-white border-orange-700 shadow-sm scale-102 font-bold'
                      : 'bg-neutral-50 hover:bg-orange-50/80 text-neutral-800 border-neutral-200/80 hover:border-orange-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-black text-sm">{d.name}</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                      isSelected ? 'bg-orange-800 text-orange-100' : 'bg-neutral-200 text-neutral-600'
                    }`}>
                      {policyCount} 則
                    </span>
                  </div>
                  <span className={`text-[10px] line-clamp-1 ${
                    isSelected ? 'text-orange-100' : 'text-neutral-500'
                  }`}>
                    {d.landmark.split('/')[0]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Thematic Filter Pills (Single clear primary categories) */}
          <div className="pt-2 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            <span className="text-neutral-400 font-medium shrink-0 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-orange-500" />
              <span>依領域分類篩選：</span>
            </span>
            <button
              onClick={() => setSelectedThemeFilter(null)}
              className={`px-3 py-1 rounded-xl font-medium transition-all cursor-pointer whitespace-nowrap text-xs ${
                selectedThemeFilter === null
                  ? 'bg-neutral-900 text-white font-bold'
                  : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
              }`}
            >
              全部領域
            </button>
            {POLICY_THEMES.map((theme) => {
              const isSelected = selectedThemeFilter === theme.id;
              const countInFilter = SOAPBOX_POLICIES.filter((p) => {
                if (selectedDistrictId !== 'all' && p.districtId !== selectedDistrictId) return false;
                return p.theme === theme.id;
              }).length;

              return (
                <button
                  key={theme.id}
                  onClick={() => {
                    setSelectedThemeFilter(isSelected ? null : theme.id);
                  }}
                  className={`px-3 py-1 rounded-xl font-medium transition-all cursor-pointer whitespace-nowrap text-xs flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-orange-600 text-white font-bold shadow-xs'
                      : 'bg-neutral-100 hover:bg-orange-50 text-neutral-700 hover:text-orange-900'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.accentColor }} />
                  <span>{theme.name}</span>
                  <span className="text-[10px] opacity-75">({countInFilter})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* STEP 2: Policy Selection & Forwarding Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column (5 cols): Policy Selector List */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-5 border border-neutral-200/90 shadow-2xs space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-orange-600 text-white flex items-center justify-center font-mono font-bold text-xs">
                  2
                </span>
                <h3 className="text-sm font-black text-neutral-900">
                  第二步：點選想轉發的政見
                </h3>
              </div>
              <span className="text-xs text-orange-600 font-mono font-bold">
                共符合 {availablePolicies.length} 則
              </span>
            </div>

            <div className="space-y-3 max-h-[680px] overflow-y-auto pr-1">
              {availablePolicies.length === 0 ? (
                <div className="p-8 text-center text-xs text-neutral-400 space-y-2">
                  <p>未找到符合條件的政見。</p>
                  <button
                    onClick={() => {
                      setSelectedDistrictId('all');
                      setSelectedThemeFilter(null);
                      setSearchQuery('');
                    }}
                    className="text-orange-600 underline font-bold cursor-pointer"
                  >
                    重置所有篩選條件
                  </button>
                </div>
              ) : (
                availablePolicies.map((p) => {
                  const isSelected = activePolicy.id === p.id;

                  return (
                    <div
                      key={p.id}
                      onClick={() => setSelectedPolicyId(p.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer text-left space-y-2.5 ${
                        isSelected
                          ? 'border-orange-500 bg-orange-50/70 shadow-sm ring-2 ring-orange-300'
                          : 'border-neutral-200/90 bg-neutral-50/40 hover:bg-neutral-100 hover:border-neutral-300'
                      }`}
                    >
                      {/* District & Single Primary Category Badge */}
                      <div className="flex items-center justify-between gap-1 text-xs">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-2 py-0.5 rounded-md bg-orange-100 text-orange-800 font-bold text-[11px]">
                            {p.area}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-neutral-200/80 text-neutral-700 font-bold text-[11px]">
                            {p.themeName}
                          </span>
                        </div>
                        <span className="text-[10px] text-neutral-400 line-clamp-1 max-w-[130px]">
                          {p.station.split('/')[0]}
                        </span>
                      </div>

                      {/* Policy Title */}
                      <h4 className="text-sm font-black text-neutral-900 leading-snug">
                        {p.title}
                      </h4>

                      {/* Citizen on stage */}
                      <div className="text-[11px] text-neutral-700 bg-white/90 p-2.5 rounded-xl border border-neutral-200/60 leading-relaxed space-y-1">
                        <div className="font-bold text-orange-950 flex items-center gap-1">
                          <span>🎤 上台發問市民：</span>
                          <span className="text-neutral-900">{p.citizenName}</span>
                          <span className="text-neutral-400 font-normal">({p.citizenRole})</span>
                        </div>
                        <p className="text-neutral-600 line-clamp-2 italic">
                          「{p.citizenQuestion}」
                        </p>
                      </div>

                      {/* Puma solution quote snippet */}
                      <div className="text-[11px] text-orange-900 bg-orange-100/60 p-2 rounded-lg line-clamp-1 font-medium">
                        💡 <strong>沈伯洋回覆：</strong>{p.pumaQuote}
                      </div>

                      <div className="flex items-center justify-between text-[11px] font-bold pt-0.5">
                        <span className={isSelected ? 'text-orange-600' : 'text-neutral-500'}>
                          {isSelected ? '✓ 目前轉發目標' : '點擊切換轉發'}
                        </span>
                        <ChevronRight className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${isSelected ? 'translate-x-1 text-orange-600' : ''}`} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column (7 cols): Forwarding Output & Action Center */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-6 border border-neutral-200/90 shadow-2xs space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-orange-600 text-white flex items-center justify-center font-mono font-bold text-xs">
                  3
                </span>
                <h3 className="text-sm font-black text-neutral-900">
                  第三步：選擇轉發管道（LINE圖卡 / LINE純文字 / Threads討論）
                </h3>
              </div>

              {/* Share Format Mode Tabs */}
              <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl text-xs font-bold">
                <button
                  onClick={() => setShareTab('image')}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                    shareTab === 'image'
                      ? 'bg-orange-600 text-white shadow-2xs'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>以圖轉出 (LINE圖卡)</span>
                </button>
                <button
                  onClick={() => setShareTab('line')}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                    shareTab === 'line'
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>LINE 純文字</span>
                </button>
                <button
                  onClick={() => setShareTab('threads')}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                    shareTab === 'threads'
                      ? 'bg-neutral-950 text-white shadow-2xs'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <span className="font-mono text-xs font-bold">@</span>
                  <span>Threads 討論</span>
                </button>
              </div>
            </div>

            {/* Currently Selected Policy Info Banner */}
            <div className="p-4 bg-orange-50/70 rounded-2xl border border-orange-200 text-xs flex items-center justify-between flex-wrap gap-2">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-orange-600 text-white font-bold text-[10px]">
                    {activePolicy.area}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white text-orange-800 font-bold text-[10px] border border-orange-200">
                    {activePolicy.themeName}
                  </span>
                  <span className="text-[11px] text-neutral-500">
                    開講點：{activePolicy.station}
                  </span>
                </div>
                <h4 className="font-black text-orange-950 text-sm sm:text-base leading-snug">
                  {activePolicy.title}
                </h4>
              </div>
            </div>

            {/* TAB 1: Image Card Generator View (LINE 最推薦) */}
            {shareTab === 'image' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="text-xs text-neutral-600 bg-neutral-50 p-3 rounded-2xl border border-neutral-200/80 leading-relaxed">
                  💡 <strong>LINE 圖片轉傳建議：</strong>將政見以清晰圖卡轉傳至 LINE 對話或群組，比長條文字更容易引起共鳴，且在所有手機螢幕皆完美呈現，<strong>完全零亂碼</strong>！
                </div>

                {/* 🌟 自定義「金句引用」預覽區域（免消耗 Token，本機 Canvas 即時渲染） */}
                <div className="bg-linear-to-b from-orange-50/40 to-amber-50/20 rounded-2xl p-4 sm:p-5 border border-orange-200/90 shadow-2xs space-y-3.5">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-orange-600 text-white flex items-center justify-center shadow-xs">
                        <Quote className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-neutral-900 flex items-center gap-2">
                          <span>自定義「金句引用」預覽區域</span>
                          <span className="text-[10px] font-bold text-orange-700 bg-orange-100 px-2 py-0.5 rounded-md">
                            沈伯洋回覆重點引言
                          </span>
                        </h4>
                        <p className="text-[11px] text-neutral-500">
                          點選以下選項，可即時替換圖卡中央的承諾引言（免消耗 Token · 本機極速重繪）：
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setIsCustomMode(!isCustomMode)}
                      className={`text-xs font-bold px-2.5 py-1 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border ${
                        isCustomMode
                          ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                          : 'bg-white hover:bg-orange-50 text-neutral-700 border-neutral-200 hover:border-orange-300'
                      }`}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>{isCustomMode ? '收起自訂輸入' : '✍️ 自訂微調引言'}</span>
                    </button>
                  </div>

                  {/* Candidate Quick Choice Pills */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {quoteCandidates.map((c) => {
                      const isSelected = !isCustomMode && selectedQuoteType === c.id;
                      return (
                        <button
                          key={c.id}
                          onClick={() => {
                            setSelectedQuoteType(c.id);
                            setIsCustomMode(false);
                          }}
                          className={`p-2.5 rounded-xl text-left transition-all cursor-pointer border flex flex-col justify-between gap-1 ${
                            isSelected
                              ? 'bg-orange-600 text-white border-orange-700 shadow-xs font-bold scale-101'
                              : 'bg-white hover:bg-orange-50/60 text-neutral-800 border-neutral-200/80 hover:border-orange-300'
                          }`}
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className="flex items-center gap-1 font-black text-xs">
                              <span>{c.icon}</span>
                              <span>{c.title}</span>
                            </span>
                            <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded ${
                              isSelected ? 'bg-orange-800 text-orange-100' : 'bg-neutral-100 text-neutral-600'
                            }`}>
                              {c.badge}
                            </span>
                          </div>
                          <span className={`text-[10px] line-clamp-1 ${
                            isSelected ? 'text-orange-100' : 'text-neutral-500'
                          }`}>
                            {c.desc}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom Text Area Input Mode */}
                  {isCustomMode && (
                    <div className="bg-white p-3 rounded-xl border border-orange-200 space-y-2 animate-in fade-in duration-150">
                      <div className="flex items-center justify-between text-xs">
                        <label className="font-bold text-neutral-800 flex items-center gap-1.5">
                          <span>自訂引言文字（建議 30~80 字，排版最清晰）：</span>
                        </label>
                        <button
                          onClick={() => {
                            setCustomQuoteInput(activePolicy.pumaQuote);
                          }}
                          className="text-[11px] text-orange-600 hover:text-orange-800 flex items-center gap-1 font-semibold cursor-pointer"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>填入現場原話</span>
                        </button>
                      </div>
                      <textarea
                        rows={3}
                        value={customQuoteInput || activePolicy.pumaQuote}
                        onChange={(e) => setCustomQuoteInput(e.target.value)}
                        placeholder="請輸入欲在圖卡上呈現的沈伯洋回覆內容重點..."
                        className="w-full p-2.5 rounded-lg bg-neutral-50 border border-neutral-200 text-xs text-neutral-800 placeholder-neutral-400 focus:outline-hidden focus:border-orange-500 focus:bg-white transition-all resize-none leading-relaxed"
                      />
                      <div className="flex items-center justify-between text-[11px] text-neutral-500">
                        <span>字數：{(customQuoteInput || activePolicy.pumaQuote).length} 字</span>
                        <span className="text-orange-600 font-bold">✓ 正在即時繪製至下方 Canvas 圖卡</span>
                      </div>
                    </div>
                  )}

                  {/* Live Quote Preview Card (即時引言預覽卡片) */}
                  <div className="bg-white p-3.5 sm:p-4 rounded-xl border-l-4 border-l-orange-500 border border-neutral-200/90 shadow-2xs space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-neutral-500">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-orange-800">
                          答 沈伯洋核心承諾與解方（圖卡預覽）：
                        </span>
                        <span className="font-mono text-[10px] text-neutral-400">
                          {currentQuoteText.length} 字
                        </span>
                      </div>
                      <span className="text-emerald-700 font-bold flex items-center gap-1 text-[10px]">
                        <Check className="w-3 h-3" />
                        <span>已同步呈現於下方圖卡</span>
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm font-bold text-neutral-900 leading-relaxed italic bg-orange-50/40 p-2.5 rounded-lg border border-orange-100">
                      「{currentQuoteText}」
                    </p>
                  </div>
                </div>

                {/* Card Canvas Preview */}
                <div className="relative rounded-2xl overflow-hidden border border-neutral-200 shadow-md bg-neutral-100 flex items-center justify-center min-h-[380px] max-h-[500px]">
                  {isGeneratingImage && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex flex-col items-center justify-center gap-2 z-10">
                      <Sparkles className="w-6 h-6 text-orange-600 animate-spin" />
                      <span className="text-xs text-neutral-600 font-medium">
                        正在繪製高畫質政見圖卡...
                      </span>
                    </div>
                  )}

                  {cardImageUrl ? (
                    <img
                      src={cardImageUrl}
                      alt={`沈伯洋台北市政見圖卡-${activeDistrictName}`}
                      className="w-full h-auto max-h-[480px] object-contain rounded-xl select-none"
                    />
                  ) : (
                    <div className="text-xs text-neutral-400 p-8 text-center">
                      正在載入圖卡預覽...
                    </div>
                  )}
                </div>

                {/* Action Buttons: Download / Copy / Open Line */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                  <button
                    onClick={handleDownloadImage}
                    className="px-4 py-3 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-98"
                  >
                    <Download className="w-4 h-4" />
                    <span>下載圖卡 (PNG)</span>
                  </button>

                  <button
                    onClick={handleCopyImage}
                    className="px-4 py-3 rounded-2xl bg-neutral-100 hover:bg-orange-50 text-neutral-800 hover:text-orange-950 font-black text-xs flex items-center justify-center gap-2 border border-neutral-200 transition-all cursor-pointer active:scale-98"
                  >
                    {copiedImage ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span className="text-emerald-700">圖卡已複製！</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>複製圖卡圖片</span>
                      </>
                    )}
                  </button>

                  <a
                    href={lineShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-98"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>打開 LINE 轉發</span>
                  </a>
                </div>
              </div>
            )}

            {/* TAB 2: LINE Plain Text View */}
            {shareTab === 'line' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="text-xs text-neutral-600 bg-emerald-50/70 p-3 rounded-2xl border border-emerald-200 leading-relaxed">
                  💬 <strong>LINE 格式優化：</strong>移除容易產生編碼亂碼之裝飾符號，文字分段清晰分明，點擊直接打開 LINE 轉發給好友或群組。
                </div>

                {/* Plain Text Box Preview */}
                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 font-sans text-xs leading-relaxed text-neutral-800 whitespace-pre-wrap select-all max-h-[340px] overflow-y-auto">
                  {lineShareText}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <a
                    href={lineShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-98"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>開啟 LINE 轉發文字</span>
                  </a>

                  <button
                    onClick={() => handleCopyText(lineShareText)}
                    className="px-4 py-3 rounded-2xl bg-neutral-100 hover:bg-orange-50 text-neutral-800 hover:text-orange-950 font-black text-xs flex items-center justify-center gap-2 border border-neutral-200 transition-all cursor-pointer active:scale-98"
                  >
                    {copiedText ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span className="text-emerald-700">純文字已複製！</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>複製純文字文案</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: Threads Discussion View */}
            {shareTab === 'threads' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="text-xs text-neutral-600 bg-neutral-100 p-3 rounded-2xl border border-neutral-200 leading-relaxed">
                  @ <strong>Threads 轉發討論：</strong>預留提問空間（「大家覺得這項解方在在地推行可行嗎？歡迎分享你的看法與建議！」），引導在地朋友參與討論，且無亂碼與多餘贅字。
                </div>

                {/* Plain Text Box Preview */}
                <div className="p-4 bg-neutral-900 text-neutral-100 rounded-2xl border border-neutral-800 font-sans text-xs leading-relaxed whitespace-pre-wrap select-all max-h-[340px] overflow-y-auto">
                  {threadsShareText}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <a
                    href={threadsShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-3 rounded-2xl bg-neutral-950 hover:bg-black text-white font-black text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-98 border border-neutral-800"
                  >
                    <span className="font-mono text-sm font-bold">@</span>
                    <span>在 Threads 發布轉發討論</span>
                  </a>

                  <button
                    onClick={() => handleCopyText(threadsShareText)}
                    className="px-4 py-3 rounded-2xl bg-neutral-100 hover:bg-orange-50 text-neutral-800 hover:text-orange-950 font-black text-xs flex items-center justify-center gap-2 border border-neutral-200 transition-all cursor-pointer active:scale-98"
                  >
                    {copiedText ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span className="text-emerald-700">Threads 內文已複製！</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>複製 Threads 討論文案</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer info banner */}
        <div className="p-4 rounded-2xl bg-white border border-neutral-200 text-xs text-neutral-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <span>引用來源：沈伯洋公開街頭肥皂箱發言記錄 · 台北市長給我聽好</span>
          <span className="font-mono text-[11px] text-emerald-700 font-bold">✓ 靜態安全計算 · 高效無延遲</span>
        </div>

      </div>
    </div>
  );
};
