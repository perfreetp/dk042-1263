import React from 'react';
import { View, Text } from '@tarojs/components';
import { ComparisonItem } from '@/types/conclusion';
import ScoreBar from '@/components/ScoreBar';
import styles from './index.module.scss';

interface CompareCardProps {
  title: string;
  items: ComparisonItem[];
}

const CompareCard: React.FC<CompareCardProps> = ({ title, items }) => {
  return (
    <View className={styles.card}>
      <Text className={styles.title}>{title}</Text>
      <View className={styles.comparisonList}>
        {items.map((item) => (
          <View key={item.brandId} className={styles.brandRow}>
            <View className={styles.brandHeader}>
              <Text className={styles.brandName}>{item.brandName}</Text>
              <Text className={styles.priceRange}>{item.priceRange}</Text>
            </View>
            <ScoreBar label='卖点' score={item.sellingPoint} />
            <ScoreBar label='视觉' score={item.visual} />
            <ScoreBar label='服务' score={item.serviceExperience} />
          </View>
        ))}
      </View>
    </View>
  );
};

export default CompareCard;
