// How serious each category is (1-10 scale)
const CATEGORY_WEIGHTS = {
  'suspicious_person': 7,
  'substance_use': 6,
  'bike_theft': 4,
  'vandalism': 3,
  'parking': 3,
  'camera': 2.5,
  'lighting': 2,
  'other': 3.5
};

// Urgent keywords that bump up severity
const URGENT_KEYWORDS = [
  'weapon', 'gun', 'knife', 'threatening', 'assault', 
  'emergency', 'attack', 'danger', 'help', 'scared', 
  'following', 'stalking', 'fight', 'blood', 'injured'
];

export function calculateSeverity(report) {
  let score = 0;
  
  // Step 1: Base score from category (1-10 scale)
  score = CATEGORY_WEIGHTS[report.category] || 3.5;
  
  // Step 2: Time of day modifier (nighttime is scarier)
  const hour = new Date(report.createdAt || new Date()).getHours();
  if (hour >= 18 || hour <= 6) {
    score += 2;  // Add 2 points for nighttime
  }
  
  // Step 3: Check for urgent keywords in description
  if (report.description) {
    const description = report.description.toLowerCase();
    let keywordMatches = 0;
    
    URGENT_KEYWORDS.forEach(keyword => {
      if (description.includes(keyword)) {
        keywordMatches++;
      }
    });
    
    // Add 1 point per urgent keyword (max 3 points)
    score += Math.min(keywordMatches * 1, 3);
  }
  
  // Step 4: Verification boost (other users verified this)
  if (report.verificationCount && report.verificationCount > 3) {
    score += 1;
  }
  
  // Step 5: Cap at 10 (maximum severity) and ensure minimum is 1
  return Math.max(1, Math.min(Math.round(score), 10));
}