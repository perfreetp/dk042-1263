import React, { useMemo } from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useAppStore } from '@/store/useAppStore';
import ObservationCard from '@/components/ObservationCard';
import styles from './index.module.scss';

const BrandDetailPage: React.FC = () => {
  const brands = useAppStore((state) => state.brands);
  const observations = useAppStore((state) => state.observations);

  const params = Taro.getCurrentInstance().router?.params;
  const brandId = params?.id || '';

  const brand = useMemo(() => brands.find((b) => b.id === brandId), [brands, brandId]);
  const brandObservations = useMemo(() => observations.filter((o) => o.brandId === brandId), [observations, brandId]);

  if (!brand) {
    return (
      <View className={styles.page}>
        <View className={styles.contentSection}>
          <Text className={styles.infoValue}>品牌不存在</Text>
        </View>
      </View>
    );
  }

  return (
    <View className={styles.page}>
      <View className={styles.headerSection}>
        <Image className={styles.logo} src={brand.logo} mode='aspectFill' />
        <View className={styles.headerInfo}>
          <Text className={styles.brandName}>{brand.name}</Text>
          <Text className={styles.brandCategory}>{brand.category}</Text>
          <Text className={styles.brandPrice}>{brand.priceRange}</Text>
        </View>
      </View>

      <View className={styles.contentSection}>
        <View className={styles.infoCard}>
          <Text className={styles.infoLabel}>品牌定位</Text>
          <Text className={styles.infoValue}>{brand.positioning}</Text>
        </View>

        <View className={styles.infoCard}>
          <Text className={styles.infoLabel}>包装特点</Text>
          <Text className={styles.infoValue}>{brand.packagingFeatures}</Text>
        </View>

        <View className={styles.infoCard}>
          <Text className={styles.infoLabel}>主推产品</Text>
          <View className={styles.tagList}>
            {brand.mainProducts.map((p) => (
              <Text key={p} className={styles.tag}>{p}</Text>
            ))}
          </View>
        </View>

        <View className={styles.infoCard}>
          <Text className={styles.infoLabel}>渠道</Text>
          <View className={styles.tagList}>
            {brand.channels.map((c) => (
              <Text key={c} className={styles.tag}>{c}</Text>
            ))}
          </View>
        </View>

        <View className={styles.infoCard}>
          <Text className={styles.infoLabel}>促销话术</Text>
          {brand.promotionSlogans.map((s) => (
            <Text key={s} className={styles.sloganItem}>{s}</Text>
          ))}
        </View>

        <View className={styles.infoCard}>
          <Text className={styles.infoLabel}>品牌标签</Text>
          <View className={styles.tagList}>
            {brand.tags.map((t) => (
              <Text key={t} className={styles.tag}>{t}</Text>
            ))}
          </View>
        </View>

        {brandObservations.length > 0 && (
          <>
            <Text className={styles.sectionTitle}>观察记录 ({brandObservations.length})</Text>
            {brandObservations.map((obs) => (
              <ObservationCard
                key={obs.id}
                observation={obs}
                onClick={() => Taro.navigateTo({ url: `/pages/observation-detail/index?id=${obs.id}` })}
              />
            ))}
          </>
        )}
      </View>
    </View>
  );
};

export default BrandDetailPage;
