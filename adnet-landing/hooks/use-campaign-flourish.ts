"use client";

import { useMemo } from "react";
import { useCampaigns, useLocations } from "@/hooks/use-dashboard-data";   // ← new path

/* ─────────────── domain output ─────────────── */

export interface CampaignFlourishData {
  stats: {
    totalCampaigns: number;
    activeCampaigns: number;
    endedCampaigns: number;
    pausedCampaigns: number;
    totalBudgetSOL: number;          // in SOL now – already a number
  };

  performance: Array<{
    id: string;
    name: string;
    status: string;
    budgetSOL: number;
  }>;

  distribution: {
    byStatus: {
      labels: string[];
      values: number[];
      colors: string[];
    };
    byBudget: {
      labels: string[];
      values: number[];
      colors: string[];
    };
  };

  locationSummary: {
    totalLocations: number;
  };
}

/* ─────────────── main hook ─────────────── */

export function useCampaignFlourish() {
  const {
    campaigns,
    isLoading: loadingCampaigns,
    getActiveCampaigns,
    getEndedCampaigns,
    getPausedCampaigns,
    getTotalBudgetSOL,
  } = useCampaigns();

  const { locations, isLoading: loadingLocations } = useLocations();

  const flourishData = useMemo<CampaignFlourishData>(() => {
    /* ------------------ status distribution ------------------ */
    const statusCounts = {
      Active: getActiveCampaigns().length,
      Ended: getEndedCampaigns().length,
      Paused: getPausedCampaigns().length,
    };

    /* ------------------ budget distribution ------------------ */
    const budgetRanges: Record<string, number> = {
      "< 1 SOL": 0,
      "1 – 5 SOL": 0,
      "5 – 10 SOL": 0,
      "> 10 SOL": 0,
    };

    campaigns.forEach((c) => {
      if (c.budgetSOL < 1)            budgetRanges["< 1 SOL"]++;
      else if (c.budgetSOL < 5)       budgetRanges["1 – 5 SOL"]++;
      else if (c.budgetSOL < 10)      budgetRanges["5 – 10 SOL"]++;
      else                             budgetRanges["> 10 SOL"]++;
    });

    /* ------------------ assemble ------------------ */
    return {
      stats: {
        totalCampaigns: campaigns.length,
        activeCampaigns: statusCounts.Active,
        endedCampaigns: statusCounts.Ended,
        pausedCampaigns: statusCounts.Paused,
        totalBudgetSOL: getTotalBudgetSOL(),
      },

      performance: campaigns.map((c) => ({
        id: c.id,
        name: c.name,
        status: c.status,
        budgetSOL: c.budgetSOL,
      })),

      distribution: {
        byStatus: {
          labels: Object.keys(statusCounts),
          values: Object.values(statusCounts),
          colors: ["#00C853", "#9E9E9E", "#FF3366"],
        },
        byBudget: {
          labels: Object.keys(budgetRanges),
          values: Object.values(budgetRanges),
          colors: ["#0055FF", "#4285F4", "#5E97F6", "#8AB4F8"],
        },
      },

      locationSummary: {
        totalLocations: locations.length,
      },
    };
  }, [
    campaigns,
    locations.length,
    getActiveCampaigns,
    getEndedCampaigns,
    getPausedCampaigns,
    getTotalBudgetSOL,
  ]);

  return {
    flourishData,
    isLoading: loadingCampaigns || loadingLocations,
  };
}
