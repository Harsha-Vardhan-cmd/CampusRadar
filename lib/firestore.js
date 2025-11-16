import { 
  collection, 
  addDoc, 
  getDoc,
  getDocs,
  doc, 
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  setDoc 
} from 'firebase/firestore';
import { db } from './firebase.js';

// Create a new report
export async function createReport(reportData) {
  const reportsRef = collection(db, 'reports');
  const docRef = await addDoc(reportsRef, {
    ...reportData,
    createdAt: Timestamp.now(),
    verificationCount: 0,
    status: 'open'
  });
  return docRef.id;
}

// Get a single report by ID
export async function getReportById(reportId) {
  const reportRef = doc(db, 'reports', reportId);
  const reportSnap = await getDoc(reportRef);
  
  if (reportSnap.exists()) {
    return { id: reportSnap.id, ...reportSnap.data() };
  }
  return null;
}

// Get all reports with optional filters - SIMPLIFIED VERSION
export async function getReports(filters = {}) {
  try {
    // Always get ALL reports first (no complex queries)
    const reportsRef = collection(db, 'reports');
    const querySnapshot = await getDocs(reportsRef);
    
    let reports = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      reports.push({
        id: doc.id,
        ...data
      });
    });
    
    // Filter in memory if category is specified
    if (filters.category) {
      reports = reports.filter(report => report.category === filters.category);
    }
    
    // Sort by createdAt in memory (newest first)
    reports.sort((a, b) => {
      const aTime = a.createdAt?.toMillis() || 0;
      const bTime = b.createdAt?.toMillis() || 0;
      return bTime - aTime;
    });
    
    // Limit to 100 most recent
    return reports.slice(0, 100);
    
  } catch (error) {
    console.error('Get reports error:', error);
    throw error;
  }
}

// Update report status
export async function updateReportStatus(reportId, status) {
  const reportRef = doc(db, 'reports', reportId);
  await updateDoc(reportRef, { 
    status,
    updatedAt: Timestamp.now()
  });
}

// Create or update a user profile
export async function createUser(userId, userData) {
  const userRef = doc(db, 'users', userId);
  await setDoc(userRef, {
    ...userData,
    reportCount: 0,
    trustScore: 100,
    createdAt: Timestamp.now()
  });
}

// Get user data
export async function getUser(userId) {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    return userSnap.data();
  }
  return null;
}

// Update user's report count
export async function updateUserReportCount(userId) {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    const currentCount = userSnap.data().reportCount || 0;
    await updateDoc(userRef, {
      reportCount: currentCount + 1,
      lastReportTime: Timestamp.now()
    });
  }
}

// Verify a report
export async function verifyReport(reportId, userId) {
  try {
    const reportRef = doc(db, 'reports', reportId);
    const reportSnap = await getDoc(reportRef);
    
    if (!reportSnap.exists()) {
      throw new Error('Report not found');
    }
    
    const reportData = reportSnap.data();
    const currentCount = reportData.verificationCount || 0;
    let newSeverity = reportData.severityScore;
    
    // If report gets 3+ verifications, increase severity by 1
    if (currentCount >= 2) {
      newSeverity = Math.min(newSeverity + 1, 10);
    }
    
    // Update report
    await updateDoc(reportRef, {
      verificationCount: currentCount + 1,
      severityScore: newSeverity,
      lastVerifiedAt: Timestamp.now()
    });
    
    return {
      id: reportId,
      verificationCount: currentCount + 1,
      severityScore: newSeverity
    };
    
  } catch (error) {
    console.error('Verify report error:', error);
    throw error;
  }
}