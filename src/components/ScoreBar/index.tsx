import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

interface ScoreBarProps {
  label: string;
  score: number;
  maxScore?: number;
}

const ScoreBar: React.FC<ScoreBarProps> = ({ label, score, maxScore = 10 }) => {
  const percentage = (score / maxScore) * 100;

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <Text className={styles.label}>{label}</Text>
        <Text className={styles.score}>{score}</Text>
      </View>
      <View className={styles.track}>
        <View className={styles.fill} style={{ width: `${percentage}%` }} />
      </View>
    </View>
  );
};

export default ScoreBar;
