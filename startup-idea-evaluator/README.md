# 🚀 Startup Idea Evaluator

A modern React Native mobile application where entrepreneurs can submit their startup ideas, receive AI-powered feedback, vote on others' ideas, and compete on leaderboards.

## ✨ Features

### Core Functionality
- 💡 **Idea Submission**: Submit startup ideas with name, tagline, and detailed description
- 🤖 **AI Rating**: Get instant AI-generated feedback and ratings (0-100)
- 👍 **Community Voting**: Vote on others' ideas (one vote per idea)
- 🏆 **Leaderboards**: View top ideas by votes or AI ratings
- 📱 **User Profiles**: Personal stats and idea management

### UI/UX Excellence
- 🌙 **Dark Mode**: Toggle between light and dark themes
- 🎨 **Modern Design**: Beautiful gradients, animations, and Material Design
- 📱 **Mobile-First**: Optimized for mobile with smooth gestures
- 🔄 **Real-time Updates**: Live data synchronization
- 🍞 **Toast Notifications**: User-friendly feedback system

### Technical Features
- 💾 **Local Storage**: Persistent data with AsyncStorage
- 🔐 **User Authentication**: Simple onboarding flow
- 📊 **Analytics**: Track user engagement and ideas
- 🔄 **Pull-to-Refresh**: Easy data refreshing
- 📤 **Share Functionality**: Share ideas via social platforms

## 🛠️ Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: React Navigation 7
- **UI Library**: Custom components with React Native Paper
- **Storage**: AsyncStorage
- **Animations**: React Native Reanimated
- **Icons**: Expo Vector Icons (Ionicons)
- **Gradients**: Expo Linear Gradient
- **Notifications**: React Native Toast Message

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (or physical device)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd startup-idea-evaluator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on device/emulator**
   ```bash
   # iOS (requires macOS)
   npm run ios

   # Android
   npm run android

   # Web
   npm run web
   ```

### Development

- **Development mode**: `npm run start:dev`
- **Clear cache**: `expo start -c`

## 📱 App Structure

```
src/
├── components/          # Reusable UI components
│   ├── CustomButton.tsx
│   ├── CustomInput.tsx
│   └── IdeaCard.tsx
├── context/            # React Context providers
│   ├── AppContext.tsx
│   └── ThemeContext.tsx
├── navigation/         # Navigation setup
│   └── TabNavigator.tsx
├── screens/           # App screens
│   ├── SubmitScreen.tsx
│   ├── IdeasScreen.tsx
│   ├── LeaderboardScreen.tsx
│   └── ProfileScreen.tsx
├── types/             # TypeScript interfaces
│   └── index.ts
└── utils/             # Utility functions
    ├── storage.ts
    ├── aiRating.ts
    └── sampleData.ts
```

## 🎯 Key Features Deep Dive

### AI Rating System
The app includes a sophisticated AI rating algorithm that analyzes:
- **Keywords**: Innovation, problem-solving, and market-related terms
- **Description Quality**: Length and detail level
- **Market Potential**: Based on content analysis
- **Fun Feedback**: Contextual messages based on rating tiers

### User Experience
- **Onboarding Flow**: Seamless user registration
- **Voting System**: One vote per idea with visual feedback
- **Leaderboards**: Beautiful podium display for top 3 ideas
- **Profile Analytics**: Personal statistics and achievements

### Data Management
- **Local Storage**: All data stored locally using AsyncStorage
- **Sample Data**: Pre-loaded ideas for demonstration
- **Data Persistence**: User preferences and votes are remembered
- **Offline Support**: Full functionality without internet

## 🎨 Design System

### Color Palette
- **Primary**: Indigo gradient (#6366f1 → #8b5cf6)
- **Success**: Emerald (#10b981)
- **Error**: Red (#ef4444)
- **Warning**: Amber (#f59e0b)

### Typography
- **Headers**: Bold, hierarchical sizing
- **Body**: Clear, readable fonts
- **Accents**: Emojis and icons for personality

### Components
- **Cards**: Elevated surfaces with shadows
- **Buttons**: Gradient backgrounds with haptic feedback
- **Inputs**: Focused states with validation
- **Animations**: Smooth transitions and micro-interactions

## 📊 Demo Data

The app includes sample startup ideas to showcase functionality:
- EcoRide Share (Sustainable transportation)
- SkillSwap (Skill exchange platform)
- FoodRescue AI (Food waste reduction)
- MindfulSpace (Mental wellness app)
- LocalCraft (Artisan marketplace)
- CodeMentor Kids (Programming for children)

## 🚀 Deployment

### Expo Publish
```bash
expo publish
```

### Build APK (Android)
```bash
expo build:android
```

### Build IPA (iOS)
```bash
expo build:ios
```

## 🎯 Assignment Requirements Met

✅ **Idea Submission Screen**: Form with validation and AI feedback  
✅ **Idea Listing Screen**: Voting, sorting, and expandable cards  
✅ **Leaderboard Screen**: Top ideas with beautiful podium display  
✅ **Bonus Features**: Dark mode, animations, share functionality  
✅ **Modern UI/UX**: Professional design with smooth interactions  
✅ **Technical Excellence**: TypeScript, proper architecture, error handling  

## 📱 Screenshots

*Note: Screenshots would be added here showing the app in action*

## 🔮 Future Enhancements

- **Real API Integration**: Connect to backend services
- **Push Notifications**: Engagement and updates
- **Social Features**: User following and comments
- **Advanced Analytics**: Detailed insights and trends
- **Monetization**: Premium features and ads
- **Multi-language**: Internationalization support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is created as a mobile app internship assignment and is for educational purposes.

## 🙏 Acknowledgments

- Built with ❤️ using React Native and Expo
- UI inspired by modern design principles
- Icons from Expo Vector Icons
- Sample ideas created for demonstration

---

**Ready to explore startup ideas? Download and start discovering! 🚀**