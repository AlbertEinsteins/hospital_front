const menus = [
  {
    icon: 'home',
    name: '入院管理',
    children: [
      {
        icon: '',
        name: '入院登记',
        url: '/enroll'
      },
      {
        icon: '',
        name: '住院查询',
        url: '/enroll_search'
      }
    ]
  },
  {
    icon: 'assignment_return',
    name: '出院管理',
    children: [
      { icon: '', name: '出院登记', url: '/out' },
      { icon: '', name: '出院查询', url: '/out_search' },
      { icon: '', name: '转院(转病房)', url: '/test5' }
    ]
  },
  {
    icon: 'dashboard',
    name: '病房管理',
    children: [
      { icon: '', name: '新置病房', url: '/ward_add' },
      { icon: '', name: '病房价位调整', url: '/ward_adjust' }
    ]
  },
  {
    icon: 'paid',
    name: '结算中心',
    children: [
      { name: '费用缴纳', url: '/test8', icon: '' },
      { name: '缴费记录', url: '/test9', icon: '' },
      { name: '费用查询', url: '/test10', icon: '' }
    ]
  },
  {
    name: '统计中心',
    icon: 'analytics',
    children: [
      { icon: '', name: '病人统计', url: '/test11' },
      { icon: '', name: '病房统计', url: '/test12' }
    ]
  },
  {
    name: '药品管理',
    icon: 'medication',
    children: [
      { icon: '', name: '药品入库', url: '/test13' },
      { icon: '', name: '药品发放', url: '/test14' },
      { icon: '', name: '退药处理', url: '/test15' },
      { icon: '', name: '入库查询', url: '/test16' },
      { icon: '', name: '库存查询', url: '/test17' }
    ]
  },
  {
    name: '用户管理',
    icon: 'groups',
    children: [
      { icon: '', name: '用户注册', url: '/test18' },
      { icon: '', name: '用户查询', url: '/test19' }
    ]
  },
  {
    name: '医生管理',
    icon: 'account_box',
    children: [
      { icon: '', name: '医生录入', url: '/doc_enroll' },
      { icon: '', name: '医生查询', url: '/doc_search' }
    ]
  },
  {
    name: '系统配置',
    icon: 'settings_suggest',
    children: [
      { icon: '', name: '运行日志', url: '/test22' }
    ]
  }
]
export default menus
