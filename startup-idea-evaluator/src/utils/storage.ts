import AsyncStorage from '@react-native-async-storage/async-storage';
import { StartupIdea, User } from '../types';

const KEYS = {
  IDEAS: 'startup_ideas',
  USER: 'current_user',
  VOTES: 'user_votes',
  THEME: 'app_theme',
};

export const StorageService = {
  // Ideas management
  async getIdeas(): Promise<StartupIdea[]> {
    try {
      const ideas = await AsyncStorage.getItem(KEYS.IDEAS);
      return ideas ? JSON.parse(ideas).map((idea: any) => ({
        ...idea,
        createdAt: new Date(idea.createdAt)
      })) : [];
    } catch (error) {
      console.error('Error getting ideas:', error);
      return [];
    }
  },

  async saveIdeas(ideas: StartupIdea[]): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.IDEAS, JSON.stringify(ideas));
    } catch (error) {
      console.error('Error saving ideas:', error);
    }
  },

  async addIdea(idea: StartupIdea): Promise<void> {
    try {
      const existingIdeas = await this.getIdeas();
      existingIdeas.push(idea);
      await this.saveIdeas(existingIdeas);
    } catch (error) {
      console.error('Error adding idea:', error);
    }
  },

  // User votes tracking
  async getUserVotes(): Promise<string[]> {
    try {
      const votes = await AsyncStorage.getItem(KEYS.VOTES);
      return votes ? JSON.parse(votes) : [];
    } catch (error) {
      console.error('Error getting votes:', error);
      return [];
    }
  },

  async addVote(ideaId: string): Promise<void> {
    try {
      const votes = await this.getUserVotes();
      if (!votes.includes(ideaId)) {
        votes.push(ideaId);
        await AsyncStorage.setItem(KEYS.VOTES, JSON.stringify(votes));
      }
    } catch (error) {
      console.error('Error adding vote:', error);
    }
  },

  // User management
  async getUser(): Promise<User | null> {
    try {
      const user = await AsyncStorage.getItem(KEYS.USER);
      return user ? { ...JSON.parse(user), createdAt: new Date(JSON.parse(user).createdAt) } : null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  },

  async saveUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.USER, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user:', error);
    }
  },

  // Theme management
  async getTheme(): Promise<boolean> {
    try {
      const theme = await AsyncStorage.getItem(KEYS.THEME);
      return theme ? JSON.parse(theme) : false;
    } catch (error) {
      console.error('Error getting theme:', error);
      return false;
    }
  },

  async saveTheme(isDark: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.THEME, JSON.stringify(isDark));
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  },

  // Clear all data (for testing)
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([KEYS.IDEAS, KEYS.USER, KEYS.VOTES, KEYS.THEME]);
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },
};