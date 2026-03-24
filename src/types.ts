export interface Plan {
  id: string;
  userId: string;
  requirement: string;
  startDate: string;
  endDate: string;
  hoursPerWeek: number;
  content: string;
  createdAt: number;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}
