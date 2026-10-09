import React, { useState } from 'react';
import { 
  Users, 
  Briefcase, 
  Train, 
  Baby, 
  HeartHandshake, 
  Dog, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  MapPin,
  CheckCircle2
} from 'lucide-react';
import { SOAPBOX_POLICIES } from '../data/policies';
import { TaipeiDistrict, SoapboxPolicy } from '../types';

interface CivicRoleMatcherProps {
  onSelectDistrict: (districtId: TaipeiDistrict) => void;
}

interface RoleOption {
  id: string;
  name: string;
  icon: React.ReactNode;
  tagline: string;
  targetPolicyIds: string[];
}

export const CivicRoleMatcher: React.FC<CivicRoleMatcherProps> = ({ onSelectDistrict }) => {
  const roles: RoleOption[] = [
    {
      id: 'renter',
      name: '租屋青年 / 北漂族',
      icon: <Briefcase className="w-4 h-4 text-orange-600" />,
      tagline: '房租高不可攀、社宅抽籤像賭博、心理高壓渴望喘息',
      targetPolicyIds: ['housing-queue', 'youth-mental-health', 'zhongshan-night-economy']
    },
    {
      id: 'commuter',
      name: '雙北通勤 / 上班族',
      icon: <Train className="w-4 h-4 text-teal-600" />,
      tagline: '內科上下班大塞車、推車走路人行道常斷頭、跨市轉運擠破頭',
      targetPolicyIds: ['neihu-smart-transit', 'walkable-city', 'nangang-biotech-transit']
    },
    {
      id: 'family',
      name: '新手爸媽 / 育兒家庭',
      icon: <Baby className="w-4 h-4 text-amber-600" />,
      tagline: '公托中籤難、臨托夜托無處找、帶小孩出門需要安全人行步道',
      targetPolicyIds: ['childcare-mental-health', 'walkable-city', 'wenshan-education-eldercare']
    },
    {
      id: 'caregiver',
      name: '長照家庭 / 孝親族',
      icon: <HeartHandshake className="w-4 h-4 text-purple-600" />,
      tagline: '高齡父母日間照護據點不足、老舊公寓爬梯困難、防走失系統待升級',
      targetPolicyIds: ['wenshan-education-eldercare', 'beitou-hotspring-resilience', 'datong-heritage-safety']
    },
    {
      id: 'pet',
      name: '毛小孩家長',
      icon: <Dog className="w-4 h-4 text-rose-600" />,
      tagline: '帶寵物搭公車捷運限制多、動物看病無公立互助補助、友善空間缺乏',
      targetPolicyIds: ['pet-friendly-city']
    },
    {
      id: 'resilience',
      name: '關心安全 / 防災市民',
      icon: <ShieldCheck className="w-4 h-4 text-blue-600" />,
      tagline: '天災斷水斷電關鍵備援、老屋耐震與消防安全、防空避難演練普及',
      targetPolicyIds: ['resilient-capital-defense', 'beitou-hotspring-resilience', 'datong-heritage-safety']
    }
  ];

  const [activeRoleId, setActiveRoleId] = useState<string>('renter');

  const activeRole = roles.find((r) => r.id === activeRoleId) || roles[0];
  const matchedPolicies = SOAPBOX_POLICIES.filter((p) =>
    activeRole.targetPolicyIds.includes(p.id)
  );

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-orange-200/90 shadow-md space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-neutral-100 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-orange-600 mb-1">
            <Users className="w-4 h-4 text-orange-600" />
            <span>市民角色配對 · 快速探索最切身市政解方</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
            你眼中的台北痛點是什麼？
          </h3>
        </div>
        <span className="text-xs text-neutral-400 font-medium">
          點選角色，即刻檢視對應行政區政見
        </span>
      </div>

      {/* Role Pill Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {roles.map((r) => {
          const isSelected = activeRoleId === r.id;
          return (
            <button
              key={r.id}
              onClick={() => setActiveRoleId(r.id)}
              className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex flex-col items-start justify-between min-h-[80px] ${
                isSelected
                  ? 'border-orange-500 bg-orange-50/80 shadow-xs ring-2 ring-orange-200'
                  : 'border-neutral-200 hover:border-orange-200 hover:bg-neutral-50'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="p-1.5 bg-white rounded-lg shadow-2xs">
                  {r.icon}
                </span>
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
                )}
              </div>
              <span className={`text-xs font-bold mt-2 ${isSelected ? 'text-orange-950 font-black' : 'text-neutral-800'}`}>
                {r.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Match Results Display */}
      <div className="bg-linear-to-r from-orange-50/60 via-amber-50/40 to-white p-5 rounded-2xl border border-orange-200 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-orange-600" />
            <span className="text-xs font-bold text-orange-800">
              【{activeRole.name}】的日常痛點：
            </span>
            <span className="text-xs text-neutral-600 italic">
              {activeRole.tagline}
            </span>
          </div>
          <span className="text-xs font-bold text-orange-700 bg-orange-100 px-2.5 py-0.5 rounded-md">
            為您推薦 {matchedPolicies.length} 條焦點政見
          </span>
        </div>

        {/* Matched Policies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {matchedPolicies.map((policy) => (
            <div
              key={policy.id}
              className="bg-white p-4 rounded-xl border border-orange-200/80 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between space-y-2.5"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-bold text-orange-700 mb-1">
                  <span className="bg-orange-100 px-2 py-0.5 rounded-md">
                    {policy.area}
                  </span>
                  <span className="text-neutral-400">
                    {policy.themeName}
                  </span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-neutral-900 line-clamp-2 leading-snug">
                  {policy.title}
                </h4>
                <p className="text-[11px] text-neutral-500 mt-1 line-clamp-2 leading-relaxed">
                  {policy.summary}
                </p>
              </div>

              <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
                <span className="text-[10px] text-neutral-400 line-clamp-1">
                  {policy.station}
                </span>
                <button
                  onClick={() => onSelectDistrict(policy.districtId)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700 shrink-0 cursor-pointer"
                >
                  <MapPin className="w-3 h-3" />
                  <span>在地圖查看</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
