import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  MessageSquare, 
  CheckCircle2, 
  Sparkles, 
  ArrowUpRight, 
  ShieldCheck, 
  Clock, 
  Home, 
  HeartHandshake, 
  Copy, 
  Check, 
  FileText, 
  Eye, 
  Share2, 
  Download, 
  Image as ImageIcon, 
  Quote, 
  Edit3, 
  RotateCcw, 
  MessageCircle, 
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { SOAPBOX_POLICIES } from '../data/policies';
import { SoapboxPolicy, HeartCategory, TaipeiDistrict } from '../types';
import { usePolicyProgress } from '../hooks/usePolicyProgress';
import { APP_REAL_URL, APP_LINE_URL, PUMA_SPEAKS_UP_URL } from '../config/urls';
import { buildLineUrl, buildThreadsUrl, buildLineShareText, buildThreadsShareText } from '../utils/shareFormatter';
import { generatePolicyCardBlob } from '../utils/cardImageGenerator';

interface SoapboxExplorerProps {
  onSelectDistrictOnMap: (districtId: TaipeiDistrict) => void;
  progress: ReturnType<typeof usePolicyProgress>;
  initialPolicyId?: string;
  autoOpenShare?: boolean;
}

export const SoapboxExplorer: React.FC<SoapboxExplorerProps> = ({
  onSelectDistrictOnMap,
  progress,
  initialPolicyId,
  autoOpenShare = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<HeartCategory | 'ALL'>('ALL');
  const [activePolicy, setActivePolicy] = useState<SoapboxPolicy | null>(SOAPBOX_POLICIES[0]);
  const [copiedPolicyId, setCopiedPolicyId] = useState<string | null>(null);

  // Synchronize initialPolicyId if provided from outside
  useEffect(() => {
    if (initialPolicyId) {
      const found = SOAPBOX_POLICIES.find((p) => p.id === initialPolicyId);
      if (found) {
        setActivePolicy(found);
      }
    }
  }, [initialPolicyId]);

  // Synchronize autoOpenShare when triggered from nav or buttons
  useEffect(() => {
    if (autoOpenShare) {
      setIsForwardingOpen(true);
    }
  }, [autoOpenShare]);

  // In-place forwarding panel toggle (可以在同頁面自己選擇轉發與否)
  const [isForwardingOpen, setIsForwardingOpen] = useState<boolean>(autoOpenShare);
  const [forwardTab, setForwardTab] = useState<'image' | 'line' | 'threads'>('image');

  // Quote customization options for the in-place card generator
  const [selectedQuoteType, setSelectedQuoteType] = useState<string>('quote');
  const [customQuoteInput, setCustomQuoteInput] = useState<string>('');
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);

  // In-place Canvas Image states
  const [cardImageUrl, setCardImageUrl] = useState<string | null>(null);
  const [cardImageBlob, setCardImageBlob] = useState<Blob | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState<boolean>(false);
  const [copiedImage, setCopiedImage] = useState<boolean>(false);
  const [copiedShareText, setCopiedShareText] = useState<boolean>(false);

  // Reset quote mode when active policy changes
  useEffect(() => {
    setSelectedQuoteType('quote');
    setIsCustomMode(false);
    setCustomQuoteInput('');
  }, [activePolicy?.id]);

  // Quote candidates for active policy
  const quoteCandidates = useMemo(() => {
    if (!activePolicy) return [];
    const list = [
      {
        id: 'quote',
        title: '現場招牌金句',
        badge: '開講原音',
        icon: '🎙️',
        desc: '沈伯洋街頭現場最有力的承諾',
        text: activePolicy.pumaQuote,
      },
      {
        id: 'summary',
        title: '核心解方精要',
        badge: '解題重點',
        icon: '💡',
        desc: '提煉的核心政策方針',
        text: activePolicy.pumaSummary,
      },
      {
        id: 'sol1',
        title: '落地方針第一步',
        badge: '首要步驟',
        icon: '🚀',
        desc: activePolicy.solutions[0]?.point || '首要步驟',
        text: activePolicy.solutions[0] ? `【${activePolicy.solutions[0].point}】${activePolicy.solutions[0].detail}` : '',
      },
      {
        id: 'sol2',
        title: '落地方針第二步',
        badge: '配套執行',
        icon: '📌',
        desc: activePolicy.solutions[1]?.point || '配套執行',
        text: activePolicy.solutions[1] ? `【${activePolicy.solutions[1].point}】${activePolicy.solutions[1].detail}` : '',
      },
      {
        id: 'threads',
        title: '社群犀利引言',
        badge: '討論亮點',
        icon: '📢',
        desc: '適合 Threads 與群組引發公共討論',
        text: activePolicy.threadsExcerpt || activePolicy.pumaQuote,
      },
      {
        id: 'grounding',
        title: '法規行政承諾',
        badge: '制度保障',
        icon: '⚖️',
        desc: '法規與行政推動步驟之嚴謹依據',
        text: activePolicy.groundingDetail || activePolicy.pumaSummary,
      },
    ];
    return list.filter((item) => item.text && item.text.trim().length > 0);
  }, [activePolicy]);

  // Current quote text
  const currentQuoteText = useMemo(() => {
    if (!activePolicy) return '';
    if (isCustomMode && customQuoteInput.trim().length > 0) {
      return customQuoteInput.trim();
    }
    const matched = quoteCandidates.find((c) => c.id === selectedQuoteType);
    return matched?.text || activePolicy.pumaQuote;
  }, [isCustomMode, customQuoteInput, selectedQuoteType, quoteCandidates, activePolicy]);

  // Generate Canvas image locally when active policy, quote, or forwarding panel opens
  useEffect(() => {
    if (!activePolicy || !isForwardingOpen) return;
    let isMounted = true;
    setIsGeneratingImage(true);

    generatePolicyCardBlob({
      districtName: activePolicy.area,
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
  }, [activePolicy, currentQuoteText, isForwardingOpen]);

  // Filtered policies list
  const filteredPolicies = useMemo(() => {
    return SOAPBOX_POLICIES.filter((item) => {
      const matchCat = selectedCategory === 'ALL' || item.category === selectedCategory;
      const matchQuery =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.station.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.citizenQuestion.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.pumaSummary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchQuery;
    });
  }, [searchQuery, selectedCategory]);

  const handleCopyPolicy = (policy: SoapboxPolicy) => {
    const text = `【沈伯洋 台北市政見 · ${policy.area}】\n\n📌 題目：${policy.title}\n📍 地點：${policy.station}\n\n💬 市民現場提問：\n「${policy.citizenQuestion}」\n\n🌊 沈伯洋回答與承諾：\n${currentQuoteText || policy.pumaQuote}\n\n三大落地方針：\n1. ${policy.solutions[0].point}：${policy.solutions[0].detail}\n2. ${policy.solutions[1].point}：${policy.solutions[1].detail}\n3. ${policy.solutions[2].point}：${policy.solutions[2].detail}\n\n👉 台北 12 行政區政見地圖：${APP_REAL_URL}\n如果有其他市政建議想提出，請至官方「市長，你給我聽好」留言\nhttps://puma.taipei/taipeispeaksup\n#沈伯洋 #台北順起來 #${policy.area}`;

    navigator.clipboard.writeText(text);
    setCopiedPolicyId(policy.id);
    setTimeout(() => setCopiedPolicyId(null), 2000);
  };

  const handleDownloadImage = () => {
    if (!cardImageUrl || !activePolicy) return;
    const a = document.createElement('a');
    a.href = cardImageUrl;
    a.download = `沈伯洋政見圖卡-${activePolicy.area}-${activePolicy.id}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

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
      handleDownloadImage();
    }
  };

  const getCategoryIcon = (cat: HeartCategory) => {
    switch (cat) {
      case 'Habitat':
        return <Home className="w-3.5 h-3.5" />;
      case 'Empowerment':
        return <Sparkles className="w-3.5 h-3.5" />;
      case 'Accompaniment':
        return <HeartHandshake className="w-3.5 h-3.5" />;
      case 'Resilience':
        return <ShieldCheck className="w-3.5 h-3.5" />;
      case 'Time':
        return <Clock className="w-3.5 h-3.5" />;
    }
  };

  return (
    <section className="py-10 bg-neutral-50/60" id="soapbox-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-orange-600 mb-2">
              <span>街頭肥皂箱市民開講實錄</span>
              <span aria-hidden="true">·</span>
              <span>直面解題</span>
              <span aria-hidden="true">·</span>
              <span className="font-bold bg-orange-100 text-orange-800 px-2 py-0.5 rounded-md">
                同頁面自選轉發討論
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
              市民提案、現場問答與社群轉發
            </h2>
            <p className="text-sm text-neutral-600 mt-1 max-w-2xl leading-relaxed">
              全面收錄台北 12 行政區市民親自上台開講問答。在同頁面閱讀沈伯洋具體政策回答後，
              <strong>您可自由在同頁面選擇是否開啟轉發討論工坊</strong>，自選金句引言、以圖轉出或分享至 Threads / LINE！
            </p>
          </div>

          {/* Search box */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="w-full sm:w-72 relative">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="搜尋捷運站、行政區或關鍵字..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-neutral-200 rounded-xl focus:outline-hidden focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all shadow-2xs"
              />
            </div>
          </div>
        </div>

        {/* Filter Tab bar with Category Progress Indicators */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-6 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              selectedCategory === 'ALL'
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'bg-white text-neutral-600 hover:text-neutral-900 border border-neutral-200/80'
            }`}
          >
            全部議題 ({SOAPBOX_POLICIES.length})
          </button>
          <button
            onClick={() => setSelectedCategory('Habitat')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              selectedCategory === 'Habitat'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-white text-neutral-600 hover:text-neutral-900 border border-neutral-200/80'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            空間與居住 (Habitat)
          </button>
          <button
            onClick={() => setSelectedCategory('Empowerment')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              selectedCategory === 'Empowerment'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-white text-neutral-600 hover:text-neutral-900 border border-neutral-200/80'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            機會與青年 (Empowerment)
          </button>
          <button
            onClick={() => setSelectedCategory('Accompaniment')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              selectedCategory === 'Accompaniment'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-white text-neutral-600 hover:text-neutral-900 border border-neutral-200/80'
            }`}
          >
            <HeartHandshake className="w-3.5 h-3.5" />
            陪伴與全齡 (Accompaniment)
          </button>
          <button
            onClick={() => setSelectedCategory('Resilience')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              selectedCategory === 'Resilience'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-white text-neutral-600 hover:text-neutral-900 border border-neutral-200/80'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            首都防衛韌性 (Resilience)
          </button>
          <button
            onClick={() => setSelectedCategory('Time')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              selectedCategory === 'Time'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-white text-neutral-600 hover:text-neutral-900 border border-neutral-200/80'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            時間與交通 (Time)
          </button>
        </div>

        {/* Two-Column Master-Detail Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Soapbox Policy Cards List (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="text-xs text-neutral-500 font-medium px-1 flex items-center justify-between">
              <span>共找到 {filteredPolicies.length} 場街頭對話紀錄</span>
              <span>點擊卡片查看詳細回答與轉發</span>
            </div>

            {filteredPolicies.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-neutral-200">
                <p className="text-sm text-neutral-500">沒有符合關鍵字的政見，請嘗試其他字詞。</p>
              </div>
            ) : (
              filteredPolicies.map((policy) => {
                const isSelected = activePolicy?.id === policy.id;
                const isRead = progress.isRead(policy.id);

                return (
                  <div
                    key={policy.id}
                    onClick={() => {
                      setActivePolicy(policy);
                      progress.markAsRead(policy.id);
                    }}
                    className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'bg-orange-50/70 border-orange-400 shadow-sm ring-1 ring-orange-300'
                        : isRead
                        ? 'bg-white border-neutral-200/80'
                        : 'bg-white hover:bg-neutral-50 border-neutral-200/80 hover:border-neutral-300'
                    }`}
                  >
                    {/* Metadata header & read checkmark */}
                    <div className="flex items-center justify-between text-xs text-neutral-500 mb-2">
                      <div className="flex items-center gap-1.5 text-orange-700 font-semibold">
                        <MapPin className="w-3.5 h-3.5 shrink-0 text-orange-600" />
                        <span className="truncate">{policy.area} · {policy.station}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {isRead && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded-md">
                            已讀
                          </span>
                        )}
                        <span className="text-[11px] text-neutral-400">{policy.categoryName.split(' ')[0]}</span>
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-neutral-900 leading-snug line-clamp-2 mb-2">
                      {policy.title}
                    </h3>

                    {/* Citizen Question snippet */}
                    <div className="text-xs text-neutral-600 line-clamp-2 bg-neutral-100/70 rounded-lg p-2 mb-2 italic">
                      {policy.citizenQuestion}
                    </div>

                    {/* Footer tags */}
                    <div className="flex items-center justify-between text-[11px] text-neutral-500">
                      <span>發言市民：{policy.citizenName}</span>
                      <span className="text-orange-600 font-semibold flex items-center gap-1">
                        <span>閱讀解方 / 轉發討論</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Column: Active Policy Detailed Dialog & Answers + In-Place Forwarding Hub (7 cols) */}
          <div className="lg:col-span-7">
            {activePolicy ? (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-md space-y-6">
                {/* Station & Category Header */}
                <div className="border-b border-neutral-100 pb-5">
                  <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                    <div className="flex items-center gap-2 text-xs font-semibold text-orange-600">
                      <button
                        onClick={() => onSelectDistrictOnMap(activePolicy.districtId)}
                        className="flex items-center gap-1 hover:underline cursor-pointer font-bold"
                      >
                        <MapPin className="w-4 h-4 text-orange-600" />
                        {activePolicy.area} · {activePolicy.station}
                      </button>
                      <span aria-hidden="true" className="text-neutral-300">·</span>
                      <span className="text-neutral-600">{activePolicy.categoryName}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => progress.toggleRead(activePolicy.id)}
                        className={`text-xs font-bold px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                          progress.isRead(activePolicy.id)
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-neutral-100 text-neutral-600 hover:bg-orange-50 hover:text-orange-700'
                        }`}
                      >
                        {progress.isRead(activePolicy.id) ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>已讀</span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-3.5 h-3.5" />
                            <span>標記已讀</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-black text-neutral-900 leading-snug">
                    {activePolicy.title}
                  </h2>
                </div>

                {/* Section 1: The Citizen's Voice (現場市民原音提問) */}
                <div className="bg-amber-50/50 rounded-2xl p-4 sm:p-5 border border-amber-200/60 relative">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-900 flex items-center justify-center font-bold text-xs">
                        問
                      </div>
                      <span className="text-xs font-bold text-neutral-900">
                        {activePolicy.citizenName}
                      </span>
                      <span className="text-xs text-neutral-500">
                        ({activePolicy.citizenRole})
                      </span>
                    </div>
                    <span className="text-[11px] text-amber-800 font-medium">現場站上肥皂箱提問</span>
                  </div>

                  <blockquote className="text-sm font-medium text-neutral-800 leading-relaxed italic">
                    {activePolicy.citizenQuestion}
                  </blockquote>

                  <div className="mt-3 pt-3 border-t border-amber-200/40 text-xs text-amber-900/80">
                    <strong className="font-semibold">核心痛點：</strong> {activePolicy.citizenPainPoint}
                  </div>
                </div>

                {/* Section 2: Puma's Answer on Soapbox (沈伯洋肥皂箱現場回答) */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold text-xs">
                      答
                    </div>
                    <h3 className="text-base font-bold text-neutral-900">
                      沈伯洋政策解方與承諾
                    </h3>
                  </div>

                  {/* Puma Quote Callout */}
                  <div className="p-4 bg-linear-to-r from-orange-500 to-amber-500 rounded-2xl text-white shadow-sm">
                    <p className="text-sm sm:text-base font-bold leading-snug">
                      {activePolicy.pumaQuote}
                    </p>
                    <p className="text-xs text-orange-100 mt-1.5">
                      {activePolicy.pumaSummary}
                    </p>
                  </div>

                  {/* 3 Core Solutions */}
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                      三大關鍵落地方針
                    </h4>
                    {activePolicy.solutions.map((sol, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3.5 bg-neutral-50 rounded-xl border border-neutral-100 hover:border-orange-200 transition-colors"
                      >
                        <div className="w-5 h-5 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                          {idx + 1}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-neutral-900">{sol.point}</p>
                          <p className="text-xs text-neutral-600 leading-relaxed mt-1">{sol.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Legislative & Administrative Grounding */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-slate-900">
                      <FileText className="w-3.5 h-3.5 text-slate-600" />
                      <span>法規與預算落實依據</span>
                    </div>
                    <p className="leading-relaxed">{activePolicy.groundingDetail}</p>
                  </div>
                </div>

                {/* 🌟 Section 3: 延續於此 · 同頁面轉發與討論工坊（在同頁面自己選擇轉發與否） */}
                <div className="pt-2 border-t border-neutral-200/80 space-y-4" id="inline-share-workshop">
                  {/* Toggle Banner / Trigger */}
                  <div className="bg-linear-to-r from-orange-50 via-amber-50/50 to-orange-50/20 p-4 rounded-2xl border border-orange-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-orange-600 text-white flex items-center justify-center shadow-xs shrink-0">
                        <Share2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-black text-neutral-900">
                            延續討論 · 轉發這則政見工坊
                          </h4>
                          <span className="text-[10px] font-bold text-orange-800 bg-orange-100 px-2 py-0.5 rounded-md">
                            同頁面自選
                          </span>
                        </div>
                        <p className="text-xs text-neutral-500 mt-0.5">
                          閱聽完畢！您可在同頁面選擇是否將此回答轉發為圖卡、LINE 或 Threads 討論。
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setIsForwardingOpen(!isForwardingOpen)}
                      className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                        isForwardingOpen
                          ? 'bg-neutral-900 text-white shadow-xs'
                          : 'bg-orange-600 hover:bg-orange-700 text-white shadow-xs'
                      }`}
                    >
                      <span>{isForwardingOpen ? '收起轉發工具箱' : '🎨 開啟轉發工具箱'}</span>
                      {isForwardingOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* In-Place Forwarding Studio Content (When opened by reader) */}
                  {isForwardingOpen && (
                    <div className="bg-white rounded-2xl p-5 border border-orange-300 shadow-sm space-y-4 animate-in fade-in duration-200">
                      {/* Format Switcher Tabs */}
                      <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-neutral-100">
                        <span className="text-xs font-bold text-neutral-700 flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                          <span>請選擇轉發形式：</span>
                        </span>

                        <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl text-xs font-bold">
                          <button
                            onClick={() => setForwardTab('image')}
                            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                              forwardTab === 'image'
                                ? 'bg-orange-600 text-white shadow-2xs'
                                : 'text-neutral-600 hover:text-neutral-900'
                            }`}
                          >
                            <ImageIcon className="w-3.5 h-3.5" />
                            <span>以圖轉出 (LINE圖卡)</span>
                          </button>
                          <button
                            onClick={() => setForwardTab('line')}
                            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                              forwardTab === 'line'
                                ? 'bg-emerald-600 text-white shadow-2xs'
                                : 'text-neutral-600 hover:text-neutral-900'
                            }`}
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>LINE 純文字</span>
                          </button>
                          <button
                            onClick={() => setForwardTab('threads')}
                            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                              forwardTab === 'threads'
                                ? 'bg-neutral-950 text-white shadow-2xs'
                                : 'text-neutral-600 hover:text-neutral-900'
                            }`}
                          >
                            <span className="font-mono text-xs font-bold">@</span>
                            <span>Threads 討論</span>
                          </button>
                        </div>
                      </div>

                      {/* Tab A: Image Card Generator with Custom Quote Preview */}
                      {forwardTab === 'image' && (
                        <div className="space-y-4">
                          {/* 自定義金句引用預覽區域 */}
                          <div className="bg-linear-to-b from-orange-50/50 to-amber-50/20 rounded-xl p-4 border border-orange-200/90 space-y-3">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <div className="flex items-center gap-2">
                                <Quote className="w-4 h-4 text-orange-600" />
                                <h5 className="text-xs font-black text-neutral-900">
                                  自定義「金句引用」預覽區域（免消耗 Token · Canvas 即時繪製）
                                </h5>
                              </div>
                              <button
                                onClick={() => setIsCustomMode(!isCustomMode)}
                                className={`text-[11px] font-bold px-2 py-0.8 rounded-lg transition-colors flex items-center gap-1 border ${
                                  isCustomMode
                                    ? 'bg-neutral-900 text-white'
                                    : 'bg-white hover:bg-orange-50 text-neutral-700 border-neutral-200'
                                }`}
                              >
                                <Edit3 className="w-3 h-3" />
                                <span>{isCustomMode ? '收起自訂輸入' : '自訂微調文字'}</span>
                              </button>
                            </div>

                            {/* Candidate Buttons */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                              {quoteCandidates.map((c) => {
                                const isSelected = !isCustomMode && selectedQuoteType === c.id;
                                return (
                                  <button
                                    key={c.id}
                                    onClick={() => {
                                      setSelectedQuoteType(c.id);
                                      setIsCustomMode(false);
                                    }}
                                    className={`p-2 rounded-xl text-left transition-all cursor-pointer border flex flex-col justify-between text-xs ${
                                      isSelected
                                        ? 'bg-orange-600 text-white border-orange-700 font-bold'
                                        : 'bg-white hover:bg-orange-50/60 text-neutral-800 border-neutral-200'
                                    }`}
                                  >
                                    <div className="flex items-center justify-between mb-0.5">
                                      <span className="font-bold flex items-center gap-1">
                                        <span>{c.icon}</span>
                                        <span>{c.title}</span>
                                      </span>
                                      <span className={`text-[9px] px-1 rounded ${
                                        isSelected ? 'bg-orange-800 text-orange-100' : 'bg-neutral-100 text-neutral-500'
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

                            {/* Custom Mode Textarea */}
                            {isCustomMode && (
                              <div className="bg-white p-2.5 rounded-xl border border-orange-200 space-y-1.5">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="font-bold text-neutral-700">自訂圖卡中央引言：</span>
                                  <button
                                    onClick={() => setCustomQuoteInput(activePolicy.pumaQuote)}
                                    className="text-[11px] text-orange-600 hover:text-orange-800 flex items-center gap-1 font-semibold cursor-pointer"
                                  >
                                    <RotateCcw className="w-3 h-3" />
                                    <span>填入現場原話</span>
                                  </button>
                                </div>
                                <textarea
                                  rows={2}
                                  value={customQuoteInput || activePolicy.pumaQuote}
                                  onChange={(e) => setCustomQuoteInput(e.target.value)}
                                  className="w-full p-2 rounded-lg bg-neutral-50 border border-neutral-200 text-xs text-neutral-800 focus:outline-hidden focus:border-orange-500 resize-none"
                                />
                              </div>
                            )}

                            {/* Quote Live Preview Card */}
                            <div className="bg-white p-3 rounded-xl border-l-4 border-l-orange-500 border border-neutral-200/90 text-xs space-y-1">
                              <div className="flex items-center justify-between text-[11px] text-neutral-500">
                                <span className="font-bold text-orange-800">沈伯洋承諾引言預覽：</span>
                                <span className="text-emerald-700 font-bold text-[10px]">✓ 已同步於下方圖卡</span>
                              </div>
                              <p className="font-bold text-neutral-900 italic bg-orange-50/50 p-2 rounded-lg border border-orange-100">
                                「{currentQuoteText}」
                              </p>
                            </div>
                          </div>

                          {/* Canvas Image Preview */}
                          <div className="relative rounded-2xl overflow-hidden border border-neutral-200 shadow-xs bg-neutral-100 flex items-center justify-center min-h-[300px] max-h-[440px]">
                            {isGeneratingImage && (
                              <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex flex-col items-center justify-center gap-2 z-10">
                                <Sparkles className="w-6 h-6 text-orange-600 animate-spin" />
                                <span className="text-xs text-neutral-600 font-medium">正在重繪圖卡...</span>
                              </div>
                            )}
                            {cardImageUrl ? (
                              <img
                                src={cardImageUrl}
                                alt={`沈伯洋台北市政見圖卡-${activePolicy.area}`}
                                className="w-full h-auto max-h-[420px] object-contain rounded-xl select-none"
                              />
                            ) : (
                              <span className="text-xs text-neutral-400">載入圖卡預覽中...</span>
                            )}
                          </div>

                          {/* Image Actions */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                            <button
                              onClick={handleDownloadImage}
                              className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer active:scale-98"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>下載圖卡 (PNG)</span>
                            </button>
                            <button
                              onClick={handleCopyImage}
                              className="px-4 py-2.5 rounded-xl bg-neutral-100 hover:bg-orange-50 text-neutral-800 hover:text-orange-950 font-bold text-xs flex items-center justify-center gap-1.5 border border-neutral-200 transition-all cursor-pointer active:scale-98"
                            >
                              {copiedImage ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                              <span>{copiedImage ? '圖卡已複製！' : '複製圖卡圖片'}</span>
                            </button>
                            <a
                              href={buildLineUrl({
                                districtName: activePolicy.area,
                                title: activePolicy.title,
                                citizenQuestion: activePolicy.citizenQuestion,
                                pumaQuote: currentQuoteText,
                              })}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer active:scale-98"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>打開 LINE 轉發</span>
                            </a>
                          </div>
                        </div>
                      )}

                      {/* Tab B: LINE Plain Text */}
                      {forwardTab === 'line' && (
                        <div className="space-y-3">
                          <div className="text-xs text-neutral-600 bg-neutral-50 p-3 rounded-xl border border-neutral-200 leading-relaxed font-mono whitespace-pre-line max-h-56 overflow-y-auto">
                            {buildLineShareText({
                              districtName: activePolicy.area,
                              title: activePolicy.title,
                              citizenQuestion: activePolicy.citizenQuestion,
                              pumaQuote: currentQuoteText,
                            })}
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  buildLineShareText({
                                    districtName: activePolicy.area,
                                    title: activePolicy.title,
                                    citizenQuestion: activePolicy.citizenQuestion,
                                    pumaQuote: currentQuoteText,
                                  })
                                );
                                setCopiedShareText(true);
                                setTimeout(() => setCopiedShareText(false), 2000);
                              }}
                              className="flex-1 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border border-neutral-300 transition-colors cursor-pointer"
                            >
                              {copiedShareText ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                              <span>{copiedShareText ? '文字已複製！' : '複製 LINE 轉發文字'}</span>
                            </button>
                            <a
                              href={buildLineUrl({
                                districtName: activePolicy.area,
                                title: activePolicy.title,
                                citizenQuestion: activePolicy.citizenQuestion,
                                pumaQuote: currentQuoteText,
                              })}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer text-center"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>開啟 LINE App 轉送</span>
                            </a>
                          </div>
                        </div>
                      )}

                      {/* Tab C: Threads Discussion */}
                      {forwardTab === 'threads' && (
                        <div className="space-y-3">
                          <div className="text-xs text-neutral-600 bg-neutral-50 p-3 rounded-xl border border-neutral-200 leading-relaxed font-mono whitespace-pre-line max-h-56 overflow-y-auto">
                            {buildThreadsShareText({
                              districtName: activePolicy.area,
                              title: activePolicy.title,
                              citizenQuestion: activePolicy.citizenQuestion,
                              pumaQuote: currentQuoteText,
                            })}
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  buildThreadsShareText({
                                    districtName: activePolicy.area,
                                    title: activePolicy.title,
                                    citizenQuestion: activePolicy.citizenQuestion,
                                    pumaQuote: currentQuoteText,
                                  })
                                );
                                setCopiedShareText(true);
                                setTimeout(() => setCopiedShareText(false), 2000);
                              }}
                              className="flex-1 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border border-neutral-300 transition-colors cursor-pointer"
                            >
                              {copiedShareText ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                              <span>{copiedShareText ? '文字已複製！' : '複製貼文文字'}</span>
                            </button>
                            <a
                              href={buildThreadsUrl({
                                districtName: activePolicy.area,
                                title: activePolicy.title,
                                citizenQuestion: activePolicy.citizenQuestion,
                                pumaQuote: currentQuoteText,
                              })}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 py-2.5 bg-neutral-950 hover:bg-black text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer text-center border border-neutral-800"
                            >
                              <span className="font-mono text-xs font-bold">@</span>
                              <span>發布至 Threads 發起討論</span>
                            </a>
                          </div>
                        </div>
                      )}

                      {/* Close button inside studio */}
                      <div className="pt-2 flex justify-center border-t border-neutral-100">
                        <button
                          onClick={() => setIsForwardingOpen(false)}
                          className="text-xs text-neutral-500 hover:text-neutral-800 font-semibold cursor-pointer py-1"
                        >
                          ▲ 完成轉發 / 收起工具箱，繼續閱讀其他政見
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Action: Quick Buttons */}
                <div className="pt-2 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {activePolicy.tags.map((tag, i) => (
                      <span key={i} className="text-xs text-neutral-500">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
                    <button
                      onClick={() => setIsForwardingOpen(!isForwardingOpen)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-orange-700 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-xl transition-colors cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>{isForwardingOpen ? '已開啟轉發工坊' : '同頁面轉發與引言製圖'}</span>
                    </button>

                    <button
                      onClick={() => handleCopyPolicy(activePolicy)}
                      className="inline-flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-linear-to-r from-orange-600 to-amber-600 rounded-xl hover:from-orange-700 hover:to-amber-700 shadow-xs transition-all cursor-pointer"
                    >
                      {copiedPolicyId === activePolicy.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-white" />
                          <span>已複製！</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>複製精華</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-neutral-200 text-neutral-500">
                請在左側選取任一街頭肥皂箱對話，查看詳細解方。
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
