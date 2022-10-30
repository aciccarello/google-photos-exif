import { closeSync, openSync, utimesSync } from 'fs'

export async function updateFileModificationDate(filePath: string, timeTaken: string | null): Promise<void> {
  const time = timeTaken ? new Date(timeTaken) : new Date();

  try {
    utimesSync(filePath, time, time);
  } catch (error) {
    closeSync(openSync(filePath, 'w'));
  }
}
