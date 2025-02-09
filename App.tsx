/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
  Linking,
  Alert,
} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import Slider from '@react-native-community/slider';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// Constants for the preference options
const CUISINES = [
  { id: 'american', name: 'American', icon: 'food-steak' },
  { id: 'italian', name: 'Italian', icon: 'pasta' },
  { id: 'japanese', name: 'Japanese', icon: 'food-sushi' },
  { id: 'chinese', name: 'Chinese', icon: 'food-drumstick' },
  { id: 'mexican', name: 'Mexican', icon: 'taco' },
  { id: 'indian', name: 'Indian', icon: 'food-curry' },
  { id: 'thai', name: 'Thai', icon: 'noodles' },
  { id: 'mediterranean', name: 'Mediterranean', icon: 'food-greek' },
  { id: 'french', name: 'French', icon: 'food-croissant' },
  { id: 'korean', name: 'Korean', icon: 'food-variant' },
];

const TIME_PERIODS = [
  { id: 'breakfast', name: 'Breakfast', icon: 'food-croissant', hours: '6AM-11AM' },
  { id: 'lunch', name: 'Lunch', icon: 'food-takeout-box', hours: '11AM-4PM' },
  { id: 'dinner', name: 'Dinner', icon: 'food-steak', hours: '4PM-10PM' },
];

interface PreferenceState {
  expandedSection: string | null;
  selectedCuisines: string[];
  selectedTime: string | null;
  priceRange: string | null;
  rating: number;
  radius: number;
}

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [state, setState] = useState<PreferenceState>({
    expandedSection: null,
    selectedCuisines: [],
    selectedTime: null,
    priceRange: null,
    rating: 3,
    radius: 5,
  });

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  // Helper functions
  const toggleSection = (section: string) => {
    setState(prev => ({
      ...prev,
      expandedSection: prev.expandedSection === section ? null : section,
    }));
  };

  const toggleCuisine = (cuisine: string) => {
    setState(prev => ({
      ...prev,
      selectedCuisines: prev.selectedCuisines.includes(cuisine)
        ? prev.selectedCuisines.filter(c => c !== cuisine)
        : [...prev.selectedCuisines, cuisine],
    }));
  };

  const selectTime = (time: string) => {
    setState(prev => ({
      ...prev,
      selectedTime: prev.selectedTime === time ? null : time,
    }));
  };

  const selectPrice = (price: string) => {
    setState(prev => ({
      ...prev,
      priceRange: prev.priceRange === price ? null : price,
    }));
  };

  const handleSubmit = async () => {
    // Create a friendly summary of selections
    const summary = [
      state.selectedTime ? `Time: ${TIME_PERIODS.find(t => t.id === state.selectedTime)?.name}` : null,
      state.selectedCuisines.length > 0 ? 
        `Cuisines: ${state.selectedCuisines.map(c => 
          CUISINES.find(cuisine => cuisine.id === c)?.name).join(', ')}` : null,
      `Distance: Within ${Math.round(state.radius)} miles`,
      state.priceRange ? `Price: ${state.priceRange}` : null,
    ].filter(Boolean).join('\n');

    // Show alert with selections
    Alert.alert(
      'Your Preferences',
      summary || 'No preferences selected',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Search',
          onPress: async () => {
            const queryParams = new URLSearchParams({
              time: state.selectedTime || '',
              cuisines: state.selectedCuisines.join(','),
              price: state.priceRange || '',
              rating: state.rating.toString(),
              radius: state.radius.toString(),
            });

            const mailtoLink = `mailto:info@andycary.com?subject=Restaurant%20Search&body=Search%20Parameters:%0A${queryParams.toString()}`;
            
            try {
              await Linking.openURL(mailtoLink);
            } catch (error) {
              console.error('Error opening email:', error);
            }
          }
        }
      ]
    );
  };

  const renderSection = (title: string, content: React.ReactNode) => (
    <View style={styles.section}>
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={() => toggleSection(title)}
      >
        <Text style={[styles.sectionTitle, { color: isDarkMode ? Colors.white : Colors.black }]}>
          {title}
        </Text>
        <MaterialIcons
          name={state.expandedSection === title ? 'expand-less' : 'expand-more'}
          size={24}
          color={isDarkMode ? Colors.white : '#666'}
        />
      </TouchableOpacity>
      {state.expandedSection === title && (
        <View style={styles.sectionContent}>
          {content}
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, backgroundStyle]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View style={styles.mainContent}>
        <Text style={[styles.title, { color: isDarkMode ? Colors.white : Colors.black }]}>
          Nearnoshly
        </Text>
        <Text style={[styles.subtitle, { color: isDarkMode ? Colors.light : Colors.dark }]}>
          Find your perfect meal
        </Text>
        
        <ScrollView style={styles.scrollView}>
          {/* 1. Time of Day */}
          {renderSection('Time of Day', (
            <View style={styles.timeGrid}>
              {TIME_PERIODS.map(period => (
                <TouchableOpacity
                  key={period.id}
                  style={[
                    styles.timeItem,
                    state.selectedTime === period.id && styles.selectedItem,
                  ]}
                  onPress={() => selectTime(period.id)}
                >
                  <MaterialCommunityIcons
                    name={period.icon}
                    size={24}
                    color={state.selectedTime === period.id ? '#fff' : '#666'}
                  />
                  <Text style={[
                    styles.timeText,
                    state.selectedTime === period.id && styles.selectedText,
                  ]}>
                    {period.name}
                  </Text>
                  <Text style={[
                    styles.timeHours,
                    state.selectedTime === period.id && styles.selectedText,
                  ]}>
                    {period.hours}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}

          {/* 2. Distance */}
          {renderSection('Distance', (
            <View>
              <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={20}
                value={state.radius}
                onValueChange={(value) => setState(prev => ({ ...prev, radius: value }))}
                step={1}
              />
              <Text style={styles.sliderText}>Within {Math.round(state.radius)} miles</Text>
            </View>
          ))}

          {/* 3. Price */}
          {renderSection('Price', (
            <View style={styles.priceGrid}>
              {['$', '$$', '$$$', '$$$$'].map(price => (
                <TouchableOpacity
                  key={price}
                  style={[styles.priceItem, state.priceRange === price && styles.selectedItem]}
                  onPress={() => selectPrice(price)}
                >
                  <Text style={[styles.priceText, state.priceRange === price && styles.selectedText]}>
                    {price}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}

          {/* 4. Cuisines */}
          {renderSection('Cuisines', (
            <View style={styles.cuisineGrid}>
              {CUISINES.map(cuisine => (
                <TouchableOpacity
                  key={cuisine.id}
                  style={[
                    styles.cuisineItem,
                    state.selectedCuisines.includes(cuisine.id) && styles.selectedItem,
                  ]}
                  onPress={() => toggleCuisine(cuisine.id)}
                >
                  <MaterialCommunityIcons
                    name={cuisine.icon}
                    size={24}
                    color={state.selectedCuisines.includes(cuisine.id) ? '#fff' : '#666'}
                  />
                  <Text style={styles.cuisineText}>{cuisine.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </ScrollView>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>Find Restaurants</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
  sectionContent: {
    padding: 16,
  },
  timeGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeItem: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  timeHours: {
    fontSize: 14,
    color: '#666',
  },
  selectedItem: {
    backgroundColor: '#007bff',
  },
  selectedText: {
    color: '#fff',
  },
  submitButton: {
    backgroundColor: '#007bff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderText: {
    textAlign: 'center',
    marginTop: 8,
    color: '#666',
  },
  cuisineGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  cuisineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginBottom: 8,
    width: '48%',
  },
  cuisineText: {
    marginLeft: 8,
    fontSize: 14,
  },
  priceGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priceItem: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  priceText: {
    fontSize: 16,
  },
});

export default App;
