import { useQuery } from '@tanstack/react-query';
import type { Major, HighSchoolBranch } from '../store'; // Import types from Zustand store

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface MatchMajorsParams {
  highSchoolAvg: number;
  branch: HighSchoolBranch;
}

const fetchMatchMajors = async ({ highSchoolAvg, branch }: MatchMajorsParams): Promise<Major[]> => {
  const response = await fetch(`${API_BASE_URL}/match-majors`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ high_school_avg: highSchoolAvg, branch }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({})); // Try to parse error
    // Log the error here for debugging
    console.error("API Error fetching matching majors:", response.status, errorData);
    throw new Error(errorData.detail || 'Failed to fetch matching majors');
  }

  return response.json();
};

// This hook fetches majors based on credentials but is only enabled when credentials are provided
const useMatchMajors = (avg: number | null, branch: HighSchoolBranch | null) => {
  return useQuery<Major[], Error>({
    queryKey: ['matchMajors', avg, branch], // Query key includes parameters
    queryFn: () => {
        if (avg === null || branch === null) {
            // Should not happen if `enabled` is used correctly, but acts as a safeguard
            return Promise.reject(new Error('Average and branch must be provided.'));
        }
        return fetchMatchMajors({ highSchoolAvg: avg, branch });
    },
    enabled: !!avg && !!branch, // Only run the query if both avg and branch are set
    staleTime: 1000 * 60 * 5, // Keep data fresh for 5 minutes
    retry: 1, // Retry once on failure
  });
};

export default useMatchMajors; 