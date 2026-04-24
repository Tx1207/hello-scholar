# 常见 Skill 反模式

本文档列出创建 Claude Skills 时常见的错误与反模式。

## 反模式 1：Description 过于模糊

问题表现：
- 没有具体 trigger phrases
- 用第二人称
- 看不出 skill 具体做什么

修复思路：
- 写具体触发短语
- 改成第三人称
- 指明实际 use cases

## 反模式 2：通篇第二人称

问题表现：
- 大量 `You should` / `You need`
- 不符合 imperative form

修复思路：
- 改成动词开头的祈使句

## 反模式 3：所有内容都堆在一个文件

问题表现：
- `SKILL.md` 超长
- 细节、FAQ、示例、排错全塞在一起

修复思路：
- 用 progressive disclosure
- 把细节放到 `references/`
- 把示例放到 `examples/`

## 反模式 4：缺少必填字段

问题表现：
- frontmatter 缺 `description`
- skill 无法被正确触发

## 反模式 5：引用失效

问题表现：
- `SKILL.md` 提到的文件不存在
- examples / references 路径写错

## 反模式 6：风格不一致

问题表现：
- 有些段落是 imperative，有些还是第二人称

## 反模式 7：Description 过长

问题表现：
- trigger phrases 太多
- 描述冗长、失焦

## 反模式 8：没有 examples

问题表现：
- 只有理论，没有可操作样例

## 反模式 9：主观营销式语言

问题表现：
- `really great`
- `awesome`
- `you'll love it`

应改成客观、事实型表达。

## 反模式 10：无效 YAML

问题表现：
- frontmatter 语法损坏
- skill 直接无法加载

## 快速检查清单

- [ ] Description 不模糊
- [ ] 使用第三人称
- [ ] `SKILL.md` 不臃肿
- [ ] 所有引用文件存在
- [ ] examples 可用
- [ ] 没有主观营销语言
- [ ] YAML 合法
