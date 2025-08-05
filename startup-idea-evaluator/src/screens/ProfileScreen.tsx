import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { User } from '../types';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import Toast from 'react-native-toast-message';

const ProfileScreen = () => {
  const { theme, toggleTheme, isDark } = useTheme();
  const { user, setUser, ideas, userVotes } = useApp();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  useEffect(() => {
    if (!user) {
      setShowOnboarding(true);
    } else {
      setFormData({ name: user.name, email: user.email });
    }
  }, [user]);

  const validateForm = (): boolean => {
    const newErrors: { name?: string; email?: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validateForm()) {
      Toast.show({
        type: 'error',
        text1: 'Please fix the errors',
        text2: 'Check all required fields',
      });
      return;
    }

    try {
      const userData: User = {
        id: user?.id || Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        createdAt: user?.createdAt || new Date(),
      };

      await setUser(userData);
      setShowOnboarding(false);
      setIsEditing(false);

      Toast.show({
        type: 'success',
        text1: 'Profile Saved! ✅',
        text2: 'Your information has been updated',
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      Toast.show({
        type: 'error',
        text1: 'Save Failed',
        text2: 'Please try again',
      });
    }
  };

  const handleInputChange = (field: 'name' | 'email', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const myIdeas = ideas.filter(idea => idea.userId === user?.id);
  const totalVotesReceived = myIdeas.reduce((sum, idea) => sum + idea.votes, 0);
  const averageRating = myIdeas.length > 0 
    ? Math.round(myIdeas.reduce((sum, idea) => sum + idea.aiRating, 0) / myIdeas.length)
    : 0;

  const getGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getAvatarInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const renderOnboardingModal = () => (
    <Modal
      visible={showOnboarding}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
        <ScrollView contentContainerStyle={styles.modalContent}>
          <View style={styles.onboardingHeader}>
            <View style={[styles.welcomeIcon, { backgroundColor: theme.colors.primary }]}>
              <Ionicons name="rocket" size={32} color="#ffffff" />
            </View>
            <Text style={[styles.welcomeTitle, { color: theme.colors.text }]}>
              Welcome to Startup Evaluator! 🚀
            </Text>
            <Text style={[styles.welcomeSubtitle, { color: theme.colors.text + '80' }]}>
              Let's set up your profile to get started with sharing and voting on amazing startup ideas!
            </Text>
          </View>

          <View style={styles.onboardingForm}>
            <CustomInput
              label="Your Name"
              placeholder="Enter your full name"
              value={formData.name}
              onChangeText={(value) => handleInputChange('name', value)}
              error={errors.name}
              icon="person-outline"
              required
            />

            <CustomInput
              label="Email Address"
              placeholder="Enter your email"
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              error={errors.email}
              icon="mail-outline"
              keyboardType="email-address"
              autoCapitalize="none"
              required
            />

            <CustomButton
              title="Get Started"
              onPress={handleSaveProfile}
              size="large"
              style={styles.onboardingButton}
            />

            <Text style={[styles.disclaimer, { color: theme.colors.text + '60' }]}>
              Your information is stored locally on your device and is used only to personalize your experience.
            </Text>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );

  const renderStatCard = (icon: keyof typeof Ionicons.glyphMap, value: string, label: string, color: string) => (
    <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
      <Ionicons name={icon} size={24} color={color} />
      <Text style={[styles.statValue, { color: theme.colors.text }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: theme.colors.text + '70' }]}>{label}</Text>
    </View>
  );

  const renderSettingItem = (
    icon: keyof typeof Ionicons.glyphMap,
    title: string,
    subtitle: string,
    onPress: () => void,
    rightComponent?: React.ReactNode
  ) => (
    <TouchableOpacity
      style={[styles.settingItem, { backgroundColor: theme.colors.surface }]}
      onPress={onPress}
    >
      <View style={styles.settingLeft}>
        <View style={[styles.settingIcon, { backgroundColor: theme.colors.primary + '20' }]}>
          <Ionicons name={icon} size={20} color={theme.colors.primary} />
        </View>
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, { color: theme.colors.text }]}>{title}</Text>
          <Text style={[styles.settingSubtitle, { color: theme.colors.text + '70' }]}>{subtitle}</Text>
        </View>
      </View>
      {rightComponent || (
        <Ionicons name="chevron-forward" size={20} color={theme.colors.text + '40'} />
      )}
    </TouchableOpacity>
  );

  if (!user && !showOnboarding) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {renderOnboardingModal()}
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {user && (
          <>
            {/* Profile Header */}
            <View style={styles.profileHeader}>
              <LinearGradient
                colors={[theme.colors.primary, theme.colors.secondary]}
                style={styles.profileGradient}
              >
                <View style={styles.avatarContainer}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {getAvatarInitials(user.name)}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.editButton, { backgroundColor: theme.colors.surface }]}
                    onPress={() => setIsEditing(true)}
                  >
                    <Ionicons name="pencil" size={16} color={theme.colors.primary} />
                  </TouchableOpacity>
                </View>
                
                <Text style={styles.greeting}>
                  {getGreeting()}, {user.name.split(' ')[0]}! 👋
                </Text>
                <Text style={styles.memberSince}>
                  Member since {new Intl.DateTimeFormat('en-US', { 
                    month: 'long', 
                    year: 'numeric' 
                  }).format(user.createdAt)}
                </Text>
              </LinearGradient>
            </View>

            {/* Stats */}
            <View style={styles.statsContainer}>
              {renderStatCard('bulb', myIdeas.length.toString(), 'Ideas Shared', theme.colors.primary)}
              {renderStatCard('heart', totalVotesReceived.toString(), 'Votes Received', theme.colors.error)}
              {renderStatCard('thumbs-up', userVotes.length.toString(), 'Votes Given', theme.colors.success)}
              {renderStatCard('star', averageRating.toString(), 'Avg AI Rating', theme.colors.warning)}
            </View>

            {/* Settings */}
            <View style={styles.settingsContainer}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Settings</Text>
              
              {renderSettingItem(
                'moon',
                'Dark Mode',
                isDark ? 'Dark theme enabled' : 'Light theme enabled',
                toggleTheme,
                <Switch
                  value={isDark}
                  onValueChange={toggleTheme}
                  trackColor={{ false: theme.colors.text + '30', true: theme.colors.primary }}
                  thumbColor={isDark ? '#ffffff' : '#f4f3f4'}
                />
              )}

              {renderSettingItem(
                'person',
                'Edit Profile',
                'Update your name and email',
                () => setIsEditing(true)
              )}

              {renderSettingItem(
                'information-circle',
                'About',
                'Learn more about this app',
                () => Alert.alert(
                  'About Startup Evaluator',
                  'This app helps entrepreneurs share their startup ideas, get AI feedback, and receive community votes. Built with React Native and Expo.\n\nVersion 1.0.0',
                  [{ text: 'OK' }]
                )
              )}
            </View>
          </>
        )}
      </ScrollView>

      {/* Edit Profile Modal */}
      {isEditing && (
        <Modal
          visible={isEditing}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <View style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setIsEditing(false)}>
                <Text style={[styles.cancelButton, { color: theme.colors.text }]}>Cancel</Text>
              </TouchableOpacity>
              <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Edit Profile</Text>
              <TouchableOpacity onPress={handleSaveProfile}>
                <Text style={[styles.saveButton, { color: theme.colors.primary }]}>Save</Text>
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.modalContent}>
              <CustomInput
                label="Your Name"
                placeholder="Enter your full name"
                value={formData.name}
                onChangeText={(value) => handleInputChange('name', value)}
                error={errors.name}
                icon="person-outline"
                required
              />

              <CustomInput
                label="Email Address"
                placeholder="Enter your email"
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                error={errors.email}
                icon="mail-outline"
                keyboardType="email-address"
                autoCapitalize="none"
                required
              />
            </ScrollView>
          </View>
        </Modal>
      )}
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
  profileHeader: {
    marginBottom: 20,
  },
  profileGradient: {
    padding: 24,
    paddingTop: 40,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  avatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 4,
  },
  memberSince: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
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
  settingsContainer: {
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 12,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    fontSize: 16,
  },
  saveButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalContent: {
    padding: 20,
    paddingBottom: 40,
  },
  onboardingHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  welcomeIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  onboardingForm: {
    flex: 1,
  },
  onboardingButton: {
    marginTop: 8,
    marginBottom: 20,
  },
  disclaimer: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default ProfileScreen;