import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAppStore } from '../../stores/appStore';

export default function PortfolioScreen() {
  const {
    user,
    myProfessors,
    professors,
    marketHours,
    isLoading,
    connectToAPI,
    disconnectFromAPI,
    voteProfessor,
  } = useAppStore();
  const [votingStates, setVotingStates] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Connect to API when component mounts
    connectToAPI();

    // Cleanup on unmount
    return () => {
      disconnectFromAPI();
    };
  }, [connectToAPI, disconnectFromAPI]);

  const handleVote = async (professorId: string, voteType: 'upvote' | 'downvote') => {
    if (!marketHours.isOpen) {
      Alert.alert('Market Closed', 'Voting is only allowed between 8 AM - 9 PM');
      return;
    }

    setVotingStates(prev => ({ ...prev, [professorId]: true }));

    try {
      const success = await voteProfessor(professorId, voteType);
      if (success) {
        Alert.alert('Vote Recorded!', `Your ${voteType} has been recorded.`);
      } else {
        Alert.alert('Vote Failed', 'Please try again.');
      }
    } finally {
      setVotingStates(prev => ({ ...prev, [professorId]: false }));
    }
  };

  const renderProfessorCard = (professor: any) => {
    const isVoting = votingStates[professor.id];
    const changeColor = professor.dailyChange >= 0 ? '#00d4aa' : '#ef4444';
    const changeIcon = professor.dailyChange >= 0 ? '📈' : '📉';

    return (
      <View key={professor.id} style={styles.professorCard}>
        <View style={styles.professorHeader}>
          <Text style={styles.professorName}>{professor.name}</Text>
          <Text style={styles.professorDept}>{professor.department}</Text>
        </View>

        <View style={styles.stockInfo}>
          <Text style={styles.stockPrice}>${professor.currentStock}</Text>
          <Text style={[styles.stockChange, { color: changeColor }]}>
            {changeIcon} {professor.dailyChange >= 0 ? '+' : ''}{professor.dailyChange} ({professor.dailyChangePercent.toFixed(1)}%)
          </Text>
        </View>

        <View style={styles.voteButtons}>
          <TouchableOpacity
            style={[styles.voteButton, styles.upvoteButton]}
            onPress={() => handleVote(professor.id, 'upvote')}
            disabled={isVoting || !marketHours.isOpen}
          >
            {isVoting ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={styles.voteButtonText}>👍 {professor.upvotes}</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.voteButton, styles.downvoteButton]}
            onPress={() => handleVote(professor.id, 'downvote')}
            disabled={isVoting || !marketHours.isOpen}
          >
            {isVoting ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={styles.voteButtonText}>👎 {professor.downvotes}</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Portfolio</Text>
        <Text style={styles.subtitle}>
          Market: {marketHours.isOpen ? '🟢 OPEN' : '🔴 CLOSED'}
        </Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00d4aa" />
          <Text style={styles.loadingText}>Loading professors...</Text>
        </View>
      ) : (
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeText}>
              Welcome, {user?.email.split('@')[0]}!
            </Text>
            <Text style={styles.infoText}>
              Tracking {professors.length} professors • {professors.filter(p => p.dailyChange > 0).length} up, {professors.filter(p => p.dailyChange < 0).length} down
            </Text>
          </View>

          <View style={styles.professorsSection}>
            {professors.map(renderProfessorCard)}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
    borderBottomColor: '#374151',
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#e2e8f0',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#8892b0',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#8892b0',
  },
  scrollView: {
    flex: 1,
  },
  welcomeSection: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#00d4aa',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#8892b0',
    lineHeight: 20,
  },
  professorsSection: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  professorCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  professorHeader: {
    marginBottom: 16,
  },
  professorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e2e8f0',
    marginBottom: 4,
  },
  professorDept: {
    fontSize: 14,
    color: '#8892b0',
  },
  stockInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  stockPrice: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#e2e8f0',
  },
  stockChange: {
    fontSize: 16,
    fontWeight: '600',
  },
  voteButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  voteButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  upvoteButton: {
    backgroundColor: '#00d4aa',
  },
  downvoteButton: {
    backgroundColor: '#ef4444',
  },
  voteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});