import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { StartupIdea } from '../types';

type LeaderboardType = 'votes' | 'rating';

const { width } = Dimensions.get('window');

const LeaderboardScreen = () => {
  const { theme } = useTheme();
  const { ideas, refreshData } = useApp();
  const [activeTab, setActiveTab] = useState<LeaderboardType>('votes');
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  };

  const topIdeas = useMemo(() => {
    const sortedIdeas = [...ideas].sort((a, b) => {
      if (activeTab === 'votes') {
        return b.votes - a.votes;
      }
      return b.aiRating - a.aiRating;
    });
    return sortedIdeas.slice(0, 10);
  }, [ideas, activeTab]);

  const getMedalEmoji = (position: number): string => {
    switch (position) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return '🏅';
    }
  };

  const getMedalColor = (position: number): string => {
    switch (position) {
      case 1: return '#FFD700'; // Gold
      case 2: return '#C0C0C0'; // Silver
      case 3: return '#CD7F32'; // Bronze
      default: return theme.colors.text + '40';
    }
  };

  const getPositionSuffix = (position: number): string => {
    const lastDigit = position % 10;
    const lastTwoDigits = position % 100;
    
    if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
      return 'th';
    }
    
    switch (lastDigit) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  const renderTabButton = (tab: LeaderboardType, label: string, icon: keyof typeof Ionicons.glyphMap) => (
    <TouchableOpacity
      key={tab}
      style={[
        styles.tabButton,
        {
          backgroundColor: activeTab === tab ? theme.colors.primary : 'transparent',
        },
      ]}
      onPress={() => setActiveTab(tab)}
    >
      <Ionicons
        name={icon}
        size={20}
        color={activeTab === tab ? '#ffffff' : theme.colors.text}
      />
      <Text
        style={[
          styles.tabButtonText,
          {
            color: activeTab === tab ? '#ffffff' : theme.colors.text,
          },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderTopThree = () => {
    const topThree = topIdeas.slice(0, 3);
    
    if (topThree.length === 0) return null;

    return (
      <View style={styles.podiumContainer}>
        <Text style={[styles.podiumTitle, { color: theme.colors.text }]}>
          🏆 Top 3 Ideas
        </Text>
        
        <View style={styles.podium}>
          {/* Second Place */}
          {topThree[1] && (
            <View style={[styles.podiumPlace, styles.secondPlace]}>
              <LinearGradient
                colors={['#E8E8E8', '#C0C0C0']}
                style={styles.podiumGradient}
              >
                <Text style={styles.podiumPosition}>2{getPositionSuffix(2)}</Text>
                <Text style={styles.podiumEmoji}>🥈</Text>
                <Text style={[styles.podiumName, { color: theme.colors.text }]} numberOfLines={2}>
                  {topThree[1].name}
                </Text>
                <Text style={[styles.podiumValue, { color: theme.colors.text }]}>
                  {activeTab === 'votes' ? `${topThree[1].votes} votes` : `${topThree[1].aiRating}/100`}
                </Text>
              </LinearGradient>
            </View>
          )}

          {/* First Place */}
          {topThree[0] && (
            <View style={[styles.podiumPlace, styles.firstPlace]}>
              <LinearGradient
                colors={['#FFE55C', '#FFD700']}
                style={styles.podiumGradient}
              >
                <Text style={styles.podiumPosition}>1{getPositionSuffix(1)}</Text>
                <Text style={styles.podiumEmoji}>🥇</Text>
                <Text style={[styles.podiumName, { color: theme.colors.text }]} numberOfLines={2}>
                  {topThree[0].name}
                </Text>
                <Text style={[styles.podiumValue, { color: theme.colors.text }]}>
                  {activeTab === 'votes' ? `${topThree[0].votes} votes` : `${topThree[0].aiRating}/100`}
                </Text>
              </LinearGradient>
            </View>
          )}

          {/* Third Place */}
          {topThree[2] && (
            <View style={[styles.podiumPlace, styles.thirdPlace]}>
              <LinearGradient
                colors={['#DEB887', '#CD7F32']}
                style={styles.podiumGradient}
              >
                <Text style={styles.podiumPosition}>3{getPositionSuffix(3)}</Text>
                <Text style={styles.podiumEmoji}>🥉</Text>
                <Text style={[styles.podiumName, { color: theme.colors.text }]} numberOfLines={2}>
                  {topThree[2].name}
                </Text>
                <Text style={[styles.podiumValue, { color: theme.colors.text }]}>
                  {activeTab === 'votes' ? `${topThree[2].votes} votes` : `${topThree[2].aiRating}/100`}
                </Text>
              </LinearGradient>
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderRankingItem = (idea: StartupIdea, index: number) => {
    const position = index + 1;
    const isTopThree = position <= 3;
    
    if (isTopThree) return null; // Already shown in podium

    return (
      <View
        key={idea.id}
        style={[
          styles.rankingItem,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.text + '10',
          },
        ]}
      >
        <View style={styles.rankingLeft}>
          <View style={[styles.positionBadge, { backgroundColor: getMedalColor(position) }]}>
            <Text style={styles.positionText}>
              {position}
            </Text>
          </View>
          
          <View style={styles.ideaInfo}>
            <Text style={[styles.ideaName, { color: theme.colors.text }]} numberOfLines={1}>
              {idea.name}
            </Text>
            <Text style={[styles.ideaTagline, { color: theme.colors.text + '70' }]} numberOfLines={1}>
              {idea.tagline}
            </Text>
          </View>
        </View>

        <View style={styles.rankingRight}>
          <Text style={[styles.rankingValue, { color: theme.colors.primary }]}>
            {activeTab === 'votes' ? idea.votes : idea.aiRating}
          </Text>
          <Text style={[styles.rankingLabel, { color: theme.colors.text + '60' }]}>
            {activeTab === 'votes' ? 'votes' : '/100'}
          </Text>
        </View>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="trophy-outline" size={64} color={theme.colors.text + '40'} />
      <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
        No Rankings Yet! 🏆
      </Text>
      <Text style={[styles.emptySubtitle, { color: theme.colors.text + '70' }]}>
        Submit ideas and vote to see the leaderboard in action!
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            🏆 Leaderboard
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.text + '70' }]}>
            Discover the most popular and highest-rated startup ideas
          </Text>
        </View>

        {/* Tab Buttons */}
        <View style={[styles.tabContainer, { backgroundColor: theme.colors.surface }]}>
          {renderTabButton('votes', 'Most Votes', 'heart')}
          {renderTabButton('rating', 'AI Rating', 'star')}
        </View>

        {ideas.length === 0 ? (
          renderEmptyState()
        ) : (
          <>
            {/* Top 3 Podium */}
            {renderTopThree()}

            {/* Rankings List */}
            {topIdeas.length > 3 && (
              <View style={styles.rankingsContainer}>
                <Text style={[styles.rankingsTitle, { color: theme.colors.text }]}>
                  Complete Rankings
                </Text>
                {topIdeas.map((idea, index) => renderRankingItem(idea, index))}
              </View>
            )}

            {/* Stats */}
            <View style={[styles.statsContainer, { backgroundColor: theme.colors.surface }]}>
              <View style={styles.statItem}>
                <Ionicons name="bulb" size={24} color={theme.colors.primary} />
                <Text style={[styles.statValue, { color: theme.colors.text }]}>
                  {ideas.length}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.text + '70' }]}>
                  Total Ideas
                </Text>
              </View>
              
              <View style={styles.statItem}>
                <Ionicons name="heart" size={24} color={theme.colors.error} />
                <Text style={[styles.statValue, { color: theme.colors.text }]}>
                  {ideas.reduce((sum, idea) => sum + idea.votes, 0)}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.text + '70' }]}>
                  Total Votes
                </Text>
              </View>
              
              <View style={styles.statItem}>
                <Ionicons name="star" size={24} color={theme.colors.warning} />
                <Text style={[styles.statValue, { color: theme.colors.text }]}>
                  {ideas.length > 0 ? Math.round(ideas.reduce((sum, idea) => sum + idea.aiRating, 0) / ideas.length) : 0}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.text + '70' }]}>
                  Avg Rating
                </Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  podiumContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  podiumTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  podium: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    height: 200,
  },
  podiumPlace: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  firstPlace: {
    height: 160,
  },
  secondPlace: {
    height: 140,
  },
  thirdPlace: {
    height: 120,
  },
  podiumGradient: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  podiumPosition: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  podiumEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  podiumName: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  podiumValue: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
  rankingsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  rankingsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  rankingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  rankingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  positionBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  positionText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  ideaInfo: {
    flex: 1,
  },
  ideaName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  ideaTagline: {
    fontSize: 12,
  },
  rankingRight: {
    alignItems: 'flex-end',
  },
  rankingValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  rankingLabel: {
    fontSize: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default LeaderboardScreen;