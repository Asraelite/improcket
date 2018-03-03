/*
 *	Constants that do not change during gameplay.
 *	This can kind of be treated like a configuration file, I guess.
 *
 *	All le
 */

// Unit length of sector. Only for internal representation.
export const SECTOR_SIZE = 512;
// Star count per sector.
export const STAR_DENSITY = (SECTOR_SIZE ** 2) / 10000;
// G, G-boy, The big G, Mr. G, g's big brother, G-dog
export const GRAVITATIONAL_CONSTANT = 0.01;
// Perspective constraints. Higher zoom value = closer.
export const MIN_ZOOM = 1;
export const MAX_ZOOM = 30;
export const DEFAULT_ZOOM = 10;
export const ZOOM_SPEED = 0.01;
