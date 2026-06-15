import Taro, { useDidShow, useDidHide } from '@tarojs/taro';
import React, { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import './app.scss';

const STORAGE_KEY = {
  BRANDS: 'brand_research_brands',
  OBSERVATIONS: 'brand_research_observations',
  CONCLUSIONS: 'brand_research_conclusions',
};

function PersistBrands() {
  const brands = useAppStore((state) => state.brands);
  useEffect(() => {
    try {
      Taro.setStorageSync(STORAGE_KEY.BRANDS, JSON.stringify(brands));
    } catch (e) {
      console.error('[Persist] Failed to persist brands:', e);
    }
  }, [brands]);
  return null;
}

function PersistObservations() {
  const observations = useAppStore((state) => state.observations);
  useEffect(() => {
    try {
      Taro.setStorageSync(STORAGE_KEY.OBSERVATIONS, JSON.stringify(observations));
    } catch (e) {
      console.error('[Persist] Failed to persist observations:', e);
    }
  }, [observations]);
  return null;
}

function PersistConclusions() {
  const conclusions = useAppStore((state) => state.conclusions);
  useEffect(() => {
    try {
      Taro.setStorageSync(STORAGE_KEY.CONCLUSIONS, JSON.stringify(conclusions));
    } catch (e) {
      console.error('[Persist] Failed to persist conclusions:', e);
    }
  }, [conclusions]);
  return null;
}

function App(props) {
  useDidShow(() => {});
  useDidHide(() => {});

  return (
    <>
      <PersistBrands />
      <PersistObservations />
      <PersistConclusions />
      {props.children}
    </>
  );
}

export default App;
