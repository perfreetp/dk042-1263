export default defineAppConfig({
  pages: [
    'pages/brands/index',
    'pages/research/index',
    'pages/assets/index',
    'pages/conclusion/index',
    'pages/brand-detail/index',
    'pages/brand-add/index',
    'pages/observation-add/index',
    'pages/compare/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#FFFFFF',
    navigationBarTitleText: '品牌研究',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#8E95B2',
    selectedColor: '#4C6EF5',
    backgroundColor: '#FFFFFF',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/brands/index',
        text: '品牌库'
      },
      {
        pagePath: 'pages/research/index',
        text: '调研'
      },
      {
        pagePath: 'pages/assets/index',
        text: '素材夹'
      },
      {
        pagePath: 'pages/conclusion/index',
        text: '结论'
      }
    ]
  }
})
