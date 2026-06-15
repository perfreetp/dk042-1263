import React, { useState, useMemo } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import classnames from 'classnames';
import { useAppStore } from '@/store/useAppStore';
import styles from './index.module.scss';

const TAG_OPTIONS = ['货架', '陈列', '海报'];
const PHOTO_KEY = (observationId: string, photoUrl: string) => `${observationId}|${photoUrl}`;

interface PhotoWithMeta {
  url: string;
  tag: string;
  brandName: string;
  region: string;
  observationId: string;
  createdAt: string;
  storeName: string;
}

const AssetsPage: React.FC = () => {
  const observations = useAppStore((state) => state.observations);
  const batchUpdatePhotoTags = useAppStore((state) => state.batchUpdatePhotoTags);

  const [activeTag, setActiveTag] = useState('全部');
  const [activeBrand, setActiveBrand] = useState('全部');
  const [activeRegion, setActiveRegion] = useState('全部');
  const [isBatchMode, setIsBatchMode] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showBatchTagModal, setShowBatchTagModal] = useState(false);
  const [_, setTick] = useState(0);

  useDidShow(() => setTick((t) => t + 1));

  const allTags = useMemo(() => {
    const set = new Set<string>();
    observations.forEach((obs) => {
      obs.photos.forEach((p) => p.tag && set.add(p.tag));
    });
    return ['全部', ...Array.from(set)];
  }, [observations]);

  const allBrands = useMemo(() => {
    const set = new Set<string>();
    observations.forEach((obs) => obs.brandName && set.add(obs.brandName));
    return ['全部', ...Array.from(set)];
  }, [observations]);

  const allRegions = useMemo(() => {
    const set = new Set<string>();
    observations.forEach((obs) => obs.region && set.add(obs.region));
    return ['全部', ...Array.from(set)];
  }, [observations]);

  const allPhotos = useMemo<PhotoWithMeta[]>(() => {
    const photos: PhotoWithMeta[] = [];
    observations.forEach((obs) => {
      obs.photos.forEach((photo) => {
        photos.push({
          url: photo.url,
          tag: photo.tag,
          brandName: obs.brandName,
          region: obs.region,
          observationId: obs.id,
          createdAt: obs.createdAt,
          storeName: obs.storeName,
        });
      });
    });
    return photos;
  }, [observations]);

  const filteredPhotos = useMemo(() => {
    return allPhotos.filter((p) => {
      const tagOk = activeTag === '全部' || p.tag === activeTag;
      const brandOk = activeBrand === '全部' || p.brandName === activeBrand;
      const regionOk = activeRegion === '全部' || p.region === activeRegion;
      return tagOk && brandOk && regionOk;
    });
  }, [allPhotos, activeTag, activeBrand, activeRegion]);

  const toggleSelect = (key: string) => {
    const next = new Set(selected);
    if (next.has(key)) {
      next.delete(key);
    } else {
      next.add(key);
    }
    setSelected(next);
  };

  const selectAll = () => {
    if (selected.size === filteredPhotos.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filteredPhotos.map((p) => PHOTO_KEY(p.observationId, p.url))));
    }
  };

  const handlePhotoClick = (p: PhotoWithMeta) => {
    if (isBatchMode) {
      toggleSelect(PHOTO_KEY(p.observationId, p.url));
      return;
    }
    Taro.navigateTo({
      url: `/pages/photo-detail/index?observationId=${encodeURIComponent(p.observationId)}&photoUrl=${encodeURIComponent(p.url)}`,
    });
  };

  const exitBatchMode = () => {
    setIsBatchMode(false);
    setSelected(new Set());
  };

  const applyBatchTag = (tag: string) => {
    if (selected.size === 0) {
      Taro.showToast({ title: '未选中任何图片', icon: 'none' });
      return;
    }
    const updates: Array<{ observationId: string; photoUrl: string; newTag: string }> = [];
    selected.forEach((key) => {
      const [observationId, photoUrl] = key.split('|');
      updates.push({ observationId, photoUrl, newTag: tag });
    });
    batchUpdatePhotoTags(updates);
    setShowBatchTagModal(false);
    setSelected(new Set());
    setIsBatchMode(false);
    Taro.showToast({ title: `已更新 ${updates.length} 张`, icon: 'success' });
  };

  return (
    <View className={styles.page}>
      <View className={styles.filterBar}>
        <ScrollView scrollX className={styles.filterScroll}>
          <View className={styles.filterList}>
            <Text className={styles.filterLabel}>标签：</Text>
            {allTags.map((tag) => (
              <View
                key={`tag-${tag}`}
                className={classnames(styles.filterBtn, activeTag === tag && styles.filterBtnActive)}
                onClick={() => setActiveTag(tag)}
              >
                <Text>{tag}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
        <ScrollView scrollX className={styles.filterScroll}>
          <View className={styles.filterList}>
            <Text className={styles.filterLabel}>品牌：</Text>
            {allBrands.map((b) => (
              <View
                key={`brand-${b}`}
                className={classnames(styles.filterBtn, activeBrand === b && styles.filterBtnActive)}
                onClick={() => setActiveBrand(b)}
              >
                <Text>{b}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
        <ScrollView scrollX className={styles.filterScroll}>
          <View className={styles.filterList}>
            <Text className={styles.filterLabel}>地区：</Text>
            {allRegions.map((r) => (
              <View
                key={`region-${r}`}
                className={classnames(styles.filterBtn, activeRegion === r && styles.filterBtnActive)}
                onClick={() => setActiveRegion(r)}
              >
                <Text>{r}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      <View className={styles.statsBar}>
        <Text className={styles.statsText}>共 {filteredPhotos.length} 张素材</Text>
        {!isBatchMode ? (
          <View className={styles.batchEntry} onClick={() => setIsBatchMode(true)}>
            <Text className={styles.batchEntryText}>批量整理</Text>
          </View>
        ) : (
          <View className={styles.batchEntry} onClick={selectAll}>
            <Text className={styles.batchEntryText}>
              {selected.size === filteredPhotos.length ? '取消全选' : '全选'}
            </Text>
          </View>
        )}
      </View>

      <View className={styles.gridSection}>
        {filteredPhotos.length > 0 ? (
          <View className={styles.photoGrid}>
            {filteredPhotos.map((p) => {
              const key = PHOTO_KEY(p.observationId, p.url);
              const isSelected = selected.has(key);
              return (
                <View key={key} className={styles.photoItem} onClick={() => handlePhotoClick(p)}>
                  <Image className={styles.photoImage} src={p.url} mode='aspectFill' />
                  <View className={styles.photoBrand}>
                    <Text className={styles.photoBrandText}>{p.brandName}</Text>
                  </View>
                  <View className={styles.photoTag}>
                    <Text className={styles.photoTagText}>{p.tag}</Text>
                  </View>
                  {isBatchMode && (
                    <View className={classnames(styles.checkMark, isSelected && styles.checkMarkActive)}>
                      {isSelected && <Text className={styles.checkMarkText}>✓</Text>}
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyText}>暂无素材</Text>
          </View>
        )}
      </View>

      {isBatchMode && (
        <View className={styles.batchBar}>
          <View className={styles.batchInfo}>
            <Text className={styles.batchInfoText}>已选 {selected.size} 张</Text>
          </View>
          <View className={styles.batchActions}>
            <View className={styles.batchCancel} onClick={exitBatchMode}>
              <Text>取消</Text>
            </View>
            <View
              className={classnames(styles.batchConfirm, selected.size === 0 && styles.batchConfirmDisabled)}
              onClick={() => selected.size > 0 && setShowBatchTagModal(true)}
            >
              <Text>修改标签</Text>
            </View>
          </View>
        </View>
      )}

      {showBatchTagModal && (
        <View className={styles.batchModalMask} onClick={() => setShowBatchTagModal(false)}>
          <View className={styles.batchModal} onClick={(e) => e.stopPropagation?.()}>
            <Text className={styles.batchModalTitle}>选择统一标签</Text>
            <View className={styles.batchTagBar}>
              {TAG_OPTIONS.map((tag) => (
                <View key={tag} className={styles.batchTagBtn} onClick={() => applyBatchTag(tag)}>
                  <Text>{tag}</Text>
                </View>
              ))}
            </View>
            <View className={styles.batchModalCancel} onClick={() => setShowBatchTagModal(false)}>
              <Text>取消</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default AssetsPage;
