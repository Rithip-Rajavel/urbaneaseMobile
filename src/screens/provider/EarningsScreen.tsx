import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing, typography, borderRadius, responsiveHeight, responsiveWidth } from '../../utils/theme';
import bookingService from '../../services/bookingService';
import { Booking } from '../../types';

interface EarningsData {
  totalEarnings: number;
  thisMonthEarnings: number;
  lastMonthEarnings: number;
  weeklyEarnings: number[];
  monthlyEarnings: { month: string; amount: number }[];
  recentTransactions: Booking[];
}

const EarningsScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const [earnings, setEarnings] = useState<EarningsData>({
    totalEarnings: 0,
    thisMonthEarnings: 0,
    lastMonthEarnings: 0,
    weeklyEarnings: [0, 0, 0, 0, 0],
    monthlyEarnings: [],
    recentTransactions: [],
  });
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [loading, setLoading] = useState(true);

  const loadEarnings = async () => {
    try {
      setLoading(true);
      
      // Load all bookings to calculate earnings
      const bookingsResponse = await bookingService.getMyBookings();
      const completedBookings = bookingsResponse.filter(b => b.status === 'COMPLETED');
      
      // Calculate earnings from completed bookings
      const totalEarnings = completedBookings.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0);
      
      // Calculate monthly earnings
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      
      const thisMonthEarnings = completedBookings
        .filter(booking => {
          const bookingDate = new Date(booking.createdAt);
          return bookingDate.getMonth() === currentMonth && bookingDate.getFullYear() === currentYear;
        })
        .reduce((sum, booking) => sum + (booking.totalAmount || 0), 0);
      
      const lastMonthEarnings = completedBookings
        .filter(booking => {
          const bookingDate = new Date(booking.createdAt);
          return bookingDate.getMonth() === lastMonth && bookingDate.getFullYear() === lastMonthYear;
        })
        .reduce((sum, booking) => sum + (booking.totalAmount || 0), 0);
      
      // Calculate weekly earnings (last 5 weeks)
      const weeklyEarnings = [0, 0, 0, 0, 0];
      const now = new Date();
      for (let i = 0; i < 5; i++) {
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - (i * 7));
        weekStart.setHours(0, 0, 0, 0);
        
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        weekEnd.setHours(23, 59, 59, 999);
        
        weeklyEarnings[4 - i] = completedBookings
          .filter(booking => {
            const bookingDate = new Date(booking.createdAt);
            return bookingDate >= weekStart && bookingDate <= weekEnd;
          })
          .reduce((sum, booking) => sum + (booking.totalAmount || 0), 0);
      }
      
      // Calculate monthly earnings for the last 6 months
      const monthlyEarnings: { month: string; amount: number }[] = [];
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      
      for (let i = 5; i >= 0; i--) {
        const month = new Date();
        month.setMonth(currentMonth - i);
        const monthName = monthNames[month.getMonth()];
        const monthYear = month.getFullYear();
        
        const monthEarnings = completedBookings
          .filter(booking => {
            const bookingDate = new Date(booking.createdAt);
            return bookingDate.getMonth() === month.getMonth() && bookingDate.getFullYear() === monthYear;
          })
          .reduce((sum, booking) => sum + (booking.totalAmount || 0), 0);
        
        monthlyEarnings.push({ month: monthName, amount: monthEarnings });
      }
      
      // Recent transactions (last 10 completed bookings)
      const recentTransactions = completedBookings
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 10);
      
      setEarnings({
        totalEarnings,
        thisMonthEarnings,
        lastMonthEarnings,
        weeklyEarnings,
        monthlyEarnings,
        recentTransactions,
      });
    } catch (error) {
      console.error('Error loading earnings:', error);
      Alert.alert('Error', 'Failed to load earnings data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEarnings();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadEarnings();
    setRefreshing(false);
  };

  const handleTransactionPress = (transaction: Booking) => {
    Alert.alert(
      'Transaction Details',
      `Service: ${transaction.service.name}\nCustomer: ${transaction.customer.username}\nAmount: $${transaction.totalAmount}\nDate: ${formatTransactionDate(transaction.createdAt)}`,
      [{ text: 'OK' }]
    );
  };

  const formatTransactionDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return `Today, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
    } else if (diffDays === 1) {
      return `Yesterday, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
    } else if (diffDays < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short', hour: 'numeric', minute: '2-digit', hour12: true });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true });
    }
  };

  const StatCard = ({ title, value, subtitle, color = colors.primary }: any) => (
    <View style={{
      backgroundColor: colors.surface,
      borderRadius: borderRadius.md,
      padding: spacing.lg,
      marginHorizontal: spacing.lg,
      marginBottom: spacing.md,
      alignItems: 'center',
      ...shadows.small,
    }}>
      <Text style={{
        fontSize: typography.caption,
        color: colors.textSecondary,
        marginBottom: spacing.xs,
      }}>
        {title}
      </Text>
      <Text style={{
        fontSize: typography.h3,
        fontWeight: 'bold',
        color: color,
        marginBottom: spacing.xs,
      }}>
        {value}
      </Text>
      {subtitle && (
        <Text style={{
          fontSize: typography.caption,
          color: colors.textLight,
        }}>
          {subtitle}
        </Text>
      )}
    </View>
  );

  const TransactionItem = ({ item }: { item: Booking }) => (
    <TouchableOpacity
      style={{
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        marginBottom: spacing.sm,
        flexDirection: 'row',
        alignItems: 'center',
        ...shadows.small,
      }}
      onPress={() => handleTransactionPress(item)}
      activeOpacity={0.8}
    >
      <View style={{
        width: responsiveWidth(40),
        height: responsiveWidth(40),
        borderRadius: borderRadius.sm,
        backgroundColor: colors.success,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
      }}>
        <Text style={{ fontSize: responsiveWidth(20), color: colors.background }}>💰</Text>
      </View>

      <View style={{ flex: 1 }}>
        <Text style={{
          fontSize: typography.body,
          fontWeight: '600',
          color: colors.text,
          marginBottom: spacing.xs,
        }}>
          {item.service.name}
        </Text>
        <Text style={{
          fontSize: typography.caption,
          color: colors.textSecondary,
          marginBottom: spacing.xs,
        }}>
          {item.customer.username} • {formatTransactionDate(item.createdAt)}
        </Text>
      </View>

      <View style={{ alignItems: 'flex-end' }}>
        <Text style={{
          fontSize: typography.h4,
          fontWeight: 'bold',
          color: colors.primary,
        }}>
          ${item.totalAmount || 0}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderChart = () => {
    const maxAmount = Math.max(...earnings.weeklyEarnings);

    return (
      <View style={{
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        padding: spacing.lg,
        marginHorizontal: spacing.lg,
        marginBottom: spacing.lg,
        ...shadows.small,
      }}>
        <Text style={{
          fontSize: typography.h4,
          fontWeight: 'bold',
          color: colors.text,
          marginBottom: spacing.md,
        }}>
          Weekly Earnings
        </Text>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: responsiveHeight(120) }}>
          {earnings.weeklyEarnings.map((amount, index) => (
            <View key={index} style={{ alignItems: 'center', flex: 1 }}>
              <Text style={{
                fontSize: typography.caption,
                color: colors.textLight,
                marginBottom: spacing.xs,
              }}>
                Week {index + 1}
              </Text>
              <View style={{
                width: '100%',
                height: responsiveHeight(80),
                backgroundColor: colors.border,
                borderRadius: borderRadius.sm,
                marginBottom: spacing.xs,
                position: 'relative',
              }}>
                <View
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: `${(amount / maxAmount) * 100}%`,
                    backgroundColor: colors.primary,
                    borderRadius: borderRadius.sm,
                  }}
                />
              </View>
            </View>
          ))}
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.sm }}>
          {earnings.weeklyEarnings.map((amount, index) => (
            <Text key={index} style={{
              fontSize: typography.caption,
              color: colors.textLight,
              textAlign: 'center',
              flex: 1,
            }}>
              ${amount > 0 ? `$${amount}` : '$0'}
            </Text>
          ))}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={{ marginTop: spacing.md, color: colors.textSecondary }}>Loading earnings...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {/* Header */}
        <View style={{
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.md,
          paddingBottom: spacing.lg,
        }}>
          <Text style={{
            fontSize: typography.h2,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: spacing.sm,
          }}>
            Earnings
          </Text>
          <Text style={{
            fontSize: typography.body,
            color: colors.textSecondary,
          }}>
            Track your income and earnings
          </Text>
        </View>

        {/* Overview Stats */}
        <View style={{ marginBottom: spacing.lg }}>
          <Text style={{
            fontSize: typography.h4,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: spacing.md,
            paddingHorizontal: spacing.lg,
          }}>
            Overview
          </Text>

          <View style={{ flexDirection: 'row', marginBottom: spacing.md }}>
            <StatCard
              title="Total Earnings"
              value={`$${earnings.totalEarnings.toFixed(2)}`}
              color={colors.success}
            />
            <StatCard
              title="This Month"
              value={`$${earnings.thisMonthEarnings.toFixed(2)}`}
              subtitle={`+${((earnings.thisMonthEarnings - earnings.lastMonthEarnings) / earnings.lastMonthEarnings * 100).toFixed(1)}%`}
              color={colors.primary}
            />
          </View>

          <View style={{ flexDirection: 'row' }}>
            <StatCard
              title="Last Month"
              value={`$${earnings.lastMonthEarnings.toFixed(2)}`}
              color={colors.textSecondary}
            />
            <StatCard
              title="Avg/Week"
              value={`$${(earnings.totalEarnings / 52).toFixed(2)}`}
              color={colors.info}
            />
          </View>
        </View>

        {/* Period Selector */}
        <View style={{
          paddingHorizontal: spacing.lg,
          marginBottom: spacing.lg,
        }}>
          <Text style={{
            fontSize: typography.body,
            fontWeight: '500',
            color: colors.text,
            marginBottom: spacing.sm,
          }}>
            View Period:
          </Text>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              style={{
                backgroundColor: selectedPeriod === 'week' ? colors.primary : colors.surface,
                borderRadius: borderRadius.sm,
                paddingVertical: spacing.sm,
                paddingHorizontal: spacing.md,
                marginRight: spacing.sm,
                borderWidth: 1,
                borderColor: selectedPeriod === 'week' ? colors.primary : colors.border,
              }}
              onPress={() => setSelectedPeriod('week')}
            >
              <Text style={{
                fontSize: typography.caption,
                color: selectedPeriod === 'week' ? colors.background : colors.text,
                fontWeight: '600',
              }}>
                Week
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: selectedPeriod === 'month' ? colors.primary : colors.surface,
                borderRadius: borderRadius.sm,
                paddingVertical: spacing.sm,
                paddingHorizontal: spacing.md,
                marginRight: spacing.sm,
                borderWidth: 1,
                borderColor: selectedPeriod === 'month' ? colors.primary : colors.border,
              }}
              onPress={() => setSelectedPeriod('month')}
            >
              <Text style={{
                fontSize: typography.caption,
                color: selectedPeriod === 'month' ? colors.background : colors.text,
                fontWeight: '600',
              }}>
                Month
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: selectedPeriod === 'year' ? colors.primary : colors.surface,
                borderRadius: borderRadius.sm,
                paddingVertical: spacing.sm,
                paddingHorizontal: spacing.md,
                borderWidth: 1,
                borderColor: selectedPeriod === 'year' ? colors.primary : colors.border,
              }}
              onPress={() => setSelectedPeriod('year')}
            >
              <Text style={{
                fontSize: typography.caption,
                color: selectedPeriod === 'year' ? colors.background : colors.text,
                fontWeight: '600',
              }}>
                Year
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Chart */}
        {selectedPeriod === 'week' && renderChart()}

        {/* Monthly Breakdown */}
        {selectedPeriod === 'month' && (
          <View style={{
            backgroundColor: colors.surface,
            borderRadius: borderRadius.md,
            padding: spacing.lg,
            marginHorizontal: spacing.lg,
            marginBottom: spacing.lg,
            ...shadows.small,
          }}>
            <Text style={{
              fontSize: typography.h4,
              fontWeight: 'bold',
              color: colors.text,
              marginBottom: spacing.md,
            }}>
              Monthly Breakdown
            </Text>

            {earnings.monthlyEarnings.map((month, index) => (
              <View key={index} style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: spacing.sm,
                borderBottomWidth: index < earnings.monthlyEarnings.length - 1 ? 1 : 0,
                borderBottomColor: colors.border,
              }}>
                <Text style={{
                  fontSize: typography.body,
                  color: colors.text,
                }}>
                  {month.month}
                </Text>
                <Text style={{
                  fontSize: typography.body,
                  fontWeight: 'bold',
                  color: colors.primary,
                }}>
                  ${month.amount}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Recent Transactions */}
        <View style={{ paddingHorizontal: spacing.lg, marginBottom: spacing.xl }}>
          <Text style={{
            fontSize: typography.h4,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: spacing.md,
          }}>
            Recent Transactions
          </Text>

          {earnings.recentTransactions.map((transaction) => (
            <TransactionItem key={transaction.id} item={transaction} />
          ))}
        </View>

        {/* Export Button */}
        <View style={{ paddingHorizontal: spacing.lg, marginBottom: spacing.xl }}>
          <TouchableOpacity
            style={{
              backgroundColor: colors.primary,
              borderRadius: borderRadius.md,
              paddingVertical: spacing.md,
              alignItems: 'center',
            }}
            onPress={() => {
              Alert.alert(
                'Export Earnings',
                'Export your earnings data as CSV or PDF?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Export CSV',
                    onPress: () => Alert.alert('Coming Soon', 'CSV export feature coming soon!'),
                  },
                  {
                    text: 'Export PDF',
                    onPress: () => Alert.alert('Coming Soon', 'PDF export feature coming soon!'),
                  },
                ]
              );
            }}
          >
            <Text style={{
              fontSize: typography.body,
              color: colors.background,
              fontWeight: '600',
            }}>
              Export Earnings
            </Text>
          </TouchableOpacity>
        </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const shadows = {
  small: {
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
};

export default EarningsScreen;
