import { Observation } from '@/types/observation';

export const mockObservations: Observation[] = [
  {
    id: 'o1',
    brandId: 'b1',
    brandName: '花西子',
    storeName: '银泰百货西湖店',
    region: '杭州',
    photos: [
      { url: 'https://picsum.photos/id/103/300/300', tag: '货架' },
      { url: 'https://picsum.photos/id/220/300/300', tag: '陈列' },
      { url: 'https://picsum.photos/id/225/300/300', tag: '海报' }
    ],
    interviewSummary: '年轻女性用户对花西子的国风设计非常认可，认为产品颜值高、送礼有面子。但部分用户反映蜜粉饼容易碎，携带不便。',
    userQuotes: [
      '包装真的太好看了，送闺蜜她超喜欢',
      '蜜粉饼用着细腻，但放包里容易碎',
      '旗舰店体验很好，柜姐会帮忙试妆'
    ],
    scores: { sellingPoint: 8, visual: 9, serviceExperience: 7 },
    notes: '专柜人流量中等，周末客流明显增加',
    createdAt: '2025-06-01'
  },
  {
    id: 'o2',
    brandId: 'b2',
    brandName: '元气森林',
    storeName: '全家便利店南京东路店',
    region: '上海',
    photos: [
      { url: 'https://picsum.photos/id/119/300/300', tag: '货架' },
      { url: 'https://picsum.photos/id/312/300/300', tag: '陈列' }
    ],
    interviewSummary: '便利店中元气森林货架位置醒目，通常放在饮料区第一排。消费者多为20-35岁年轻群体，0糖概念认知度高。',
    userQuotes: [
      '减肥期唯一能喝的快乐水',
      '白桃味最好喝，其他一般',
      '比可乐贵一点但更健康'
    ],
    scores: { sellingPoint: 9, visual: 7, serviceExperience: 5 },
    notes: '货架占比约15%，竞品农夫山泉占比更大',
    createdAt: '2025-06-02'
  },
  {
    id: 'o3',
    brandId: 'b3',
    brandName: '三顿半',
    storeName: '三顿半线下概念店',
    region: '上海',
    photos: [
      { url: 'https://picsum.photos/id/225/300/300', tag: '陈列' },
      { url: 'https://picsum.photos/id/230/300/300', tag: '海报' }
    ],
    interviewSummary: '概念店设计感极强，吸引大量打卡拍照用户。产品体验区设计精巧，但购买转化率需关注。',
    userQuotes: [
      '拍照特别出片，但咖啡味道还行吧',
      '1号最好喝，3号太苦了',
      '出差必备，冷水也能冲'
    ],
    scores: { sellingPoint: 8, visual: 10, serviceExperience: 8 },
    notes: '概念店客流以打卡为主，实际购买比例约30%',
    createdAt: '2025-06-03'
  },
  {
    id: 'o4',
    brandId: 'b4',
    brandName: '喜茶',
    storeName: '喜茶杭州嘉里中心店',
    region: '杭州',
    photos: [
      { url: 'https://picsum.photos/id/250/300/300', tag: '货架' },
      { url: 'https://picsum.photos/id/580/300/300', tag: '海报' }
    ],
    interviewSummary: '门店排队情况明显，高峰期等待15-25分钟。多肉葡萄复购率最高，新品推广力度大。',
    userQuotes: [
      '多肉葡萄yyds，每周必喝',
      '排队太久了，有时改点外卖',
      '新品经常踩雷，还是经典好喝'
    ],
    scores: { sellingPoint: 7, visual: 8, serviceExperience: 6 },
    notes: '工作日午间客流最大，建议优化出杯速度',
    createdAt: '2025-06-04'
  },
  {
    id: 'o5',
    brandId: 'b5',
    brandName: '完美日记',
    storeName: '完美日记银泰店',
    region: '杭州',
    photos: [
      { url: 'https://picsum.photos/id/220/300/300', tag: '货架' },
      { url: 'https://picsum.photos/id/103/300/300', tag: '陈列' }
    ],
    interviewSummary: '线下门店体验感一般，产品丰富但试用装管理不佳。线上声量远大于线下。',
    userQuotes: [
      '线上买更便宜，线下就看看色号',
      '动物眼影盘确实好看，但飞粉',
      '粉底液性价比很高'
    ],
    scores: { sellingPoint: 6, visual: 7, serviceExperience: 5 },
    notes: '线下客流偏少，店员推荐不够积极',
    createdAt: '2025-06-05'
  },
  {
    id: 'o6',
    brandId: 'b6',
    brandName: '钟薛高',
    storeName: '盒马鲜生上海湾店',
    region: '上海',
    photos: [
      { url: 'https://picsum.photos/id/292/300/300', tag: '货架' },
      { url: 'https://picsum.photos/id/312/300/300', tag: '陈列' }
    ],
    interviewSummary: '超市冰柜中钟薛高陈列面积较小，价格标签醒目。消费者对价格敏感，复购意愿偏低。',
    userQuotes: [
      '好吃是好吃，但太贵了',
      '买来尝鲜可以，不会经常买',
      '瓦片造型很特别，小朋友喜欢'
    ],
    scores: { sellingPoint: 7, visual: 8, serviceExperience: 4 },
    notes: '冰柜位置偏角落，与梦龙等竞品相比曝光不足',
    createdAt: '2025-06-06'
  },
  {
    id: 'o7',
    brandId: 'b9',
    brandName: '泡泡玛特',
    storeName: '泡泡玛特杭州大厦店',
    region: '杭州',
    photos: [
      { url: 'https://picsum.photos/id/230/300/300', tag: '陈列' },
      { url: 'https://picsum.photos/id/250/300/300', tag: '海报' },
      { url: 'https://picsum.photos/id/225/300/300', tag: '货架' }
    ],
    interviewSummary: '门店客流旺盛，抽盒机区人气最高。用户粘性强，部分用户有收藏癖好。限量款黄牛问题需关注。',
    userQuotes: [
      '已经集齐了MOLLY全系列',
      '抽到隐藏款超开心',
      '最近出的联名款不好看',
      '线上抽盒体验不好，还是线下爽'
    ],
    scores: { sellingPoint: 8, visual: 9, serviceExperience: 8 },
    notes: '周末客流是工作日3倍，限量发售日排队超1小时',
    createdAt: '2025-06-07'
  },
  {
    id: 'o8',
    brandId: 'b10',
    brandName: '蔚来汽车',
    storeName: '蔚来中心杭州西湖店',
    region: '杭州',
    photos: [
      { url: 'https://picsum.photos/id/1/300/300', tag: '陈列' },
      { url: 'https://picsum.photos/id/2/300/300', tag: '海报' }
    ],
    interviewSummary: '蔚来中心打造生活方式空间，非传统4S店体验。用户社群活跃，换电体验是核心卖点。',
    userQuotes: [
      '换电3分钟就满电，比加油还快',
      '社区活动很丰富，交到了不少朋友',
      '车机系统很智能，就是偶尔会卡',
      '保养免费很省心'
    ],
    scores: { sellingPoint: 9, visual: 9, serviceExperience: 10 },
    notes: '换电站覆盖密度是核心痛点，三四线城市覆盖不足',
    createdAt: '2025-06-08'
  },
  {
    id: 'o9',
    brandId: 'b7',
    brandName: '小仙炖',
    storeName: '小仙炖北京SKP专柜',
    region: '北京',
    photos: [
      { url: 'https://picsum.photos/id/580/300/300', tag: '陈列' },
      { url: 'https://picsum.photos/id/598/300/300', tag: '货架' }
    ],
    interviewSummary: '高端商场专柜形象好，但品类单一。礼品属性强，自用消费偏低。冷链配送体验良好。',
    userQuotes: [
      '送礼非常有面子，包装好看',
      '自己吃的话觉得有点贵',
      '每周配送很方便，新鲜度好'
    ],
    scores: { sellingPoint: 7, visual: 9, serviceExperience: 8 },
    notes: '节假日前销量明显增加，日常销量平稳',
    createdAt: '2025-06-09'
  },
  {
    id: 'o10',
    brandId: 'b8',
    brandName: '自嗨锅',
    storeName: '永辉超市南京店',
    region: '南京',
    photos: [
      { url: 'https://picsum.photos/id/312/300/300', tag: '货架' },
      { url: 'https://picsum.photos/id/292/300/300', tag: '陈列' }
    ],
    interviewSummary: '超市货架上自热食品品类丰富，自嗨锅占据领先位置。消费者多为独居年轻人和户外爱好者。',
    userQuotes: [
      '加班神器，放办公室备着',
      '味道还不错，但量有点少',
      '出门露营必带，方便'
    ],
    scores: { sellingPoint: 7, visual: 6, serviceExperience: 5 },
    notes: '竞品海底捞自热火锅增长快，需关注',
    createdAt: '2025-06-10'
  }
];
