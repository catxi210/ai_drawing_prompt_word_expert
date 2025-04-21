# <p align="center"> 🎨 AI 绘图提示词专家 🚀✨</p>

<p align="center">AI绘图提示词专家使用AI将图片转换成提示词或对图片进行风格修改，提供灵感、优化、翻译等辅助功能，同时支持一键文生图，快速测试提示词效果。</p>

<p align="center"><a href="https://302.ai/tools/imgprompt/" target="blank"><img src="https://file.302.ai/gpt/imgs/github/20250102/72a57c4263944b73bf521830878ae39a.png" /></a></p >

<p align="center"><a href="README_zh.md">中文</a> | <a href="README.md">English</a> | <a href="README_ja.md">日本語</a></p>

![](docs/302_AI_drawing_prompt_word_expert.png)

来自[302.AI](https://302.ai)的[AI 绘图提示词专家](https://302.ai/tools/imgprompt/)的开源版本。你可以直接登录302.AI，零代码零配置使用在线版本。或者对本项目根据自己的需求进行修改，传入302.AI的API KEY，自行部署。

## 界面预览
上传一张图片即可自动根据图片生成提示词，点击生成图片，快速测试提示词效果。同时支持手动输入提示词。
![](docs/302_AI_drawing_prompt_word_expert_screenshot_01.png)

选择风格标签或输入风格描述即可修改图片风格。
![](docs/302_AI_drawing_prompt_word_expert_screenshot_02.png)           

通过上传图片或从示例风格图中选择一张作为参考图，然后根据该参考图对操作图进行风格修改。
![](docs/302_AI_drawing_prompt_word_expert_screenshot_03.png)        

 
## 项目特性
### 🖼️ 图片分析
支持自动分析图片内容并生成精准提示词。
### 🎨 风格转换
支持多种艺术风格的一键转换和自定义风格描述。
### 🔄 参考图复刻
支持上传参考图进行风格迁移。
### 📝 辅助功能
提供AI优化、翻译、灵感等辅助功能。
### 🌍 多语言支持
  - 中文界面
  - English Interface
  - 日本語インターフェース

## 🚩 未来更新计划
- [ ] 新增更多预设艺术风格
- [ ] 支持批量图片处理


## 🛠️ 技术栈

- **框架**: Next.js 14
- **语言**: TypeScript
- **样式**: TailwindCSS
- **UI组件**: Radix UI
- **状态管理**: Jotai
- **表单处理**: React Hook Form
- **HTTP客户端**: ky
- **国际化**: next-intl
- **主题**: next-themes
- **代码规范**: ESLint, Prettier
- **提交规范**: Husky, Commitlint

## 开发&部署
1. 克隆项目
```bash
git clone https://github.com/302ai/302_ai_drawing_prompt_word_expert
cd 302_ai_drawing_prompt_word_expert
```

2. 安装依赖
```bash
pnpm install
```

3. 环境配置
```bash
cp .env.example .env.local
```
根据需要修改 `.env.local` 中的环境变量。

4. 启动开发服务器
```bash
pnpm dev
```

5. 构建生产版本
```bash
pnpm build
pnpm start
```

## ✨ 302.AI介绍 ✨
[302.AI](https://302.ai)是一个按需付费的AI应用平台，为用户解决AI用于实践的最后一公里问题。
1. 🧠 集合了最新最全的AI能力和品牌，包括但不限于语言模型、图像模型、声音模型、视频模型。
2. 🚀 在基础模型上进行深度应用开发，我们开发真正的AI产品，而不是简单的对话机器人
3. 💰 零月费，所有功能按需付费，全面开放，做到真正的门槛低，上限高。
4. 🛠 功能强大的管理后台，面向团队和中小企业，一人管理，多人使用。
5. 🔗 所有AI能力均提供API接入，所有工具开源可自行定制（进行中）。
6. 💡 强大的开发团队，每周推出2-3个新应用，产品每日更新。有兴趣加入的开发者也欢迎联系我们
