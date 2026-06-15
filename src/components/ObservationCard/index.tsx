import React from 'react';
import { View, Text } from '@tarojs/components';
import { Observation } from '@/types/observation';
import styles from './index.module.scss';

interface ObservationCardProps {
  observation: Observation;
  onClick?: (obs: Observation) => void;
}

const ObservationCard: React.FC<ObservationCardProps> = ({ observation, onClick }) => {
  const avgScore = Math.round(
    (observation.scores.sellingPoint + observation.scores.visual + observation.scores.serviceExperience) / 3 * 10
  ) / 10;

  return (
    <View className={styles.card} onClick={() => onClick?.(observation)}>
      <View className={styles.top}>
        <View className={styles.brandInfo}>
          <Text className={styles.brandName}>{observation.brandName}</Text>
          <Text className={styles.storeName}>{observation.storeName}</Text>
        </View>
        <View className={styles.scoreBadge}>
          <Text className={styles.scoreText}>{avgScore}</Text>
        </View>
      </View>
      <View className={styles.meta}>
        <Text className={styles.region}>{observation.region}</Text>
        <Text className={styles.dot}>·</Text>
        <Text className={styles.date}>{observation.createdAt}</Text>
        <Text className={styles.dot}>·</Text>
        <Text className={styles.photoCount}>{observation.photos.length}张照片</Text>
      </View>
      <Text className={styles.summary}>{observation.interviewSummary}</Text>
      <View className={styles.scores}>
        <View className={styles.scoreItem}>
          <Text className={styles.scoreLabel}>卖点</Text>
          <Text className={styles.scoreValue}>{observation.scores.sellingPoint}</Text>
        </View>
        <View className={styles.scoreItem}>
          <Text className={styles.scoreLabel}>视觉</Text>
          <Text className={styles.scoreValue}>{observation.scores.visual}</Text>
        </View>
        <View className={styles.scoreItem}>
          <Text className={styles.scoreLabel}>服务</Text>
          <Text className={styles.scoreValue}>{observation.scores.serviceExperience}</Text>
        </View>
      </View>
      {observation.userQuotes.length > 0 && (
        <View className={styles.quote}>
          <Text className={styles.quoteText}>"{observation.userQuotes[0]}"</Text>
        </View>
      )}
    </View>
  );
};

export default ObservationCard;
