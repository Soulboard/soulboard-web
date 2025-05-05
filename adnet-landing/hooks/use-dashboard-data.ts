"use client";

import { useEffect } from "react";
import { useDashboardStore } from "@/store/dashboard-store";
import { usePrivy } from '@privy-io/react-auth';
import { useSolanaWallets } from "@privy-io/react-auth";

/* ──────────────────────────────────────────────────────────── */
/*                         CAMPAIGNS                           */
/* ──────────────────────────────────────────────────────────── */
export function useCampaigns() {
  const { user, ready } = usePrivy();
  const { wallets } = useSolanaWallets()
  const {
    initialise,
    campaigns,
    isLoading,
    error,
    fetchCampaigns,
    createCampaign,
    addBudget,
  } = useDashboardStore();

  /* auto-refresh once when the hook first mounts and when user is ready */
  useEffect(() => {
    if (ready && user) {
      fetchCampaigns();
    }
  }, [fetchCampaigns, ready, user]);

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
    isAuthenticated: !!user,
    isReady: ready,

    /* helpers */
    initialise,
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
  const { user, ready } = usePrivy();
  const {
    initialise,
    locations,
    isLoading,
    error,
    fetchLocations,
    registerLocation,
  } = useDashboardStore();

  useEffect(() => {
    if (ready && user) {
      fetchLocations();
    }
  }, [fetchLocations, ready, user]);

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
    isAuthenticated: !!user,
    isReady: ready,

    /* helpers */
    initialise,
    getActiveLocations,
    getMaintenanceLocations,
    getInactiveLocations,
    getLocationById,
    getTotalSlots,

    /* mutations */
    registerLocation,
  };
}
