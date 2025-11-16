// List of admin emails
export const ADMIN_EMAILS = [
    'admin@umd.edu',
    'test2@umd.edu'  // Add YOUR test email here
  ]
  
  export function isAdmin(email) {
    return ADMIN_EMAILS.includes(email?.toLowerCase())
  }