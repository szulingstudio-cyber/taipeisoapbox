import React, { useState, useEffect } from 'react';
import { 
  X, 
  Download, 
  Copy, 
  Check, 
  Share2, 
  Smartphone, 
  MessageCircle,
  ExternalLink,
  Sparkles,
  Loader2
} from 'lucide-react';
import { SoapboxPolicy, TaipeiDistrict } from '../types';
import { generatePolicyCardBlob } from '../utils/cardImageGenerator';
import { buildLineUrl, buildThreadsUrl } from '../utils/shareFormatter';

interface PolicyImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  policy: SoapboxPolicy | null;
  districtName: string;
}

export const PolicyImageModal: React.FC<PolicyImageModalProps> = ({
  isOpen,
  onClose,
  policy,
  districtName,
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copiedImage, setCopiedImage] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen && policy) {
      setIsGenerating(true);
      generatePolicyCardBlob({ districtName, policy })
        .then((blob) => {
          setImageBlob(blob);
          const url = URL.createObjectURL(blob);
          setImageUrl(url);
          setIsGenerating(false);
        })
        .catch((err) => {
          console.error('Failed to generate image', err);
          setIsGenerating(false);
        });
    } else {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
        setImageUrl(null);
      }
      setImageBlob(null);
      setCopiedImage(false);
    }
  }, [isOpen, policy, districtName]);

  if (!isOpen || !policy) return null;

  // Download image to device
  const handleDownload = () => {
    if (!imageUrl) return;
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = `沈伯洋政見圖卡-${districtName}-${policy.id}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Copy image to clipboard
  const handleCopyImage = async () => {
    if (!imageBlob) return;
    try {
      // @ts-ignore
      await navigator.clipboard.write([
        new ClipboardItem({
          'image/png': imageBlob,
        }),
      ]);
      setCopiedImage(true);
      setTimeout(() => setCopiedImage(false), 2200);
    } catch (err) {
      console.warn('Clipboard write image not fully supported in this browser, downloading instead', err);
      handleDownload();
    }
  };

  // Web Share API (Mobile native share sheet)
  const handleNativeShare = async () => {
    if (!imageBlob) return;
    try {
      const file = new File([imageBlob], `政見圖卡-${districtName}.png`, { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `【台北市政見 · ${districtName}】${policy.title}`,
          text: `【${districtName}街頭肥皂箱實錄】${policy.pumaQuote}`,
        });
      } else {
        handleDownload();
      }
    } catch (err) {
      console.error('Share cancelled or failed', err);
    }
  };

  const lineUrl = buildLineUrl({
    districtName,
    title: policy.title,
    citizenQuestion: policy.citizenQuestion,
    pumaQuote: policy.pumaQuote,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto p-5 sm:p-6 shadow-2xl border border-orange-200/90 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-600 text-white flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-neutral-900">
                以圖卡直覺轉傳 LINE / 社群
              </h3>
              <p className="text-[11px] text-neutral-500">
                自動將【{districtName}】市民提問與沈伯洋解方轉為高畫質圖卡，社群分享一目瞭然！
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Card Preview */}
        <div className="relative rounded-2xl overflow-hidden border border-neutral-200 bg-neutral-100 flex items-center justify-center min-h-[300px] max-h-[460px]">
          {isGenerating ? (
            <div className="flex flex-col items-center gap-2 text-neutral-500 py-12">
              <Loader2 className="w-8 h-8 text-orange-600 animate-spin" />
              <span className="text-xs font-bold">正在客製繪製高畫質政見圖卡...</span>
            </div>
          ) : imageUrl ? (
            <img 
              src={imageUrl} 
              alt="政見分享圖卡" 
              className="w-full h-auto max-h-[460px] object-contain rounded-2xl shadow-sm"
            />
          ) : (
            <div className="text-xs text-neutral-400">無法產生預覽</div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          <div className="grid grid-cols-2 gap-2">
            {/* Download Button */}
            <button
              onClick={handleDownload}
              disabled={isGenerating || !imageUrl}
              className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-98 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>下載圖卡傳 LINE</span>
            </button>

            {/* Copy Image Button */}
            <button
              onClick={handleCopyImage}
              disabled={isGenerating || !imageUrl}
              className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-98 disabled:opacity-50"
            >
              {copiedImage ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300">已複製圖卡！</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>複製圖卡圖片</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* Native Mobile Share */}
            <button
              onClick={handleNativeShare}
              disabled={isGenerating || !imageUrl}
              className="px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Smartphone className="w-3.5 h-3.5 text-neutral-600" />
              <span>手機系統分享面板</span>
            </button>

            {/* Send Line text directly */}
            <a
              href={lineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-emerald-200"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>直接以 LINE 傳文字</span>
            </a>
          </div>
        </div>

        {/* Privacy & Performance Assurance Footer */}
        <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200/80 text-[11px] text-neutral-500 space-y-1">
          <p className="flex items-center gap-1 font-bold text-neutral-700">
            <Sparkles className="w-3.5 h-3.5 text-orange-600" />
            <span>用戶隱私與系統保證：</span>
          </p>
          <p>
            • 圖卡產生完全於您的瀏覽器本機 Canvas 繪製，<strong>極速生成、絕不上傳或留存任何資料</strong>。
          </p>
          <p>
            • 靜態頁面架構可承受上萬人同時造訪，絕無您的私人 Email 或帳號資訊外流。
          </p>
        </div>
      </div>
    </div>
  );
};
