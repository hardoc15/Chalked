import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useAppStore } from '../../stores/appStore';

export default function NewsScreen() {
  const { newsEvents, marketHours, connectToAPI, disconnectFromAPI } = useAppStore();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Connect to API when component mounts
    connectToAPI();
    setIsConnected(true);

    // Cleanup on unmount
    return () => {
      disconnectFromAPI();
      setIsConnected(false);
    };
  }, [connectToAPI, disconnectFromAPI]);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getNewsIcon = (eventType: string) => {
    switch (eventType) {
      case 'stock_rise': return '📈';
      case 'stock_drop': return '📉';
      case 'market_open': return '🔔';
      case 'market_close': return '🔕';
      case 'announcement': return '📢';
      default: return '📰';
    }
  };

  const renderNewsItem = (newsItem: any, index: number) => {
    const isRecent = Date.now() - new Date(newsItem.createdAt).getTime() < 300000; // 5 minutes

    return (
      <View key={newsItem.id || index} style={[styles.newsItem, isRecent && styles.recentNews]}>
        <View style={styles.newsHeader}>
          <Text style={styles.newsIcon}>{getNewsIcon(newsItem.eventType)}</Text>
          <View style={styles.newsInfo}>
            <Text style={styles.newsTime}>{formatTime(newsItem.createdAt)}</Text>
            {isRecent && <Text style={styles.liveIndicator}>LIVE</Text>}
          </View>
        </View>

        <Text style={styles.newsTitle}>{newsItem.title}</Text>
        <Text style={styles.newsDescription}>{newsItem.description}</Text>
      </View>
    );
  };

  // Generate some initial mock news if we don't have any real news yet
  const mockNews = [
    {
      id: 'mock-1',
      title: '🏪 Market Opens',
      description: 'Professor stock market is now open for trading! Vote on your professors to impact their stock prices.',
      eventType: 'market_open',
      createdAt: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
    },
    {
      id: 'mock-2',
      title: '📊 Daily Reset Complete',
      description: 'All professor stocks have been reset for today\'s trading session. Starting prices set at $100.',
      eventType: 'announcement',
      createdAt: new Date(Date.now() - 7200000).toISOString() // 2 hours ago
    }
  ];

  const allNews = [...newsEvents, ...mockNews].sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Market News</Text>
        <View style={styles.statusRow}>
          <Text style={styles.subtitle}>
            Market: {marketHours.isOpen ? '🟢 OPEN' : '🔴 CLOSED'}
          </Text>
          {isConnected && (
            <Text style={styles.connectedIndicator}>⚡ LIVE</Text>
          )}
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.newsContainer}>
          {allNews.length === 0 ? (
            <View style={styles.emptyState}>
              <ActivityIndicator size="large" color="#00d4aa" />
              <Text style={styles.emptyText}>Waiting for market news...</Text>
            </View>
          ) : (
            allNews.map(renderNewsItem)
          )}
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
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#8892b0',
  },
  connectedIndicator: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#00d4aa',
    backgroundColor: 'rgba(0, 212, 170, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  scrollView: {
    flex: 1,
  },
  newsContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#8892b0',
  },
  newsItem: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#374151',
  },
  recentNews: {
    borderLeftColor: '#00d4aa',
    backgroundColor: '#1a2332',
  },
  newsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  newsIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  newsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  newsTime: {
    fontSize: 12,
    color: '#8892b0',
    fontWeight: '600',
  },
  liveIndicator: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#00d4aa',
    backgroundColor: 'rgba(0, 212, 170, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 8,
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e2e8f0',
    marginBottom: 6,
    lineHeight: 22,
  },
  newsDescription: {
    fontSize: 14,
    color: '#8892b0',
    lineHeight: 20,
  },
});