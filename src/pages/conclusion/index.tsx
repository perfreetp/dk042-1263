import React from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useAppStore } from '@/store/useAppStore';
import CompareCard from '@/components/CompareCard';
import styles from './index.module.scss';

const ConclusionPage: React.FC = () => {
  const conclusions = useAppStore((state) => state.conclusions);
  const brands = useAppStore((state) => state.brands);

  const handleCompare = () => {
    Taro.navigateTo({ url: '/pages/compare/index' });
  };

  const handleShare = (conclusionId: string) => {
    Taro.showModal({
      title: '分享结论',
      content: '确认将此结论分享给团队成员？',
      success: (res) => {
        if (res.confirm) {
          console.info('[Conclusion] Shared:', conclusionId);
          Taro.showToast({ title: '已分享', icon: 'success' });
        }
      },
    });
  };

  const getBrandName = (brandId: string) => {
    return brands.find((b) => b.id === brandId)?.name || '';
  };

  return (
    <View className={styles.page}>
      <View className={styles.headerSection}>
        <Text className={styles.headerTitle}>研究结论</Text>
        <Text className={styles.headerDesc}>汇总竞品洞察，驱动品牌决策</Text>
      </View>

      <View className={styles.actionRow}>
        <View className={styles.actionCard} onClick={handleCompare}>
          <View className={`${styles.actionIcon} ${styles.actionIconCompare}`}>
            <Text className={styles.actionIconText}>📊</Text>
          </View>
          <Text className={styles.actionTitle}>竞品对比</Text>
          <Text className={styles.actionDesc}>生成对比卡片</Text>
        </View>
        <View className={styles.actionCard} onClick={() => {}}>
          <View className={`${styles.actionIcon} ${styles.actionIconShare}`}>
            <Text className={styles.actionIconText}>📤</Text>
          </View>
          <Text className={styles.actionTitle}>分享团队</Text>
          <Text className={styles.actionDesc}>推送阶段性结论</Text>
        </View>
      </View>

      <Text className={styles.sectionTitle}>近期结论</Text>

      <View className={styles.conclusionList}>
        {conclusions.length > 0 ? (
          conclusions.map((conclusion) => (
            <View key={conclusion.id} className={styles.conclusionCard} onClick={() => handleShare(conclusion.id)}>
              <View className={styles.conclusionHeader}>
                <Text className={styles.conclusionTitle}>{conclusion.title}</Text>
                <Text className={styles.conclusionDate}>{conclusion.createdAt}</Text>
              </View>
              <Text className={styles.conclusionContent}>{conclusion.content}</Text>
              <View className={styles.conclusionFooter}>
                <View className={styles.brandTags}>
                  {conclusion.brandIds.map((bid) => (
                    <Text key={bid} className={styles.brandTag}>{getBrandName(bid)}</Text>
                  ))}
                </View>
                <Text className={styles.shareInfo}>{conclusion.sharedWith.length}人已查看</Text>
              </View>
            </View>
          ))
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyText}>暂无结论</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default ConclusionPage;
