
import { v4 as uuidv4 } from "uuid";

/**
 * Generates a unique reference for payments
 * @param userId User ID
 * @param planId Plan ID
 * @returns A unique reference string
 */
export const generateUniqueReference = (userId: string, planId: string): string => {
  const timestamp = Date.now();
  const randomPart = Math.random().toString(36).substring(2, 9);
  
  return `${userId.substring(0, 8)}_${planId}_${timestamp}_${randomPart}`;
};

/**
 * Track payment attempts to prevent multiple submissions
 * @param attemptsTracker Object tracking attempts
 * @param userId User ID
 * @param planId Plan ID
 * @returns Boolean indicating if attempt should be allowed
 */
export const trackPaymentAttempt = (
  attemptsTracker: Record<string, { count: number, timestamp: number }>,
  userId: string, 
  planId: string
): boolean => {
  const key = `${userId}_${planId}`;
  const now = Date.now();
  
  // If no previous attempts or older than 2 minutes, reset counter
  if (!attemptsTracker[key] || (now - attemptsTracker[key].timestamp > 2 * 60 * 1000)) {
    attemptsTracker[key] = { count: 1, timestamp: now };
    return true;
  }
  
  // If less than 5 seconds since last attempt, block to prevent duplicates
  if (now - attemptsTracker[key].timestamp < 5000) {
    return false;
  }
  
  // Increment counter
  attemptsTracker[key].count += 1;
  attemptsTracker[key].timestamp = now;
  
  // Allow if fewer than 3 attempts in 2 minutes
  return attemptsTracker[key].count <= 3;
};
