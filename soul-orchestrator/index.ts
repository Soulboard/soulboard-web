#!/usr/bin/env bun
/*****************************************************************
 * Poll ThingSpeak and push fresh deltas on-chain on an interval
 * Bun edition – no external scheduler needed
 *****************************************************************/
import { loadConfig } from "./config";
import { loadState, saveState } from "./state";
import { computeDelta, fetchThingSpeak } from "./thingspeak";
import { ensureDevice } from "./oracle-service";

const logDelta = (views: number, impressions: number, samples: number) => {
  console.log(
    `📈 Reporting metrics: views=${views}, impressions=${impressions}, samples=${samples}`
  );
};

const logDevice = (deviceIdx: number, authority: string) => {
  console.log(`📟 Device index: ${deviceIdx}`);
  console.log(`🔑 Device authority: ${authority}`);
};

const logNoUpdates = (lastEntryId: number) => {
  console.log(`ℹ️  No new data (last entry: ${lastEntryId})`);
};

const logPolling = (url: string) => {
  console.log(`📡 Fetching from: ${url}`);
};

const createRunner = async () => {
  const config = loadConfig();
  let state = await loadState(config.statePath);
  const deviceContext = await ensureDevice(config, state, config.allowRegister);

  const runOnce = async () => {
    logDevice(deviceContext.deviceIdx, deviceContext.deviceAuthority.toBase58());
    logPolling(config.thingspeakUrl);

    const data = await fetchThingSpeak(config.thingspeakUrl);
    const delta = computeDelta(data, state.lastEntryId);

    if (delta.samples === 0) {
      logNoUpdates(state.lastEntryId);
      return;
    }

    logDelta(delta.views, delta.impressions, delta.samples);

    await deviceContext.client.devices.reportMetrics(
      deviceContext.deviceAuthority,
      deviceContext.deviceIdx,
      delta.views,
      delta.impressions
    );

    state = {
      lastEntryId: delta.lastEntryId,
      deviceIdx: deviceContext.deviceIdx.toString(),
    };

    await saveState(config.statePath, state);
    console.log(`✅ Updated lastEntryId to ${delta.lastEntryId}`);
  };

  return { runOnce, pollIntervalMs: config.pollIntervalMs };
};

export const getOracleData = async () => {
  try {
    const config = loadConfig();
    const state = await loadState(config.statePath);
    const deviceContext = await ensureDevice(config, state, false);
    const device = deviceContext.device;

    return {
      deviceIdx: deviceContext.deviceIdx,
      deviceAuthority: deviceContext.deviceAuthority.toBase58(),
      oracleAuthority: device.oracleAuthority.toBase58(),
      location: device.location.toBase58(),
      status: Object.keys(device.status ?? {})[0] ?? "unknown",
      totalViews: device.metrics.totalViews.toString(),
      totalImpressions: device.metrics.totalImpressions.toString(),
      lastReportedAt: device.metrics.lastReportedAt.toString(),
      lastEntryId: state.lastEntryId,
    };
  } catch (error) {
    console.error("Failed to fetch oracle data:", error);
    return null;
  }
};

const main = async () => {
  const runner = await createRunner();
  await runner.runOnce();
  setInterval(() => {
    runner.runOnce().catch((error) => console.error("Update failed:", error));
  }, runner.pollIntervalMs);
};

if (import.meta.main) {
  await main();
}
