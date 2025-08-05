export interface AIFeedback {
  rating: number;
  message: string;
  category: 'excellent' | 'good' | 'average' | 'needs-work';
}

const excellentMessages = [
  "🚀 This idea could change the world! Investors are probably already calling!",
  "💎 Pure gold! This startup has unicorn potential written all over it!",
  "🔥 Absolutely brilliant! This could be the next big thing!",
  "⭐ Outstanding innovation! Your competitors will be scrambling to catch up!",
  "💡 Genius level thinking! This addresses a real market need perfectly!"
];

const goodMessages = [
  "👍 Solid concept! With some refinement, this could really take off!",
  "✨ Great potential here! A few tweaks could make this amazing!",
  "🎯 You're on the right track! This addresses a real problem!",
  "💪 Strong foundation! This could definitely find its market!",
  "🌟 Promising idea! The execution will be key to success!"
];

const averageMessages = [
  "🤔 Interesting concept, but it needs more differentiation from existing solutions.",
  "📈 There's potential here, but the market might be quite competitive.",
  "⚡ Not bad! Consider pivoting to a more specific niche market.",
  "🎨 The idea has merit, but you'll need a unique angle to stand out.",
  "💭 Worth exploring further, but do more market research first."
];

const needsWorkMessages = [
  "🔄 This needs some rethinking. Consider the target audience more carefully.",
  "📚 Back to the drawing board! Market research could help refine this.",
  "🎯 The problem is valid, but this solution might not be the right fit.",
  "💡 Keep brainstorming! Sometimes the best ideas come after the first few attempts.",
  "🔍 Dig deeper into what customers really want - there's a better solution here somewhere."
];

export function generateAIRating(name: string, tagline: string, description: string): AIFeedback {
  // Simulate AI analysis with some randomness and basic keyword detection
  let baseScore = Math.floor(Math.random() * 40) + 30; // 30-70 base range
  
  // Bonus points for certain keywords
  const innovativeWords = ['ai', 'blockchain', 'sustainable', 'eco', 'green', 'smart', 'cloud', 'mobile', 'social'];
  const problemWords = ['solve', 'problem', 'solution', 'easy', 'simple', 'efficient', 'save', 'help'];
  const marketWords = ['billion', 'million', 'growing', 'market', 'demand', 'need', 'users'];
  
  const text = `${name} ${tagline} ${description}`.toLowerCase();
  
  if (innovativeWords.some(word => text.includes(word))) baseScore += 15;
  if (problemWords.some(word => text.includes(word))) baseScore += 10;
  if (marketWords.some(word => text.includes(word))) baseScore += 10;
  
  // Length bonus (more detailed descriptions get higher scores)
  if (description.length > 200) baseScore += 5;
  if (description.length > 400) baseScore += 5;
  
  // Ensure score is within bounds
  const rating = Math.min(100, Math.max(10, baseScore + Math.floor(Math.random() * 20) - 10));
  
  let category: AIFeedback['category'];
  let messages: string[];
  
  if (rating >= 85) {
    category = 'excellent';
    messages = excellentMessages;
  } else if (rating >= 70) {
    category = 'good';
    messages = goodMessages;
  } else if (rating >= 50) {
    category = 'average';
    messages = averageMessages;
  } else {
    category = 'needs-work';
    messages = needsWorkMessages;
  }
  
  const message = messages[Math.floor(Math.random() * messages.length)];
  
  return { rating, message, category };
}