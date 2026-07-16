/**
 * AI Service - Main orchestrator for AI operations
 *
 * This module exports the main AI functions that coordinate
 * between vision and instruction models.
 */

export { generateStructuredMetadata } from './instruct.js';
export { generateImageDescription as generateInfoForImage } from './vision.js';
