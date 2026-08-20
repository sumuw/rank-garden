---
title: "GitHub 每日趋势榜 2026-08-20"
description: "今日 GitHub Trending 主要集中在 AI Agent、skills 工作流、本地推理和开发自动化。"
category: "github"
period: "daily"
date: "2026-08-20"
dataFile: "data/rankings/github/daily/2026-08-20.json"
tags: ["GitHub", "开源", "趋势"]
---

## 今日概览

2026-08-20 GitHub Trending 共收录 13 个项目，Python、TypeScript、Shell 和 Rust 是今天出现较多的语言。榜首仍由 AI 视频生成项目占据，榜单前半部分则明显集中在 Agent 记忆、Agent skills、多 Agent harness 和本地 LLM 推理。

今天的另一个信号是“把知识和流程结构化给 Agent 使用”：网络安全 skills、工程 skills 和开发方法论框架同时进入榜单，说明开发者正在把可复用工作流从文档迁移到更容易被工具调用的形态。

非 AI 项目仍有清晰位置，包括交易引擎、自托管照片管理和 OpenStreetMap 地图绘制工具。这些项目说明 GitHub Trending 并不只由 AI 主题驱动，高性能基础设施和个人生产力工具仍有稳定关注。

## 重点项目

### 1. harry0703/MoneyPrinterTurbo

- 地址：https://github.com/harry0703/MoneyPrinterTurbo
- 简介：利用 AI 大模型和自动化工作流，根据主题或关键词一键生成高清短视频。Generate HD short videos from a topic or keyword with an automated AI workflow.
- 语言：Python
- 今日新增：2,221 stars today
- 标签：AI、自动化、LLM、Python

这个项目把大模型和自动化工作流用于短视频生成，入口是主题或关键词，使用门槛较低。它继续位居榜首，说明开发者对 AI 内容生产工具仍保持关注。

### 2. volcengine/OpenViking

- 地址：https://github.com/volcengine/OpenViking
- 简介：Self-evolving Context Database for AI Agents. Unify Agent Memory, Knowledge RAG and Skills.
- 语言：Python
- 今日新增：803 stars today
- 标签：AI、Agent、数据库、RAG、Python

OpenViking 把 Agent 记忆、知识 RAG 和技能统一到上下文数据库方向，定位清晰。它的增长反映出 Agent 应用正在从单次调用转向更长期的上下文管理。

### 3. chaitanyagiri/munder-difflin

- 地址：https://github.com/chaitanyagiri/munder-difflin
- 简介：local multi-agent harness
- 语言：TypeScript
- 今日新增：797 stars today
- 标签：Agent、自动化、开发工具、TypeScript

这个项目聚焦本地多 Agent harness，适合观察开发者如何组织和运行多 Agent 流程。它以较小体量获得高日增，说明本地化 Agent 编排仍有明显需求。

### 4. mukul975/Anthropic-Cybersecurity-Skills

- 地址：https://github.com/mukul975/Anthropic-Cybersecurity-Skills
- 简介：817 structured cybersecurity skills for AI agents · Mapped to 6 frameworks: MITRE ATT&CK, NIST CSF 2.0, MITRE ATLAS, D3FEND, NIST AI RMF & MITRE F3 (Fight Fraud) · agentskills.io standard · Works with Claude Code, GitHub Copilot, Codex CLI, Cursor, Gemini CLI & 20+ platforms · 29 security domains · Apache 2.0
- 语言：Python
- 今日新增：767 stars today
- 标签：安全、AI、Agent、自动化、Python

这个仓库把网络安全技能结构化并映射到多个安全框架，信息组织方式比较适合 Agent 调用。它值得关注的地方在于把安全知识从文档形态推向可组合的技能形态。

### 5. nautechsystems/nautilus_trader

- 地址：https://github.com/nautechsystems/nautilus_trader
- 简介：Production-grade Rust-native trading engine with deterministic event-driven architecture
- 语言：Rust
- 今日新增：79 stars today
- 标签：基础设施、Rust、自动化、数据分析

Nautilus Trader 面向交易系统，强调 Rust 原生和确定性的事件驱动架构。它在 AI 项目密集的榜单中上榜，说明高性能领域基础设施仍有稳定关注。

### 6. mattpocock/skills

- 地址：https://github.com/mattpocock/skills
- 简介：Skills for Real Engineers. Straight from my .agents directory.
- 语言：Shell
- 今日新增：1,214 stars today
- 标签：开发工具、自动化、生产力、Shell

这个仓库直接公开工程实践中的 skills 内容，适合观察开发者如何沉淀可复用工作流。它的高关注度说明 agent skills 已经从概念讨论进入实际组织和复用阶段。

### 7. obra/superpowers

- 地址：https://github.com/obra/superpowers
- 简介：An agentic skills framework & software development methodology that works.
- 语言：Shell
- 今日新增：514 stars today
- 标签：Agent、开发工具、自动化、Shell

Superpowers 同时覆盖 skills 框架和软件开发方法论，关注点不只是工具本身，也包括协作流程。它继续上榜，反映出开发者在寻找更稳定的 Agent 开发规范。

### 8. jundot/omlx

- 地址：https://github.com/jundot/omlx
- 简介：LLM inference server with continuous batching & SSD caching for Apple Silicon — managed from the macOS menu bar
- 语言：Python
- 今日新增：467 stars today
- 标签：AI、LLM、基础设施、Python

omlx 面向 Apple Silicon 上的 LLM 推理服务，并突出连续批处理和 SSD 缓存。它说明本地推理的体验优化仍是开发者关注的具体方向。

### 9. santifer/career-ops

- 地址：https://github.com/santifer/career-ops
- 简介：Open-source AI job search: scan job portals, evaluate listings with a structured A-F rubric into a 1.0-5.0 score, tailor your CV, track applications — runs locally in your AI coding CLI (Claude Code, Codex, OpenCode, Antigravity…)
- 语言：JavaScript
- 今日新增：193 stars today
- 标签：AI、自动化、生产力、JavaScript

career-ops 把职位扫描、评分、简历调整和申请跟踪放到本地 AI 编码 CLI 中。它把 AI 自动化落在求职流程这种高频个人场景上，应用边界比较具体。

### 10. immich-app/immich

- 地址：https://github.com/immich-app/immich
- 简介：High performance self-hosted photo and video management solution.
- 语言：TypeScript
- 今日新增：137 stars today
- 标签：开源、生产力、前端、TypeScript

Immich 是自托管照片和视频管理方案，长期受到家庭数据管理用户关注。它在今日榜单中代表了非 AI 工具的持续热度，也说明个人数据自主仍有稳定需求。

### 11. amadeusprotocol/node

- 地址：https://github.com/amadeusprotocol/node
- 简介：Unknown
- 语言：Rust
- 今日新增：1,415 stars today
- 标签：基础设施、Rust、开源

Trending 页面没有展示这个项目的简介，因此只能确认它是 Rust 项目并且今日新增较高。后续值得结合仓库 README 再判断具体技术方向。

### 12. marceloprates/prettymaps

- 地址：https://github.com/marceloprates/prettymaps
- 简介：Draw pretty maps from OpenStreetMap data! Built with osmnx +matplotlib + shapely
- 语言：Python
- 今日新增：58 stars today
- 标签：数据分析、库、Python、开源

prettymaps 使用 OpenStreetMap 数据生成地图，并结合 osmnx、matplotlib 和 shapely。它说明数据可视化和地理数据处理类工具仍能在榜单中获得稳定曝光。

### 13. genlayerlabs/genlayer-project-boilerplate

- 地址：https://github.com/genlayerlabs/genlayer-project-boilerplate
- 简介：Unknown
- 语言：TypeScript
- 今日新增：421 stars today
- 标签：开发工具、框架、TypeScript、开源

Trending 页面没有展示这个项目的简介，因此这里只记录可确认的语言、星标和排名信息。作为 boilerplate 类项目，它更适合作为后续查看仓库文档时的候选入口。

## 观察

- AI 和 Agent 相关项目占据榜单前列，尤其集中在上下文、记忆、skills 和本地编排。
- skills 仓库连续出现，说明“可复用工作流”正在成为开发者组织 Agent 能力的重要方式。
- Python 仍是 AI 与数据处理项目的主要语言，TypeScript 则更多出现在工具和应用层。
- Rust 项目主要落在交易引擎、节点和基础设施方向，和榜单中的应用型 AI 项目形成对照。
