import { create } from 'zustand';

type UniversitySlug = "aaup" | "birzeit" | "an-najah" | "alquds" | "bethlehem" | "ppu";
type HighSchoolBranch = "scientific" | "literary" | "industrial";

// Define the structure of a major (adjust based on API response)
interface Major {
  university: UniversitySlug;
  major: string;
  min_avg: number;
  branch: HighSchoolBranch[];
  // Add other relevant fields like logo maybe?
  uniName?: string; // Optional full name for display
  uniLogo?: string; // Optional logo path
}

interface AppState {
  // State Properties
  sessionId: string;
  activeUniversity: UniversitySlug | null;
  highSchoolAvg: number | null;
  branch: HighSchoolBranch | null;
  consideredMajors: Major[];

  // Actions
  initializeSession: () => void;
  setUniversity: (slug: UniversitySlug | null) => void;
  setCredentials: (avg: number, branch: HighSchoolBranch) => void;
  addMajor: (major: Major) => void;
  removeMajor: (majorId: string) => void; // Use a unique identifier if possible
  clearConsideredMajors: () => void;
}

// Create the store
const useAppStore = create<AppState>()(
  (set, get) => ({
    // Initial State
    sessionId: crypto.randomUUID(), // Generate a session ID on load
    activeUniversity: null,
    highSchoolAvg: null,
    branch: null,
    consideredMajors: [],

    // Actions Implementation
    initializeSession: () => set({ sessionId: crypto.randomUUID(), consideredMajors: [] }), // Reset session

    setUniversity: (slug) => set({ activeUniversity: slug }),

    setCredentials: (avg, branch) => set({ highSchoolAvg: avg, branch: branch }),

    addMajor: (major) => {
      // Avoid adding duplicates
      if (!get().consideredMajors.some(m => m.university === major.university && m.major === major.major)) {
        set((state) => ({ consideredMajors: [...state.consideredMajors, major] }));
      }
    },

    removeMajor: (majorId) => { // Assumes majorId is `university+major` string
      set((state) => ({
        consideredMajors: state.consideredMajors.filter(m => `${m.university}${m.major}` !== majorId)
      }));
    },

    clearConsideredMajors: () => set({ consideredMajors: [] }),

  })
);

export default useAppStore;
export type { Major, UniversitySlug, HighSchoolBranch }; // Export types for use in components 