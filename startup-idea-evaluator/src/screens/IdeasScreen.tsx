import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { StartupIdea } from '../types';
import IdeaCard from '../components/IdeaCard';
import CustomButton from '../components/CustomButton';

type SortOption = 'newest' | 'votes' | 'rating';

const IdeasScreen = () => {
  const { theme } = useTheme();
  const { ideas, voteForIdea, refreshData, loading } = useApp();
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  };

  const sortedIdeas = useMemo(() => {
    const ideaList = [...ideas];
    
    switch (sortBy) {
      case 'votes':
        return ideaList.sort((a, b) => b.votes - a.votes);
      case 'rating':
        return ideaList.sort((a, b) => b.aiRating - a.aiRating);
      case 'newest':
      default:
        return ideaList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  }, [ideas, sortBy]);

  const getSortLabel = (option: SortOption): string => {
    switch (option) {
      case 'newest': return 'Newest First';
      case 'votes': return 'Most Votes';
      case 'rating': return 'Highest AI Rating';
      default: return 'Sort';
    }
  };

  const getSortIcon = (option: SortOption): keyof typeof Ionicons.glyphMap => {
    switch (option) {
      case 'newest': return 'time-outline';
      case 'votes': return 'heart-outline';
      case 'rating': return 'star-outline';
      default: return 'funnel-outline';
    }
  };

  const renderSortButton = (option: SortOption) => (
    <TouchableOpacity
      key={option}
      style={[
        styles.sortButton,
        {
          backgroundColor: sortBy === option ? theme.colors.primary : theme.colors.surface,
          borderColor: sortBy === option ? theme.colors.primary : theme.colors.text + '20',
        },
      ]}
      onPress={() => setSortBy(option)}
    >
      <Ionicons
        name={getSortIcon(option)}
        size={16}
        color={sortBy === option ? '#ffffff' : theme.colors.text}
      />
      <Text
        style={[
          styles.sortButtonText,
          {
            color: sortBy === option ? '#ffffff' : theme.colors.text,
          },
        ]}
      >
        {getSortLabel(option)}
      </Text>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="bulb-outline" size={64} color={theme.colors.text + '40'} />
      <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
        No Ideas Yet! 💡
      </Text>
      <Text style={[styles.emptySubtitle, { color: theme.colors.text + '70' }]}>
        Be the first to share your amazing startup idea and get AI feedback!
      </Text>
      <CustomButton
        title="Submit First Idea"
        onPress={() => {/* Navigation will be handled by tab navigator */}}
        variant="outline"
        style={styles.emptyButton}
      />
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <View>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
            Startup Ideas
          </Text>
          <Text style={[styles.headerSubtitle, { color: theme.colors.text + '70' }]}>
            {ideas.length} ideas submitted
          </Text>
        </View>
      </View>

      <View style={styles.sortContainer}>
        <Text style={[styles.sortLabel, { color: theme.colors.text }]}>
          Sort by:
        </Text>
        <View style={styles.sortButtons}>
          {(['newest', 'votes', 'rating'] as SortOption[]).map(renderSortButton)}
        </View>
      </View>
    </View>
  );

  const renderIdeaItem = ({ item }: { item: StartupIdea }) => (
    <IdeaCard
      idea={item}
      onVote={voteForIdea}
    />
  );

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.text }]}>
          Loading ideas...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={sortedIdeas}
        renderItem={renderIdeaItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContent,
          ideas.length === 0 && styles.emptyListContent,
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyListContent: {
    flexGrow: 1,
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  sortContainer: {
    marginBottom: 8,
  },
  sortLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  sortButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  sortButtonText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
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
    marginBottom: 24,
  },
  emptyButton: {
    paddingHorizontal: 32,
  },
});

export default IdeasScreen;