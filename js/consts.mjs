/*
 *	Constants that do not change during gameplay.
 *	This can kind of be treated like a configuration file, I guess.
 *
 *	All length units are relative to the size of a small ship module, which
 *	is always 1x1.
 */

// For fixing floating point rounding errors.
export const EPSILON = 1e-8;
// Don't change these.
export const TAU = Math.PI * 2;
// Unit length of sector. Only for internal representation.
export const SECTOR_SIZE = 512;
// G, G-boy, The big G, Mr. G, g's big brother, G-dog
export const GRAVITATIONAL_CONSTANT = 0.002;
// Perspective constraints. Higher zoom value = closer.
export const MIN_ZOOM = 1;
export const MAX_ZOOM = 100;
export const DEFAULT_ZOOM = 10;
export const ZOOM_SPEED = 0.01;
// Ship landing. Angle in radians.
export const TIP_ANGLE = 0.25;
export const TIP_SPEED = 0.03;
// Ship flight mechanics. Speed measured in units per tick.
export const FUEL_BURN_RATE = 0.01;
export const THRUST_POWER = 0.007;
export const TURN_POWER = 0.05;
// Distance at which an orbited planet will not be considered a parent body.
export const MAX_PARENT_CELESTIAL_DISTANCE = 120;
// Ship editing.
export const EDIT_MARGIN = 2;
// Floating items.
export const ENTITY_ROTATION_RATE = 0.01;
