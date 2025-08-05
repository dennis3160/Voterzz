import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { StartupIdea } from '../types';
import Toast from 'react-native-toast-message';

interface IdeaCardProps {
  idea: StartupIdea;
  onVote: (ideaId: string) => void;
  onShare?: (idea: StartupIdea) => void;
}

const IdeaCard: React.FC<IdeaCardProps> = ({ idea, onVote, onShare }) => {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const [animatedHeight] = useState(new Animated.Value(0));
  const [isVoting, setIsVoting] = useState(false);

  const handleToggleExpand = () => {
    const toValue = isExpanded ? 0 : 1;
    
    Animated.timing(animatedHeight, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
    
    setIsExpanded(!isExpanded);
  };

  const handleVote = async () => {
    if (idea.hasVoted) {
      Toast.show({
        type: 'info',
        text1: 'Already Voted',
        text2: 'You\'ve already voted for this idea',
      });
      return;
    }

    setIsVoting(true);
    try {
      await onVote(idea.id);
      Toast.show({
        type: 'success',
        text1: 'Vote Recorded! 👍',
        text2: 'Thanks for supporting this idea',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Vote Failed',
        text2: 'Please try again',
      });
    } finally {
      setIsVoting(false);
    }
  };

  const handleShare = async () => {
    try {
      const shareMessage = `Check out this startup idea: ${idea.name}\n\n"${idea.tagline}"\n\nAI Rating: ${idea.aiRating}/100 | Votes: ${idea.votes}`;
      
      await Share.share({
        message: shareMessage,
        title: `Startup Idea: ${idea.name}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 85) return theme.colors.success;
    if (rating >= 70) return theme.colors.primary;
    if (rating >= 50) return theme.colors.warning;
    return theme.colors.error;
  };

  const getRatingEmoji = (rating: number) => {
    if (rating >= 85) return '🚀';
    if (rating >= 70) return '✨';
    if (rating >= 50) return '⚡';
    return '💡';
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(new Date(date));
  };

  const maxHeight = animatedHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 200],
  });

  return (
    <View 
      style={[
        styles.container,
        { 
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.text + '10',
        },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={2}>
            {idea.name}
          </Text>
          <Text style={[styles.date, { color: theme.colors.text + '60' }]}>
            {formatDate(idea.createdAt)}
          </Text>
        </View>
        
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingEmoji}>{getRatingEmoji(idea.aiRating)}</Text>
          <Text style={[styles.rating, { color: getRatingColor(idea.aiRating) }]}>
            {idea.aiRating}
          </Text>
        </View>
      </View>

      {/* Tagline */}
      <Text style={[styles.tagline, { color: theme.colors.text + '90' }]} numberOfLines={2}>
        {idea.tagline}
      </Text>

      {/* Stats and Actions */}
      <View style={styles.statsContainer}>
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Ionicons name="heart" size={16} color={theme.colors.error} />
            <Text style={[styles.statText, { color: theme.colors.text }]}>
              {idea.votes} votes
            </Text>
          </View>
          
          <TouchableOpacity onPress={handleToggleExpand} style={styles.statItem}>
            <Ionicons 
              name={isExpanded ? "chevron-up" : "chevron-down"} 
              size={16} 
              color={theme.colors.primary} 
            />
            <Text style={[styles.statText, { color: theme.colors.primary }]}>
              {isExpanded ? 'Less' : 'More'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity onPress={handleShare} style={styles.actionButton}>
            <Ionicons name="share-outline" size={20} color={theme.colors.text + '80'} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={handleVote}
            disabled={isVoting || idea.hasVoted}
            style={[
              styles.voteButton,
              { 
                backgroundColor: idea.hasVoted ? theme.colors.success + '20' : theme.colors.primary,
                opacity: isVoting ? 0.6 : 1,
              },
            ]}
          >
            <Ionicons 
              name={idea.hasVoted ? "checkmark" : "heart-outline"} 
              size={16} 
              color={idea.hasVoted ? theme.colors.success : "#ffffff"} 
            />
            <Text style={[
              styles.voteText,
              { color: idea.hasVoted ? theme.colors.success : "#ffffff" }
            ]}>
              {idea.hasVoted ? 'Voted' : 'Vote'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Expandable Description */}
      <Animated.View 
        style={[
          styles.expandableContainer,
          { 
            maxHeight,
            backgroundColor: theme.colors.background + '50',
          },
        ]}
      >
        <Text style={[styles.description, { color: theme.colors.text + '90' }]}>
          {idea.description}
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
  },
  ratingContainer: {
    alignItems: 'center',
    minWidth: 50,
  },
  ratingEmoji: {
    fontSize: 20,
    marginBottom: 2,
  },
  rating: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  tagline: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginRight: 8,
  },
  voteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  voteText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  expandableContainer: {
    overflow: 'hidden',
    marginTop: 8,
    borderRadius: 8,
    padding: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default IdeaCard;