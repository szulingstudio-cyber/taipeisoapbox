import React, { useState } from 'react';
import { 
  Building2, 
  Navigation, 
  Sparkles, 
  HeartPulse, 
  ShieldAlert, 
  Cpu, 
  ArrowRight, 
  HelpCircle, 
  MessageSquare, 
  CheckCircle2, 
  Copy, 
  Check, 
  MapPin, 
  Layers,
  Award,
  Eye,
  BarChart3,
  Heart
} from 'lucide-react';
import { POLICY_THEMES, SOAPBOX_POLICIES } from '../data/policies';
import { SoapboxPolicy, PolicyTheme, TaipeiDistrict, HeartCategory } from '../types';
import { usePolicyProgress } from '../hooks/usePolicyProgress';
import { APP_REAL_URL, APP_LINE_URL, PUMA_SPEAKS_UP_URL } from '../config/urls';
import { HeartPolicyShowcase } from './HeartPolicyShowcase';

interface ThemeExplorerProps {
  onSelectDistrictOnMap: (districtId: TaipeiDistrict) => void;
  onGoToSoapbox: (category?: HeartCategory) => void;
  onSelectPolicyForShare?: (policyId: string, districtId: TaipeiDistrict) => void;
  progress: ReturnType<typeof usePolicyProgress>;
}

export const ThemeExplorer: React.FC<ThemeExplorerProps> = ({
  onSelectDistrictOnMap,
  onGoToSoapbox,
  onSelectPolicyForShare,
  progress
}) => {
  const [activeThemeId, setActiveThemeId] = useState<PolicyTheme>('housing');
  const [selectedDetailPolicy, setSelectedDetailPolicy] = useState<SoapboxPolicy | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activeTheme = POLICY_THEMES.find((t) => t.id === activeThemeId) || POLICY_THEMES[0];
  const policiesInTheme = SOAPBOX_POLICIES.filter((p) => p.theme === activeThemeId);
  const currentThemeProg = progress.getThemeProgress(activeThemeId);

  const handleCopy = (policy: SoapboxPolicy) => {
    const text = `【沈伯洋 台北市政見 · ${policy.themeName}】\n\n📌 題目：${policy.title}\n📍 地點：${policy.station} (${policy.area})\n\n💬 市民現場提問：\n「${policy.citizenQuestion}」\n\n🌊 沈伯洋回答與承諾：\n${policy.pumaQuote}\n\n三大方針：\n1. ${policy.solutions[0].point}：${policy.solutions[0].detail}\n2. ${policy.solutions[1].point}：${policy.solutions[1].detail}\n3. ${policy.solutions[2].point}：${policy.solutions[2].detail}\n\n👉 台北 12 行政區政見地圖：${APP_REAL_URL}\n如果有其他市政建議想提出，請至官方「市長，你給我聽好」留言\nhttps://puma.taipei/taipeispeaksup\n（資料來源引用：沈伯洋公開政策發言記錄）\n#沈伯洋 #台北順起來 #${policy.area}`;

    navigator.clipboard.writeText(text);
    setCopiedId(policy.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const renderThemeIcon = (theme: PolicyTheme, className: string = 'w-5 h-5') => {
    switch (theme) {
      case 'housing':
        return <Building2 className={className} />;
      case 'transit':
        return <Navigation className={className} />;
      case 'youth':
        return <Sparkles className={className} />;
      case 'healthcare':
        return <HeartPulse className={className} />;
      case 'defense':
        return <ShieldAlert className={className} />;
      case 'digital':
        return <Cpu className={className} />;
    }
  };

  return (
    <section className="py-10 bg-white space-y-12" id="theme-explorer-section">
      {/* 1. 沈伯洋原本的 HEART 五大核心政策架構展示 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <HeartPolicyShowcase
          onSelectDistrictOnMap={onSelectDistrictOnMap}
          onGoToSoapbox={onGoToSoapbox}
          onSelectPolicyForShare={onSelectPolicyForShare}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-neutral-100 pt-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100/80 text-orange-800 text-xs font-semibold mb-3">
            <Layers className="w-3.5 h-3.5 text-orange-600" />
            <span>台北市政主題探索系統 · 資訊圖表化</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight">
            依主題探索政策承諾
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 mt-2 leading-relaxed">
            點選下方政策主題（居住正義、交通運輸、青年世代、健康醫療照護、首都防衛、數位治理），
            即時檢視該主題進度條、核心摘要、市民常見問題與沈伯洋的具體解方。
          </p>
        </div>

        {/* Theme Selector Tabs with Visual Progress Bars */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mb-8">
          {POLICY_THEMES.map((theme) => {
            const isActive = activeThemeId === theme.id;
            const tProg = progress.getThemeProgress(theme.id);

            return (
              <button
                key={theme.id}
                onClick={() => {
                  setActiveThemeId(theme.id);
                  setSelectedDetailPolicy(null);
                }}
                className={`p-3.5 rounded-2xl text-left transition-all duration-200 cursor-pointer border flex flex-col justify-between ${
                  isActive
                    ? 'bg-linear-to-b from-orange-50 to-amber-50/50 border-orange-400 shadow-sm ring-2 ring-orange-400/30'
                    : 'bg-neutral-50/60 hover:bg-neutral-100/70 border-neutral-200 text-neutral-600'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      isActive ? 'bg-orange-500 text-white' : 'bg-neutral-200/80 text-neutral-700'
                    }`}
                  >
                    {renderThemeIcon(theme.id, 'w-4 h-4')}
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                    {theme.enName.split(' ')[0]}
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <p
                      className={`text-sm font-bold leading-tight ${
                        isActive ? 'text-orange-950 font-black' : 'text-neutral-800'
                      }`}
                    >
                      {theme.name}
                    </p>
                    <span
                      className={`text-[10px] font-mono ${
                        tProg.percent === 100 ? 'text-emerald-600 font-bold' : 'text-neutral-400'
                      }`}
                    >
                      {tProg.percent === 100 ? '✓' : `${tProg.percent}%`}
                    </span>
                  </div>

                  {/* Mini Progress Bar inside theme card */}
                  <div className="w-full bg-neutral-200 rounded-full h-1.5 mt-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        tProg.percent === 100 ? 'bg-emerald-500' : 'bg-orange-500'
                      }`}
                      style={{ width: `${tProg.percent}%` }}
                    />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Current Active Theme Highlight Banner with Visual Theme Progress Bar */}
        <div className="p-6 rounded-3xl bg-linear-to-r from-orange-500 via-orange-600 to-amber-600 text-white shadow-md mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2 text-xs text-orange-100 font-semibold uppercase tracking-wider">
              <span>當前主題</span>
              <span aria-hidden="true">·</span>
              <span>{activeTheme.enName}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black">{activeTheme.name}：{activeTheme.tagline}</h3>
            <p className="text-xs sm:text-sm text-orange-100/90 max-w-2xl">{activeTheme.description}</p>
          </div>

          {/* Theme Progress Box */}
          <div className="bg-white/15 backdrop-blur-md p-4 rounded-2xl border border-white/20 min-w-[220px] shrink-0">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5" />
                <span>{activeTheme.name} 探索度</span>
              </span>
              <span className="font-mono font-bold tabular-nums">{currentThemeProg.percent}%</span>
            </div>

            <div className="w-full bg-white/30 rounded-full h-2 overflow-hidden">
              <div
                className="bg-white h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.max(currentThemeProg.percent, 3)}%` }}
              />
            </div>

            <p className="text-[11px] text-orange-100 mt-2 text-right">
              已探索 {currentThemeProg.read} / {currentThemeProg.total} 則政見
            </p>
          </div>
        </div>

        {/* Policies in this Theme: Grid of Policy Summaries */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {policiesInTheme.map((policy) => {
            const isOpened = selectedDetailPolicy?.id === policy.id;
            const isCopied = copiedId === policy.id;
            const isRead = progress.isRead(policy.id);

            return (
              <div
                key={policy.id}
                onClick={() => progress.markAsRead(policy.id)}
                className={`bg-white rounded-3xl border transition-all duration-200 overflow-hidden ${
                  isOpened
                    ? 'border-orange-500 ring-2 ring-orange-200 shadow-lg'
                    : isRead
                    ? 'border-neutral-200 shadow-xs'
                    : 'border-neutral-200/80 hover:border-neutral-300 hover:shadow-md'
                }`}
              >
                {/* Policy Card Header */}
                <div className="p-6 sm:p-7 space-y-4">
                  {/* Station, metadata and read indicator */}
                  <div className="flex items-center justify-between text-xs text-neutral-500">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectDistrictOnMap(policy.districtId);
                      }}
                      className="flex items-center gap-1.5 text-orange-600 font-bold hover:underline cursor-pointer"
                    >
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span>{policy.area} · {policy.station}</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        progress.toggleRead(policy.id);
                      }}
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[11px] font-bold cursor-pointer transition-colors ${
                        isRead
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-neutral-100 text-neutral-500 hover:bg-orange-50 hover:text-orange-700'
                      }`}
                    >
                      {isRead ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>已讀</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3 h-3 text-neutral-400" />
                          <span>未讀</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Title & Core Summary */}
                  <div>
                    <h4 className="text-lg font-black text-neutral-900 leading-snug">
                      {policy.title}
                    </h4>
                    <p className="text-sm text-neutral-600 mt-2 leading-relaxed">
                      {policy.summary}
                    </p>
                  </div>

                  {/* Puma's Key Quote */}
                  <div className="p-3.5 bg-orange-50/70 border-l-4 border-orange-500 rounded-r-xl text-xs sm:text-sm font-medium text-orange-950 italic">
                    {policy.pumaQuote}
                  </div>

                  {/* 3 Core Solutions Preview */}
                  <div className="space-y-2 pt-1">
                    <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                      核心落地方針
                    </p>
                    <ul className="space-y-1.5 text-xs text-neutral-700">
                      {policy.solutions.map((s, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-orange-600 shrink-0 mt-0.5" />
                          <span>
                            <strong className="font-semibold text-neutral-900">{s.point}</strong>：
                            {s.detail}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Bar */}
                  <div className="pt-4 border-t border-neutral-100 flex items-center justify-between gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDetailPolicy(isOpened ? null : policy);
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700 cursor-pointer"
                    >
                      <span>{isOpened ? '收起市民提問與回答' : '查看市民問題與沈伯洋回答'}</span>
                      <ArrowRight className={`w-3.5 h-3.5 transition-transform ${isOpened ? 'rotate-90' : ''}`} />
                    </button>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      <a
                        href={`https://www.threads.net/intent/post?text=${encodeURIComponent(
                          `【台北市政見 · ${policy.themeName}】\n「${policy.title}」\n\n💬 市民現場提問：${policy.citizenQuestion}\n🎯 沈伯洋回應：${policy.pumaQuote}\n\n👉 12 區互動政見地圖：${APP_REAL_URL}\n#沈伯洋 #台北順起來 #${policy.area}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-white bg-neutral-900 hover:bg-black rounded-xl transition-all cursor-pointer active:scale-98 shadow-2xs"
                        title="以 Threads 轉發此政見（首選推薦）"
                      >
                        <span className="font-mono text-xs font-bold">@</span>
                        <span>Threads</span>
                      </a>

                      <a
                        href={`https://line.me/R/msg/text/?${encodeURIComponent(
                          `【台北市政見 · ${policy.themeName}】\n${policy.title}\n\n市民心聲：「${policy.citizenQuestion}」\n\n👉 點此線上瀏覽 12 區政見地圖：${APP_LINE_URL}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl transition-all cursor-pointer active:scale-98 shadow-2xs"
                        title="以 LINE 轉發給好友"
                      >
                        <span className="font-bold text-[10px]">L</span>
                        <span>LINE</span>
                      </a>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(policy);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-neutral-700 bg-neutral-100 hover:bg-orange-100 hover:text-orange-900 rounded-xl transition-all cursor-pointer active:scale-98"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700">已複製！</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>複製摘要</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Drawer: Citizen Question & Puma's Detailed Answer & FAQs */}
                {isOpened && (
                  <div className="bg-neutral-50/80 p-6 sm:p-7 border-t border-neutral-200/70 space-y-5 animate-in fade-in duration-200">
                    {/* Citizen Question */}
                    <div className="bg-white rounded-2xl p-4 border border-amber-200 shadow-2xs">
                      <div className="flex items-center gap-2 mb-2 text-xs font-bold text-amber-900">
                        <MessageSquare className="w-4 h-4 text-amber-600" />
                        <span>街頭肥皂箱現場提問 · {policy.citizenRole}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-neutral-800 italic leading-relaxed">
                        {policy.citizenQuestion}
                      </p>
                    </div>

                    {/* Puma's FAQs (市民常見問題及沈伯洋的回答) */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-neutral-700">
                        <HelpCircle className="w-4 h-4 text-orange-600" />
                        <span>市民常見深度問題及沈伯洋的回答</span>
                      </div>

                      {policy.faqs.map((faq, fIdx) => (
                        <div
                          key={fIdx}
                          className="bg-white rounded-2xl p-4 border border-neutral-200/90 shadow-2xs space-y-2"
                        >
                          <p className="text-xs sm:text-sm font-bold text-neutral-900">
                            {faq.question}
                          </p>
                          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed bg-orange-50/40 p-2.5 rounded-xl border border-orange-100">
                            {faq.answer}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Legal / Budget Grounding */}
                    <div className="text-xs text-neutral-500 bg-white p-3 rounded-xl border border-neutral-200">
                      <strong className="font-semibold text-neutral-700">落實法規與行政規劃：</strong>
                      {policy.groundingDetail}
                    </div>

                    {/* Bottom CTA in Drawer */}
                    <div className="text-right">
                      <button
                        onClick={() => onSelectDistrictOnMap(policy.districtId)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl cursor-pointer"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        <span>前往地圖查看 {policy.area} 更多政見</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
