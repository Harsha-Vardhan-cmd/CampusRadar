import { createReport, createUser, updateUserReportCount, getUser } from '../../../lib/firestore.js';
import { calculateSeverity } from '../../../lib/severityEngine.js';
import { determineRoute } from '../../../lib/routingEngine.js';
import { checkRateLimit } from '../../../lib/rateLimit.js';

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, userEmail, lat, lng, category, description, photoURL, isAnonymous } = body;
    
    // Validate required fields
    if (!userId || !userEmail || !lat || !lng || !category || !description) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Check rate limiting
    const rateLimitCheck = await checkRateLimit(userId);
    if (!rateLimitCheck.allowed) {
      return new Response(
        JSON.stringify({ error: rateLimitCheck.reason }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Create report object
    const report = {
      userId,
      userEmail: isAnonymous ? 'anonymous' : userEmail,
      lat,
      lng,
      category,
      description,
      photoURL: photoURL || null,
      isAnonymous: isAnonymous || false
    };
    
    // Calculate severity (1-10)
    const severityScore = calculateSeverity(report);
    
    // Determine routing
    const routedTo = determineRoute(severityScore);
    
    // Add to report
    report.severityScore = severityScore;
    report.routedTo = routedTo;
    report.status = 'open';
    
    // Save to database
    const reportId = await createReport(report);
    
    // Check if user exists, create if not
    const existingUser = await getUser(userId);
    if (!existingUser) {
      await createUser(userId, {
        email: userEmail,
        reportCount: 1,
        trustScore: 100
      });
    } else {
      // Update user's report count
      await updateUserReportCount(userId);
    }
    
    // Return success
    return new Response(
      JSON.stringify({
        success: true,
        reportId,
        severityScore,
        routedTo,
        message: 'Report submitted successfully'
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Submit report error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to submit report' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}