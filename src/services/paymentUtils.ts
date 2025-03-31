
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

/**
 * Check if a payment link is still valid
 * @param linkUrl The URL to check
 * @returns Boolean indicating if link is still valid
 */
export const checkPaymentLinkValidity = async (linkUrl: string): Promise<boolean> => {
  try {
    if (!linkUrl) return false;
    
    // Simple validation: Check if URL is properly formatted and contains expected domain
    if (!linkUrl.startsWith('https://')) return false;
    if (!linkUrl.includes('asaas.com')) return false;
    
    // Check if the link is still accessible (link not expired or cancelled)
    const response = await fetch(linkUrl, {
      method: 'HEAD',
      redirect: 'manual', // Don't follow redirects
    });
    
    // If response is a redirect to login or error page, link is invalid
    if (response.status === 302 || response.status === 301) {
      const location = response.headers.get('location');
      if (location && (location.includes('login') || location.includes('error'))) {
        return false;
      }
    }
    
    // Consider valid if status is 200 or it's a payment page redirect
    return response.ok || response.status === 302;
  } catch (error) {
    console.error("Error checking payment link validity:", error);
    return false; // Consider invalid if there's an error
  }
};
