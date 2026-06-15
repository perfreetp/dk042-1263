import React, { useMemo, useState } from 'react';
import { View, Text, Image, ScrollView, Input, Textarea } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import { useAppStore } from '@/store/useAppStore';
import { ObservationScores } from '@/types/observation';
import styles from './index.module.scss';

const ObservationDetailPage: React.FC = () => {
  const observations = useAppStore((state) => state.observations);
  const updateObservation = useAppStore((state) => state.updateObservation);

  const params = Taro.getCurrentInstance().router?.params;
  const observationId = params?.id || '';

  const observation = useMemo(
    () => observations.find((o) => o.id === observationId),
    [observations, observationId]
  );

  const [isEditing, setIsEditing] = useState(false);
  const [interviewSummary, setInterviewSummary] = useState(observation?.interviewSummary ?? '');
  const [userQuotes, setUserQuotes] = useState<string[]>(observation?.userQuotes ?? []);
  const [quoteInput, setQuoteInput] = useState('');
  const [notes, setNotes] = useState(observation?.notes ?? '');
  const [scores, setScores] = useState<ObservationScores>(
    observation?.scores ?? { sellingPoint: 5, visual: 5, serviceExperience: 5 }
  );

  useDidShow(() => {
    if (observation && !isEditing) {
      setInterviewSummary(observation.interviewSummary);
      setUserQuotes(observation.userQuotes);
      setNotes(observation.notes);
      setScores(observation.scores);
    }
  });

  const avgScore = useMemo(() => {
    if (!observation) return 0;
    return (
      Math.round(
        ((scores.sellingPoint + scores.visual + scores.serviceExperience) / 3) * 10
      ) / 10
    );
  }, [observation, scores]);

  const handlePreview = (current: string) => {
    if (!observation) return;
    Taro.previewImage({
      current,
      urls: observation.photos.map((p) => p.url),
    });
  };

  const handlePhotoToDetail = (photoUrl: string) => {
    Taro.navigateTo({
      url: `/pages/photo-detail/index?observationId=${encodeURIComponent(observationId)}&photoUrl=${encodeURIComponent(photoUrl)}`,
    });
  };

  const addQuote = () => {
    if (quoteInput.trim()) {
      setUserQuotes([...userQuotes, quoteInput.trim()]);
      setQuoteInput('');
    }
  };

  const removeQuote = (index: number) => {
    setUserQuotes(userQuotes.filter((_, i) => i !== index));
  };

  const adjustScore = (key: keyof ObservationScores, delta: number) => {
    const next = scores[key] + delta;
    if (next >= 1 && next <= 10) setScores({ ...scores, [key]: next });
  };

  const handleSave = () => {
    if (!observationId) {
      Taro.showToast({ title: '记录不存在', icon: 'none' });
      return;
    }
    updateObservation(observationId, { interviewSummary, userQuotes, notes, scores });
    console.info('[ObservationDetail] Updated:', observationId);
    Taro.showToast({ title: '保存成功', icon: 'success' });
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (observation) {
      setInterviewSummary(observation.interviewSummary);
      setUserQuotes(observation.userQuotes);
      setNotes(observation.notes);
      setScores(observation.scores);
    }
    setIsEditing(false);
  };

  if (!observation) {
    return (
      <View className={styles.page}>
        <View className={styles.empty}>
          <Text className={styles.emptyText}>观察记录不存在</Text>
        </View>
      </View>
    );
  }

  return (
    <View className={styles.page}>
      <ScrollView scrollY className={styles.scroll}>
        <View className={styles.header}>
          <View className={styles.headerLeft}>
            <Text className={styles.brandName}>{observation.brandName}</Text>
            <Text className={styles.storeName}>{observation.storeName}</Text>
            <View className={styles.metaRow}>
              <Text className={styles.metaTag}>{observation.region}</Text>
              <Text className={styles.metaTag}>{observation.createdAt}</Text>
            </View>
          </View>
          <View className={styles.scoreBadge}>
            <Text className={styles.scoreText}>{avgScore}</Text>
            <Text className={styles.scoreLabel}>综合</Text>
          </View>
        </View>

        {!isEditing && (
          <View className={styles.editBar}>
            <View className={styles.editBtn} onClick={() => setIsEditing(true)}>
              <Text className={styles.editBtnText}>编辑记录</Text>
            </View>
          </View>
        )}

        {observation.photos.length > 0 && (
          <View className={styles.section}>
            <Text className={styles.sectionTitle}>现场照片（{observation.photos.length}）</Text>
            <View className={styles.photoGrid}>
              {observation.photos.map((p, i) => (
                <View
                  key={`${p.url}-${i}`}
                  className={styles.photoItem}
                  onClick={() => handlePreview(p.url)}
                  onLongPress={() => handlePhotoToDetail(p.url)}
                >
                  <Image className={styles.photoImg} src={p.url} mode='aspectFill' />
                  <View className={styles.photoTag}>
                    <Text className={styles.photoTagText}>{p.tag}</Text>
                  </View>
                </View>
              ))}
            </View>
            <Text className={styles.tip}>点击放大 · 长按可修改标签</Text>
          </View>
        )}

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>评分</Text>
          <View className={styles.scoreRow}>
            {(['sellingPoint', 'visual', 'serviceExperience'] as const).map((key) => {
              const labelMap = { sellingPoint: '卖点', visual: '视觉', serviceExperience: '服务体验' };
              const value = scores[key];
              return (
                <View key={key} className={styles.scoreItem}>
                  <Text className={styles.label}>{labelMap[key]}</Text>
                  {isEditing ? (
                    <View className={styles.scoreControl}>
                      <View className={styles.scoreBtn} onClick={() => adjustScore(key, -1)}>
                        <Text>-</Text>
                      </View>
                      <Text className={styles.value}>{value}</Text>
                      <View className={styles.scoreBtn} onClick={() => adjustScore(key, 1)}>
                        <Text>+</Text>
                      </View>
                    </View>
                  ) : (
                    <>
                      <View className={styles.bar}>
                        <View
                          className={styles.barInner}
                          style={{ width: `${(value / 10) * 100}%` }}
                        />
                      </View>
                      <Text className={styles.value}>{value}</Text>
                    </>
                  )}
                </View>
              );
            })}
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>访谈摘要</Text>
          {isEditing ? (
            <Textarea
              className={styles.editTextarea}
              value={interviewSummary}
              onInput={(e) => setInterviewSummary(e.detail.value)}
              placeholder='记录访谈核心发现'
              autoHeight
            />
          ) : (
            <View className={styles.card}>
              <Text className={styles.cardText}>{interviewSummary || '暂无'}</Text>
            </View>
          )}
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>用户原话（{userQuotes.length}）</Text>
          {isEditing && (
            <View className={styles.quoteInputRow}>
              <Input
                className={styles.quoteInput}
                value={quoteInput}
                onInput={(e) => setQuoteInput(e.detail.value)}
                placeholder='输入用户原话'
              />
              <View className={styles.addQuoteBtn} onClick={addQuote}>
                <Text className={styles.addQuoteBtnText}>+</Text>
              </View>
            </View>
          )}
          {userQuotes.length > 0 ? (
            <View className={styles.quoteList}>
              {userQuotes.map((q, i) => (
                <View key={i} className={styles.quoteItem}>
                  <Text className={styles.quoteMark}>“</Text>
                  <Text className={styles.quoteText}>{q}</Text>
                  <Text className={styles.quoteMark}>”</Text>
                  {isEditing && (
                    <View className={styles.quoteRemove} onClick={() => removeQuote(i)}>
                      <Text>×</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          ) : (
            <View className={styles.card}>
              <Text className={styles.cardText}>暂无</Text>
            </View>
          )}
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>备注</Text>
          {isEditing ? (
            <Textarea
              className={styles.editTextarea}
              value={notes}
              onInput={(e) => setNotes(e.detail.value)}
              placeholder='其他补充信息'
              autoHeight
            />
          ) : (
            <View className={styles.card}>
              <Text className={styles.cardText}>{notes || '暂无'}</Text>
            </View>
          )}
        </View>

        <View style={{ height: 180 }} />
      </ScrollView>

      {isEditing && (
        <View className={styles.bottomBar}>
          <View className={styles.cancelBtn} onClick={handleCancel}>
            <Text>取消</Text>
          </View>
          <View className={styles.saveBtn} onClick={handleSave}>
            <Text>保存修改</Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default ObservationDetailPage;
