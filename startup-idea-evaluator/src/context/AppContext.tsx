import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { StartupIdea, User } from '../types';
import { StorageService } from '../utils/storage';
import { loadSampleData } from '../utils/sampleData';

interface AppContextType {
  ideas: StartupIdea[];
  user: User | null;
  userVotes: string[];
  addIdea: (idea: Omit<StartupIdea, 'id' | 'votes' | 'createdAt'>) => Promise<void>;
  voteForIdea: (ideaId: string) => Promise<void>;
  setUser: (user: User) => Promise<void>;
  refreshData: () => Promise<void>;
  loading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [ideas, setIdeas] = useState<StartupIdea[]>([]);
  const [user, setUserState] = useState<User | null>(null);
  const [userVotes, setUserVotes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Load sample data if no ideas exist (for demo purposes)
      await loadSampleData();
      
      const [loadedIdeas, loadedUser, loadedVotes] = await Promise.all([
        StorageService.getIdeas(),
        StorageService.getUser(),
        StorageService.getUserVotes(),
      ]);

      setIdeas(loadedIdeas);
      setUserState(loadedUser);
      setUserVotes(loadedVotes);
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addIdea = async (ideaData: Omit<StartupIdea, 'id' | 'votes' | 'createdAt'>) => {
    try {
      const newIdea: StartupIdea = {
        ...ideaData,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        votes: 0,
        createdAt: new Date(),
      };

      await StorageService.addIdea(newIdea);
      setIdeas(prev => [...prev, newIdea]);
    } catch (error) {
      console.error('Error adding idea:', error);
      throw error;
    }
  };

  const voteForIdea = async (ideaId: string) => {
    try {
      if (userVotes.includes(ideaId)) {
        return; // Already voted
      }

      await StorageService.addVote(ideaId);
      setUserVotes(prev => [...prev, ideaId]);

      setIdeas(prev => prev.map(idea => 
        idea.id === ideaId 
          ? { ...idea, votes: idea.votes + 1, hasVoted: true }
          : idea
      ));
    } catch (error) {
      console.error('Error voting for idea:', error);
      throw error;
    }
  };

  const setUser = async (userData: User) => {
    try {
      await StorageService.saveUser(userData);
      setUserState(userData);
    } catch (error) {
      console.error('Error setting user:', error);
      throw error;
    }
  };

  const refreshData = async () => {
    await loadInitialData();
  };

  // Mark ideas as voted by user
  const ideasWithVotes = ideas.map(idea => ({
    ...idea,
    hasVoted: userVotes.includes(idea.id),
  }));

  return (
    <AppContext.Provider value={{
      ideas: ideasWithVotes,
      user,
      userVotes,
      addIdea,
      voteForIdea,
      setUser,
      refreshData,
      loading,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};