import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { generateAIRating } from '../utils/aiRating';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import Toast from 'react-native-toast-message';

interface FormData {
  name: string;
  tagline: string;
  description: string;
}

interface FormErrors {
  name?: string;
  tagline?: string;
  description?: string;
}

const SubmitScreen = () => {
  const { theme } = useTheme();
  const { addIdea, user } = useApp();
  const navigation = useNavigation();

  const [formData, setFormData] = useState<FormData>({
    name: '',
    tagline: '',
    description: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAIResult, setShowAIResult] = useState(false);
  const [aiResult, setAiResult] = useState<{ rating: number; message: string } | null>(null);

  const fadeAnim = new Animated.Value(0);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Startup name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Startup name must be at least 2 characters';
    }

    if (!formData.tagline.trim()) {
      newErrors.tagline = 'Tagline is required';
    } else if (formData.tagline.trim().length < 10) {
      newErrors.tagline = 'Tagline must be at least 10 characters';
    } else if (formData.tagline.trim().length > 100) {
      newErrors.tagline = 'Tagline must be less than 100 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 50) {
      newErrors.description = 'Description must be at least 50 characters';
    } else if (formData.description.trim().length > 1000) {
      newErrors.description = 'Description must be less than 1000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Toast.show({
        type: 'error',
        text1: 'Please fix the errors',
        text2: 'Check all required fields',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate AI rating
      const aiRating = generateAIRating(formData.name, formData.tagline, formData.description);
      setAiResult({ rating: aiRating.rating, message: aiRating.message });

      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Add idea to storage
      await addIdea({
        name: formData.name.trim(),
        tagline: formData.tagline.trim(),
        description: formData.description.trim(),
        aiRating: aiRating.rating,
        userId: user?.id || 'anonymous',
      });

      // Show AI result with animation
      setShowAIResult(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();

      Toast.show({
        type: 'success',
        text1: 'Idea Submitted! 🎉',
        text2: `AI Rating: ${aiRating.rating}/100`,
      });

      // Reset form after delay
      setTimeout(() => {
        setFormData({ name: '', tagline: '', description: '' });
        setShowAIResult(false);
        setAiResult(null);
        fadeAnim.setValue(0);
        navigation.navigate('Ideas' as never);
      }, 3000);

    } catch (error) {
      console.error('Error submitting idea:', error);
      Toast.show({
        type: 'error',
        text1: 'Submission Failed',
        text2: 'Please try again',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 85) return theme.colors.success;
    if (rating >= 70) return theme.colors.primary;
    if (rating >= 50) return theme.colors.warning;
    return theme.colors.error;
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Share Your Startup Idea! 💡
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.text + '80' }]}>
            Get instant AI feedback and let the community vote on your idea
          </Text>
        </View>

        <View style={styles.form}>
          <CustomInput
            label="Startup Name"
            placeholder="e.g., EcoRide, FoodShare, CodeMentor"
            value={formData.name}
            onChangeText={(value) => handleInputChange('name', value)}
            error={errors.name}
            icon="rocket-outline"
            required
            maxLength={50}
          />

          <CustomInput
            label="Tagline"
            placeholder="One-line description of what your startup does"
            value={formData.tagline}
            onChangeText={(value) => handleInputChange('tagline', value)}
            error={errors.tagline}
            icon="flash-outline"
            required
            maxLength={100}
          />

          <CustomInput
            label="Description"
            placeholder="Describe your startup idea, the problem it solves, target audience, and business model..."
            value={formData.description}
            onChangeText={(value) => handleInputChange('description', value)}
            error={errors.description}
            icon="document-text-outline"
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            required
            maxLength={1000}
          />

          <View style={styles.characterCount}>
            <Text style={[styles.characterCountText, { color: theme.colors.text + '60' }]}>
              {formData.description.length}/1000 characters
            </Text>
          </View>

          {showAIResult && aiResult && (
            <Animated.View 
              style={[
                styles.aiResultContainer,
                { 
                  backgroundColor: theme.colors.surface,
                  borderColor: getRatingColor(aiResult.rating),
                  opacity: fadeAnim,
                },
              ]}
            >
              <View style={styles.ratingContainer}>
                <Text style={[styles.ratingLabel, { color: theme.colors.text }]}>
                  AI Rating
                </Text>
                <Text style={[
                  styles.ratingValue,
                  { color: getRatingColor(aiResult.rating) }
                ]}>
                  {aiResult.rating}/100
                </Text>
              </View>
              <Text style={[styles.aiMessage, { color: theme.colors.text }]}>
                {aiResult.message}
              </Text>
            </Animated.View>
          )}

          <CustomButton
            title={isSubmitting ? "Analyzing Idea..." : "Submit Idea"}
            onPress={handleSubmit}
            loading={isSubmitting}
            disabled={isSubmitting || showAIResult}
            size="large"
            style={styles.submitButton}
          />

          <Text style={[styles.disclaimer, { color: theme.colors.text + '60' }]}>
            💡 AI ratings are for fun and don't reflect real market potential.
            {'\n'}Your idea will be visible to all users for voting.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    flex: 1,
  },
  characterCount: {
    alignItems: 'flex-end',
    marginTop: -8,
    marginBottom: 16,
  },
  characterCountText: {
    fontSize: 12,
  },
  aiResultContainer: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  ratingValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  aiMessage: {
    fontSize: 14,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  submitButton: {
    marginBottom: 20,
  },
  disclaimer: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default SubmitScreen;