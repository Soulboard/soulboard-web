"use client";

import { useMemo } from "react";
import { useRole } from "@/hooks/use-role";
import { useCampaigns, useLocations } from "@/hooks/use-dashboard-data";

export interface FlourishData {
  keyMetrics: {
    primary: { value: string; label: string };
    secondary: Array<{ value: string; label: string }>;
  };
  trends: { daily: number[]; labels: string[] };
  distribution: { labels: string[]; values: number[]; colors: string[] };
}

export function useFlourishData() {
  const { role } = useRole();
  const {
    campaigns,
    isLoading: loadingCampaigns,
    getActiveCampaigns,
    getEndedCampaigns,
    getPausedCampaigns,
    getTotalBudgetSOL,
  } = useCampaigns();

  const { locations, isLoading: loadingLocations } = useLocations();

  const flourishData = useMemo<FlourishData>(() => {
    /* ───────── common aggregates ───────── */
    const totalBudget   = getTotalBudgetSOL();
    const activeCount   = getActiveCampaigns().length;
    const endedCount    = getEndedCampaigns().length;
    const pausedCount   = getPausedCampaigns().length;

    /* ───────── status distribution chart ───────── */
    const statusLabels  = ["Active", "Ended", "Paused"];
    const statusValues  = [activeCount, endedCount, pausedCount];
    const statusColors  = ["#00C853", "#9E9E9E", "#FF3366"];

    if (role === "advertiser") {
      return {
        keyMetrics: {
          primary: {
            value : `${totalBudget.toFixed(2)} SOL`,
            label : "Total Budget",
          },
          secondary: [
            { value: `${campaigns.length}`, label: "All Campaigns" },
            { value: `${activeCount}`,     label: "Active" },
            { value: `${pausedCount}`,     label: "Paused" },
          ],
        },

        trends: {
          daily : campaigns.map((c) => c.budgetSOL),   // quick sparkline idea
          labels: campaigns.map((c) => c.name.slice(0, 10)),
        },

        distribution: {
          labels : statusLabels,
          values : statusValues,
          colors : statusColors,
        },
      };
    }

    /* provider dashboard */
    return {
      keyMetrics: {
        primary: {
          value : `${locations.filter((l) => l.status === "Active").length}`,
          label : "Active Displays",
        },
        secondary: [
          { value: `${locations.length}`, label: "All Displays" },
          { value: `${locations.reduce((s, l) => s + l.slotCount, 0)}`, label: "Total Slots" },
        ],
      },

      trends: {
        daily : locations.map((l) => l.slotCount),
        labels: locations.map((l) => l.name.slice(0, 10)),
      },

      distribution: {
        labels : statusLabels,
        values : statusValues,
        colors : statusColors,
      },
    };
  }, [
    role,
    campaigns,
    locations,
    getActiveCampaigns,
    getEndedCampaigns,
    getPausedCampaigns,
    getTotalBudgetSOL,
  ]);

  return {
    flourishData,
    isLoading: loadingCampaigns || loadingLocations,
    role,
  };
}
