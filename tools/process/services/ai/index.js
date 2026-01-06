/**
 * AI Service - Main orchestrator for AI operations
 * 
 * This module exports the main AI functions that coordinate
 * between vision and instruction models.
 */

export { generateImageDescription as generateInfoForImage } from './vision.js';
export { generateStructuredMetadata } from './instruct.js';

