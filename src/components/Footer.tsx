import React from 'react';
import { Waves, Heart, BookOpen, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onSelectTab: (tab: 'map' | 'soapbox' | 'heart' | 'currents' | 'share') => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  return (
    <footer className="bg-neutral-900 text-neutral-400 py-12 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-neutral-800">
          {/* Brand & Campaign Summary */}
          <div className="md:col-span-6 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-orange-600 flex items-center justify-center text-white font-black text-sm">
                洋
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                台北市政見探索所 · 台北順起來
              </span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-md">
              以街頭肥皂箱精神打破政治單向傳播，走入台北各行政區捷運站，面對面聆聽市民提問。
              延續競選視覺「活力暖橘」與「洋流向前」的設計理念，讓每位台北市民輕鬆以資訊圖表探索城市解方。
            </p>
            <div className="flex flex-col gap-1.5 text-xs text-neutral-400 pt-1">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1.5 text-amber-300 font-bold">
                <span>💬 如果有其他市政建議想提出，請至官方「市長，你給我聽好」留言：</span>
                <a
                  href="https://puma.taipei/taipeispeaksup"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-white transition-colors"
                >
                  https://puma.taipei/taipeispeaksup
                </a>
              </div>
              <div className="flex items-center gap-1.5 text-orange-400 font-medium">
                <BookOpen className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                <span>資料來源引用：沈伯洋公開街頭肥皂箱開講實錄、市政公開發言與政策白皮書</span>
              </div>
              <div className="flex items-center gap-1.5 text-neutral-500 text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                <span>本站為民間公共政策資訊圖表化整理平台，非競選辦公室官方網站</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-2">
            <h4 className="text-xs font-bold text-neutral-200 uppercase tracking-wider">
              主題導覽
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  onClick={() => onSelectTab('map')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  台北市 12 行政區地圖政見
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('soapbox')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  肥皂箱實錄 · 轉發討論
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('heart')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  HEART 市政白皮書
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('currents')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  沈伯洋金句 · 洋流理念
                </button>
              </li>
              <li>
                <a
                  href="https://puma.taipei/policies"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-400 hover:text-orange-300 transition-colors font-bold flex items-center gap-1"
                >
                  <span>沈伯洋官方政策白皮書 ↗</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Civic Values */}
          <div className="md:col-span-3 space-y-2">
            <h4 className="text-xs font-bold text-neutral-200 uppercase tracking-wider">
              五大政策核心（HEART）
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              空間宜居 (Habitat) · 機會賦能 (Empowerment) · 全齡陪伴 (Accompaniment) · 首都韌性 (Resilience) · 高效時間 (Time)
            </p>
          </div>
        </div>

        {/* Quiet Bottom Line */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-2">
          <p>民間公民政策資訊整理平台 · 資料來源：沈伯洋公開街頭肥皂箱發言記錄</p>
          <p className="flex items-center gap-1">
            <span>洋流湧動</span>
            <span aria-hidden="true">·</span>
            <span>看見台北新力量</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
