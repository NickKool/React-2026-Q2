import { create } from 'zustand';

export interface SubmissionData {
  id: string;
  name: string;
  age: number;
  email: string;
  gender: 'male' | 'female';
  country: string;
  imageBas64: string;
  timestamp: number;
}

interface SubmissionState {
  submissions: SubmissionData[];
  countries: string[];
  latestSubmissionId: string | null;
  addSubmission: (submission: Omit<SubmissionData, 'id' | 'timestamp'>) => string;
  setLatestSubmissionId: (id: string | null) => void;
}

export const useSubmissionStore = create<SubmissionState>((set) => ({
  submissions: [],
  
  countries: ['Belarus', 'Russia', 'Kazakhstan', 'Georgia', 'Armenia', 'Poland', 'Germany'],
  
  latestSubmissionId: null,

  addSubmission: (data) => {
    const id = crypto.randomUUID();
    
    const newSubmission: SubmissionData = {
      ...data,
      id,
      timestamp: Date.now(),
    };

    set((state) => ({
      submissions: [newSubmission, ...state.submissions],
      latestSubmissionId: id,
    }));

    return id; 
  },

  setLatestSubmissionId: (id) => set({ latestSubmissionId: id }),
}));
