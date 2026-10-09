import { SoapboxPolicy, TaipeiDistrict } from '../types';
import { APP_REAL_URL } from '../config/urls';

export interface DrawCardOptions {
  districtName: string;
  policy: SoapboxPolicy;
  customQuote?: string;
}

/**
 * Client-side HTML5 Canvas generator for generating crisp, warm-orange
 * infographic cards specifically optimized for LINE, Threads, and chat forwards.
 * Zero server compute, works 100% offline/client-side.
 */
export async function generatePolicyCardBlob(options: DrawCardOptions): Promise<Blob> {
  const { districtName, policy } = options;

  const width = 1080;
  const height = 1350;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas 2D context not supported');
  }

  // Helper function to draw rounded rectangles
  function roundRect(
    x: number,
    y: number,
    w: number,
    h: number,
    r: number,
    fill?: string,
    stroke?: string,
    lineWidth: number = 1
  ) {
    ctx!.beginPath();
    ctx!.moveTo(x + r, y);
    ctx!.lineTo(x + w - r, y);
    ctx!.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx!.lineTo(x + w, y + h - r);
    ctx!.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx!.lineTo(x + r, y + h);
    ctx!.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx!.lineTo(x, y + r);
    ctx!.quadraticCurveTo(x, y, x + r, y);
    ctx!.closePath();
    if (fill) {
      ctx!.fillStyle = fill;
      ctx!.fill();
    }
    if (stroke) {
      ctx!.strokeStyle = stroke;
      ctx!.lineWidth = lineWidth;
      ctx!.stroke();
    }
  }

  // Helper function to wrap text
  function wrapText(
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number,
    maxLines: number = 4
  ): number {
    const words = text.split('');
    let line = '';
    let currentY = y;
    let linesDrawn = 0;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n];
      const metrics = ctx!.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        linesDrawn++;
        if (linesDrawn >= maxLines) {
          ctx!.fillText(line + '...', x, currentY);
          return currentY + lineHeight;
        }
        ctx!.fillText(line, x, currentY);
        line = words[n];
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx!.fillText(line, x, currentY);
    return currentY + lineHeight;
  }

  // 1. Background (Warm cream / white background with subtle border)
  ctx.fillStyle = '#FFFBF7';
  ctx.fillRect(0, 0, width, height);

  // Subtle warm top accent
  const topGrad = ctx.createLinearGradient(0, 0, width, 220);
  topGrad.addColorStop(0, '#FF6B00');
  topGrad.addColorStop(1, '#EA580C');
  ctx.fillStyle = topGrad;
  ctx.fillRect(0, 0, width, 180);

  // Top header text inside orange banner
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 36px "PingFang TC", "Microsoft JhengHei", sans-serif';
  ctx.fillText('台北市 12 行政區 · 街頭肥皂箱實錄', 70, 75);

  ctx.fillStyle = '#FED7AA';
  ctx.font = '24px "PingFang TC", "Microsoft JhengHei", sans-serif';
  ctx.fillText('台北市長給我聽好 · 市民發問與沈伯洋市政解方', 70, 125);

  // District Pill Badge
  roundRect(70, 215, 230, 52, 26, '#FFEDD5', '#FB923C', 2);
  ctx.fillStyle = '#C2410C';
  ctx.font = 'bold 24px "PingFang TC", "Microsoft JhengHei", sans-serif';
  ctx.fillText(`【${districtName}】`, 90, 250);

  // Single Clear Primary Theme Badge
  roundRect(315, 215, 210, 52, 26, '#FFF7ED', '#EA580C', 1.5);
  ctx.fillStyle = '#9A3412';
  ctx.font = 'bold 22px "PingFang TC", "Microsoft JhengHei", sans-serif';
  ctx.fillText(`領域：${policy.themeName}`, 335, 250);

  // Station location
  ctx.fillStyle = '#78716C';
  ctx.font = '22px "PingFang TC", "Microsoft JhengHei", sans-serif';
  const stationText = policy.station.length > 20 ? policy.station.slice(0, 20) + '...' : policy.station;
  ctx.fillText(`開講地標：${stationText}`, 545, 250);

  // 2. Policy Title
  ctx.fillStyle = '#1C1917';
  ctx.font = 'bold 42px "PingFang TC", "Microsoft JhengHei", sans-serif';
  const afterTitleY = wrapText(policy.title, 70, 335, 940, 54, 2);

  // 3. Citizen Question Box (Warm amber card)
  const citizenBoxY = afterTitleY + 12;
  const citizenBoxH = 185;
  roundRect(70, citizenBoxY, 940, citizenBoxH, 24, '#FEF3C7', '#FDE68A', 2);

  ctx.fillStyle = '#92400E';
  ctx.font = 'bold 24px "PingFang TC", "Microsoft JhengHei", sans-serif';
  ctx.fillText(`💬 市民現場提問 (${policy.citizenName} · ${policy.citizenRole})：`, 100, citizenBoxY + 42);

  ctx.fillStyle = '#451A03';
  ctx.font = 'italic 25px "PingFang TC", "Microsoft JhengHei", sans-serif';
  wrapText(`「${policy.citizenQuestion}」`, 100, citizenBoxY + 80, 880, 38, 2);

  // 4. Puma's Response Box (Deep Orange Accent Card)
  const pumaBoxY = citizenBoxY + citizenBoxH + 20;
  const pumaBoxH = 185;
  roundRect(70, pumaBoxY, 940, pumaBoxH, 24, '#FFEDD5', '#FDBA74', 2);

  ctx.fillStyle = '#9A3412';
  ctx.font = 'bold 24px "PingFang TC", "Microsoft JhengHei", sans-serif';
  ctx.fillText('答 沈伯洋核心承諾與解方：', 100, pumaBoxY + 42);

  const quoteToDisplay = options.customQuote?.trim() || policy.pumaQuote;
  ctx.fillStyle = '#431407';
  ctx.font = 'bold 26px "PingFang TC", "Microsoft JhengHei", sans-serif';
  wrapText(quoteToDisplay, 100, pumaBoxY + 82, 880, 40, 2);

  // 5. Three Key Solutions Section
  const solY = pumaBoxY + pumaBoxH + 25;
  ctx.fillStyle = '#7C2D12';
  ctx.font = 'bold 23px "PingFang TC", "Microsoft JhengHei", sans-serif';
  ctx.fillText('三大落地方針與具體步驟：', 70, solY);

  const stepBoxY = solY + 12;
  policy.solutions.slice(0, 3).forEach((sol, idx) => {
    const cardY = stepBoxY + idx * 82;
    roundRect(70, cardY, 940, 72, 16, '#FFFFFF', '#E7E5E4', 1.5);

    // Number tag
    roundRect(85, cardY + 14, 44, 44, 10, '#FF6B00');
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 22px monospace';
    ctx.fillText(`0${idx + 1}`, 96, cardY + 43);

    // Point & Detail
    ctx.fillStyle = '#1C1917';
    ctx.font = 'bold 22px "PingFang TC", "Microsoft JhengHei", sans-serif';
    ctx.fillText(sol.point, 145, cardY + 36);

    ctx.fillStyle = '#78716C';
    ctx.font = '18px "PingFang TC", "Microsoft JhengHei", sans-serif';
    const detailSnippet = sol.detail.length > 36 ? sol.detail.slice(0, 36) + '...' : sol.detail;
    ctx.fillText(detailSnippet, 145, cardY + 58);
  });

  // 6. Grounding Legal Basis
  const groundY = stepBoxY + 3 * 82 + 18;
  ctx.fillStyle = '#57534E';
  ctx.font = '19px "PingFang TC", "Microsoft JhengHei", sans-serif';
  wrapText(`推動法規依據：${policy.groundingDetail}`, 70, groundY, 940, 26, 1);

  ctx.fillStyle = '#A8A29E';
  ctx.font = '17px "PingFang TC", "Microsoft JhengHei", sans-serif';
  ctx.fillText('引用來源：沈伯洋公開街頭肥皂箱發言記錄 · 台北市長給我聽好', 70, groundY + 30);

  // 7. Footer Bar
  roundRect(70, height - 110, 940, 70, 20, '#1C1917');
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 22px "PingFang TC", "Microsoft JhengHei", sans-serif';
  ctx.fillText('台北 12 行政區政見互動地圖', 105, height - 66);

  ctx.fillStyle = '#FB923C';
  ctx.font = 'bold 20px monospace';
  ctx.fillText(APP_REAL_URL, 620, height - 66);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('Failed to create Blob from canvas'));
      }
    }, 'image/png');
  });
}
