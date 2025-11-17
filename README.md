# Redis Dict 字典可视化演示系统

> 交互式教育平台，深入理解Redis字典数据结构的工作原理

## 🎯 项目简介

这是一个专注于Redis字典（Dict）数据结构的可视化演示系统，通过动画和交互式操作帮助用户理解：

- ✨ 哈希表的实现原理
- 🔄 渐进式Rehash机制
- ⚡ 哈希冲突解决策略
- 📊 性能分析与优化
- 🔐 哈希函数对比

## 🚀 快速开始

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

## 🏗️ 项目结构

```
redis-dict-animation/
├── src/
│   ├── types/           # 类型定义
│   ├── core/            # 核心逻辑（Dict实现、哈希函数）
│   ├── components/      # React组件
│   │   ├── visualization/  # 可视化组件
│   │   ├── controls/       # 控制面板
│   │   └── common/         # 通用组件
│   ├── hooks/           # 自定义Hooks
│   ├── utils/           # 工具函数
│   ├── styles/          # 全局样式
│   ├── App.tsx          # 主应用组件
│   └── main.tsx         # 应用入口
├── public/              # 静态资源
└── ...配置文件
```

## 🎨 核心功能

### 1. 哈希表可视化
- 实时显示哈希桶状态
- 哈希冲突链可视化
- 负载因子动态监控

### 2. 渐进式Rehash演示
- 双哈希表切换动画
- 节点迁移过程展示
- Rehash进度实时追踪

### 3. 多种哈希函数对比
- SipHash (Redis默认)
- DJB2
- FNV-1a
- MurmurHash3

### 4. 性能分析工具
- 冲突率统计
- 平均查找长度计算
- 内存使用监控
- 操作吞吐量测试

### 5. 交互式操作
- 键值对的增删改查
- 自定义Rehash参数
- 工作负载模拟器
- A/B测试模式

## 📚 技术栈

- **TypeScript**: 类型安全的开发体验
- **React**: 组件化UI框架
- **D3.js**: 数据驱动的可视化
- **Vite**: 快速的构建工具
- **CSS Modules**: 样式隔离

## 🎓 教育价值

本项目适合：
- Redis学习者理解底层实现
- 数据结构爱好者学习哈希表
- 性能优化工程师分析哈希策略
- 教师进行算法可视化教学

## 📖 相关资源

- [Redis源码](https://github.com/redis/redis)
- [Redis设计与实现](http://redisbook.com/)
- [哈希表原理](https://en.wikipedia.org/wiki/Hash_table)

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交Issue和Pull Request！
