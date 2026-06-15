import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { useAppStore } from '@/store/useAppStore';
import ObservationCard from '@/components/ObservationCard';
import { Observation } from '@/types/observation';
import styles from './index.module.scss';

const TIME_FILTERS = ['全部', '最近7天', '最近30天'];

const ResearchPage: React.FC = () => {
  const observations = useAppStore((state) => state.observations);
  const [activeRegion, setActiveRegion] = useState('全部');
  const [activeTime, setActiveTime] = useState('全部');

  const regions = useMemo(() => {
    const set = new Set<string>();
    observations.forEach((obs) => {
      if (obs.region) set.add(obs.region);
    });
    return ['全部', ...Array.from(set)];
  }, [observations]);

  const filteredObservations = useMemo(() => {
    return observations.filter((obs) => {
      const matchRegion = activeRegion === '全部' || obs.region === activeRegion;
      let matchTime = true;
      if (activeTime === '最近7天') {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        matchTime = new Date(obs.createdAt) >= sevenDaysAgo;
      } else if (activeTime === '最近30天') {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        matchTime = new Date(obs.createdAt) >= thirtyDaysAgo;
      }
      return matchRegion && matchTime;
    });
  }, [observations, activeRegion, activeTime]);

  const handleObservationClick = (obs: Observation) => {
    console.info('[Research] Observation clicked:', obs.id);
  };

  const handleAddObservation = () => {
    Taro.navigateTo({ url: '/pages/observation-add/index' });
  };

  return (
    <View className={styles.page}>
      <View className={styles.filterBar}>
        <ScrollView scrollX className={styles.filterScroll}>
          <View className={styles.filterRow}>
            {regions.map((region) => (
              <View
                key={region}
                className={classnames(styles.filterBtn, activeRegion === region && styles.filterBtnActive)}
                onClick={() => setActiveRegion(region)}
              >
                <Text>{region}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
        <View className={styles.filterRow} style={{ marginTop: '16rpx' }}>
          {TIME_FILTERS.map((time) => (
            <View
              key={time}
              className={classnames(styles.filterBtn, activeTime === time && styles.filterBtnActive)}
              onClick={() => setActiveTime(time)}
            >
              <Text>{time}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.listSection}>
        {filteredObservations.length > 0 ? (
          filteredObservations.map((obs) => (
            <ObservationCard key={obs.id} observation={obs} onClick={handleObservationClick} />
          ))
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyText}>暂无观察记录</Text>
          </View>
        )}
      </View>

      <View className={styles.fab}>
        <View className={styles.fabBtn} onClick={handleAddObservation}>
          <Text className={styles.fabText}>+</Text>
        </View>
      </View>
    </View>
  );
};

export default ResearchPage;
