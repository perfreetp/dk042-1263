import React, { useMemo } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useAppStore } from '@/store/useAppStore';
import styles from './index.module.scss';

const ObservationDetailPage: React.FC = () => {
  const observations = useAppStore((state) => state.observations);
  const params = Taro.getCurrentInstance().router?.params;
  const observationId = params?.id || '';

  const observation = useMemo(
    () => observations.find((o) => o.id === observationId),
    [observations, observationId]
  );

  const avgScore = useMemo(() => {
    if (!observation) return 0;
    return (
      Math.round(
        ((observation.scores.sellingPoint +
          observation.scores.visual +
          observation.scores.serviceExperience) /
          3) *
          10
      ) / 10
    );
  }, [observation]);

  const handlePreview = (current: string) => {
    if (!observation) return;
    Taro.previewImage({
      current,
      urls: observation.photos.map((p) => p.url),
    });
  };

  const handlePhotoToDetail = (photoUrl: string) => {
    Taro.navigateTo({
      url: `/pages/photo-detail/index?observationId=${encodeURIComponent(observationId)}&photoUrl=${encodeURIComponent(photoUrl)}`,
    });
  };

  if (!observation) {
    return (
      <View className={styles.page}>
        <View className={styles.empty}>
          <Text className={styles.emptyText}>观察记录不存在</Text>
        </View>
      </View>
    );
  }

  return (
    <View className={styles.page}>
      <ScrollView scrollY className={styles.scroll}>
        <View className={styles.header}>
          <View className={styles.headerLeft}>
            <Text className={styles.brandName}>{observation.brandName}</Text>
            <Text className={styles.storeName}>{observation.storeName}</Text>
            <View className={styles.metaRow}>
              <Text className={styles.metaTag}>{observation.region}</Text>
              <Text className={styles.metaTag}>{observation.createdAt}</Text>
            </View>
          </View>
          <View className={styles.scoreBadge}>
            <Text className={styles.scoreText}>{avgScore}</Text>
            <Text className={styles.scoreLabel}>综合</Text>
          </View>
        </View>

        {observation.photos.length > 0 && (
          <View className={styles.section}>
            <Text className={styles.sectionTitle}>现场照片（{observation.photos.length}）</Text>
            <View className={styles.photoGrid}>
              {observation.photos.map((p, i) => (
                <View
                  key={`${p.url}-${i}`}
                  className={styles.photoItem}
                  onClick={() => handlePreview(p.url)}
                  onLongPress={() => handlePhotoToDetail(p.url)}
                >
                  <Image className={styles.photoImg} src={p.url} mode='aspectFill' />
                  <View className={styles.photoTag}>
                    <Text className={styles.photoTagText}>{p.tag}</Text>
                  </View>
                </View>
              ))}
            </View>
            <Text className={styles.tip}>长按图片可修改标签</Text>
          </View>
        )}

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>评分</Text>
          <View className={styles.scoreRow}>
            <View className={styles.scoreItem}>
              <Text className={styles.label}>卖点</Text>
              <View className={styles.bar}>
                <View
                  className={styles.barInner}
                  style={{ width: `${(observation.scores.sellingPoint / 10) * 100}%` }}
                />
              </View>
              <Text className={styles.value}>{observation.scores.sellingPoint}</Text>
            </View>
            <View className={styles.scoreItem}>
              <Text className={styles.label}>视觉</Text>
              <View className={styles.bar}>
                <View
                  className={styles.barInner}
                  style={{ width: `${(observation.scores.visual / 10) * 100}%` }}
                />
              </View>
              <Text className={styles.value}>{observation.scores.visual}</Text>
            </View>
            <View className={styles.scoreItem}>
              <Text className={styles.label}>服务体验</Text>
              <View className={styles.bar}>
                <View
                  className={styles.barInner}
                  style={{ width: `${(observation.scores.serviceExperience / 10) * 100}%` }}
                />
              </View>
              <Text className={styles.value}>{observation.scores.serviceExperience}</Text>
            </View>
          </View>
        </View>

        {observation.interviewSummary && (
          <View className={styles.section}>
            <Text className={styles.sectionTitle}>访谈摘要</Text>
            <View className={styles.card}>
              <Text className={styles.cardText}>{observation.interviewSummary}</Text>
            </View>
          </View>
        )}

        {observation.userQuotes.length > 0 && (
          <View className={styles.section}>
            <Text className={styles.sectionTitle}>用户原话（{observation.userQuotes.length}）</Text>
            <View className={styles.quoteList}>
              {observation.userQuotes.map((q, i) => (
                <View key={i} className={styles.quoteItem}>
                  <Text className={styles.quoteMark}>“</Text>
                  <Text className={styles.quoteText}>{q}</Text>
                  <Text className={styles.quoteMark}>”</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {observation.notes && (
          <View className={styles.section}>
            <Text className={styles.sectionTitle}>备注</Text>
            <View className={styles.card}>
              <Text className={styles.cardText}>{observation.notes}</Text>
            </View>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

export default ObservationDetailPage;
