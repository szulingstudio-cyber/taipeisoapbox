import { useState, useEffect } from 'react';
import { SOAPBOX_POLICIES } from '../data/policies';

// Seeded baseline engagement numbers reflecting citizen street feedback
const SEEDED_BASELINE_VOTES: Record<string, number> = {
  'shilin-housing-queue': 2480,
  'walkable-city': 2315,
  'neihu-tech-traffic': 2190,
  'daan-mental-oasis': 1950,
  'housing-first-wanhua': 1870,
  'pet-friendly-xinyi': 1820,
  'civil-defense-resilience': 1760,
  'senior-daycare-wenshan': 1710,
  'nangang-biotech-hub': 1640,
  'beitou-eco-resilience': 1580,
  'zhongshan-night-economy': 1530,
  'datong-civic-transparency': 1490
};

const STORAGE_KEY = 'taipei_puma_citizen_focus_voted';

export function useCitizenFocus() {
  const [votedIds, setVotedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [votes, setVotes] = useState<Record<string, number>>(() => {
    return { ...SEEDED_BASELINE_VOTES };
  });

  // Load any user votes into counts
  useEffect(() => {
    setVotes((prev) => {
      const updated = { ...prev };
      votedIds.forEach((id) => {
        if (updated[id] !== undefined) {
          updated[id] = (SEEDED_BASELINE_VOTES[id] || 1500) + 1;
        }
      });
      return updated;
    });
  }, [votedIds]);

  const toggleFocus = (policyId: string) => {
    setVotedIds((prev) => {
      let next: string[];
      if (prev.includes(policyId)) {
        next = prev.filter((id) => id !== policyId);
      } else {
        next = [...prev, policyId];
      }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (err) {
        console.error('Failed to save focus to localStorage', err);
      }
      return next;
    });
  };

  const isFocused = (policyId: string) => votedIds.includes(policyId);

  const getVoteCount = (policyId: string) => {
    return (votes[policyId] || SEEDED_BASELINE_VOTES[policyId] || 1500) + (votedIds.includes(policyId) ? 1 : 0);
  };

  // Max vote count for normalizing percentage bars
  const maxVotes = Math.max(...Object.values(votes), 2600);

  const getPercentage = (policyId: string) => {
    const count = getVoteCount(policyId);
    return Math.min(Math.round((count / maxVotes) * 100), 98);
  };

  const totalInteractions = Object.values(votes).reduce((a, b) => a + b, 0) + votedIds.length;

  return {
    votedIds,
    toggleFocus,
    isFocused,
    getVoteCount,
    getPercentage,
    totalInteractions,
    totalUserFocused: votedIds.length
  };
}
