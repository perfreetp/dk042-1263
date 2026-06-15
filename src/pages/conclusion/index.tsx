import React, { useState } from 'react';
import { View, Text, Image, Textarea, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { useAppStore } from '@/store/useAppStore';
import { mockTeamMembers } from '@/data/members';
import { ShareRecord } from '@/types/conclusion';
import CompareCard from '@/components/CompareCard';
import styles from './index.module.scss';

const formatDate = (d: Date) => {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const TAG_OPTIONS = ['货架', '陈列', '海报'];

const ConclusionPage: React.FC = () => {
  const conclusions = useAppStore((state) => state.conclusions);
  const brands = useAppStore((state) => state.brands);
  const updateConclusionShared = useAppStore((state) => state.updateConclusionShared);

  const [showShareModal, setShowShareModal] = useState(false);
  const [activeConclusionId, setActiveConclusionId] = useState<string | null>(null);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [shareNote, setShareNote] = useState('');

  const openShareFlow = (conclusionId?: string) => {
    let targetId = conclusionId;
    if (!targetId && conclusions.length > 0) {
      targetId = conclusions[conclusions.length - 1].id;
    }
    if (!targetId) {
      Taro.showToast({ title: '暂无可分享的结论', icon: 'none' });
      return;
    }
    const conclusion = conclusions.find((c) => c.id === targetId);
    setActiveConclusionId(targetId);
    setSelectedMembers(conclusion?.sharedWith ? [...conclusion.sharedWith] : []);
    setShareNote(conclusion?.shareNote || '');
    setShowShareModal(true);
  };

  const handleCompare = () => {
    Taro.navigateTo({ url: '/pages/compare/index' });
  };

  const toggleMember = (name: string) => {
    if (selectedMembers.includes(name)) {
      setSelectedMembers(selectedMembers.filter((n) => n !== name));
    } else {
      setSelectedMembers([...selectedMembers, name]);
    }
  };

  const confirmShare = () => {
    if (!activeConclusionId) return;
    if (selectedMembers.length === 0) {
      Taro.showToast({ title: '请选择团队成员', icon: 'none' });
      return;
    }
    const conclusion = conclusions.find((c) => c.id === activeConclusionId);
    const existing = conclusion?.viewedCount ?? 0;
    const lastSharedAt = formatDate(new Date());
    updateConclusionShared(
      activeConclusionId,
      selectedMembers,
      Math.max(existing, selectedMembers.length),
      shareNote,
      lastSharedAt
    );
    console.info('[Conclusion] Shared with members:', selectedMembers, 'note:', shareNote);
    setShowShareModal(false);
    Taro.showToast({ title: '分享成功', icon: 'success' });
  };

  const getBrandName = (brandId: string) => {
    return brands.find((b) => b.id === brandId)?.name || '';
  };

  const activeConclusion = activeConclusionId
    ? conclusions.find((c) => c.id === activeConclusionId)
    : null;

  const getAvatarByName = (name: string) => {
    return mockTeamMembers.find((m) => m.name === name)?.avatar || '';
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
        <View className={styles.actionCard} onClick={() => openShareFlow()}>
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
            <View key={conclusion.id} className={styles.conclusionCard} onClick={() => openShareFlow(conclusion.id)}>
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
              </View>
              <View className={styles.conclusionShareRow}>
                {conclusion.sharedWith.length > 0 && (
                  <View className={styles.avatars}>
                    {conclusion.sharedWith.slice(0, 3).map((name) => {
                      const avatar = getAvatarByName(name);
                      return avatar ? (
                        <Image key={name} className={styles.avatar} src={avatar} mode='aspectFill' />
                      ) : null;
                    })}
                  </View>
                )}
                <View className={styles.shareInfoBox}>
                  <Text className={styles.shareInfo}>
                    {conclusion.sharedWith.length > 0
                      ? `已分享给${conclusion.sharedWith.join('、')} · ${conclusion.viewedCount}人已查看`
                      : '点击分享给团队'
                    }
                  </Text>
                  {conclusion.lastSharedAt && (
                    <Text className={styles.shareTime}>最近分享 {conclusion.lastSharedAt}</Text>
                  )}
                  {conclusion.shareNote && (
                    <Text className={styles.shareNoteBox}>"{conclusion.shareNote}"</Text>
                  )}
                </View>
              </View>

              {conclusion.shareHistory && conclusion.shareHistory.length > 0 && (
                <View className={styles.historySection}>
                  <View className={styles.historyHeader}>
                    <Text className={styles.historyTitle}>分享记录（{conclusion.shareHistory.length}）</Text>
                  </View>
                  <View className={styles.historyList}>
                    {conclusion.shareHistory.map((rec: ShareRecord, idx: number) => (
                      <View key={idx} className={styles.historyItem}>
                        <View className={styles.historyAvatars}>
                          {rec.sharedWith.slice(0, 3).map((name) => {
                            const avatar = getAvatarByName(name);
                            return avatar ? (
                              <Image key={name} className={styles.historyAvatar} src={avatar} mode='aspectFill' />
                            ) : null;
                          })}
                          {rec.sharedWith.length > 3 && (
                            <View className={styles.historyAvatarMore}>
                              <Text className={styles.historyAvatarMoreText}>+{rec.sharedWith.length - 3}</Text>
                            </View>
                          )}
                        </View>
                        <View className={styles.historyInfo}>
                          <Text className={styles.historyMembers}>{rec.sharedWith.join('、')}</Text>
                          <Text className={styles.historyTime}>{rec.sharedAt}</Text>
                          {rec.shareNote && (
                            <Text className={styles.historyNote}>"{rec.shareNote}"</Text>
                          )}
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          ))
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyText}>暂无结论</Text>
          </View>
        )}
      </View>

      {showShareModal && (
        <View className={styles.modalMask} onClick={() => setShowShareModal(false)}>
          <View className={styles.modal} onClick={(e) => e.stopPropagation?.()}>
            <View className={styles.modalHeader}>
              <Text className={styles.modalTitle}>分享给团队成员</Text>
              <Text className={styles.modalSubTitle}>
                {activeConclusion ? `结论：${activeConclusion.title}` : ''}
              </Text>
            </View>

            <ScrollView scrollY className={styles.modalScroll}>
              <View className={styles.memberList}>
                {mockTeamMembers.map((member) => {
                  const checked = selectedMembers.includes(member.name);
                  return (
                    <View
                      key={member.id}
                      className={classnames(styles.memberItem, checked && styles.memberItemActive)}
                      onClick={() => toggleMember(member.name)}
                    >
                      <Image className={styles.memberAvatar} src={member.avatar} mode='aspectFill' />
                      <View className={styles.memberInfo}>
                        <Text className={styles.memberName}>{member.name}</Text>
                        <Text className={styles.memberRole}>{member.role}</Text>
                      </View>
                      <View className={classnames(styles.checkbox, checked && styles.checkboxChecked)}>
                        {checked && <Text className={styles.checkIcon}>✓</Text>}
                      </View>
                    </View>
                  );
                })}
              </View>

              <View className={styles.shareNoteSection}>
                <Text className={styles.shareNoteLabel}>分享说明（可选）</Text>
                <Textarea
                  className={styles.shareNoteInput}
                  value={shareNote}
                  onInput={(e) => setShareNote(e.detail.value)}
                  placeholder='补充说明，例如：请在周会前先看完'
                  maxlength={120}
                  autoHeight
                />
              </View>

              {activeConclusion?.shareHistory && activeConclusion.shareHistory.length > 0 && (
                <View className={styles.historySection}>
                  <View className={styles.historyHeader}>
                    <Text className={styles.historyTitle}>历史分享（{activeConclusion.shareHistory.length}）</Text>
                  </View>
                  <View className={styles.historyList}>
                    {activeConclusion.shareHistory.map((rec: ShareRecord, idx: number) => (
                      <View key={idx} className={styles.historyItem}>
                        <View className={styles.historyAvatars}>
                          {rec.sharedWith.slice(0, 2).map((name) => {
                            const avatar = getAvatarByName(name);
                            return avatar ? (
                              <Image key={name} className={styles.historyAvatar} src={avatar} mode='aspectFill' />
                            ) : null;
                          })}
                        </View>
                        <View className={styles.historyInfo}>
                          <Text className={styles.historyMembers}>{rec.sharedWith.join('、')}</Text>
                          <Text className={styles.historyTime}>{rec.sharedAt}</Text>
                          {rec.shareNote && (
                            <Text className={styles.historyNote}>"{rec.shareNote}"</Text>
                          )}
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </ScrollView>

            <View className={styles.modalFooter}>
              <View className={styles.cancelShareBtn} onClick={() => setShowShareModal(false)}>
                <Text>取消</Text>
              </View>
              <View className={styles.confirmShareBtn} onClick={confirmShare}>
                <Text>确认分享（{selectedMembers.length}）</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default ConclusionPage;
