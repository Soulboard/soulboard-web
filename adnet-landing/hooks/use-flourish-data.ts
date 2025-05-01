"use client";

import { useMemo } from "react";
import { useRole } from "@/hooks/use-role";
import { useCampaigns, useLocations } from "@/hooks/use-dashboard-data"; // ← new hooks

/* ───────────────── types kept for UI compatibility ─────────────── */
export interface FlourishData {
  keyMetrics: {
    primary: { value: string; label: string; change: string; isPositive: boolean };
    secondary: Array<{ value: string; label: string; change: string; isPositive: boolean }>;
  };
  trends: { daily: number[]; weekly: number[]; monthly: number[]; labels: string[] };
  topPerforming: Array<{ id: string; name: string; value: string; change: string; isPositive: boolean }>;
  distribution: { labels: string[]; values: number[]; colors: string[] };
  recentActivity: Array<{ id: string; title: string; time: string; description: string }>;
}
/* ──────────────────────────────────────────────────────────────── */

export function useFlourishData() {
  const { role } = useRole();

  /* on-chain slices */
  const {
    campaigns,
    isLoading: campaignsLoading,
    getActiveCampaigns,
    getEndedCampaigns,
    getPausedCampaigns,
    getTotalBudgetSOL,
  } = useCampaigns();

  const {
    locations,
    isLoading: locationsLoading,
    getActiveLocations,
    getMaintenanceLocations,
    getInactiveLocations,
    getTotalSlots,
  } = useLocations();

  /* ─────────────── compute flourish data ─────────────── */
  const flourishData = useMemo<FlourishData>(() => {
    if (role === "advertiser") {
      /* ----- counts & helpers ----- */
      const active  = getActiveCampaigns().length;
      const ended   = getEndedCampaigns().length;
      const paused  = getPausedCampaigns().length;
      const budget  = getTotalBudgetSOL().toFixed(2);

      return {
        keyMetrics: {
          primary: { value: `${budget} SOL`, label: "Total Budget", change: "", isPositive: true },
          secondary: [
            { value: `${active}`,  label: "Active Campaigns",  change: "", isPositive: true },
            { value: `${ended}`,   label: "Ended Campaigns",   change: "", isPositive: false },
            { value: `${paused}`,  label: "Paused Campaigns",  change: "", isPositive: false },
          ],
        },

        /* no on-chain time-series yet → placeholder zeros */
        trends:   { daily: [], weekly: [], monthly: [], labels: [] },

        topPerforming: campaigns.map((c) => ({
          id: c.id,
          name: c.name,
          value: `${c.budgetSOL.toFixed(2)} SOL`,
          change: "",
          isPositive: true,
        })),

        distribution: {
          labels: ["Active", "Ended", "Paused"],
          values: [active, ended, paused],
          colors: ["#00C853", "#9E9E9E", "#FF3366"],
        },

        recentActivity: [],   // activity feed not implemented yet
      };
    }

    /* ---------------- PROVIDER view ---------------- */
    const activeLoc   = getActiveLocations().length;
    const maintLoc    = getMaintenanceLocations().length;
    const inactiveLoc = getInactiveLocations().length;

    return {
      keyMetrics: {
        primary: { value: `${activeLoc}`, label: "Active Locations", change: "", isPositive: true },
        secondary: [
          { value: `${locations.length}`, label: "Total Locations",    change: "", isPositive: true },
          { value: `${maintLoc}`,        label: "Maintenance",        change: "", isPositive: false },
          { value: `${getTotalSlots()}`, label: "Total Slots",        change: "", isPositive: true },
        ],
      },

      trends: { daily: [], weekly: [], monthly: [], labels: [] },

      topPerforming: locations.map((l) => ({
        id: l.id,
        name: l.name,
        value: `${l.slotCount} slots`,
        change: "",
        isPositive: true,
      })),

      distribution: {
        labels: ["Active", "Maintenance", "Inactive"],
        values: [activeLoc, maintLoc, inactiveLoc],
        colors: ["#00C853", "#FFCC00", "#9E9E9E"],
      },

      recentActivity: [],
    };
  }, [
    role,
    campaigns, locations,
    getActiveCampaigns, getEndedCampaigns, getPausedCampaigns,
    getActiveLocations, getMaintenanceLocations, getInactiveLocations,
    getTotalBudgetSOL, getTotalSlots,
  ]);

  return {
    flourishData,
    isLoading: campaignsLoading || locationsLoading,
    role,
  };
}
