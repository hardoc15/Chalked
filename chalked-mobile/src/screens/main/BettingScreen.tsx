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

export default function BettingScreen() {
  const {
    studentBalance,
    professors,
    activeBets,
    marketHours,
    connectToAPI,
    disconnectFromAPI,
  } = useAppStore();
  const [selectedProfessor, setSelectedProfessor] = useState<string | null>(null);
  const [betAmount] = useState(50); // Fixed bet amount for simplicity

  useEffect(() => {
    // Connect to API when component mounts
    connectToAPI();

    return () => {
      disconnectFromAPI();
    };
  }, [connectToAPI, disconnectFromAPI]);

  const handlePlaceBet = (professorId: string, betType: 'call' | 'put') => {
    if (!marketHours.isOpen) {
      Alert.alert('Market Closed', 'Betting is only available during market hours (8 AM - 9 PM)');
      return;
    }

    if (studentBalance < betAmount) {
      Alert.alert('Insufficient Funds', 'You need more Chalk Coins to place this bet.');
      return;
    }

    const professor = professors.find(p => p.id === professorId);
    if (!professor) return;

    const betDescription = betType === 'call'
      ? `${professor.name}'s stock will go UP`
      : `${professor.name}'s stock will go DOWN`;

    Alert.alert(
      'Place Bet',
      `Bet ${betAmount} Chalk Coins that ${betDescription}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Place Bet',
          onPress: () => {
            // TODO: Implement actual bet placement
            Alert.alert('Bet Placed!', `You bet ${betAmount} coins that ${betDescription}`);
          }
        }
      ]
    );
  };

  const renderProfessorBettingCard = (professor: any) => {
    const changeColor = professor.dailyChange >= 0 ? '#00d4aa' : '#ef4444';
    const changeIcon = professor.dailyChange >= 0 ? '📈' : '📉';
    const trend = professor.dailyChange >= 0 ? 'UP' : 'DOWN';
    const trendColor = professor.dailyChange >= 0 ? '#00d4aa' : '#ef4444';

    return (
      <View key={professor.id} style={styles.bettingCard}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.professorName}>{professor.name}</Text>
            <Text style={styles.professorDept}>{professor.department}</Text>
          </View>
          <View style={styles.stockInfo}>
            <Text style={styles.stockPrice}>${professor.currentStock}</Text>
            <Text style={[styles.stockChange, { color: changeColor }]}>
              {changeIcon} {professor.dailyChange >= 0 ? '+' : ''}{professor.dailyChange}
            </Text>
          </View>
        </View>

        <View style={styles.trendIndicator}>
          <Text style={styles.trendLabel}>Current Trend:</Text>
          <Text style={[styles.trendValue, { color: trendColor }]}>
            {trend} ({professor.dailyChangePercent.toFixed(1)}%)
          </Text>
        </View>

        <View style={styles.betButtons}>
          <TouchableOpacity
            style={[styles.betButton, styles.callButton]}
            onPress={() => handlePlaceBet(professor.id, 'call')}
            disabled={!marketHours.isOpen}
          >
            <Text style={styles.betButtonTitle}>📈 CALL</Text>
            <Text style={styles.betButtonSubtitle}>Bet it goes UP</Text>
            <Text style={styles.betButtonAmount}>{betAmount} coins</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.betButton, styles.putButton]}
            onPress={() => handlePlaceBet(professor.id, 'put')}
            disabled={!marketHours.isOpen}
          >
            <Text style={styles.betButtonTitle}>📉 PUT</Text>
            <Text style={styles.betButtonSubtitle}>Bet it goes DOWN</Text>
            <Text style={styles.betButtonAmount}>{betAmount} coins</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Betting Market</Text>
        <View style={styles.headerInfo}>
          <Text style={styles.subtitle}>
            Market: {marketHours.isOpen ? '🟢 OPEN' : '🔴 CLOSED'}
          </Text>
          <Text style={styles.balance}>
            💰 {studentBalance} Chalk Coins
          </Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.bettingContainer}>
          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>How Betting Works</Text>
            <Text style={styles.infoText}>
              • <Text style={styles.highlightText}>CALL</Text>: Bet that a professor's stock will go up
            </Text>
            <Text style={styles.infoText}>
              • <Text style={styles.highlightText}>PUT</Text>: Bet that a professor's stock will go down
            </Text>
            <Text style={styles.infoText}>
              • Win 2x your bet if you're right, lose it if you're wrong
            </Text>
          </View>

          <View style={styles.statsSection}>
            <Text style={styles.statsTitle}>Your Stats</Text>
            <View style={styles.statsRow}>
              <Text style={styles.statsText}>Active Bets: {activeBets.length}</Text>
              <Text style={styles.statsText}>Balance: {studentBalance} coins</Text>
            </View>
          </View>

          <View style={styles.professorsSection}>
            <Text style={styles.sectionTitle}>Place Your Bets</Text>
            {professors.map(renderProfessorBettingCard)}
          </View>
        </View>
      </ScrollView>
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
  headerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#8892b0',
  },
  balance: {
    fontSize: 18,
    fontWeight: '600',
    color: '#00d4aa',
  },
  scrollView: {
    flex: 1,
  },
  bettingContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  infoSection: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#00d4aa',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e2e8f0',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#8892b0',
    lineHeight: 20,
    marginBottom: 6,
  },
  highlightText: {
    color: '#00d4aa',
    fontWeight: '600',
  },
  statsSection: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e2e8f0',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statsText: {
    fontSize: 14,
    color: '#8892b0',
    fontWeight: '600',
  },
  professorsSection: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e2e8f0',
    marginBottom: 16,
  },
  bettingCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
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
  },
  stockInfo: {
    alignItems: 'flex-end',
  },
  stockPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e2e8f0',
    marginBottom: 2,
  },
  stockChange: {
    fontSize: 14,
    fontWeight: '600',
  },
  trendIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  trendLabel: {
    fontSize: 14,
    color: '#8892b0',
  },
  trendValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  betButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  betButton: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  callButton: {
    backgroundColor: '#00d4aa',
  },
  putButton: {
    backgroundColor: '#ef4444',
  },
  betButtonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  betButtonSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 6,
  },
  betButtonAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
});