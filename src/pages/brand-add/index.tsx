import React, { useState } from 'react';
import { View, Text, Input, Textarea } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useAppStore } from '@/store/useAppStore';
import { Brand } from '@/types/brand';
import styles from './index.module.scss';

const BrandAddPage: React.FC = () => {
  const addBrand = useAppStore((state) => state.addBrand);
  const [name, setName] = useState('');
  const [positioning, setPositioning] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [packagingFeatures, setPackagingFeatures] = useState('');
  const [category, setCategory] = useState('');
  const [mainProducts, setMainProducts] = useState<string[]>([]);
  const [channels, setChannels] = useState<string[]>([]);
  const [promotionSlogans, setPromotionSlogans] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [channelInput, setChannelInput] = useState('');
  const [sloganInput, setSloganInput] = useState('');

  const addToArray = (arr: string[], setArr: (v: string[]) => void, value: string) => {
    if (value.trim()) {
      setArr([...arr, value.trim()]);
    }
  };

  const removeFromArray = (arr: string[], setArr: (v: string[]) => void, index: number) => {
    setArr(arr.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!name.trim()) {
      Taro.showToast({ title: '请输入品牌名称', icon: 'none' });
      return;
    }
    const newBrand: Brand = {
      id: `b${Date.now()}`,
      name: name.trim(),
      logo: `https://picsum.photos/id/${Math.floor(Math.random() * 200)}/200/200`,
      positioning,
      priceRange,
      mainProducts,
      packagingFeatures,
      channels,
      promotionSlogans,
      category,
      tags: [],
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    addBrand(newBrand);
    console.info('[BrandAdd] Brand created:', newBrand.id);
    Taro.showToast({ title: '创建成功', icon: 'success' });
    setTimeout(() => Taro.navigateBack(), 1500);
  };

  return (
    <View className={styles.page}>
      <View className={styles.formSection}>
        <View className={styles.formCard}>
          <Text className={styles.formLabel}>品牌名称<Text className={styles.formRequired}>*</Text></Text>
          <Input className={styles.formInput} value={name} onInput={(e) => setName(e.detail.value)} placeholder='请输入品牌名称' />
        </View>

        <View className={styles.formCard}>
          <Text className={styles.formLabel}>品牌定位</Text>
          <Input className={styles.formInput} value={positioning} onInput={(e) => setPositioning(e.detail.value)} placeholder='如：高端智能电动汽车品牌' />
        </View>

        <View className={styles.formCard}>
          <Text className={styles.formLabel}>价格带</Text>
          <Input className={styles.formInput} value={priceRange} onInput={(e) => setPriceRange(e.detail.value)} placeholder='如：¥89-¥399' />
        </View>

        <View className={styles.formCard}>
          <Text className={styles.formLabel}>行业分类</Text>
          <Input className={styles.formInput} value={category} onInput={(e) => setCategory(e.detail.value)} placeholder='如：美妆、饮料、茶饮' />
        </View>

        <View className={styles.formCard}>
          <Text className={styles.formLabel}>包装特点</Text>
          <Textarea className={styles.formTextarea} value={packagingFeatures} onInput={(e) => setPackagingFeatures(e.detail.value)} placeholder='描述产品的包装设计特点' />
        </View>

        <View className={styles.formCard}>
          <Text className={styles.formLabel}>主推产品</Text>
          <View className={styles.tagInputRow}>
            <Input className={styles.tagInput} value={tagInput} onInput={(e) => setTagInput(e.detail.value)} placeholder='输入产品名' />
            <View className={styles.addTagBtn} onClick={() => { addToArray(mainProducts, setMainProducts, tagInput); setTagInput(''); }}>
              <Text className={styles.addTagBtnText}>+</Text>
            </View>
          </View>
          <View className={styles.tagList}>
            {mainProducts.map((p, i) => (
              <View key={i} className={styles.tag} onClick={() => removeFromArray(mainProducts, setMainProducts, i)}>
                <Text>{p}</Text>
                <Text className={styles.tagRemove}>×</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.formCard}>
          <Text className={styles.formLabel}>渠道</Text>
          <View className={styles.tagInputRow}>
            <Input className={styles.tagInput} value={channelInput} onInput={(e) => setChannelInput(e.detail.value)} placeholder='输入渠道名' />
            <View className={styles.addTagBtn} onClick={() => { addToArray(channels, setChannels, channelInput); setChannelInput(''); }}>
              <Text className={styles.addTagBtnText}>+</Text>
            </View>
          </View>
          <View className={styles.tagList}>
            {channels.map((c, i) => (
              <View key={i} className={styles.tag} onClick={() => removeFromArray(channels, setChannels, i)}>
                <Text>{c}</Text>
                <Text className={styles.tagRemove}>×</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.formCard}>
          <Text className={styles.formLabel}>促销话术</Text>
          <View className={styles.tagInputRow}>
            <Input className={styles.tagInput} value={sloganInput} onInput={(e) => setSloganInput(e.detail.value)} placeholder='输入话术' />
            <View className={styles.addTagBtn} onClick={() => { addToArray(promotionSlogans, setPromotionSlogans, sloganInput); setSloganInput(''); }}>
              <Text className={styles.addTagBtnText}>+</Text>
            </View>
          </View>
          <View className={styles.tagList}>
            {promotionSlogans.map((s, i) => (
              <View key={i} className={styles.tag} onClick={() => removeFromArray(promotionSlogans, setPromotionSlogans, i)}>
                <Text>{s}</Text>
                <Text className={styles.tagRemove}>×</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View className={styles.bottomBar}>
        <View className={styles.cancelBtn} onClick={() => Taro.navigateBack()}>
          <Text>取消</Text>
        </View>
        <View className={styles.saveBtn} onClick={handleSave}>
          <Text>保存品牌</Text>
        </View>
      </View>
    </View>
  );
};

export default BrandAddPage;
