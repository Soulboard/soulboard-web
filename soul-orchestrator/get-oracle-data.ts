#!/usr/bin/env bun
/*****************************************************************
 * Simple script to fetch current oracle data
 * Usage: bun run get-oracle-data.ts
 *****************************************************************/

import { getOracleData } from "./index.ts";

async function main() {
  console.log("🔍 Fetching oracle data...\n");

  const data = await getOracleData();

  if (!data) {
    console.log("❌ Failed to fetch oracle data");
    process.exit(1);
  }

  console.log("📊 Oracle Device Data:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`Device Idx:       ${data.deviceIdx}`);
  console.log(`Device Authority: ${data.deviceAuthority}`);
  console.log(`Oracle Authority: ${data.oracleAuthority}`);
  console.log(`Location:         ${data.location}`);
  console.log(`Status:           ${data.status}`);
  console.log(`Total Views:      ${data.totalViews}`);
  console.log(`Total Impressions: ${data.totalImpressions}`);
  console.log(`Last Reported At: ${data.lastReportedAt}`);
  console.log(`Last Entry Id:    ${data.lastEntryId}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

main().catch(console.error);
