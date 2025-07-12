import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

// Define the structure of a Major object based on the backend response
// We might need to refine this based on the actual data structure used
export interface Major {
  id: string;
  university: string; // Slug or key for the university
  university_name?: string; // Optional full name of the university
  url: string;
  title: string;
  description?: string; // Optional description for the major
  section: string; // Or could be more specific like 'field'?
  keywords: string[];
  text: string[]; // Keep raw text if needed
  parsed_fee?: number | string | null; // Allow string for cases like "دينار" or specific notes
  parsed_min_avg?: number | string | null; // Allow string for cases like "ناجح"
  parsed_branches?: string[];
  parsed_field?: string | null; // Add field if needed later
}

interface InterestContextType {
  likedMajors: Major[];
  addMajor: (major: Major) => void;
  removeMajor: (majorId: string) => void;
}

const InterestContext = createContext<InterestContextType | undefined>(undefined);

export const useInterest = () => {
  const context = useContext(InterestContext);
  if (!context) {
    throw new Error('useInterest must be used within an InterestProvider');
  }
  return context;
};

interface InterestProviderProps {
  children: ReactNode;
}

const STORAGE_KEY = 'liked_majors';

export const InterestProvider: React.FC<InterestProviderProps> = ({ children }) => {
  // Initialize state from localStorage
  const [likedMajors, setLikedMajors] = useState<Major[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading liked majors from localStorage:', error);
      return [];
    }
  });

  // Save to localStorage whenever likedMajors changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(likedMajors));
      console.log('Saved liked majors to localStorage:', likedMajors.length);
    } catch (error) {
      console.error('Error saving liked majors to localStorage:', error);
    }
  }, [likedMajors]);

  const addMajor = (major: Major) => {
    setLikedMajors((prevMajors) => {
      // Avoid adding duplicates
      if (!prevMajors.some(m => m.id === major.id)) {
        const newMajors = [...prevMajors, major];
        console.log('Added major:', major.title);
        return newMajors;
      }
      return prevMajors;
    });
  };

  const removeMajor = (majorId: string) => {
    setLikedMajors((prevMajors) => {
      const newMajors = prevMajors.filter(m => m.id !== majorId);
      console.log('Removed major with ID:', majorId);
      return newMajors;
    });
  };

  // Log when the provider mounts and unmounts
  useEffect(() => {
    console.log('InterestProvider mounted with', likedMajors.length, 'majors');
    return () => {
      console.log('InterestProvider unmounting with', likedMajors.length, 'majors');
    };
  }, []);

  return (
    <InterestContext.Provider value={{ likedMajors, addMajor, removeMajor }}>
      {children}
    </InterestContext.Provider>
  );
}; 