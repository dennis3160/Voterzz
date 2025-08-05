import { StartupIdea } from '../types';

export const sampleIdeas: StartupIdea[] = [
  {
    id: 'sample-1',
    name: 'EcoRide Share',
    tagline: 'Sustainable transportation made simple with AI-powered ride matching',
    description: 'EcoRide Share connects eco-conscious commuters with shared electric vehicle rides, reducing carbon footprint while saving money. Our AI algorithm optimizes routes for maximum efficiency and matches riders based on preferences, schedules, and environmental goals. Users earn rewards for choosing green transportation options.',
    aiRating: 87,
    votes: 15,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    userId: 'demo-user-1',
  },
  {
    id: 'sample-2',
    name: 'SkillSwap',
    tagline: 'Learn by teaching - exchange skills with your community',
    description: 'SkillSwap is a platform where people can exchange skills and knowledge with others in their community. Want to learn guitar? Teach someone coding in return. Our matching algorithm pairs users based on complementary skills, availability, and learning goals. Build connections while growing professionally.',
    aiRating: 76,
    votes: 23,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    userId: 'demo-user-2',
  },
  {
    id: 'sample-3',
    name: 'FoodRescue AI',
    tagline: 'Reducing food waste with intelligent donation matching',
    description: 'FoodRescue AI connects restaurants, grocery stores, and food suppliers with local charities and food banks. Our AI predicts food surplus and automatically matches donations with organizations in need. Real-time tracking ensures food safety and maximizes impact in fighting hunger.',
    aiRating: 92,
    votes: 31,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    userId: 'demo-user-3',
  },
  {
    id: 'sample-4',
    name: 'MindfulSpace',
    tagline: 'AI-powered mental wellness companion for busy professionals',
    description: 'MindfulSpace provides personalized meditation, stress management, and wellness coaching through AI. The app learns from your daily patterns, stress levels, and goals to suggest micro-meditations, breathing exercises, and mindfulness practices that fit your schedule.',
    aiRating: 73,
    votes: 18,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    userId: 'demo-user-4',
  },
  {
    id: 'sample-5',
    name: 'LocalCraft',
    tagline: 'Marketplace for handmade goods with story-driven shopping',
    description: 'LocalCraft is an e-commerce platform that connects artisans with customers through storytelling. Each product comes with the maker\'s story, crafting process videos, and cultural background. Customers can message artisans directly and even commission custom pieces.',
    aiRating: 68,
    votes: 12,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    userId: 'demo-user-5',
  },
  {
    id: 'sample-6',
    name: 'CodeMentor Kids',
    tagline: 'Making programming fun and accessible for children aged 6-14',
    description: 'CodeMentor Kids uses gamification and visual programming to teach children coding concepts. Kids build games, animations, and apps while learning fundamental programming principles. Parents get progress reports and children earn badges for completing challenges.',
    aiRating: 81,
    votes: 27,
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
    userId: 'demo-user-6',
  },
];

export const loadSampleData = async () => {
  // This function can be called to load sample data for demonstration
  const { StorageService } = await import('./storage');
  const existingIdeas = await StorageService.getIdeas();
  
  if (existingIdeas.length === 0) {
    await StorageService.saveIdeas(sampleIdeas);
    return true;
  }
  return false;
};