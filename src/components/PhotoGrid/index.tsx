import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import { PhotoItem } from '@/types/observation';
import styles from './index.module.scss';

interface PhotoGridProps {
  photos: PhotoItem[];
  columns?: number;
}

const PhotoGrid: React.FC<PhotoGridProps> = ({ photos, columns = 3 }) => {
  return (
    <View className={styles.grid}>
      {photos.map((photo, index) => (
        <View key={index} className={styles.item} style={{ width: `${(100 - (columns - 1) * 3) / columns}%` }}>
          <Image className={styles.image} src={photo.url} mode='aspectFill' />
          <View className={styles.tagOverlay}>
            <Text className={styles.tagText}>{photo.tag}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

export default PhotoGrid;
