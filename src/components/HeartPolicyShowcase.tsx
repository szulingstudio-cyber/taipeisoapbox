import React, { useState } from 'react';
import { 
  Heart, 
  Home, 
  Sparkles, 
  HeartHandshake, 
  ShieldCheck, 
  Clock, 
  Target, 
  ArrowRight, 
  ChevronRight, 
  Compass, 
  MessageSquare, 
  ExternalLink,
  BookOpen,
  CheckCircle2
} from 'lucide-react';
import { HEART_FRAMEWORK, SOAPBOX_POLICIES } from '../data/policies';
import { HeartCategory, TaipeiDistrict, SoapboxPolicy } from '../types';
import { PUMA_POLICIES_URL } from '../config/urls';

interface HeartPolicyShowcaseProps {
  onSelectDistrictOnMap?: (districtId: TaipeiDistrict) => void;
  onGoToSoapbox?: (category: HeartCategory) => void;
  onSelectPolicyForShare?: (policyId: string, districtId: TaipeiDistrict) => void;
}

export const HeartPolicyShowcase: React.FC<HeartPolicyShowcaseProps> = ({
  onSelectDistrictOnMap,
  onGoToSoapbox,
  onSelectPolicyForShare
}) => {
  const [activeLetter, setActiveLetter] = useState<'H' | 'E' | 'A' | 'R' | 'T'>('H');

  const currentPillar = HEART_FRAMEWORK.find((p) => p.letter === activeLetter) || HEART_FRAMEWORK[0];

  // Find related citizen soapbox policies under this HEART category
  const relatedSoapboxPolicies = SOAPBOX_POLICIES.filter(
    (p) => p.category === currentPillar.key
  );

  const getPillarIcon = (letter: string, className: string = 'w-5 h-5') => {
    switch (letter) {
      case 'H':
        return <Home className={className} />;
      case 'E':
        return <Sparkles className={className} />;
      case 'A':
        return <HeartHandshake className={className} />;
      case 'R':
        return <ShieldCheck className={className} />;
      case 'T':
        return <Clock className={className} />;
      default:
        return <Heart className={className} />;
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-orange-200/90 shadow-sm space-y-6" id="heart-showcase">
      {/* 1. Official Policy Website Guidance Banner (帶領民眾至官網看更詳細內容) */}
      <div className="bg-linear-to-r from-orange-600 via-orange-500 to-amber-500 rounded-2xl p-4 sm:p-5 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <span className="text-xs font-black bg-white text-orange-700 px-2.5 py-0.5 rounded-full">
                官方白皮書專頁
              </span>
              <span className="text-xs font-semibold text-orange-100">
                puma.taipei/policies
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black tracking-tight">
              沈伯洋政策白皮書 · 完整專章與法案藍圖
            </h3>
            <p className="text-xs text-orange-100 mt-0.5 max-w-xl">
              此處提供 HEART 五大核心精華快速導讀；欲深入研讀完整條文、立法期程與章節論述，歡迎直接造訪政策官網！
            </p>
          </div>
        </div>

        <a
          href={PUMA_POLICIES_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-orange-700 hover:bg-orange-50 font-black text-xs sm:text-sm rounded-xl shadow-sm transition-all cursor-pointer active:scale-98 shrink-0 w-full sm:w-auto"
        >
          <span>前往沈伯洋政策官網看完整章節</span>
          <ExternalLink className="w-4 h-4 text-orange-700" />
        </a>
      </div>

      {/* 2. Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-orange-100 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold mb-2">
            <Heart className="w-3.5 h-3.5 text-orange-600 fill-orange-500" />
            <span>沈伯洋原創市政架構 · HEART 五大核心速覽</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
            HEART 市政白皮書快速導讀
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 mt-1 max-w-2xl leading-relaxed">
            以 <strong>H (宜居環境)</strong>、<strong>E (青年賦能)</strong>、<strong>A (溫暖陪伴)</strong>、<strong>R (首都韌性)</strong>、<strong>T (自由時間)</strong> 為主軸。點選下方各英文字母，快速了解各項核心重點與落地方針！
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-neutral-500 font-mono">
            架構：5 大核心 · 15 項承諾 · 36 則街頭實錄
          </span>
        </div>
      </div>

      {/* 3. HEART 5 Letters Switcher Tabs (簡明直覺點選) */}
      <div className="grid grid-cols-5 gap-2 sm:gap-3">
        {HEART_FRAMEWORK.map((pillar) => {
          const isActive = activeLetter === pillar.letter;
          return (
            <button
              key={pillar.letter}
              onClick={() => setActiveLetter(pillar.letter)}
              className={`p-3 sm:p-4 rounded-2xl text-left transition-all cursor-pointer border flex flex-col justify-between relative overflow-hidden ${
                isActive
                  ? 'bg-linear-to-b from-orange-600 to-amber-600 text-white border-orange-600 shadow-md scale-102 ring-2 ring-orange-200'
                  : 'bg-neutral-50 hover:bg-orange-50/70 text-neutral-800 border-neutral-200/80 hover:border-orange-300'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1 sm:mb-2">
                <span className={`font-black text-xl sm:text-2xl font-mono ${isActive ? 'text-white' : 'text-orange-600'}`}>
                  {pillar.letter}
                </span>
                <div className={`p-1.5 rounded-lg ${isActive ? 'bg-white/20 text-white' : 'bg-neutral-200/70 text-neutral-700'}`}>
                  {getPillarIcon(pillar.letter, 'w-3.5 h-3.5 sm:w-4 sm:h-4')}
                </div>
              </div>
              <div>
                <span className="block text-xs sm:text-sm font-black line-clamp-1">
                  {pillar.name.split('·')[0]}
                </span>
                <span className={`text-[10px] hidden sm:block ${isActive ? 'text-orange-100' : 'text-neutral-500'}`}>
                  {pillar.enName.split('&')[0]}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* 4. Active Pillar Summary (簡單各項介紹 + 官網專屬導購) */}
      <div className="bg-linear-to-br from-neutral-50 to-orange-50/30 rounded-3xl p-6 sm:p-7 border border-orange-100 space-y-6">
        {/* Banner with Official Link */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-orange-100/80">
          <div className="flex items-center gap-3">
            <span className="w-12 h-12 rounded-2xl bg-orange-600 text-white font-black text-2xl font-mono flex items-center justify-center shadow-sm">
              {currentPillar.letter}
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xl sm:text-2xl font-black text-neutral-900">
                  {currentPillar.name}
                </h3>
                <span className="text-xs font-mono text-orange-700 font-bold bg-orange-100 px-2 py-0.5 rounded-md">
                  {currentPillar.enName}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-orange-900 mt-0.5">
                「{currentPillar.slogan}」
              </p>
            </div>
          </div>

          <a
            href={PUMA_POLICIES_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-orange-100 hover:bg-orange-200 text-orange-800 text-xs font-bold rounded-xl transition-colors cursor-pointer shrink-0"
          >
            <span>在政策官網查看本篇專章</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Core Concept: 簡單一句話重點介紹 */}
        <div className="bg-white p-4.5 rounded-2xl border border-neutral-200/80 text-xs sm:text-sm text-neutral-700 leading-relaxed shadow-2xs">
          <strong className="text-neutral-900 block mb-1 text-sm font-black">
            💡 本項政策一句話重點介紹：
          </strong>
          {currentPillar.coreConcept}
        </div>

        {/* 3 Concrete Action Pillars: 簡明條列介紹 */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
            三大落地解方與關鍵推進目標：
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {currentPillar.pillars.map((p, idx) => (
              <div
                key={idx}
                className="bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-2xs flex flex-col justify-between space-y-3 hover:border-orange-300 transition-all"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-5 h-5 rounded-full bg-orange-600 text-white text-[11px] font-bold flex items-center justify-center font-mono">
                      {idx + 1}
                    </span>
                    <h5 className="font-black text-sm text-neutral-900">
                      {p.title}
                    </h5>
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {p.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-neutral-100 flex items-start gap-1.5 text-[11px] text-orange-900 bg-orange-50/60 p-2 rounded-xl">
                  <Target className="w-3.5 h-3.5 text-orange-600 shrink-0 mt-0.5" />
                  <span className="font-semibold leading-tight">
                    <strong>量化目標：</strong>{p.targetMetric}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Linked Street Soapbox Questions from "市長你給我聽好" */}
        <div className="pt-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-neutral-700 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-orange-600" />
              <span>本核心對應的「市長你給我聽好」街頭肥皂箱市民開講實錄 ({relatedSoapboxPolicies.length} 則)：</span>
            </h4>
            {onGoToSoapbox && (
              <button
                onClick={() => onGoToSoapbox(currentPillar.key)}
                className="text-xs font-bold text-orange-600 hover:text-orange-800 flex items-center gap-1 cursor-pointer"
              >
                <span>至肥皂箱專區查看全部</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {relatedSoapboxPolicies.slice(0, 6).map((policy) => (
              <div
                key={policy.id}
                className="bg-white p-3.5 rounded-2xl border border-neutral-200/90 shadow-2xs hover:border-orange-400 transition-all flex flex-col justify-between gap-2"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">
                      {policy.area}
                    </span>
                    <span className="text-neutral-400 font-mono text-[10px]">
                      {policy.citizenName} ({policy.citizenRole})
                    </span>
                  </div>
                  <h6 className="font-bold text-neutral-900 text-xs line-clamp-1">
                    {policy.title}
                  </h6>
                  <p className="text-[11px] text-neutral-500 line-clamp-2 italic">
                    「{policy.citizenQuestion}」
                  </p>
                </div>

                <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px]">
                  {onSelectDistrictOnMap && (
                    <button
                      onClick={() => onSelectDistrictOnMap(policy.districtId)}
                      className="text-neutral-600 hover:text-orange-600 font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <Compass className="w-3 h-3" />
                      <span>在地圖檢視</span>
                    </button>
                  )}
                  {onSelectPolicyForShare && (
                    <button
                      onClick={() => onSelectPolicyForShare(policy.id, policy.districtId)}
                      className="text-orange-600 hover:text-orange-800 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <span>前往轉發討論</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Detailed Official Link Card */}
        <div className="pt-2 border-t border-orange-100/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs bg-white p-4 rounded-2xl border border-neutral-200/80">
          <div className="flex items-center gap-2 text-neutral-700">
            <BookOpen className="w-4 h-4 text-orange-600 shrink-0" />
            <span>
              想了解更完整的台北市政規劃？歡迎造訪沈伯洋官方政策白皮書網站：<strong>https://puma.taipei/policies</strong>
            </span>
          </div>
          <a
            href={PUMA_POLICIES_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
          >
            <span>造訪官網白皮書 ↗</span>
          </a>
        </div>
      </div>
    </div>
  );
};
