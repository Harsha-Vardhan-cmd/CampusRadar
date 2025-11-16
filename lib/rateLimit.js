import { getDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from './firebase.js';

export async function checkRateLimit(userId) {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      // New user - allow
      return { allowed: true };
    }
    
    const userData = userSnap.data();
    const reportCount = userData.reportCount || 0;
    const lastReportTime = userData.lastReportTime?.toDate();
    const trustScore = userData.trustScore || 100;
    
    // Check if user is banned (trust score too low)
    if (trustScore < -10) {
      return { 
        allowed: false, 
        reason: 'Account suspended due to low trust score' 
      };
    }
    
    // Check 24-hour rate limit
    if (lastReportTime) {
      const hoursSinceLastReport = (Date.now() - lastReportTime.getTime()) / (1000 * 60 * 60);
      
      if (hoursSinceLastReport < 24 && reportCount >= 5) {
        return { 
          allowed: false, 
          reason: 'Maximum 5 reports per 24 hours' 
        };
      }
    }
    
    return { allowed: true };
    
  } catch (error) {
    console.error('Rate limit check error:', error);
    return { allowed: true }; // Allow on error (fail open)
  }
}
