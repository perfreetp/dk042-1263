import React, { useState, useMemo } from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import { useAppStore } from '@/store/useAppStore';
import CompareCard from '@/components/CompareCard';
import { ComparisonItem } from '@/types/conclusion';
import styles from './index.module.scss';

const ComparePage: React.FC = () => {
  const brands = useAppStore((state) => state.brands);
  const observations = useAppStore((state) => state.observations);
  const [selectedBrandIds, setSelectedBrandIds] = useState<string[]>([]);
  const [generated, setGenerated] = useState(false);

  const toggleBrand = (id: string) => {
    setSelectedBrandIds((prev) =>
      prev.includes(id) ? prev.filter((bid) => bid !== id) : [...prev, id]
    );
    setGenerated(false);
  };

  const comparisonItems = useMemo(() => {
    if (!generated) return [];
    return selectedBrandIds.map((brandId) => {
      const brand = brands.find((b) => b.id === brandId);
      const brandObs = observations.filter((o) => o.brandId === brandId);
      const avgSelling = brandObs.length > 0
        ? Math.round(brandObs.reduce((s, o) => s + o.scores.sellingPoint, 0) / brandObs.length * 10) / 10
        : 0;
      const avgVisual = brandObs.length > 0
        ? Math.round(brandObs.reduce((s, o) => s + o.scores.visual, 0) / brandObs.length * 10) / 10
        : 0;
      const avgService = brandObs.length > 0
        ? Math.round(brandObs.reduce((s, o) => s + o.scores.serviceExperience, 0) / brandObs.length * 10) / 10
        : 0;
      return {
        brandId,
        brandName: brand?.name || '',
        sellingPoint: avgSelling,
        visual: avgVisual,
        serviceExperience: avgService,
        priceRange: brand?.priceRange || '',
      } as ComparisonItem;
    });
  }, [selectedBrandIds, generated, brands, observations]);

  const handleGenerate = () => {
    if (selectedBrandIds.length < 2) {
      return;
    }
    setGenerated(true);
    console.info('[Compare] Generated comparison for brands:', selectedBrandIds);
  };

  return (
    <View className={styles.page}>
      <View className={styles.headerSection}>
        <Text className={styles.headerTitle}>竞品对比</Text>
        <Text className={styles.headerDesc}>选择品牌生成对比卡片</Text>
      </View>

      <View className={styles.contentSection}>
        <View className={styles.selectCard}>
          <Text className={styles.selectLabel}>选择品牌（至少2个）</Text>
          <View className={styles.brandCheckList}>
            {brands.map((brand) => (
              <View
                key={brand.id}
                className={classnames(styles.brandCheckItem, selectedBrandIds.includes(brand.id) && styles.brandCheckActive)}
                onClick={() => toggleBrand(brand.id)}
              >
                <Text>{brand.name}</Text>
              </View>
            ))}
          </View>
        </View>

        <Text className={styles.selectedInfo}>已选择 {selectedBrandIds.length} 个品牌</Text>

        <View className={styles.compareResult}>
          {generated && comparisonItems.length > 0 ? (
            <CompareCard title='竞品评分对比' items={comparisonItems} />
          ) : (
            <View className={styles.emptyHint}>
              <Text className={styles.emptyText}>选择品牌后点击生成对比</Text>
            </View>
          )}
        </View>
      </View>

      <View className={styles.bottomBar}>
        <View
          className={styles.generateBtn}
          onClick={handleGenerate}
          style={{ opacity: selectedBrandIds.length < 2 ? 0.5 : 1 }}
        >
          <Text>生成对比卡片</Text>
        </View>
      </View>
    </View>
  );
};

export default ComparePage;
