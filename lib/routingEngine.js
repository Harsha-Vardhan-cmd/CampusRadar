// Determines where to send the report based on severity (1-10 scale)
export function determineRoute(severityScore) {
  if (severityScore >= 8) {
    return "EMERGENCY";  // Police/911 (severity 8-10)
  } else if (severityScore >= 5) {
    return "UMPD";       // Campus police (severity 5-7)
  } else {
    return "FACILITIES"; // Maintenance/facilities (severity 1-4)
  }
}

// Get a human-readable explanation
export function getRouteExplanation(route) {
  const explanations = {
    "EMERGENCY": "This report requires immediate attention from emergency services.",
    "UMPD": "This report will be handled by UMD Police Department.",
    "FACILITIES": "This report will be handled by Campus Facilities."
  };
  
  return explanations[route] || "This report will be reviewed.";
}

// Get severity level description
export function getSeverityDescription(severityScore) {
  if (severityScore >= 8) return "Critical";
  if (severityScore >= 6) return "High";
  if (severityScore >= 4) return "Medium";
  return "Low";
}