/**
 * Formats a raw number into a SmartCare Queue Token (e.g. 5 -> SC005)
 * @param {number} num 
 * @returns {string}
 */
export function formatToken(num) {
  if (!num) return 'SC000';
  return `SC${String(num).padStart(3, '0')}`;
}

/**
 * Calculates estimated wait time based on patients ahead.
 * Assumes a standard of 15 minutes average per appointment.
 * @param {number} patientsAhead 
 * @returns {string}
 */
export function estimateWaitTime(patientsAhead) {
  if (patientsAhead <= 0) return 'Immediate';
  const minutes = patientsAhead * 15;
  if (minutes < 60) {
    return `${minutes} mins`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMins = minutes % 60;
  return remainingMins > 0 ? `${hours}h ${remainingMins}m` : `${hours}h`;
}

/**
 * Validates email format.
 * @param {string} email 
 * @returns {boolean}
 */
export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Formats standard date
 * @param {string|Date} dateVal 
 * @returns {string}
 */
export function formatDate(dateVal) {
  if (!dateVal) return '';
  const date = new Date(dateVal);
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

/**
 * Formats a 24-hour time string into a lovely human-readable 12-hour format
 * @param {string} time24 
 * @returns {string}
 */
export function formatTime12(time24) {
  if (!time24) return '';
  const [hourStr, minStr] = time24.split(':');
  const hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minStr} ${ampm}`;
}
