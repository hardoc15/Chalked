import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useAppStore } from '../../stores/appStore';

export default function LeaderboardScreen() {
  const {
    professors,
    topProfessors,
    marketHours,
    isLoading,
    connectToAPI,
    disconnectFromAPI,
  } = useAppStore();

  useEffect(() => {
    // Connect to API when component mounts
    connectToAPI();

    // Cleanup on unmount
    return () => {
      disconnectFromAPI();
    };
  }, [connectToAPI, disconnectFromAPI]);

  // Sort professors by current stock price for real-time leaderboard
  const sortedProfessors = [...professors].sort((a, b) => b.currentStock - a.currentStock);
  const top5 = sortedProfessors.slice(0, 5);

  const getRankEmoji = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      case 4: return '4️⃣';
      case 5: return '5️⃣';
      default: return '🏆';
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return '#ffd700'; // Gold
      case 2: return '#c0c0c0'; // Silver
      case 3: return '#cd7f32'; // Bronze
      default: return '#8892b0';
    }
  };

  const renderLeaderboardItem = (professor: any, index: number) => {
    const rank = index + 1;
    const changeColor = professor.dailyChange >= 0 ? '#00d4aa' : '#ef4444';
    const changeIcon = professor.dailyChange >= 0 ? '📈' : '📉';

    return (
      <View key={professor.id} style={[styles.leaderItem, rank === 1 && styles.topRankItem]}>
        <View style={styles.rankSection}>
          <Text style={[styles.rankEmoji]}>{getRankEmoji(rank)}</Text>
          <Text style={[styles.rankNumber, { color: getRankColor(rank) }]}>#{rank}</Text>
        </View>

        <View style={styles.professorSection}>
          <Text style={styles.professorName}>{professor.name}</Text>
          <Text style={styles.professorDept}>{professor.department}</Text>
          <Text style={styles.voteCount}>
            👍 {professor.upvotes} • 👎 {professor.downvotes} • Total: {professor.totalVotes}
          </Text>
        </View>

        <View style={styles.stockSection}>
          <Text style={styles.stockPrice}>${professor.currentStock}</Text>
          <Text style={[styles.stockChange, { color: changeColor }]}>
            {changeIcon} {professor.dailyChange >= 0 ? '+' : ''}{professor.dailyChange}
          </Text>
          <Text style={[styles.stockPercent, { color: changeColor }]}>
            ({professor.dailyChangePercent.toFixed(1)}%)
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Top 5 Professors</Text>
        <View style={styles.statusRow}>
          <Text style={styles.subtitle}>
            Market: {marketHours.isOpen ? '🟢 OPEN' : '🔴 CLOSED'}
          </Text>
          <Text style={styles.liveIndicator}>⚡ LIVE</Text>
        </View>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00d4aa" />
          <Text style={styles.loadingText}>Loading leaderboard...</Text>
        </View>
      ) : (
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.leaderboardContainer}>
            <View style={styles.statsRow}>
              <Text style={styles.statsText}>
                📊 Total Professors: {professors.length}
              </Text>
              <Text style={styles.statsText}>
                📈 Trending Up: {professors.filter(p => p.dailyChange > 0).length}
              </Text>
            </View>

            {top5.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No professors available</Text>
              </View>
            ) : (
              <View style={styles.leaderboardList}>
                {top5.map(renderLeaderboardItem)}
              </View>
            )}

            {professors.length > 5 && (
              <View style={styles.moreStats}>
                <Text style={styles.moreText}>
                  + {professors.length - 5} more professors in the market
                </Text>
              </View>
            )}
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
    marginBottom: 8,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#8892b0',
  },
  liveIndicator: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#00d4aa',
    backgroundColor: 'rgba(0, 212, 170, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
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
  leaderboardContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  statsText: {
    fontSize: 14,
    color: '#8892b0',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#8892b0',
  },
  leaderboardList: {
    marginBottom: 20,
  },
  leaderItem: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#374151',
  },
  topRankItem: {
    borderColor: '#ffd700',
    backgroundColor: '#2a2317',
  },
  rankSection: {
    alignItems: 'center',
    marginRight: 16,
    minWidth: 50,
  },
  rankEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  rankNumber: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  professorSection: {
    flex: 1,
    marginRight: 12,
  },
  professorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e2e8f0',
    marginBottom: 4,
  },
  professorDept: {
    fontSize: 14,
    color: '#8892b0',
    marginBottom: 6,
  },
  voteCount: {
    fontSize: 12,
    color: '#8892b0',
  },
  stockSection: {
    alignItems: 'flex-end',
    minWidth: 80,
  },
  stockPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e2e8f0',
    marginBottom: 2,
  },
  stockChange: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  stockPercent: {
    fontSize: 12,
    fontWeight: '600',
  },
  moreStats: {
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  moreText: {
    fontSize: 14,
    color: '#8892b0',
    fontStyle: 'italic',
  },
});