import React, { useState } from 'react';
import { View, Text, Input, Textarea, Picker, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { useAppStore } from '@/store/useAppStore';
import { Observation, PhotoItem } from '@/types/observation';
import styles from './index.module.scss';

const TAG_OPTIONS = ['货架', '陈列', '海报'];

interface PhotoWithTag extends PhotoItem {
  localId: string;
}

const ObservationAddPage: React.FC = () => {
  const brands = useAppStore((state) => state.brands);
  const addObservation = useAppStore((state) => state.addObservation);

  const [brandIndex, setBrandIndex] = useState(0);
  const [storeName, setStoreName] = useState('');
  const [region, setRegion] = useState('');
  const [interviewSummary, setInterviewSummary] = useState('');
  const [notes, setNotes] = useState('');
  const [sellingPoint, setSellingPoint] = useState(5);
  const [visual, setVisual] = useState(5);
  const [serviceExperience, setServiceExperience] = useState(5);
  const [userQuotes, setUserQuotes] = useState<string[]>([]);
  const [quoteInput, setQuoteInput] = useState('');
  const [photos, setPhotos] = useState<PhotoWithTag[]>([]);

  const brandNames = brands.map((b) => b.name);

  const handleChooseImages = async () => {
    try {
      const res = await Taro.chooseImage({
        count: 9,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
      });
      const newPhotos: PhotoWithTag[] = (res.tempFilePaths || []).map((url, idx) => ({
        url,
        tag: TAG_OPTIONS[0],
        localId: `photo-${Date.now()}-${idx}`,
      }));
      setPhotos([...photos, ...newPhotos]);
      console.info('[ObservationAdd] Photos selected:', newPhotos.length);
    } catch (e) {
      console.error('[ObservationAdd] Choose image failed:', e);
    }
  };

  const handlePhotoTagChange = (localId: string, tag: string) => {
    setPhotos(photos.map((p) => (p.localId === localId ? { ...p, tag } : p)));
  };

  const handlePhotoRemove = (localId: string) => {
    setPhotos(photos.filter((p) => p.localId !== localId));
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

  const handleSave = () => {
    if (!storeName.trim()) {
      Taro.showToast({ title: '请输入门店名称', icon: 'none' });
      return;
    }
    const selectedBrand = brands[brandIndex];
    const fallbackPhotos: PhotoItem[] =
      photos.length > 0
        ? photos.map((p) => ({ url: p.url, tag: p.tag }))
        : TAG_OPTIONS.map((tag) => ({
            url: `https://picsum.photos/id/${Math.floor(Math.random() * 200) + 100}/300/300`,
            tag,
          }));

    const newObs: Observation = {
      id: `o${Date.now()}`,
      brandId: selectedBrand.id,
      brandName: selectedBrand.name,
      storeName: storeName.trim(),
      region: region.trim() || '未知',
      photos: fallbackPhotos,
      interviewSummary,
      userQuotes,
      scores: { sellingPoint, visual, serviceExperience },
      notes,
      createdAt: new Date().toISOString().split('T')[0],
    };
    addObservation(newObs);
    console.info('[ObservationAdd] Created:', newObs.id, 'photos:', newObs.photos.length);
    Taro.showToast({ title: '保存成功', icon: 'success' });
    setTimeout(() => Taro.navigateBack(), 1500);
  };

  const adjustScore = (setter: React.Dispatch<React.SetStateAction<number>>, delta: number, current: number) => {
    const next = current + delta;
    if (next >= 1 && next <= 10) setter(next);
  };

  return (
    <View className={styles.page}>
      <View className={styles.formSection}>
        <View className={styles.formCard}>
          <Text className={styles.formLabel}>选择品牌<Text className={styles.formRequired}>*</Text></Text>
          <Picker mode='selector' range={brandNames} value={brandIndex} onChange={(e) => setBrandIndex(Number(e.detail.value))}>
            <View className={styles.pickerRow}>
              <View className={styles.pickerBtn}>
                <Text className={styles.pickerValue}>{brandNames[brandIndex] || '请选择品牌'}</Text>
              </View>
            </View>
          </Picker>
        </View>

        <View className={styles.formCard}>
          <Text className={styles.formLabel}>门店名称<Text className={styles.formRequired}>*</Text></Text>
          <Input className={styles.formInput} value={storeName} onInput={(e) => setStoreName(e.detail.value)} placeholder='如：银泰百货西湖店' />
        </View>

        <View className={styles.formCard}>
          <Text className={styles.formLabel}>地区</Text>
          <Input className={styles.formInput} value={region} onInput={(e) => setRegion(e.detail.value)} placeholder='如：杭州' />
        </View>

        <View className={styles.formCard}>
          <Text className={styles.formLabel}>拍摄照片</Text>
          <View className={styles.photoGrid}>
            {photos.map((photo) => (
              <View key={photo.localId} className={styles.photoItem}>
                <Image className={styles.photoImage} src={photo.url} mode='aspectFill' />
                <View className={styles.photoRemove} onClick={() => handlePhotoRemove(photo.localId)}>
                  <Text className={styles.photoRemoveText}>×</Text>
                </View>
                <View className={styles.photoTagBar}>
                  {TAG_OPTIONS.map((tag) => (
                    <View
                      key={tag}
                      className={classnames(
                        styles.photoTagOption,
                        photo.tag === tag && styles.photoTagOptionActive
                      )}
                      onClick={() => handlePhotoTagChange(photo.localId, tag)}
                    >
                      <Text>{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
            {photos.length < 9 && (
              <View className={styles.photoAdd} onClick={handleChooseImages}>
                <Text className={styles.photoAddText}>+</Text>
                <Text className={styles.photoAddLabel}>拍照/相册</Text>
              </View>
            )}
          </View>
          <Text className={styles.photoHint}>每张照片点击下方标签可切换（货架/陈列/海报）</Text>
        </View>

        <View className={styles.formCard}>
          <Text className={styles.formLabel}>访谈摘要</Text>
          <Textarea className={styles.formTextarea} value={interviewSummary} onInput={(e) => setInterviewSummary(e.detail.value)} placeholder='记录访谈核心发现' />
        </View>

        <View className={styles.formCard}>
          <Text className={styles.formLabel}>用户原话</Text>
          <View className={styles.quoteInputRow}>
            <Input className={styles.quoteInput} value={quoteInput} onInput={(e) => setQuoteInput(e.detail.value)} placeholder='输入用户原话' />
            <View className={styles.addQuoteBtn} onClick={addQuote}>
              <Text className={styles.addQuoteBtnText}>+</Text>
            </View>
          </View>
          <View className={styles.quoteList}>
            {userQuotes.map((q, i) => (
              <View key={i} className={styles.quoteItem} onClick={() => removeQuote(i)}>
                <Text className={styles.quoteText}>"{q}"</Text>
                <Text className={styles.quoteRemove}>×</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.formCard}>
          <Text className={styles.formLabel}>评分 (1-10)</Text>
          <View className={styles.scoreRow}>
            <Text className={styles.scoreLabel}>卖点</Text>
            <View className={styles.scoreControl}>
              <View className={styles.scoreBtn} onClick={() => adjustScore(setSellingPoint, -1, sellingPoint)}>
                <Text>-</Text>
              </View>
              <Text className={styles.scoreValue}>{sellingPoint}</Text>
              <View className={styles.scoreBtn} onClick={() => adjustScore(setSellingPoint, 1, sellingPoint)}>
                <Text>+</Text>
              </View>
            </View>
          </View>
          <View className={styles.scoreRow}>
            <Text className={styles.scoreLabel}>视觉</Text>
            <View className={styles.scoreControl}>
              <View className={styles.scoreBtn} onClick={() => adjustScore(setVisual, -1, visual)}>
                <Text>-</Text>
              </View>
              <Text className={styles.scoreValue}>{visual}</Text>
              <View className={styles.scoreBtn} onClick={() => adjustScore(setVisual, 1, visual)}>
                <Text>+</Text>
              </View>
            </View>
          </View>
          <View className={styles.scoreRow}>
            <Text className={styles.scoreLabel}>服务体验</Text>
            <View className={styles.scoreControl}>
              <View className={styles.scoreBtn} onClick={() => adjustScore(setServiceExperience, -1, serviceExperience)}>
                <Text>-</Text>
              </View>
              <Text className={styles.scoreValue}>{serviceExperience}</Text>
              <View className={styles.scoreBtn} onClick={() => adjustScore(setServiceExperience, 1, serviceExperience)}>
                <Text>+</Text>
              </View>
            </View>
          </View>
        </View>

        <View className={styles.formCard}>
          <Text className={styles.formLabel}>备注</Text>
          <Textarea className={styles.formTextarea} value={notes} onInput={(e) => setNotes(e.detail.value)} placeholder='其他补充信息' />
        </View>
      </View>

      <View className={styles.bottomBar}>
        <View className={styles.cancelBtn} onClick={() => Taro.navigateBack()}>
          <Text>取消</Text>
        </View>
        <View className={styles.saveBtn} onClick={handleSave}>
          <Text>保存记录</Text>
        </View>
      </View>
    </View>
  );
};

export default ObservationAddPage;
