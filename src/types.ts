export type HeartCategory = 'Habitat' | 'Empowerment' | 'Accompaniment' | 'Resilience' | 'Time';

export interface HeartPillar {
  letter: 'H' | 'E' | 'A' | 'R' | 'T';
  key: HeartCategory;
  name: string;
  enName: string;
  slogan: string;
  coreConcept: string;
  pillars: {
    title: string;
    description: string;
    targetMetric: string;
  }[];
  accentColor: string;
  badgeBg: string;
}

export type PolicyTheme = 
  | 'housing'     // 居住正義
  | 'transit'     // 交通運輸
  | 'youth'       // 青年世代
  | 'healthcare'  // 健康醫療與社福
  | 'defense'     // 首都防衛與韌性
  | 'digital';    // 數位治理與透明

export type TaipeiDistrict = 
  | 'beitou'      // 北投區
  | 'shilin'      // 士林區
  | 'neihu'       // 內湖區
  | 'nangang'     // 南港區
  | 'songshan'    // 松山區
  | 'zhongshan'   // 中山區
  | 'datong'      // 大同區
  | 'zhongzheng'  // 中正區
  | 'wanhua'      // 萬華區
  | 'daan'        // 大安區
  | 'xinyi'       // 信義區
  | 'wenshan';    // 文山區

export interface PolicyFAQ {
  question: string;
  answer: string;
}

export interface CampaignQuote {
  id: string;
  quote: string;
  topic: string;
  theme: PolicyTheme;
  themeName: string;
  context: string;
  districtId?: TaipeiDistrict;
  policyId?: string;
  highlightWords?: string[];
}

export interface SoapboxPolicy {
  id: string;
  districtId: TaipeiDistrict;
  area: string; // e.g. "士林區"
  theme: PolicyTheme;
  themeName: string;
  station: string; // e.g. "士林劍潭捷運站 1 號出口"
  title: string;
  summary: string;
  category: HeartCategory;
  categoryName: string;
  citizenName: string;
  citizenRole: string;
  citizenQuestion: string;
  citizenPainPoint: string;
  pumaSummary: string;
  pumaQuote: string;
  solutions: {
    point: string;
    detail: string;
  }[];
  groundingDetail: string; // 法律或行政規劃細節
  faqs: PolicyFAQ[];
  threadsExcerpt: string;
  tags: string[];
}

export type CardTheme = 'current_orange' | 'ocean_deep' | 'dawn_minimal';
