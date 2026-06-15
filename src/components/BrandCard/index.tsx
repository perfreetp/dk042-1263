import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import { Brand } from '@/types/brand';
import classnames from 'classnames';
import styles from './index.module.scss';

interface BrandCardProps {
  brand: Brand;
  onClick?: (brand: Brand) => void;
}

const BrandCard: React.FC<BrandCardProps> = ({ brand, onClick }) => {
  return (
    <View className={styles.card} onClick={() => onClick?.(brand)}>
      <View className={styles.header}>
        <Image className={styles.logo} src={brand.logo} mode='aspectFill' />
        <View className={styles.headerInfo}>
          <Text className={styles.name}>{brand.name}</Text>
          <Text className={styles.category}>{brand.category}</Text>
        </View>
        <Text className={styles.price}>{brand.priceRange}</Text>
      </View>
      <Text className={styles.positioning}>{brand.positioning}</Text>
      <View className={styles.tags}>
        {brand.tags.slice(0, 3).map((tag) => (
          <Text key={tag} className={styles.tag}>{tag}</Text>
        ))}
      </View>
      <View className={styles.footer}>
        <Text className={styles.footerLabel}>主推</Text>
        {brand.mainProducts.slice(0, 2).map((p) => (
          <Text key={p} className={styles.product}>{p}</Text>
        ))}
      </View>
    </View>
  );
};

export default BrandCard;
