import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  Volume2, 
  Heart, 
  MapPin, 
  Copy, 
  Check, 
  Mic, 
  Waves, 
  Quote, 
  Download, 
  Share2, 
  Compass, 
  CheckCircle2,
  FileImage,
  Palette
} from 'lucide-react';
import { SOAPBOX_POLICIES, ENRICHED_CAMPAIGN_QUOTES } from '../data/policies';
import { SoapboxPolicy, TaipeiDistrict, CampaignQuote } from '../types';
import { APP_REAL_URL, APP_LINE_URL, PUMA_SPEAKS_UP_URL } from '../config/urls';

interface PumaDigitalInteractiveProps {
  onSelectDistrictOnMap: (districtId: TaipeiDistrict) => void;
}

export const PumaDigitalInteractive: React.FC<PumaDigitalInteractiveProps> = ({
  onSelectDistrictOnMap
}) => {
  const [activeSpeech, setActiveSpeech] = useState(
    '「嗨！我是沈伯洋，歡迎站上街頭肥皂箱！今天台北有什麼市政問題想跟我聊聊？」'
  );
  const [userQuestion, setUserQuestion] = useState('');
  const [matchedPolicy, setMatchedPolicy] = useState<SoapboxPolicy | null>(SOAPBOX_POLICIES[0]);
  const [likesCount, setLikesCount] = useState(1284);
  const [hasLiked, setHasLiked] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Card Generator state (Zero-Compute Client-Side Canvas)
  const [selectedQuote, setSelectedQuote] = useState<CampaignQuote>(ENRICHED_CAMPAIGN_QUOTES[0]);
  const [cardColorTheme, setCardColorTheme] = useState<'orange' | 'cyan' | 'dark'>('orange');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [cardCopied, setCardCopied] = useState(false);

  const hotQuestions = [
    { label: '台北房租太高社宅抽不到', policyId: 'housing-queue' },
    { label: '推嬰兒車走人行道常斷頭', policyId: 'walkable-city' },
    { label: '內科上下班大塞車怎麼解', policyId: 'neihu-smart-transit' },
    { label: '青年工作高壓想找心理諮商', policyId: 'youth-mental-health' },
    { label: '帶毛小孩想搭捷運跟看獸醫', policyId: 'pet-friendly-city' },
    { label: '遭遇天災斷水斷電首都防衛', policyId: 'resilient-capital-defense' }
  ];

  const handleAskQuestion = (policyId?: string, queryText?: string) => {
    let targetPolicy = SOAPBOX_POLICIES[0];

    if (policyId) {
      targetPolicy = SOAPBOX_POLICIES.find((p) => p.id === policyId) || SOAPBOX_POLICIES[0];
    } else if (queryText) {
      const found = SOAPBOX_POLICIES.find(
        (p) =>
          p.title.includes(queryText) ||
          p.citizenQuestion.includes(queryText) ||
          p.tags.some((t) => queryText.includes(t))
      );
      if (found) targetPolicy = found;
    }

    setMatchedPolicy(targetPolicy);
    setActiveSpeech(
      `「感謝你的發聲！針對【${targetPolicy.title}】，我的承諾是：${targetPolicy.pumaQuote}」`
    );

    // Also sync the card generator
    const relatedQuote = ENRICHED_CAMPAIGN_QUOTES.find(q => q.policyId === targetPolicy.id);
    if (relatedQuote) {
      setSelectedQuote(relatedQuote);
    }
  };

  const handleLike = () => {
    if (!hasLiked) {
      setLikesCount((prev) => prev + 1);
      setHasLiked(true);
    }
  };

  const handleCopyMatched = () => {
    if (!matchedPolicy) return;
    const text = `【沈伯洋 台北市政見 · ${matchedPolicy.area}】\n${matchedPolicy.title}\n\n市民提問：${matchedPolicy.citizenQuestion}\n\n沈伯洋回答：${matchedPolicy.pumaQuote}\n\n👉 台北 12 行政區政見地圖：${APP_REAL_URL}\n如果有其他市政建議想提出，請至官方「市長，你給我聽好」留言\nhttps://puma.taipei/taipeispeaksup\n#沈伯洋 #台北順起來 #${matchedPolicy.area}`;
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Render high-res 1080x1080 social card on HTML5 Canvas (zero compute)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 1080;
    canvas.width = size;
    canvas.height = size;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    if (cardColorTheme === 'orange') {
      gradient.addColorStop(0, '#EA580C');
      gradient.addColorStop(0.5, '#F97316');
      gradient.addColorStop(1, '#FB923C');
    } else if (cardColorTheme === 'cyan') {
      gradient.addColorStop(0, '#0F766E');
      gradient.addColorStop(0.5, '#0D9488');
      gradient.addColorStop(1, '#14B8A6');
    } else {
      gradient.addColorStop(0, '#18181B');
      gradient.addColorStop(0.6, '#27272A');
      gradient.addColorStop(1, '#3F3F46');
    }
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    // Decorative wave ripples
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 4;
    for (let r = 200; r <= 800; r += 120) {
      ctx.beginPath();
      ctx.arc(size * 0.85, size * 0.15, r, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();

    // Flowing ocean current wave ribbons
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.beginPath();
    ctx.moveTo(0, size * 0.7);
    ctx.bezierCurveTo(size * 0.3, size * 0.6, size * 0.6, size * 0.85, size, size * 0.75);
    ctx.lineTo(size, size);
    ctx.lineTo(0, size);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.beginPath();
    ctx.moveTo(0, size * 0.78);
    ctx.bezierCurveTo(size * 0.4, size * 0.88, size * 0.7, size * 0.68, size, size * 0.82);
    ctx.lineTo(size, size);
    ctx.lineTo(0, size);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Card Inner Frame (Frosted glass outline)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 3;
    ctx.strokeRect(60, 60, size - 120, size - 120);

    // Header Badge: Brand Identity & Topic
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 34px "Noto Sans TC", sans-serif';
    ctx.fillText('🌊 洋流湧動 · 台北順起來', 100, 140);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.font = '500 24px "Noto Sans TC", sans-serif';
    ctx.fillText('沈伯洋 台北市 12 行政區政見所', 100, 180);

    // Topic Chip
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.beginPath();
    ctx.roundRect(size - 360, 105, 260, 60, 16);
    ctx.fill();

    ctx.fillStyle = '#FEF08A';
    ctx.font = 'bold 24px "Noto Sans TC", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`【#${selectedQuote.topic}】`, size - 230, 143);
    ctx.textAlign = 'left';

    // Quote Mark
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.font = 'italic 120px serif';
    ctx.fillText('“', 100, 310);

    // Quote Text Wrapping
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 46px "Noto Sans TC", sans-serif';
    const maxWidth = size - 220;
    const lineHeight = 72;
    const text = selectedQuote.quote;
    
    // Simple text wrapping algorithm
    let line = '';
    let y = 370;
    for (let n = 0; n < text.length; n++) {
      const testLine = line + text[n];
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line, 110, y);
        line = text[n];
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 110, y);

    // Attribution Section
    y += 90;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(110, y);
    ctx.lineTo(size - 110, y);
    ctx.stroke();

    y += 50;
    ctx.fillStyle = '#FEF08A';
    ctx.font = 'bold 30px "Noto Sans TC", sans-serif';
    ctx.fillText('—— 沈伯洋（台北市長候選人）', 110, y);

    y += 42;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.font = '24px "Noto Sans TC", sans-serif';
    ctx.fillText(`📍 現場實錄：${selectedQuote.context}`, 110, y);

    // Footer Info & Hashtags
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.font = 'bold 24px "Noto Sans TC", sans-serif';
    ctx.fillText('#沈伯洋 #台北順起來 #洋流向前 #公民肥皂箱', 110, size - 110);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '20px "Noto Sans TC", sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('資料來源引用：沈伯洋公開政策發言 · 民間公民圖表', size - 110, size - 110);
    ctx.textAlign = 'left';

  }, [selectedQuote, cardColorTheme]);

  const handleDownloadCard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `沈伯洋政見圖卡_${selectedQuote.topic}.png`;
    a.click();
  };

  const handleCopyCardText = () => {
    const text = `「${selectedQuote.quote}」\n\n—— 沈伯洋（${selectedQuote.context}）\n\n👉 台北 12 行政區政見地圖：${APP_REAL_URL}\n如果有其他市政建議想提出，請至官方「市長，你給我聽好」留言\nhttps://puma.taipei/taipeispeaksup\n#沈伯洋 #台北順起來 #${selectedQuote.topic}`;
    navigator.clipboard.writeText(text);
    setCardCopied(true);
    setTimeout(() => setCardCopied(false), 2000);
  };

  return (
    <div className="py-10 bg-linear-to-b from-white via-orange-50/40 to-neutral-50/70 border-t border-orange-100" id="currents-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Module 1: 沈伯洋金句、洋流理念 現場開講互動 */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold mb-2">
            <Mic className="w-3.5 h-3.5 text-orange-600" />
            <span>沈伯洋街頭對話 · 洋流理念開講</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight">
            沈伯洋金句 · 洋流理念互動舞台
          </h2>
          <p className="text-sm text-neutral-600 mt-2">
            點選熱門市政問題或輸入你想了解的議題，即刻查看沈伯洋在街頭肥皂箱的核心金句與具體洋流解方！
          </p>
        </div>

        {/* Stage Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-orange-200/80 shadow-lg max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Left Symbolic Ocean Currents Soundwave Emblem (No Candidate Photo) */}
            <div className="md:col-span-5 flex flex-col items-center text-center space-y-4">
              <div className="relative w-full max-w-[280px] aspect-square rounded-3xl bg-linear-to-br from-orange-500 via-orange-600 to-amber-600 text-white p-6 shadow-md flex flex-col items-center justify-between overflow-hidden">
                {/* Background wave ripple SVG */}
                <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" viewBox="0 0 200 200">
                  <circle cx="100" cy="100" r="30" stroke="#FFF" strokeWidth="2" strokeDasharray="3 3" />
                  <circle cx="100" cy="100" r="60" stroke="#FFF" strokeWidth="1.5" />
                  <circle cx="100" cy="100" r="90" stroke="#FFF" strokeWidth="1" strokeDasharray="4 4" />
                </svg>

                <div className="z-10 flex items-center justify-between w-full">
                  <span className="text-[10px] font-mono tracking-widest text-orange-200 uppercase">
                    Future Soon
                  </span>
                  <span className="text-[10px] bg-black/20 px-2 py-0.5 rounded-md font-bold">
                    台北順起來
                  </span>
                </div>

                <div className="z-10 flex flex-col items-center my-auto">
                  <div className="w-16 h-16 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner mb-2">
                    <Waves className="w-8 h-8 text-amber-200" />
                  </div>
                  <h3 className="text-xl font-black tracking-tight">洋流理念</h3>
                  <p className="text-xs text-orange-100 mt-0.5">沈伯洋 台北市政金句庫</p>
                </div>

                <div className="z-10 flex items-center gap-1.5 w-full justify-center pt-2 border-t border-white/20">
                  <span className="w-1.5 h-3 bg-white/80 rounded-full animate-pulse" />
                  <span className="w-1.5 h-5 bg-white rounded-full animate-pulse" style={{ animationDelay: '100ms' }} />
                  <span className="w-1.5 h-2 bg-white/70 rounded-full animate-pulse" style={{ animationDelay: '200ms' }} />
                  <span className="w-1.5 h-6 bg-white rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                  <span className="w-1.5 h-4 bg-white/90 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                  <span className="text-[11px] text-orange-100 ml-1 font-medium">洋流理念共鳴中</span>
                </div>
              </div>

              {/* Civic Cheer button & Random quote button */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleLike}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    hasLiked
                      ? 'bg-orange-500 text-white shadow-xs'
                      : 'bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-white' : ''}`} />
                  <span>市民應援 ({likesCount})</span>
                </button>

                <button
                  onClick={() => {
                    const randomQuote =
                      ENRICHED_CAMPAIGN_QUOTES[Math.floor(Math.random() * ENRICHED_CAMPAIGN_QUOTES.length)];
                    setActiveSpeech(`「${randomQuote.quote}」`);
                    setSelectedQuote(randomQuote);
                  }}
                  className="px-3 py-2 rounded-xl text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors cursor-pointer"
                >
                  隨機沈伯洋金句
                </button>
              </div>
            </div>

            {/* Right Speech & Question Box (7 cols) */}
            <div className="md:col-span-7 space-y-5">
              {/* Animated Speech Bubble */}
              <div className="relative p-5 bg-linear-to-br from-orange-50 via-amber-50/50 to-white rounded-2xl border-2 border-orange-300 shadow-xs">
                <div className="flex items-center justify-between text-xs text-orange-700 font-bold mb-2">
                  <span className="flex items-center gap-1.5">
                    <Volume2 className="w-4 h-4 text-orange-600 animate-pulse" />
                    沈伯洋街頭現場金句答覆
                  </span>
                  <span className="text-[11px] text-neutral-400">現場實錄金句</span>
                </div>
                <p className="text-sm sm:text-base font-bold text-neutral-900 leading-relaxed min-h-[50px]">
                  {activeSpeech}
                </p>
              </div>

              {/* Hot topic buttons */}
              <div>
                <p className="text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                  點選熱門街頭市民提問：
                </p>
                <div className="flex flex-wrap gap-2">
                  {hotQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAskQuestion(q.policyId)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-neutral-100 hover:bg-orange-100 hover:text-orange-900 text-neutral-700 border border-neutral-200/80 transition-colors cursor-pointer"
                    >
                      {q.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom question input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block">
                  或是輸入你想了解的市政關鍵字：
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={userQuestion}
                    onChange={(e) => setUserQuestion(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && userQuestion.trim()) {
                        handleAskQuestion(undefined, userQuestion.trim());
                      }
                    }}
                    placeholder="例如：捷運、托育、都更、青年租屋..."
                    className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-neutral-50 border border-neutral-300 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-hidden"
                  />
                  <button
                    onClick={() => {
                      if (userQuestion.trim()) {
                        handleAskQuestion(undefined, userQuestion.trim());
                      }
                    }}
                    className="px-4 py-2.5 text-xs sm:text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>查看回答</span>
                  </button>
                </div>
              </div>

              {/* Matched Policy Card Action */}
              {matchedPolicy && (
                <div className="p-4 bg-orange-50/70 rounded-2xl border border-orange-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-bold text-orange-700">對應在地政見（{matchedPolicy.area}）：</span>
                    <p className="text-xs font-bold text-neutral-900 line-clamp-1">
                      {matchedPolicy.title}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={handleCopyMatched}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-neutral-700 bg-white hover:bg-neutral-100 rounded-lg border border-neutral-200 transition-colors cursor-pointer"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-neutral-500" />}
                      <span>{isCopied ? '已複製' : '複製摘要'}</span>
                    </button>
                    <button
                      onClick={() => onSelectDistrictOnMap(matchedPolicy.districtId)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-lg shadow-2xs transition-colors cursor-pointer"
                    >
                      <MapPin className="w-3 h-3" />
                      <span>在地圖查看</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Module 2: Instant Infographic Social Card Studio (Zero-Compute, Client-Side) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-orange-200/90 shadow-md max-w-5xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-orange-600 mb-1">
                <FileImage className="w-4 h-4 text-orange-600" />
                <span>公眾圖文卡片工坊 · 零運算即時生成</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-neutral-900">
                沈伯洋金句 · 洋流理念資訊圖表分享卡
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 mt-0.5">
                選擇沈伯洋金句與色彩風格，一鍵匯出高畫質（1080×1080）圖文卡片，可直接發布至 Threads、Line、Facebook 或 Instagram！
              </p>
            </div>

            {/* Color Palette Selector */}
            <div className="flex items-center gap-2 bg-neutral-100 p-1.5 rounded-2xl">
              <span className="text-xs font-semibold text-neutral-600 pl-2 flex items-center gap-1">
                <Palette className="w-3.5 h-3.5 text-neutral-500" />
                <span>風格：</span>
              </span>
              <button
                onClick={() => setCardColorTheme('orange')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  cardColorTheme === 'orange' ? 'bg-orange-500 text-white shadow-xs' : 'text-neutral-700 hover:bg-white'
                }`}
              >
                活力暖橘
              </button>
              <button
                onClick={() => setCardColorTheme('cyan')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  cardColorTheme === 'cyan' ? 'bg-teal-600 text-white shadow-xs' : 'text-neutral-700 hover:bg-white'
                }`}
              >
                深青洋流
              </button>
              <button
                onClick={() => setCardColorTheme('dark')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  cardColorTheme === 'dark' ? 'bg-neutral-800 text-white shadow-xs' : 'text-neutral-700 hover:bg-white'
                }`}
              >
                簡約深灰
              </button>
            </div>
          </div>

          {/* Selector Grid of All Quotes */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block">
              選擇欲製作的金句主題：
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {ENRICHED_CAMPAIGN_QUOTES.map((q) => {
                const isSelected = selectedQuote.id === q.id;
                return (
                  <button
                    key={q.id}
                    onClick={() => setSelectedQuote(q)}
                    className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between min-h-[90px] ${
                      isSelected
                        ? 'border-orange-500 bg-orange-50/80 shadow-xs ring-2 ring-orange-200'
                        : 'border-neutral-200 hover:border-orange-200 hover:bg-neutral-50'
                    }`}
                  >
                    <span className="text-[11px] font-bold text-orange-600">
                      #{q.topic}
                    </span>
                    <p className="text-xs font-bold text-neutral-900 line-clamp-2 leading-snug">
                      {q.quote}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live Canvas Preview and Actions */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center pt-2">
            {/* Canvas Display (Left 6 cols) */}
            <div className="md:col-span-6 flex justify-center">
              <div className="w-full max-w-[340px] aspect-square rounded-2xl overflow-hidden shadow-lg border border-neutral-300">
                <canvas ref={canvasRef} className="w-full h-full block" />
              </div>
            </div>

            {/* Actions (Right 6 cols) */}
            <div className="md:col-span-6 space-y-4">
              <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200/80 space-y-2">
                <span className="text-xs font-bold text-neutral-800">已選定金句：</span>
                <blockquote className="text-sm font-bold text-neutral-900 italic">
                  「{selectedQuote.quote}」
                </blockquote>
                <p className="text-xs text-neutral-500">
                  出處：{selectedQuote.context}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                {/* Threads Share - Priority 1 */}
                <a
                  href={`https://www.threads.net/intent/post?text=${encodeURIComponent(
                    `「${selectedQuote.quote}」\n\n—— 沈伯洋（${selectedQuote.context}）\n🎯 主題：#${selectedQuote.topic} · ${selectedQuote.themeName}\n\n👉 台北 12 行政區政見地圖：${APP_REAL_URL}\n（資料來源引用：沈伯洋公開政策發言）\n#沈伯洋 #台北順起來 #${selectedQuote.topic}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm text-white bg-neutral-950 hover:bg-black shadow-sm transition-all cursor-pointer active:scale-98 border border-neutral-800"
                  title="以 Threads 轉發此金句圖卡文案（首選推薦）"
                >
                  <span className="font-mono text-sm font-black">@</span>
                  <span>Threads 轉發</span>
                </a>

                {/* LINE Share - Non-blocking parameter */}
                <a
                  href={`https://line.me/R/msg/text/?${encodeURIComponent(
                    `【台北市政見金句 · #${selectedQuote.topic}】\n「${selectedQuote.quote}」\n\n出處：${selectedQuote.context}\n\n👉 點此線上瀏覽 12 區政見地圖：\n${APP_LINE_URL}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-emerald-500 hover:bg-emerald-600 shadow-sm transition-all cursor-pointer active:scale-98"
                  title="以 LINE 轉發給好友（免卡關直開）"
                >
                  <span className="font-bold text-xs">L</span>
                  <span>LINE 轉發</span>
                </a>

                <button
                  onClick={handleDownloadCard}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-orange-600 hover:bg-orange-700 shadow-sm transition-all cursor-pointer active:scale-98"
                >
                  <Download className="w-4 h-4" />
                  <span>下載 1080P 圖卡</span>
                </button>

                <button
                  onClick={handleCopyCardText}
                  className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-neutral-700 bg-white hover:bg-neutral-100 border border-neutral-300 transition-colors cursor-pointer"
                >
                  {cardCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-neutral-500" />}
                  <span>{cardCopied ? '已複製' : '複製貼文'}</span>
                </button>
              </div>

              {selectedQuote.districtId && (
                <button
                  onClick={() => onSelectDistrictOnMap(selectedQuote.districtId!)}
                  className="inline-flex items-center gap-1.5 text-xs text-orange-600 hover:text-orange-700 font-semibold cursor-pointer"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>在地圖上查看相關行政區政見</span>
                </button>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
