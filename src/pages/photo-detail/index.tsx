import React, { useMemo, useState } from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { useAppStore } from '@/store/useAppStore';
import { PhotoItem } from '@/types/observation';
import styles from './index.module.scss';

const TAG_OPTIONS = ['货架', '陈列', '海报'];

const PhotoDetailPage: React.FC = () => {
  const observations = useAppStore((state) => state.observations);
  const updatePhotoTag = useAppStore((state) => state.updatePhotoTag);

  const params = Taro.getCurrentInstance().router?.params;
  const observationId = decodeURIComponent(params?.observationId || '');
  const photoUrl = decodeURIComponent(params?.photoUrl || '');

  const observation = useMemo(
    () => observations.find((o) => o.id === observationId),
    [observations, observationId]
  );

  const photo: PhotoItem | undefined = useMemo(() => {
    if (!observation) return undefined;
    return observation.photos.find((p) => p.url === photoUrl);
  }, [observation, photoUrl]);

  const [currentTag, setCurrentTag] = useState<string>(photo?.tag ?? TAG_OPTIONS[0]);

  const handleSaveTag = () => {
    if (!observationId || !photoUrl) {
      Taro.showToast({ title: '参数缺失', icon: 'none' });
      return;
    }
    if (currentTag === photo?.tag) {
      Taro.navigateBack();
      return;
    }
    updatePhotoTag(observationId, photoUrl, currentTag);
    console.info('[PhotoDetail] Tag updated:', photoUrl, '->', currentTag);
    Taro.showToast({ title: '标签已更新', icon: 'success' });
    setTimeout(() => Taro.navigateBack(), 1200);
  };

  const handlePreview = () => {
    if (!observation) return;
    Taro.previewImage({
      current: photoUrl,
      urls: observation.photos.map((p) => p.url),
    });
  };

  const handleGoObservation = () => {
    Taro.navigateTo({
      url: `/pages/observation-detail/index?id=${encodeURIComponent(observationId)}`,
    });
  };

  if (!observation || !photo) {
    return (
      <View className={styles.page}>
        <View className={styles.empty}>
          <Text className={styles.emptyText}>图片不存在或已删除</Text>
        </View>
      </View>
    );
  }

  return (
    <View className={styles.page}>
      <View className={styles.imgWrap} onClick={handlePreview}>
        <Image className={styles.img} src={photo.url} mode='aspectFit' />
        <Text className={styles.imgHint}>点击图片可放大</Text>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>标签分类</Text>
        <View className={styles.tagBar}>
          {TAG_OPTIONS.map((tag) => (
            <View
              key={tag}
              className={classnames(styles.tagBtn, currentTag === tag && styles.tagBtnActive)}
              onClick={() => setCurrentTag(tag)}
            >
              <Text className={classnames(currentTag === tag && styles.tagTextActive)}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>来源信息</Text>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>所属品牌</Text>
          <Text className={styles.infoValue}>{observation.brandName}</Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>门店名称</Text>
          <Text className={styles.infoValue}>{observation.storeName}</Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>所在地区</Text>
          <Text className={styles.infoValue}>{observation.region}</Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>观察时间</Text>
          <Text className={styles.infoValue}>{observation.createdAt}</Text>
        </View>
        <View className={styles.infoRow} onClick={handleGoObservation}>
          <Text className={styles.infoLabel}>关联观察</Text>
          <View className={styles.linkRow}>
            <Text className={styles.linkValue}>查看完整记录</Text>
            <Text className={styles.linkArrow}>›</Text>
          </View>
        </View>
      </View>

      <View className={styles.bottomBar}>
        <View className={styles.cancelBtn} onClick={() => Taro.navigateBack()}>
          <Text>取消</Text>
        </View>
        <View className={styles.saveBtn} onClick={handleSaveTag}>
          <Text>保存标签</Text>
        </View>
      </View>
    </View>
  );
};

export default PhotoDetailPage;
