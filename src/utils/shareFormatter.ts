import { APP_REAL_URL, APP_LINE_URL, PUMA_SPEAKS_UP_URL } from '../config/urls';

interface PolicyShareData {
  districtName: string;
  title: string;
  citizenQuestion: string;
  pumaQuote: string;
}

/**
 * Clean plain-text formatting for Threads sharing without decorative emojis 
 * that risk character encoding distortion, including space for citizen discussion.
 */
export function buildThreadsShareText(data: PolicyShareData): string {
  return `【台北市政見探索 · ${data.districtName}】
題目：${data.title}

[市民提問]
${data.citizenQuestion}

[沈伯洋回覆]
${data.pumaQuote}

大家覺得這項解方在在地推行可行嗎？歡迎分享你的看法與建議！
完整12區互動地圖：${APP_REAL_URL}
如果有其他市政建議想提出，請至官方「市長，你給我聽好」留言
https://puma.taipei/taipeispeaksup
(引用來源：沈伯洋公開街頭肥皂箱開講記錄)
#沈伯洋 #台北市政見 #${data.districtName}`;
}

export function buildThreadsUrl(data: PolicyShareData): string {
  const text = buildThreadsShareText(data);
  return `https://www.threads.net/intent/post?text=${encodeURIComponent(text)}`;
}

/**
 * Clean plain-text formatting for LINE sharing with direct open browser parameter
 */
export function buildLineShareText(data: PolicyShareData): string {
  return `【台北市政見 · ${data.districtName}】
${data.title}

市民提問：
${data.citizenQuestion}

沈伯洋回覆：
${data.pumaQuote}

點此看12區互動地圖：
${APP_LINE_URL}
(引用來源：沈伯洋街頭肥皂箱發言記錄)`;
}

export function buildLineUrl(data: PolicyShareData): string {
  const text = buildLineShareText(data);
  return `https://line.me/R/msg/text/?${encodeURIComponent(text)}`;
}
