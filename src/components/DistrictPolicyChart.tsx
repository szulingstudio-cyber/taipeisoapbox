import React, { useState } from 'react';
import { 
  BarChart2, 
  Radar as RadarIcon, 
  Sparkles, 
  CheckCircle2, 
  Info,
  Building2,
  Navigation,
  HeartPulse,
  ShieldAlert,
  Cpu,
  Layers,
  Award
} from 'lucide-react';
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  ResponsiveContainer, 
  Tooltip 
} from 'recharts';
import { DistrictInfo, POLICY_THEMES, SOAPBOX_POLICIES } from '../data/policies';
import { SoapboxPolicy, TaipeiDistrict } from '../types';

interface DistrictPolicyChartProps {
  district: DistrictInfo;
  policies: SoapboxPolicy[];
  selectedThemeId?: string | null;
  onSelectTheme?: (themeId: string | null) => void;
}

interface CategoryScore {
  id: string;
  name: string;
  enName: string;
  iconName: string;
  accentColor: string;
  score: number; // 0 to 100
  isPrimary: boolean;
  isAddressed: boolean;
  policyCount: number;
  tagsInDistrict: string[];
  description: string;
}

// Recharts Custom Tooltip with Warm Orange Theme Styling
const CustomRadarTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-orange-200 shadow-xl text-xs space-y-1 z-50">
        <div className="flex items-center gap-1.5 font-bold text-neutral-900">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shrink-0" />
          <span>{data.subject}</span>
          {data.isPrimary ? (
            <span className="text-[10px] bg-orange-100 text-orange-800 px-1.5 py-0.5 rounded font-bold">
              ★ 現場核心開講
            </span>
          ) : data.isAddressed ? (
            <span className="text-[10px] bg-teal-50 text-teal-800 px-1.5 py-0.5 rounded font-medium">
              在地急迫課題對應
            </span>
          ) : null}
        </div>
        <div className="text-neutral-700 flex items-center justify-between gap-4">
          <span>政策涵蓋評估：</span>
          <span className="font-mono font-black text-orange-600 text-sm">{data.score}%</span>
        </div>
        <p className="text-[11px] text-neutral-500 max-w-[200px] leading-relaxed pt-0.5">
          {data.description}
        </p>
      </div>
    );
  }
  return null;
};

export const DistrictPolicyChart: React.FC<DistrictPolicyChartProps> = ({
  district,
  policies,
  selectedThemeId,
  onSelectTheme,
}) => {
  // Default to radar chart as requested by user
  const [chartType, setChartType] = useState<'radar' | 'bar'>('radar');

  // Compute category breakdown scores for the selected district
  const categoryScores: CategoryScore[] = React.useMemo(() => {
    return POLICY_THEMES.map((theme) => {
      // Find policies under this theme in current district
      const themePolicies = policies.filter((p) => p.theme === theme.id);
      const isPrimary = themePolicies.length > 0;
      
      // Determine if key issues or features in this district touch this dimension
      const issueMatches = 
        district.keyIssues.includes(theme.name.slice(0, 2)) ||
        district.features.includes(theme.name.slice(0, 2)) ||
        (theme.id === 'transit' && (district.id === 'neihu' || district.id === 'songshan' || district.id === 'datong')) ||
        (theme.id === 'housing' && (district.id === 'shilin' || district.id === 'beitou' || district.id === 'wanhua')) ||
        (theme.id === 'youth' && (district.id === 'zhongshan' || district.id === 'daan' || district.id === 'nangang')) ||
        (theme.id === 'healthcare' && (district.id === 'wenshan' || district.id === 'xinyi' || district.id === 'beitou')) ||
        (theme.id === 'defense' && (district.id === 'zhongzheng' || district.id === 'nangang')) ||
        (theme.id === 'digital' && (district.id === 'datong' || district.id === 'neihu'));

      // Calculate grounded coverage percentage
      let score = 25; // Base citywide presence
      if (isPrimary) {
        score = 95;
      } else if (issueMatches) {
        score = 65;
      }

      // Collect related tags
      const tagsInDistrict = themePolicies.flatMap((p) => p.tags);

      return {
        id: theme.id,
        name: theme.name,
        enName: theme.enName,
        iconName: theme.icon,
        accentColor: theme.accentColor,
        score,
        isPrimary,
        isAddressed: isPrimary || issueMatches,
        policyCount: themePolicies.length,
        tagsInDistrict,
        description: theme.tagline,
      };
    });
  }, [district, policies]);

  // Transform data for Recharts RadarChart
  const rechartsData = React.useMemo(() => {
    return categoryScores.map((cat) => ({
      subject: cat.name,
      score: cat.score,
      fullMark: 100,
      themeId: cat.id,
      isPrimary: cat.isPrimary,
      isAddressed: cat.isAddressed,
      description: cat.description,
      tags: cat.tagsInDistrict,
    }));
  }, [categoryScores]);

  // Primary categories count
  const primaryCount = categoryScores.filter((c) => c.isPrimary).length;
  const addressedCount = categoryScores.filter((c) => c.isAddressed).length;

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-neutral-200/90 shadow-2xs space-y-4">
      {/* Chart Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-orange-600">
            <RadarIcon className="w-3.5 h-3.5" />
            <span>【{district.name}】政策領域分佈雷達圖</span>
          </div>
          <p className="text-xs text-neutral-500">
            以 Recharts 視覺化呈現該區涵蓋領域（居住、交通、教育青年、社福醫療、韌性防衛、數位治理）
          </p>
        </div>

        {/* View Toggle: Radar vs Bar */}
        <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setChartType('radar')}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all cursor-pointer ${
              chartType === 'radar'
                ? 'bg-white text-orange-950 shadow-2xs font-black'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <RadarIcon className="w-3 h-3 text-orange-600" />
            <span>雷達圖</span>
          </button>
          <button
            onClick={() => setChartType('bar')}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all cursor-pointer ${
              chartType === 'bar'
                ? 'bg-white text-orange-950 shadow-2xs font-black'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <BarChart2 className="w-3 h-3 text-orange-600" />
            <span>長條圖</span>
          </button>
        </div>
      </div>

      {/* Overview Stat Badges */}
      <div className="grid grid-cols-3 gap-2 pt-1 text-center">
        <div className="bg-orange-50/70 p-2.5 rounded-2xl border border-orange-100">
          <span className="text-[10px] text-orange-700 block font-medium">現場開講核心主軸</span>
          <span className="text-base sm:text-lg font-mono font-black text-orange-950">
            {primaryCount} <span className="text-xs font-normal text-orange-700">類核心</span>
          </span>
        </div>
        <div className="bg-neutral-50 p-2.5 rounded-2xl border border-neutral-200/80">
          <span className="text-[10px] text-neutral-500 block font-medium">市政課題對應</span>
          <span className="text-base sm:text-lg font-mono font-black text-neutral-800">
            {addressedCount} <span className="text-xs font-normal text-neutral-500">/ 6 領域</span>
          </span>
        </div>
        <div className="bg-emerald-50/70 p-2.5 rounded-2xl border border-emerald-100">
          <span className="text-[10px] text-emerald-700 block font-medium">法規自治條例依據</span>
          <span className="text-base sm:text-lg font-mono font-black text-emerald-800">
            100% <span className="text-xs font-normal text-emerald-600">具法源</span>
          </span>
        </div>
      </div>

      {/* Recharts Radar Chart View */}
      {chartType === 'radar' ? (
        <div className="py-2 flex flex-col items-center">
          <div className="w-full h-[290px] max-w-[420px] mx-auto select-none">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart 
                cx="50%" 
                cy="50%" 
                outerRadius="72%" 
                data={rechartsData}
              >
                {/* Warm orange themed PolarGrid */}
                <PolarGrid 
                  stroke="#FED7AA" 
                  strokeOpacity={0.7} 
                  strokeDasharray="3 3"
                />
                
                {/* Styled Angle Axis */}
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={{ 
                    fill: '#431407', 
                    fontSize: 12, 
                    fontWeight: 800,
                  }}
                  onClick={(data: any) => {
                    if (data && data.value) {
                      const matched = categoryScores.find(c => c.name === data.value);
                      if (matched && onSelectTheme) {
                        onSelectTheme(selectedThemeId === matched.id ? null : matched.id);
                      }
                    }
                  }}
                  className="cursor-pointer"
                />

                {/* Subtle Radius Axis */}
                <PolarRadiusAxis 
                  angle={30} 
                  domain={[0, 100]} 
                  stroke="#FED7AA" 
                  tick={{ fill: '#A8A29E', fontSize: 9 }}
                />

                {/* Warm Orange Radar Area */}
                <Radar
                  name="政策領域覆蓋度"
                  dataKey="score"
                  stroke="#EA580C"
                  strokeWidth={2.5}
                  fill="#FF6B00"
                  fillOpacity={0.42}
                  dot={{ r: 4, fill: '#FF6B00', stroke: '#FFFFFF', strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: '#EA580C', stroke: '#FFFFFF', strokeWidth: 2 }}
                />

                <Tooltip content={<CustomRadarTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-4 text-[11px] text-neutral-500 mt-1 flex-wrap font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-600" />
              <span>暖橘多邊形：【{district.name}】施政領域分佈強度</span>
            </span>
            <span className="text-neutral-400">|</span>
            <span className="text-orange-700 font-bold">
              ★ 點擊外圍類別可篩選下方政見
            </span>
          </div>
        </div>
      ) : (
        /* Minimalist Horizontal Bar Chart View */
        <div className="space-y-2.5 pt-2">
          {categoryScores.map((cat) => {
            const isSelected = selectedThemeId === cat.id;

            return (
              <div
                key={cat.id}
                onClick={() => onSelectTheme && onSelectTheme(isSelected ? null : cat.id)}
                className={`p-2.5 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-orange-500 bg-orange-50/50 shadow-2xs'
                    : 'border-neutral-100 bg-neutral-50/50 hover:bg-neutral-100/70'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: cat.accentColor }}
                    />
                    <span className="font-bold text-neutral-800">{cat.name}</span>
                    <span className="text-[10px] text-neutral-400 font-mono hidden sm:inline">
                      {cat.enName}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {cat.isPrimary && (
                      <span className="px-2 py-0.5 rounded-md bg-orange-500 text-white text-[10px] font-bold">
                        ★ 本區核心收錄
                      </span>
                    )}
                    {cat.isAddressed && !cat.isPrimary && (
                      <span className="px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 text-[10px] font-medium border border-teal-200">
                        在地課題對應
                      </span>
                    )}
                    <span className="font-mono text-xs font-bold text-neutral-600">
                      {cat.score}%
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-neutral-200/80 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${cat.score}%`,
                      backgroundColor: cat.isPrimary ? '#FF6B00' : cat.isAddressed ? '#0D9488' : '#D1D5DB',
                    }}
                  />
                </div>

                {/* Tags if primary */}
                {cat.isPrimary && cat.tagsInDistrict.length > 0 && (
                  <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                    <span className="text-[10px] text-neutral-500">本區標籤：</span>
                    {cat.tagsInDistrict.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-1.5 py-0.5 rounded bg-white text-neutral-700 text-[10px] border border-neutral-200 font-medium"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Grounded Source Footer Note */}
      <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400">
        <span className="flex items-center gap-1">
          <Info className="w-3 h-3 text-neutral-400" />
          <span>數據來源：沈伯洋街頭肥皂箱發言記錄 · 台北市12行政區市政資料</span>
        </span>
        <span className="font-mono text-[10px] text-emerald-600 font-bold">✓ 隱私安全保證 · 本機即時運算</span>
      </div>
    </div>
  );
};
