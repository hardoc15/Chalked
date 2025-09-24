import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../types';

// Import screens (will create these next)
import PortfolioScreen from '../screens/main/PortfolioScreen';
import LeaderboardScreen from '../screens/main/LeaderboardScreen';
import NewsScreen from '../screens/main/NewsScreen';
import BettingScreen from '../screens/main/BettingScreen';
import ProfileScreen from '../screens/main/ProfileScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1a1a2e',
          borderTopColor: '#16213e',
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 90,
        },
        tabBarActiveTintColor: '#00d4aa',
        tabBarInactiveTintColor: '#8892b0',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
      }}
    >
      <Tab.Screen
        name="Portfolio"
        component={PortfolioScreen}
        options={{
          tabBarLabel: 'Portfolio',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name="📊" focused={focused} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Leaderboard"
        component={LeaderboardScreen}
        options={{
          tabBarLabel: 'Top 5',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name="🏆" focused={focused} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="News"
        component={NewsScreen}
        options={{
          tabBarLabel: 'News',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name="📰" focused={focused} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Betting"
        component={BettingScreen}
        options={{
          tabBarLabel: 'Betting',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name="💰" focused={focused} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name="👤" focused={focused} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Simple tab icon component using emojis for now
function TabIcon({ name, focused, color }: { name: string, focused: boolean, color: string }) {
  return (
    <Text style={{
      fontSize: focused ? 24 : 20,
      opacity: focused ? 1 : 0.7,
      color: color,
    }}>
      {name}
    </Text>
  );
}