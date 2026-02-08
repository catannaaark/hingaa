
export enum ActivityStatus {
  OPEN = 'OPEN JOIN',
  REQUEST = 'REQUEST ACCESS',
  COMPLETED = 'COMPLETED',
  AWAITING_APPROVAL = 'PENDING',
  CONFIRMED = 'CONFIRMED'
}

export type AudienceType = 'Mixed' | 'Girls Only' | 'Boys Only';

export interface Activity {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  hostName: string;
  hostAvatar: string;
  participants: number;
  participantLimit: number;
  location: string;
  status: ActivityStatus;
  audience: AudienceType;
  image: string;
  tags: string[];
}

export interface RecurringConfig {
  frequency: 'daily' | 'weekly' | 'monthly';
  days?: string[];
  endDate?: string;
}

export interface Message {
  id: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  isSelf: boolean;
  image?: string;
}

export interface UserProfile {
  fullName: string;
  birthDate: string;
  gender: string;
  instaUsername: string;
  email: string;
  bio: string;
  avatar: string;
  interests: string[];
}

export const INTEREST_CATEGORIES = [
  { id: 'food', label: 'Food & Dining', icon: 'restaurant' },
  { id: 'adventure', label: 'Adventure', icon: 'explore' },
  { id: 'sports', label: 'Sports & Fitness', icon: 'fitness_center' },
  { id: 'arts', label: 'Arts & Creativity', icon: 'palette' },
  { id: 'entertainment', label: 'Entertainment & Chill', icon: 'local_activity' },
  { id: 'gaming', label: 'Gaming', icon: 'sports_esports' },
  { id: 'learning', label: 'Learning & Skill-Building', icon: 'school' },
  { id: 'volunteer', label: 'Volunteer', icon: 'volunteer_activism' },
  { id: 'sidequests', label: 'Side Quests!', icon: 'auto_awesome' },
];
