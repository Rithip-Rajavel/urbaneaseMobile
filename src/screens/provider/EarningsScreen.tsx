import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography, borderRadius, responsiveHeight, responsiveWidth } from '../../utils/theme';

// Mock data - will be replaced with API calls
const mockEarnings = {
  totalEarnings: 3456.78,
  thisMonthEarnings: 892.45,
  lastMonthEarnings: 756.32,
  weeklyEarnings: [234.50, 198.75, 312.25, 276.80, 298.15],
  monthlyEarnings: [
    { month: 'January', amount: 756.32 },
    { month: 'February', amount: 892.45 },
    { month: 'March', amount: 945.67 },
    { month: 'April', amount: 823.90 },
    { month: 'May', amount: 1024.33 },
    { month: 'June', amount: 1134.78 },
  ],
  recentTransactions: [
    { id: 1, service: 'Home Cleaning', customer: 'John Doe', amount: 45, date: 'Today, 2:30 PM', status: 'completed' },
    { id: 2, service: 'Plumbing Repair', customer: 'Sarah Smith', amount: 85, date: 'Today, 11:15 AM', status: 'completed' },
    { id: 3, service: 'Cooking', customer: 'Mike Johnson', amount: 60, date: 'Yesterday, 6:00 PM', status: 'completed' },
    { id: 4, service: 'Gardening', customer: 'Emma Wilson', amount: 35, date: 'Yesterday, 9:00 AM', status: 'completed' },
    { id: 5, service: 'Electrical Work', customer: 'Tom Harris', amount: 55, date: '2 days ago', status: 'completed' },
  ],
};

const EarningsScreen = ({ navigation }: any) => {
  const [earnings, setEarnings] = useState(mockEarnings);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleTransactionPress = (transaction: any) => {
    Alert.alert(
      'Transaction Details',
      `Service: ${transaction.service}\nCustomer: ${transaction.customer}\nAmount: $${transaction.amount}\nDate: ${transaction.date}`,
      [{ text: 'OK' }]
    );
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

  const TransactionItem = ({ item }: any) => (
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
          {item.service}
        </Text>
        <Text style={{
          fontSize: typography.caption,
          color: colors.textSecondary,
          marginBottom: spacing.xs,
        }}>
          {item.customer} • {item.date}
        </Text>
      </View>

      <View style={{ alignItems: 'flex-end' }}>
        <Text style={{
          fontSize: typography.h4,
          fontWeight: 'bold',
          color: colors.primary,
        }}>
          ${item.amount}
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
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
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
