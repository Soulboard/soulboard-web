"use client";

import { useEffect } from "react";
import { useDashboardStore } from "@/store/dashboard-store";

/* ──────────────────────────────────────────────────────────── */
/*                         CAMPAIGNS                           */
/* ──────────────────────────────────────────────────────────── */
export function useCampaigns() {
  const {
    campaigns,
    isLoading,
    error,
    fetchCampaigns,
    createCampaign,
    addBudget,
  } = useDashboardStore();

  /* auto-refresh once when the hook first mounts */
  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  /* helpers */
  const getActiveCampaigns   = () => campaigns.filter(c => c.status === "Active");
  const getEndedCampaigns    = () => campaigns.filter(c => c.status === "Ended");
  const getPausedCampaigns   = () => campaigns.filter(c => c.status === "Paused");
  const getCampaignById      = (id: string) => campaigns.find(c => c.id === id);

  const getTotalBudgetSOL    = () =>
    campaigns.reduce((sum, c) => sum + (c.budgetSOL ?? 0), 0);

  return {
    campaigns,
    isLoading: isLoading.campaigns,
    error: error.campaigns,
    refresh: fetchCampaigns,

    /* helpers */
    getActiveCampaigns,
    getEndedCampaigns,
    getPausedCampaigns,
    getCampaignById,
    getTotalBudgetSOL,

    /* mutations */
    createCampaign,
    addBudget,
  };
}

/* ──────────────────────────────────────────────────────────── */
/*                          LOCATIONS                          */
/* ──────────────────────────────────────────────────────────── */
export function useLocations() {
  const {
    locations,
    isLoading,
    error,
    fetchLocations,
    registerLocation,
  } = useDashboardStore();

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  /* helpers */
  const getActiveLocations       = () => locations.filter(l => l.status === "Active");
  const getMaintenanceLocations  = () => locations.filter(l => l.status === "Maintenance");
  const getInactiveLocations     = () => locations.filter(l => l.status === "Inactive");
  const getLocationById          = (id: string) => locations.find(l => l.id === id);

  const getTotalSlots            = () =>
    locations.reduce((sum, l) => sum + l.slotCount, 0);

  return {
    locations,
    isLoading: isLoading.locations,
    error: error.locations,
    refresh: fetchLocations,

    /* helpers */
    getActiveLocations,
    getMaintenanceLocations,
    getInactiveLocations,
    getLocationById,
    getTotalSlots,

    /* mutations */
    registerLocation,
  };
}
