import { Conclusion } from '@/types/conclusion';

export const mockConclusions: Conclusion[] = [
  {
    id: 'c1',
    title: '美妆品牌华东区竞品对比',
    content: '花西子在视觉设计上遥遥领先（9分），但服务体验仍有提升空间（7分）。完美日记整体偏弱，线下门店体验差距明显。建议加强终端导购培训，优化试用装管理。',
    brandIds: ['b1', 'b5'],
    comparisonData: [
      { brandId: 'b1', brandName: '花西子', sellingPoint: 8, visual: 9, serviceExperience: 7, priceRange: '¥89-¥399' },
      { brandId: 'b5', brandName: '完美日记', sellingPoint: 6, visual: 7, serviceExperience: 5, priceRange: '¥39-¥169' }
    ],
    createdAt: '2025-06-10',
    sharedWith: ['张经理', '李设计师'],
    viewedCount: 2
  },
  {
    id: 'c2',
    title: '饮料品类便利店渠道观察',
    content: '元气森林0糖概念认知度极高（9分），但视觉陈列被农夫山泉压制。建议加强终端货架谈判，争取更优陈列位置。自嗨锅在自热食品中占据领先，但竞品增速快。',
    brandIds: ['b2', 'b8'],
    comparisonData: [
      { brandId: 'b2', brandName: '元气森林', sellingPoint: 9, visual: 7, serviceExperience: 5, priceRange: '¥5-¥7' },
      { brandId: 'b8', brandName: '自嗨锅', sellingPoint: 7, visual: 6, serviceExperience: 5, priceRange: '¥15-¥39' }
    ],
    createdAt: '2025-06-12',
    sharedWith: ['王总监'],
    viewedCount: 1
  },
  {
    id: 'c3',
    title: '新消费品牌线下体验力对比',
    content: '蔚来汽车服务体验得分最高（10分），用户社群运营成熟。泡泡玛特视觉+体验双高，IP效应显著。三顿半视觉设计最突出（10分），但购买转化需关注。喜茶排队问题影响体验。',
    brandIds: ['b10', 'b9', 'b3', 'b4'],
    comparisonData: [
      { brandId: 'b10', brandName: '蔚来汽车', sellingPoint: 9, visual: 9, serviceExperience: 10, priceRange: '¥29.8万-¥59.8万' },
      { brandId: 'b9', brandName: '泡泡玛特', sellingPoint: 8, visual: 9, serviceExperience: 8, priceRange: '¥59-¥899' },
      { brandId: 'b3', brandName: '三顿半', sellingPoint: 8, visual: 10, serviceExperience: 8, priceRange: '¥5-¥12/颗' },
      { brandId: 'b4', brandName: '喜茶', sellingPoint: 7, visual: 8, serviceExperience: 6, priceRange: '¥15-¥35' }
    ],
    createdAt: '2025-06-14',
    sharedWith: ['张经理', '王总监', '李设计师'],
    viewedCount: 3
  },
  {
    id: 'c4',
    title: '高端消费品牌送礼场景分析',
    content: '送礼场景中小仙炖和钟薛高包装设计突出，但价格敏感度高。花西子因国风定位送礼属性强。建议在节日营销中突出礼品属性。',
    brandIds: ['b7', 'b6', 'b1'],
    comparisonData: [
      { brandId: 'b7', brandName: '小仙炖', sellingPoint: 7, visual: 9, serviceExperience: 8, priceRange: '¥199-¥2999' },
      { brandId: 'b6', brandName: '钟薛高', sellingPoint: 7, visual: 8, serviceExperience: 4, priceRange: '¥12-¥66' },
      { brandId: 'b1', brandName: '花西子', sellingPoint: 8, visual: 9, serviceExperience: 7, priceRange: '¥89-¥399' }
    ],
    createdAt: '2025-06-15',
    sharedWith: ['张经理'],
    viewedCount: 1
  }
];
