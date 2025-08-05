export interface StartupIdea {
  id: string;
  name: string;
  tagline: string;
  description: string;
  aiRating: number;
  votes: number;
  createdAt: Date;
  userId: string;
  hasVoted?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: Date;
}

export interface AppTheme {
  isDark: boolean;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    error: string;
    success: string;
    warning: string;
  };
}

export type RootTabParamList = {
  Submit: undefined;
  Ideas: undefined;
  Leaderboard: undefined;
  Profile: undefined;
};