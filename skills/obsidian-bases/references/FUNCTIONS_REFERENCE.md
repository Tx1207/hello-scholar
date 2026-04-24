# Functions 参考

## 全局函数

| Function | Signature | Description |
|----------|-----------|-------------|
| `date()` | `date(string): date` | 将字符串解析为日期，格式：`YYYY-MM-DD HH:mm:ss` |
| `duration()` | `duration(string): duration` | 解析 duration 字符串 |
| `now()` | `now(): date` | 当前日期和时间 |
| `today()` | `today(): date` | 当前日期（时间为 `00:00:00`） |
| `if()` | `if(condition, trueResult, falseResult?)` | 条件判断 |
| `min()` | `min(n1, n2, ...): number` | 最小值 |
| `max()` | `max(n1, n2, ...): number` | 最大值 |
| `number()` | `number(any): number` | 转成数字 |
| `link()` | `link(path, display?): Link` | 创建链接 |
| `list()` | `list(element): List` | 若不是 list 就包装成 list |
| `file()` | `file(path): file` | 获取 file 对象 |
| `image()` | `image(path): image` | 创建用于渲染的图片 |
| `icon()` | `icon(name): icon` | 通过名称获取 Lucide icon |
| `html()` | `html(string): html` | 按 HTML 渲染 |
| `escapeHTML()` | `escapeHTML(string): string` | 转义 HTML 字符 |

## Any 类型函数

| Function | Signature | Description |
|----------|-----------|-------------|
| `isTruthy()` | `any.isTruthy(): boolean` | 转成布尔值 |
| `isType()` | `any.isType(type): boolean` | 检查类型 |
| `toString()` | `any.toString(): string` | 转成字符串 |

## Date 函数与字段

**字段：** `date.year`、`date.month`、`date.day`、`date.hour`、`date.minute`、`date.second`、`date.millisecond`

| Function | Signature | Description |
|----------|-----------|-------------|
| `date()` | `date.date(): date` | 去掉时间部分 |
| `format()` | `date.format(string): string` | 用 Moment.js 模式格式化 |
| `time()` | `date.time(): string` | 取时间字符串 |
| `relative()` | `date.relative(): string` | 可读的相对时间 |
| `isEmpty()` | `date.isEmpty(): boolean` | 对 date 永远为 false |

## Duration 类型

两个日期相减的结果是 **Duration**，不是 number。Duration 有自己的字段和方法。

**Duration 字段：**

| Field | Type | Description |
|-------|------|-------------|
| `duration.days` | Number | 总天数 |
| `duration.hours` | Number | 总小时数 |
| `duration.minutes` | Number | 总分钟数 |
| `duration.seconds` | Number | 总秒数 |
| `duration.milliseconds` | Number | 总毫秒数 |

**重要：** Duration 不能直接调用 `.round()`、`.floor()`、`.ceil()`。必须先取数值字段，再应用 number 函数。

```yaml
# 正确：先得到数字天数
"(date(due_date) - today()).days"
"(now() - file.ctime).days"

# 正确：对数字结果再 round
"(date(due_date) - today()).days.round(0)"
"(now() - file.ctime).hours.round(0)"
```

## 日期运算

```yaml
# Duration 单位：y/year/years, M/month/months, d/day/days,
#               w/week/weeks, h/hour/hours, m/minute/minutes, s/second/seconds

"date + \"1M\""
"date - \"2h\""
"now() + \"1 day\""
"today() + \"7d\""

"now() - file.ctime"
"(now() - file.ctime).days"
"(now() - file.ctime).hours"

"now() + (duration('1d') * 2)"
```

## String 函数

**字段：** `string.length`

| Function | Signature | Description |
|----------|-----------|-------------|
| `contains()` | `string.contains(value): boolean` | 检查是否包含子串 |
| `containsAll()` | `string.containsAll(...values): boolean` | 是否包含全部子串 |
| `containsAny()` | `string.containsAny(...values): boolean` | 是否包含任一子串 |
| `startsWith()` | `string.startsWith(query): boolean` | 是否以指定内容开头 |
| `endsWith()` | `string.endsWith(query): boolean` | 是否以指定内容结尾 |
| `isEmpty()` | `string.isEmpty(): boolean` | 是否为空或不存在 |
| `lower()` | `string.lower(): string` | 转小写 |
| `title()` | `string.title(): string` | 转 Title Case |
| `trim()` | `string.trim(): string` | 去空白 |
| `replace()` | `string.replace(pattern, replacement): string` | 替换模式 |
| `repeat()` | `string.repeat(count): string` | 重复字符串 |
| `reverse()` | `string.reverse(): string` | 反转 |
| `slice()` | `string.slice(start, end?): string` | 截取子串 |
| `split()` | `string.split(separator, n?): list` | 切分为 list |

## Number 函数

| Function | Signature | Description |
|----------|-----------|-------------|
| `abs()` | `number.abs(): number` | 绝对值 |
| `ceil()` | `number.ceil(): number` | 向上取整 |
| `floor()` | `number.floor(): number` | 向下取整 |
| `round()` | `number.round(digits?): number` | 四舍五入 |
| `toFixed()` | `number.toFixed(precision): string` | 固定小数位表示 |
| `isEmpty()` | `number.isEmpty(): boolean` | 是否不存在 |

## List 函数

**字段：** `list.length`

| Function | Signature | Description |
|----------|-----------|-------------|
| `contains()` | `list.contains(value): boolean` | 是否包含元素 |
| `containsAll()` | `list.containsAll(...values): boolean` | 是否包含全部元素 |
| `containsAny()` | `list.containsAny(...values): boolean` | 是否包含任一元素 |
| `filter()` | `list.filter(expression): list` | 按条件过滤（使用 `value`、`index`） |
| `map()` | `list.map(expression): list` | 映射转换（使用 `value`、`index`） |
| `reduce()` | `list.reduce(expression, initial): any` | 归约（使用 `value`、`index`、`acc`） |
| `flat()` | `list.flat(): list` | 展平嵌套 list |
| `join()` | `list.join(separator): string` | 拼接为字符串 |
| `reverse()` | `list.reverse(): list` | 反转顺序 |
| `slice()` | `list.slice(start, end?): list` | 截取子列表 |
| `sort()` | `list.sort(): list` | 升序排序 |
| `unique()` | `list.unique(): list` | 去重 |
| `isEmpty()` | `list.isEmpty(): boolean` | 是否无元素 |

## File 函数

| Function | Signature | Description |
|----------|-----------|-------------|
| `asLink()` | `file.asLink(display?): Link` | 转成链接 |
| `hasLink()` | `file.hasLink(otherFile): boolean` | 是否链接到另一个文件 |
| `hasTag()` | `file.hasTag(...tags): boolean` | 是否拥有任一 tag |
| `hasProperty()` | `file.hasProperty(name): boolean` | 是否有指定 property |
| `inFolder()` | `file.inFolder(folder): boolean` | 是否位于某文件夹或其子文件夹 |

## Link 函数

| Function | Signature | Description |
|----------|-----------|-------------|
| `asFile()` | `link.asFile(): file` | 获取 file 对象 |
| `linksTo()` | `link.linksTo(file): boolean` | 是否链接到某文件 |

## Object 函数

| Function | Signature | Description |
|----------|-----------|-------------|
| `isEmpty()` | `object.isEmpty(): boolean` | 是否无属性 |
| `keys()` | `object.keys(): list` | 获取 keys |
| `values()` | `object.values(): list` | 获取 values |

## 正则函数

| Function | Signature | Description |
|----------|-----------|-------------|
| `matches()` | `regexp.matches(string): boolean` | 测试是否匹配 |
