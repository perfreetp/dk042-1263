import React, { useState, useMemo } from 'react';
import { View, Text, Input, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { useAppStore } from '@/store/useAppStore';
import BrandCard from '@/components/BrandCard';
import { Brand } from '@/types/brand';
import styles from './index.module.scss';

const CATEGORIES = ['全部', '美妆', '饮料', '咖啡', '茶饮', '冰淇淋', '滋补', '方便食品', '潮玩', '汽车'];

const BrandsPage: React.FC = () => {
  const brands = useAppStore((state) => state.brands);
  const [keyword, setKeyword] = useState('');
  const [activeCategory, setActiveCategory] = useState('全部');

  const filteredBrands = useMemo(() => {
    return brands.filter((brand) => {
      const matchKeyword = !keyword || brand.name.includes(keyword) || brand.positioning.includes(keyword);
      const matchCategory = activeCategory === '全部' || brand.category === activeCategory;
      return matchKeyword && matchCategory;
    });
  }, [brands, keyword, activeCategory]);

  const handleBrandClick = (brand: Brand) => {
    Taro.navigateTo({ url: `/pages/brand-detail/index?id=${brand.id}` });
  };

  const handleAddBrand = () => {
    Taro.navigateTo({ url: '/pages/brand-add/index' });
  };

  return (
    <View className={styles.page}>
      <View className={styles.searchBar}>
        <Input
          className={styles.searchInput}
          placeholder='搜索品牌名称或定位'
          placeholderClass={styles.searchPlaceholder}
          value={keyword}
          onInput={(e) => setKeyword(e.detail.value)}
        />
      </View>

      <View className={styles.filterSection}>
        <ScrollView scrollX className={styles.filterScroll}>
          <View className={styles.filterList}>
            {CATEGORIES.map((cat) => (
              <View
                key={cat}
                className={classnames(styles.filterBtn, activeCategory === cat && styles.filterBtnActive)}
                onClick={() => setActiveCategory(cat)}
              >
                <Text>{cat}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      <View className={styles.listSection}>
        {filteredBrands.length > 0 ? (
          filteredBrands.map((brand) => (
            <BrandCard key={brand.id} brand={brand} onClick={handleBrandClick} />
          ))
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyText}>暂无匹配品牌</Text>
          </View>
        )}
      </View>

      <View className={styles.fab}>
        <View className={styles.fabBtn} onClick={handleAddBrand}>
          <Text className={styles.fabText}>+</Text>
        </View>
      </View>
    </View>
  );
};

export default BrandsPage;
