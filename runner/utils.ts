const SECS_IN_MINUTE = 60
const MINUTES_IN_HOUR = 60
export function secstohms(secs: number|undefined) {
    if(secs===undefined) return '?:??';
    let mins = secs / SECS_IN_MINUTE
    let hours = mins / SECS_IN_MINUTE

    secs = Math.round(secs)
    mins = Math.floor(mins)
    hours = Math.floor(hours)
    mins = mins - hours * MINUTES_IN_HOUR;
    secs = secs - ((hours * MINUTES_IN_HOUR) + mins) * SECS_IN_MINUTE;

    let output = [
        hours,
        (mins ?? '0').toString().padStart(hours ? 2 : 1, '0'),
        secs.toString().padStart(2, '0')
    ].filter(Boolean).join(':')
    return output
}


// Gemini ai-generated file hash function:
import { createHash } from 'crypto';
import { readFileSync } from 'fs';

/**
 * Synchronously generates a hash for a file.
 * Best for smaller files or CLI tools where async overhead isn't needed.
 */
export function getFileHashSync(filePath: string, algorithm: string = 'sha256'): string {
  const fileBuffer = readFileSync(filePath);
  return createHash(algorithm).update(fileBuffer).digest('hex');
}