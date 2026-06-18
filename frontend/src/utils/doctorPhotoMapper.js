/**
 * SmartCare Doctor Profile Photo Mapping Utility
 * Ensures correct professional portraits with clean white/blue studio backgrounds are assigned.
 */

export const MALE_DOCTOR_PORTRAIT = "https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&q=80&w=400";
export const FEMALE_DOCTOR_PORTRAIT = "https://images.unsplash.com/photo-1614608682850-e0e6edc961dc?auto=format&fit=crop&q=80&w=400";

export const DOCTOR_PHOTOS_MAPPING = {
  // Dr. Arvind Sharma - Professional Male Doctor with clean white/neutral studio background
  "Dr. Arvind Sharma": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400",
  "Arvind Sharma": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400",

  // Dr. Priya Patel - Professional Female Doctor with clean blueish/white clinical background
  "Dr. Priya Patel": "https://images.unsplash.com/photo-1614608682850-e0e6edc961dc?auto=format&fit=crop&q=80&w=400",
  "Priya Patel": "https://images.unsplash.com/photo-1614608682850-e0e6edc961dc?auto=format&fit=crop&q=80&w=400",
  "Dr. Priya": "https://images.unsplash.com/photo-1614608682850-e0e6edc961dc?auto=format&fit=crop&q=80&w=400",

  // Dr. Meera Nair - Female pediatrician
  "Dr. Meera Nair": "https://images.unsplash.com/photo-1591604021695-0c69b7c05981?auto=format&fit=crop&q=80&w=400",

  // Dr. Sarah D'Souza - Female dermatologist (unique)
  "Dr. Sarah D'Souza": "https://images.unsplash.com/photo-1594824813573-246434e33963?auto=format&fit=crop&q=80&w=400",

  // Dr. Rajesh K. - Male orthopedic surgeon
  "Dr. Rajesh K.": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400",

  // Dr. Amit Verma - Male general physician (verified male portrait, unique)
  "Dr. Amit Verma": "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400",
  "Amit Verma": "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400",
  "Dr. Amit": "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400"
};

/**
 * Gets the correct, verified professional portrait for a doctor
 * @param {string} doctorName - The display name of the doctor
 * @param {string} [gender] - The gender of the doctor ('Male', 'Female')
 * @returns {string} The Unsplash portrait URL
 */
export function getDoctorPhoto(doctorName, gender) {
  if (!doctorName) {
    return gender?.toLowerCase() === "female" ? FEMALE_DOCTOR_PORTRAIT : MALE_DOCTOR_PORTRAIT;
  }

  const cleanedName = doctorName.trim();
  
  // Direct lookup match
  if (DOCTOR_PHOTOS_MAPPING[cleanedName]) {
    return DOCTOR_PHOTOS_MAPPING[cleanedName];
  }

  // Fuzzy lookup matching substrings
  for (const [key, url] of Object.entries(DOCTOR_PHOTOS_MAPPING)) {
    if (cleanedName.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(cleanedName.toLowerCase())) {
      return url;
    }
  }

  // Fallback heuristic based on common gender indicators or explicit parameter
  const nameLower = cleanedName.toLowerCase();

  // Explicit male name markers — these always get male portrait
  const isMale =
    gender?.toLowerCase() === "male" ||
    nameLower.includes("amit") ||
    nameLower.includes("arvind") ||
    nameLower.includes("rajesh");

  if (isMale) return MALE_DOCTOR_PORTRAIT;

  const isFemale =
    gender?.toLowerCase() === "female" ||
    nameLower.includes("priya") ||
    nameLower.includes("meera") ||
    nameLower.includes("sarah") ||
    nameLower.includes("nair") ||
    nameLower.includes("dsouza");

  return isFemale ? FEMALE_DOCTOR_PORTRAIT : MALE_DOCTOR_PORTRAIT;
}
