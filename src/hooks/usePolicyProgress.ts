import { useState, useEffect, useCallback, useMemo } from 'react';
import { SOAPBOX_POLICIES } from '../data/policies';
import { TaipeiDistrict, PolicyTheme } from '../types';

const STORAGE_KEY = 'taipei_policy_read_ids_v1';

export interface ProgressTier {
  title: string;
  badge: string;
  description: string;
  minPercent: number;
}

export const PROGRESS_TIERS: ProgressTier[] = [
  { minPercent: 0, title: '初探台北', badge: '🌱 市政新鮮人', description: '展開探索，了解第一則政見' },
  { minPercent: 25, title: '關心地區', badge: '🚶 街頭走讀者', description: '已探索超過四分之一政見' },
  { minPercent: 50, title: '市政常客', badge: '🔍 深入觀察家', description: '半數台北行政區已熟稔' },
  { minPercent: 75, title: '深耕公民', badge: '🌊 洋流共行者', description: '全台北藍圖即將完整解鎖' },
  { minPercent: 100, title: '城市智庫', badge: '🏆 全台北大滿貫', description: '已完整讀畢 12 行政區全部政見！' }
];

export function usePolicyProgress() {
  const [readIds, setReadIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(readIds));
    } catch {
      // storage quota or incognito fallback
    }
  }, [readIds]);

  const markAsRead = useCallback((policyId: string) => {
    setReadIds((prev) => {
      if (prev.includes(policyId)) return prev;
      return [...prev, policyId];
    });
  }, []);

  const toggleRead = useCallback((policyId: string) => {
    setReadIds((prev) => {
      if (prev.includes(policyId)) {
        return prev.filter((id) => id !== policyId);
      }
      return [...prev, policyId];
    });
  }, []);

  const markAllAsRead = useCallback(() => {
    setReadIds(SOAPBOX_POLICIES.map((p) => p.id));
  }, []);

  const resetProgress = useCallback(() => {
    setReadIds([]);
  }, []);

  const isRead = useCallback(
    (policyId: string) => readIds.includes(policyId),
    [readIds]
  );

  const totalCount = SOAPBOX_POLICIES.length;
  const readCount = readIds.length;
  const overallPercent = totalCount > 0 ? Math.round((readCount / totalCount) * 100) : 0;

  // Calculate current tier
  const currentTier = useMemo(() => {
    for (let i = PROGRESS_TIERS.length - 1; i >= 0; i--) {
      if (overallPercent >= PROGRESS_TIERS[i].minPercent) {
        return PROGRESS_TIERS[i];
      }
    }
    return PROGRESS_TIERS[0];
  }, [overallPercent]);

  // District progress
  const getDistrictProgress = useCallback(
    (districtId: TaipeiDistrict) => {
      const districtPolicies = SOAPBOX_POLICIES.filter((p) => p.districtId === districtId);
      const total = districtPolicies.length;
      if (total === 0) return { read: 0, total: 0, percent: 100 };
      const read = districtPolicies.filter((p) => readIds.includes(p.id)).length;
      const percent = Math.round((read / total) * 100);
      return { read, total, percent };
    },
    [readIds]
  );

  // Category progress
  const getCategoryProgress = useCallback(
    (categoryTag: string) => {
      const catPolicies = SOAPBOX_POLICIES.filter((p) =>
        p.tags.some((t) => t.toLowerCase() === categoryTag.toLowerCase()) ||
        p.categoryName.includes(categoryTag) ||
        p.themeName.includes(categoryTag)
      );
      const total = catPolicies.length;
      if (total === 0) return { read: 0, total: 0, percent: 100 };
      const read = catPolicies.filter((p) => readIds.includes(p.id)).length;
      const percent = Math.round((read / total) * 100);
      return { read, total, percent };
    },
    [readIds]
  );

  // Theme progress
  const getThemeProgress = useCallback(
    (themeId: PolicyTheme) => {
      const themePolicies = SOAPBOX_POLICIES.filter((p) => p.theme === themeId);
      const total = themePolicies.length;
      if (total === 0) return { read: 0, total: 0, percent: 100 };
      const read = themePolicies.filter((p) => readIds.includes(p.id)).length;
      const percent = Math.round((read / total) * 100);
      return { read, total, percent };
    },
    [readIds]
  );

  return {
    readIds,
    isRead,
    markAsRead,
    toggleRead,
    markAllAsRead,
    resetProgress,
    readCount,
    totalCount,
    overallPercent,
    currentTier,
    getDistrictProgress,
    getCategoryProgress,
    getThemeProgress
  };
}
