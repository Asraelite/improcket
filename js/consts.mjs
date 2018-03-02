/*
 *	Constants that do not change during gameplay.
 *	This can kind of be treated like a configuration file, I guess.
 */

// Pixel length of sector.
export const SECTOR_SIZE = 512;
// Star count per sector.
export const STAR_DENSITY = (SECTOR_SIZE ** 2) / 10000;
