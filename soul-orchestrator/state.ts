import fs from "fs/promises";
import path from "path";

export interface OracleState {
  lastEntryId: number;
  deviceIdx?: string;
}

const defaultState: OracleState = {
  lastEntryId: 0,
};

export const loadState = async (statePath: string): Promise<OracleState> => {
  try {
    const raw = await fs.readFile(statePath, "utf8");
    const parsed = JSON.parse(raw) as OracleState;
    return {
      lastEntryId: parsed.lastEntryId ?? 0,
      deviceIdx: parsed.deviceIdx,
    };
  } catch (error) {
    return { ...defaultState };
  }
};

export const saveState = async (
  statePath: string,
  state: OracleState
): Promise<void> => {
  await fs.mkdir(path.dirname(statePath), { recursive: true });
  await fs.writeFile(statePath, JSON.stringify(state, null, 2));
};
