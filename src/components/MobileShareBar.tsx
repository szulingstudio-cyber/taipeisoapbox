import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  Smartphone, 
  ExternalLink,
  MessageCircle,
  Share2,
  Image as ImageIcon
} from 'lucide-react';
import { SoapboxPolicy, TaipeiDistrict } from '../types';
import { TAIPEI_DISTRICTS, SOAPBOX_POLICIES } from '../data/policies';
import { APP_REAL_URL, APP_LINE_URL, PUMA_SPEAKS_UP_URL } from '../config/urls';
import { buildThreadsUrl, buildLineUrl, buildThreadsShareText } from '../utils/shareFormatter';
import { PolicyImageModal } from './PolicyImageModal';

interface MobileShareBarProps {
  currentDistrictId?: TaipeiDistrict;
  activePolicy?: SoapboxPolicy;
}

export const MobileShareBar: React.FC<MobileShareBarProps> = ({
  currentDistrictId = 'shilin',
  activePolicy
}) => {
  const [copiedText, setCopiedText] = useState(false);
  const [copiedAppUrl, setCopiedAppUrl] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const district = TAIPEI_DISTRICTS.find((d) => d.id === currentDistrictId) || TAIPEI_DISTRICTS[1];
  const policy = activePolicy || SOAPBOX_POLICIES.find((p) => p.districtId === currentDistrictId) || SOAPBOX_POLICIES[0];

  const shareData = {
    districtName: district.name,
    title: policy.title,
    citizenQuestion: policy.citizenQuestion,
    pumaQuote: policy.pumaQuote
  };

  const threadsShareUrl = buildThreadsUrl(shareData);
  const lineShareUrl = buildLineUrl(shareData);

  // Clean copy text tailored for group chats without emoji glitches
  const mobileMessage = `【台北市政見探索 · ${district.name}】
題目：${policy.title}

[市民提問]
${policy.citizenQuestion}

[沈伯洋回覆與承諾]
${policy.pumaQuote}

三大落地方針：
1. ${policy.solutions[0].point}：${policy.solutions[0].detail}
2. ${policy.solutions[1].point}：${policy.solutions[1].detail}
3. ${policy.solutions[2].point}：${policy.solutions[2].detail}

完整12區互動地圖：
${APP_REAL_URL}

如果有其他市政建議想提出，請至官方「市長，你給我聽好」留言
https://puma.taipei/taipeispeaksup
(引用來源：沈伯洋公開街頭肥皂箱發言記錄)
#沈伯洋 #台北市政見 #${district.name}`;

  const handleCopyMobileText = () => {
    navigator.clipboard.writeText(mobileMessage);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2200);
  };

  const handleCopyAppUrl = () => {
    navigator.clipboard.writeText(APP_REAL_URL);
    setCopiedAppUrl(true);
    setTimeout(() => setCopiedAppUrl(false), 2200);
  };

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-orange-200/90 shadow-sm space-y-3.5">
      {/* Header: Pure focus on Social Forwarding */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 pb-2 border-b border-neutral-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-linear-to-br from-orange-500 to-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Share2 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm sm:text-base font-black text-neutral-900 tracking-tight">
                社群一鍵轉發
              </h4>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-neutral-950 text-white">
                Threads 首選
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                LINE 直開無阻
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              以 Threads 與 LINE 快速分享市民關注政見
            </p>
          </div>
        </div>

        {/* Copy Real App URL button */}
        <button
          onClick={handleCopyAppUrl}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-900 text-xs font-bold transition-all cursor-pointer active:scale-95"
          title="複製此網頁可分享網址"
        >
          {copiedAppUrl ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="text-emerald-700 font-sans">已複製網頁連結</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3 text-orange-500 shrink-0" />
              <span className="text-orange-800 font-bold">複製網頁分享連結</span>
            </>
          )}
        </button>
      </div>

      {/* Social Action Buttons: Strictly Focused on Threads, LINE & Image Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {/* 1. Image Card Export (Top Recommended for LINE) */}
        <button
          onClick={() => setIsImageModalOpen(true)}
          className="p-3 sm:p-3.5 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white transition-all flex items-center justify-center gap-2.5 text-xs font-bold shadow-md hover:shadow-lg active:scale-98 cursor-pointer"
          title="以高畫質圖卡轉傳 LINE / 儲存圖片"
        >
          <div className="w-5 h-5 rounded-full bg-white text-orange-600 flex items-center justify-center">
            <ImageIcon className="w-3.5 h-3.5" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[10px] text-orange-200 font-medium leading-none">LINE 最推薦</span>
            <span className="text-xs font-black leading-tight">以圖轉出 / 傳LINE</span>
          </div>
        </button>

        {/* 2. Threads Share (First Priority #1) */}
        <a
          href={threadsShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 sm:p-3.5 rounded-2xl bg-neutral-950 hover:bg-black text-white transition-all flex items-center justify-center gap-2.5 text-xs font-black shadow-md hover:shadow-lg active:scale-98 cursor-pointer border border-neutral-800 group"
          title="以 Threads 轉發此政見（首選推薦）"
        >
          <div className="w-5 h-5 rounded-full bg-white text-neutral-950 flex items-center justify-center font-mono font-black text-xs group-hover:scale-110 transition-transform">
            @
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[10px] text-neutral-400 font-medium leading-none">第一首選</span>
            <span className="text-xs font-bold leading-tight">Threads 轉發討論</span>
          </div>
        </a>

        {/* 3. LINE Share (Non-blocking direct open for mobile chats) */}
        <a
          href={lineShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 sm:p-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white transition-all flex items-center justify-center gap-2.5 text-xs font-bold shadow-md hover:shadow-lg active:scale-98 cursor-pointer"
          title="以 LINE 轉發純文字給好友"
        >
          <div className="w-5 h-5 rounded-full bg-white text-emerald-600 flex items-center justify-center font-black text-[11px]">
            L
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[10px] text-emerald-100 font-medium leading-none">手機秒開</span>
            <span className="text-xs font-bold leading-tight">LINE 一鍵分享</span>
          </div>
        </a>

        {/* 4. Copy Formatted Short Text for Group Chats */}
        <button
          onClick={handleCopyMobileText}
          className="p-3 sm:p-3.5 rounded-2xl bg-orange-50/80 hover:bg-orange-100/90 border border-orange-200 text-orange-950 transition-colors flex items-center justify-center gap-2 text-xs font-bold shadow-2xs active:scale-98 cursor-pointer"
          title="複製適合轉貼於社群對話之政見好讀短文"
        >
          {copiedText ? (
            <>
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <div className="flex flex-col text-left">
                <span className="text-[10px] text-emerald-700 font-medium leading-none">已複製</span>
                <span className="text-xs font-bold text-emerald-900 leading-tight">好讀文案已存</span>
              </div>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-orange-600 shrink-0" />
              <div className="flex flex-col text-left">
                <span className="text-[10px] text-orange-600 font-medium leading-none">社群貼文</span>
                <span className="text-xs font-bold leading-tight">複製好讀短文</span>
              </div>
            </>
          )}
        </button>
      </div>

      {/* Policy Image Modal */}
      <PolicyImageModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        policy={policy}
        districtName={district.name}
      />

      {/* Official Feedback CTA Banner */}
      <div className="bg-linear-to-r from-orange-500 to-amber-500 rounded-2xl p-3 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-base">💬</span>
          <div>
            <p className="text-xs font-bold leading-tight">
              如果有其他市政建議想提出？
            </p>
            <p className="text-[11px] text-orange-100 mt-0.5">
              請至官方「市長，你給我聽好」留言：<span className="font-mono underline font-bold">https://puma.taipei/taipeispeaksup</span>
            </p>
          </div>
        </div>
        <a
          href="https://puma.taipei/taipeispeaksup"
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 rounded-xl bg-white text-orange-700 hover:bg-orange-50 font-black text-xs transition-colors shrink-0 flex items-center gap-1 shadow-2xs self-end sm:self-auto cursor-pointer"
        >
          <span>前往留言加入 ↗</span>
        </a>
      </div>

      {/* Target Policy Preview & Citation Notice */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pt-1 text-[11px] text-neutral-400">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
          <span className="line-clamp-1 text-neutral-600">
            目前轉發：【{district.name}】{policy.title}
          </span>
        </div>
        <div>
          資料來源引用：沈伯洋街頭肥皂箱發言記錄
        </div>
      </div>
    </div>
  );
};
