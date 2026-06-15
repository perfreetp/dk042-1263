import React, { useState, useMemo } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import classnames from 'classnames';
import { useAppStore } from '@/store/useAppStore';
import { PhotoItem } from '@/types/observation';
import styles from './index.module.scss';

interface PhotoWithMeta extends PhotoItem {
  brandName: string;
  observationId: string;
}

const AssetsPage: React.FC = () => {
  const observations = useAppStore((state) => state.observations);
  const [activeTag, setActiveTag] = useState('全部');

  const allTags = useMemo(() => {
    const set = new Set<string>();
    observations.forEach((obs) => {
      obs.photos.forEach((p) => p.tag && set.add(p.tag));
    });
    return ['全部', ...Array.from(set)];
  }, [observations]);

  const allPhotos = useMemo(() => {
    const photos: PhotoWithMeta[] = [];
    observations.forEach((obs) => {
      obs.photos.forEach((photo) => {
        photos.push({
          ...photo,
          brandName: obs.brandName,
          observationId: obs.id,
        });
      });
    });
    return photos;
  }, [observations]);

  const filteredPhotos = useMemo(() => {
    if (activeTag === '全部') return allPhotos;
    return allPhotos.filter((p) => p.tag === activeTag);
  }, [allPhotos, activeTag]);

  return (
    <View className={styles.page}>
      <View className={styles.filterBar}>
        <ScrollView scrollX className={styles.filterScroll}>
          <View className={styles.filterList}>
            {allTags.map((tag) => (
              <View
                key={tag}
                className={classnames(styles.filterBtn, activeTag === tag && styles.filterBtnActive)}
                onClick={() => setActiveTag(tag)}
              >
                <Text>{tag}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      <View className={styles.statsBar}>
        <Text className={styles.statsText}>共 {filteredPhotos.length} 张素材</Text>
      </View>

      <View className={styles.gridSection}>
        {filteredPhotos.length > 0 ? (
          <View className={styles.photoGrid}>
            {filteredPhotos.map((photo, index) => (
              <View
                key={`${photo.observationId}-${index}`}
                className={styles.photoItem}
                onClick={() =>
                  Taro.navigateTo({
                    url: `/pages/photo-detail/index?observationId=${encodeURIComponent(
                      photo.observationId
                    )}&photoUrl=${encodeURIComponent(photo.url)}`,
                  })
                }
              >
                <Image className={styles.photoImage} src={photo.url} mode='aspectFill' />
                <View className={styles.photoBrand}>
                  <Text className={styles.photoBrandText}>{photo.brandName}</Text>
                </View>
                <View className={styles.photoTag}>
                  <Text className={styles.photoTagText}>{photo.tag}</Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyText}>暂无素材</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default AssetsPage;
