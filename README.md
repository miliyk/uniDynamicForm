# 动态表单组件规范

## 一、使用示例

### 1.1 页面引入

```vue
<template>
    <view class="form-container">
        <dynamic-form ref="dynamicFormRef" :form-items="formItems" :show-submit="true" @submit="handleSubmit">
            <template v-slot:custom-custom1>
                <view class="custom-slot">
                    <text>自定义表单项1，点我可以跳转其他页面，比如：某某选择页面</text>
                </view>
            </template>
            <template v-slot:custom-custom2>
                <view class="custom-slot">
                    <text>自定义表单项2，我这里要展示特殊格式的内容</text>
                </view>
            </template>
        </dynamic-form>
    </view>
</template>

<script>
import DynamicForm from '@/components/dynamicForm/dynamic-form.vue';

export default {
    components: {
        DynamicForm
    },
    data() {
        return {
            formItems: [] // 见下方配置
        };
    },
    methods: {
        handleSubmit(formData) {
            console.log('表单提交数据：', formData);
        }
    }
}
</script>
```

### 1.2 完整 formItems 配置

```javascript
formItems: [
    {
        fieldLabel: '用户名',
        fieldKey: 'username',
        labelPosition: 'left',
        labelWidth: '160rpx',
        required: true,
        componentType: 'text',
        placeholder: '请输入用户名',
        clearable: true,
        fieldValue: '哈哈哈'
    },
    {
        fieldLabel: '描述',
        fieldKey: 'description',
        clearable: true,
        autoHeight: true,
        showWordCount: true,
        componentType: 'textarea',
        placeholder: '请输入描述',
        fieldValue: ''
    },
    {
        fieldLabel: '数字',
        fieldKey: 'number',
        clearable: true,
        componentType: 'number',
        placeholder: '请输入数字',
        explain: '合法数字（正负整数小数均可）',
        fieldValue: null
    },
    {
        fieldLabel: '年龄',
        fieldKey: 'age',
        minNumber: 1,
        maxNumber: 100,
        required: true,
        displayMode: 'integer',
        componentType: 'number',
        placeholder: '请输入年龄',
        explain: '正整数',
        fieldValue: null
    },
    {
        fieldLabel: '金额',
        fieldKey: 'amount',
        displayMode: 'decimal',
        componentType: 'number',
        placeholder: '请输入金额',
        prefix: '¥',
        suffix: '元',
        required: true,
        clearable: true,
        bodyPositionRight: true,
        labelPosition: 'left',
        labelWidth: '160rpx',
        explain: '正小数',
        fieldValue: null
    },
    {
        fieldLabel: '温度',
        fieldKey: 'temperature',
        displayMode: 'negative-integer',
        componentType: 'number',
        labelPosition: 'left',
        placeholder: '请输入温度',
        explain: '负整数',
        suffix: '℃',
        clearable: true,
        fieldValue: null
    },
    {
        fieldLabel: '天气',
        fieldKey: 'weather',
        displayMode: 'negative-decimal',
        componentType: 'number',
        labelPosition: 'left',
        placeholder: '请输入天气',
        explain: '负小数',
        suffix: '℃',
        clearable: true,
        fieldValue: null
    },
    {
        fieldLabel: '性别',
        fieldKey: 'gender',
        componentType: 'radio',
        required: true,
        labelPosition: 'left',
        bodyPositionRight: true,
        options: [
            { label: '男', value: 'male' },
            { label: '女', value: 'female', disabled: true }
        ],
        fieldValue: 'female'
    },
    {
        fieldLabel: '兴趣爱好',
        fieldKey: 'hobbies',
        required: false,
        componentType: 'checkbox',
        options: [
            { label: '阅读', value: 'reading' },
            { label: '运动', value: 'sports' },
            { label: '听音乐', value: 'music' },
            { label: '看电影', value: 'movies' },
            { label: '打穿越火线游戏', value: 'games', disabled: true }
        ],
        fieldValue: ['games']
    },
    {
        fieldLabel: '城市',
        fieldKey: 'city',
        componentType: 'picker',
        placeholder: '请选择城市',
        options: [
            { label: '北京', value: 'beijing' },
            { label: '上海', value: 'shanghai' }
        ],
        fieldValue: ''
    },
    {
        fieldLabel: '日期',
        fieldKey: 'date',
        componentType: 'date',
        placeholder: '请选择日期',
        fieldValue: ''
    },
    {
        fieldLabel: '是否启用',
        fieldKey: 'enabled',
        componentType: 'boolean',
        required: true,
        displayMode: 'circle',
        fieldValue: null
    },
    {
        fieldLabel: '是否公开',
        fieldKey: 'public',
        componentType: 'boolean',
        displayMode: 'round',
        fieldValue: null
    },
    {
        fieldLabel: '是否匿名',
        fieldKey: 'anonymous',
        componentType: 'boolean',
        displayMode: 'line',
        fieldValue: null
    },
    {
        fieldLabel: '图片',
        fieldKey: 'upload',
        componentType: 'upload',
        displayMode: 'card',
        fieldValue: []
    },
    {
        fieldLabel: '自定义表单项1',
        fieldKey: 'custom1',
        componentType: 'custom',
        fieldValue: ''
    },
    {
        fieldLabel: '自定义表单项2',
        fieldKey: 'custom2',
        componentType: 'custom',
        fieldValue: ''
    }
]
```

### 1.3 fieldValue 初始值规范

| 组件类型 | fieldValue 初始值 | 说明 |
|----------|-------------------|------|
| text | `''` | 空字符串 |
| number | `null` | 必须为 null，写 `''` 会触发 Vue prop 类型告警 |
| textarea | `''` | 空字符串 |
| checkbox | `[]` | 空数组 |
| picker | `''` | 空字符串 |
| date | `''` | 空字符串 |
| radio | `''` | 空字符串 |
| boolean | `null` | 必须为 null / true / false 三态 |
| upload | `[]` | 空数组（文件列表） |
| custom | `''` | 空字符串（由自定义内容决定实际类型） |

---

## 二、架构概览

```
页面（form.vue）
  └── DynamicForm（容器，负责数据收集、校验、提交）
        ├── DynamicCopmLayout（布局，负责标签、必填星号、说明文字、错误提示）
        ├── DynamicCopmClearable（清除按钮，被 text / number / textarea 内部复用）
        ├── DynamicCopmSelect（选择触发器，被 picker / date 内部复用）
        ├── DynamicCopmCheckbox（复选框图标，被 checkbox 内部复用）
        ├── DynamicCopmRadio（单选图标，被 radio 内部复用）
        ├── DynamicCopmBoolean（布尔开关，被 boolean 内部复用）
        ├── DynamicFormText（文本输入）
        ├── DynamicFormNumber（数字输入）
        ├── DynamicFormTextarea（多行文本输入）
        ├── DynamicFormCheckbox（复选框）
        ├── DynamicFormPicker（选择器）
        ├── DynamicFormDate（日期选择）
        ├── DynamicFormRadio（单选框）
        ├── DynamicFormBoolean（布尔选择）
        ├── DynamicFormUpload（文件上传）
        └── DynamicFormCustom（自定义插槽容器）
```

**职责划分：**
- **页面**：定义 `formItems` 配置数组，传入 `DynamicForm`
- **DynamicForm**：遍历配置，所有类型（含 custom）统一通过 `<component :is>` 渲染，转发自定义插槽，统一做数据收集、必填校验与提交
- **控件子组件**：内部自行引入 `DynamicCopmLayout`，将控件放入 layout 默认插槽
- **DynamicCopmLayout**：承担单个表单项的排版（标签、分割线、说明文字、错误提示）
- **DynamicCopmClearable**：承担清除按钮的视觉与交互，被 text / number / textarea 复用
- **DynamicCopmSelect**：承担选择触发器的视觉与交互（显示文案 / placeholder 色 / 箭头 / 禁用态），被 picker / date 复用
- **DynamicCopmCheckbox**：承担复选框图标的视觉与交互（选中态 / 禁用态 / 勾号绘制），被 checkbox 复用
- **DynamicCopmRadio**：承担单选图标的视觉与交互（选中态 / 禁用态 / 圆点绘制），被 radio 复用
- **DynamicCopmBoolean**：承担布尔开关的视觉与交互（三态滑动 / 三种类型 circle-round-line），被 boolean 复用

---

## 三、组件清单

### 3.1 DynamicForm（容器）

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| formItems | Array | [] | 表单项配置数组 |
| showSubmit | Boolean | true | 是否显示提交按钮 |
| submitText | String | '提交' | 提交按钮文本 |

| 事件 | 参数 | 说明 |
|------|------|------|
| change | (fieldKey, value) | 字段值改变 |
| submit | (formData) | 表单提交（必填校验通过后） |

### 3.2 DynamicCopmLayout（布局）

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| fieldLabel | String | '--' | 表单项标签 |
| required | Boolean | false | 是否必填（显示红色星号） |
| isLast | Boolean | false | 是否最后一项（隐藏底部分割线） |
| explain | String | '' | 说明文字 |
| errorMessage | String | '' | 错误提示信息 |
| labelPosition | String | 'top' | 标签位置，取值见 LABEL_POSITION 枚举 |
| labelWidth | [String, Number] | '160rpx' | 标签宽度，仅左右结构生效；数字按 rpx 处理，字符串原样使用 |
| bodyPositionRight | Boolean | false | body 区域是否居右对齐（控件、说明文字、错误提示统一居右） |

**LABEL_POSITION 枚举：**

| 常量 | 值 | 说明 |
|------|------|------|
| TOP | 'top' | 上下结构：标签在上、控件在下（默认） |
| LEFT | 'left' | 左右结构：标签在左、控件在右，说明文字与错误提示跟随控件列对齐 |

各控件子组件均声明 `labelPosition` / `labelWidth`（不设默认值）并原样转交 layout，未配置时由 layout 的默认值兜底。

### 3.3 DynamicFormText（文本输入）

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| value | String | '' | 输入值 |
| maxLength | Number | 100 | 最大长度 |
| clearable | Boolean | false | 是否显示清除按钮 |
| disabled | Boolean | false | 是否禁用 |
| readonly | Boolean | false | 是否只读（实际走 disabled 逻辑） |
| showWordCount | Boolean | false | 是否显示字数统计 |

| 事件 | 说明 |
|------|------|
| input | 输入值改变 |
| clear | 清除按钮点击 |

### 3.4 DynamicFormNumber（数字输入）

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| value | Number | null | 输入值（必须为 Number 或 null，禁止空字符串） |
| maxLength | Number | 10 | 最大输入长度 |
| minNumber | Number | null | 最小值 |
| maxNumber | Number | null | 最大值 |
| displayMode | String | 'number' | 数值类型，取值见 NUMBER_TYPE 枚举 |
| precision | Number | 2 | 小数位数（decimal/negative-decimal 时生效） |
| prefix | String | '' | 输入框前置文本（如货币符号） |
| suffix | String | '' | 输入框后置文本（如单位） |
| clearable | Boolean | false | 是否显示清除按钮 |
| disabled | Boolean | false | 是否禁用 |
| readonly | Boolean | false | 是否只读 |

**NUMBER_TYPE 枚举：**

| 常量 | 值 | 说明 |
|------|------|------|
| NUMBER | 'number' | 合法数字（正负整数小数均可） |
| INTEGER | 'integer' | 正整数 |
| DECIMAL | 'decimal' | 正小数 |
| NEGATIVE_INTEGER | 'negative-integer' | 负整数 |
| NEGATIVE_DECIMAL | 'negative-decimal' | 负小数 |

**校验机制：**
- 防抖 500ms 后执行 `validateRange`，校验失败返回 `null`
- 校验提示由组件内部 `getValidationMessage()` 根据 displayMode/minNumber/maxNumber/precision 自动生成
- 错误提示初始不显示，校验失败后才显示

| 事件 | 说明 |
|------|------|
| input | 输入值改变（校验后） |
| clear | 清除按钮点击 |

### 3.5 DynamicFormTextarea（多行文本输入）

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| value | String | '' | 输入值 |
| maxLength | Number | 500 | 最大长度 |
| clearable | Boolean | false | 是否显示清除按钮 |
| disabled | Boolean | false | 是否禁用 |
| readonly | Boolean | false | 是否只读 |
| autoHeight | Boolean | true | 是否自动增高 |
| showWordCount | Boolean | false | 是否显示字数统计 |

| 事件 | 说明 |
|------|------|
| input | 输入值改变 |
| clear | 清除按钮点击 |

### 3.6 DynamicFormCheckbox（复选框）

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| value | Array | [] | 选中的值数组 |
| options | Array | [] | 选项列表 `[{ label, value }]` |

| 事件 | 说明 |
|------|------|
| change | 选中值改变 |

### 3.7 DynamicFormPicker（选择器）

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| value | [String, Number] | '' | 选中的值 |
| options | Array | [] | 选项列表 `[{ label, value }]` |

基于公用弹出组件 MlyPopup + 通用滚轮选择器 MlyPicker 实现，替代原生 `<picker mode="selector">` 以统一各端样式。

| 事件 | 说明 |
|------|------|
| change | 选中值改变 |

### 3.8 DynamicFormDate（日期选择）

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| value | String | '' | 选中的日期值 |
| dateFormat | String | 'YYYY-MM-DD' | 日期格式 |
| startDate | String | '' | 可选日期范围起始 |
| endDate | String | '' | 可选日期范围结束 |
| displayMode | String | 'day' | 选择器粒度（year/month/day） |

基于公用弹出组件 MlyPopup + 通用滚轮选择器 MlyPicker 实现，替代原生 `<picker mode="date">` 以统一各端样式；确认后按 displayMode 粒度输出：year→`YYYY`，month→`YYYY-MM`，day→`YYYY-MM-DD`。

| 事件 | 说明 |
|------|------|
| change | 选中日期 |

### 3.9 DynamicFormRadio（单选框）

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| value | [String, Number] | '' | 选中的值 |
| options | Array | [] | 选项列表 `[{ label, value }]` |

基于 uni-app 原生 `<radio-group>` + `<radio>` 实现。

| 事件 | 说明 |
|------|------|
| change | 选中值改变 |

### 3.10 DynamicFormBoolean（布尔选择）

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| value | [Boolean, null] | null | 选中值：true（右）/ false（左）/ null（中） |
| displayMode | String | 'circle' | 开关类型：circle（圆形）/ round（圆角）/ line（线性） |

内部使用公用组件 `DynamicCopmBoolean`（滑动开关，三位置对应三态）。固定使用 `labelPosition: 'left'` 左右布局，控件与校验提示居右显示。不支持 options 属性。

**三态交互：** 点击开关循环切换 null → true → false → null，滑块在左/中/右三位置间滑动。

| 事件 | 说明 |
|------|------|
| change | 选中值改变（true / false / null） |

### 3.11 DynamicFormUpload（文件上传）

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| value | Array | [] | 文件列表 `[{ uid, name, url, size }]` |
| displayMode | String | 'card' | 展示模式：card（卡片）/ list（列表） |
| maxCount | Number | 9 | 最大上传数量 |
| maxSize | Number | 10 | 单个文件最大大小（MB） |
| accept | String | 'image' | 允许的文件类型：image / video / all |
| multiple | Boolean | true | 是否允许多选 |
| showUploadTips | Boolean | true | 是否显示提示信息 |

**UPLOAD_DISPLAY_MODE 枚举：**

| 常量 | 值 | 说明 |
|------|------|------|
| CARD | 'card' | 卡片模式（网格展示） |
| LIST | 'list' | 列表模式（单行展示） |

**UPLOAD_ACCEPT 枚举：**

| 常量 | 值 | 说明 |
|------|------|------|
| IMAGE | 'image' | 仅图片 |
| VIDEO | 'video' | 仅视频 |
| ALL | 'all' | 所有文件（H5 支持） |

**功能特性：**
- 两种展示模式：卡片（网格）/ 列表（单行）
- 文件大小校验与数量限制
- 图片预览（点击放大）
- 删除功能
- 实时显示已上传数量

| 事件 | 说明 |
|------|------|
| change | 文件列表改变 |

### 3.12 DynamicFormCustom（自定义插槽容器）

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| value | any | '' | 当前字段的值 |
| labelPosition | String | 由 layout 兜底为 'top' | 标签位置 |
| labelWidth | [String, Number] | 由 layout 兜底为 '160rpx' | 标签宽度，仅左右结构生效 |
| bodyPositionRight | Boolean | false | body 区域居右对齐，原样转交 layout |

组件内部提供固定名 `custom` 的具名作用域插槽，页面侧可自由放入任意自定义内容，同时保留表单布局（标签、必填星号、说明文字、错误提示）与数据收集能力。插槽作用域暴露 `value`（当前值）和 `onChange`（值更新回调）。调用 `onChange(newValue)` 后，由组件的 `handleChange` 发出 `change`，再经容器的 `getComponentEvents` 回写表单数据。

**页面插槽命名规则：** 通过 DynamicForm 使用时仍为 `custom-${fieldKey}`，每个 custom 项按 fieldKey 拥有独立插槽，支持多个 custom 项各自不同内容。容器在统一的 `<component :is>` 内通过 `v-slot:custom` 桥接这些页面插槽，页面既有写法无需更改；直接使用 DynamicFormCustom 时使用 `v-slot:custom`。

```html
<!-- 示例：fieldKey 为 'custom1' 的 custom 项 -->
<template v-slot:custom-custom1="{ value, onChange }">
    <view>自定义内容，当前值：{{ value }}</view>
    <button @tap="onChange('新值')">更新值</button>
</template>
```

| 事件 | 说明 |
|------|------|
| change | 自定义内容触发值更新 |

### 3.13 公用组件

#### MlyPopup（公用底部弹出组件）

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| title | String | '请选择' | 弹出层标题 |
| visible | Boolean | false | 是否可见 |
| height | String | '70%' | 内容区域高度，支持百分比或具体数值（如 '70%'、'500rpx'），容器总高度会自动加上 header 部分 |

| 事件 | 说明 |
|------|------|
| confirm | 确认按钮点击 |
| close | 关闭按钮点击或遮罩层点击 |

提供统一的底部弹出层样式与交互（遮罩、滑入动画、取消/确认头部），通过默认插槽传入自定义内容。

#### MlyPicker（通用滚轮选择器）

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| columns | Array | [] | 列配置，形如 `[[{ label, value }], ...]`，每列为该列的选项数组 |
| value | Array | [] | 各列当前选中的下标数组 |
| indicatorStyle | String | 'height: 88rpx; border-top: 1rpx solid #3355ff; border-bottom: 1rpx solid #3355ff;' | 选中指示条样式 |

| 事件 | 参数 | 说明 |
|------|------|------|
| change | (indexes) | 滚轮滚动时触发，携带各列选中下标数组 |

基于 uni-app `picker-view` 封装，支持多列联动选择。选中区域上下边框为蓝色（#3355ff）。

#### DynamicCopmClearable（清除按钮）

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| visible | Boolean | false | 是否显示清除按钮 |
| disabled | Boolean | false | 是否禁用（禁用时点击无效） |

| 事件 | 说明 |
|------|------|
| clear | 点击清除按钮 |

动态表单体系内公用的清除按钮，被 `DynamicFormText` / `DynamicFormNumber` / `DynamicFormTextarea` 内部复用。组件本身只负责「是否显示 / 是否禁用 / 点击派发 clear」，位置由父级通过 CSS 类控制（如 `.text__clear`、`.textarea__clear`）。

#### DynamicCopmSelect（选择触发器）

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| displayText | String | '' | 触发器上显示的文案（已选中时为选项 label，未选中时为 placeholder） |
| isPlaceholder | Boolean | false | 是否处于 placeholder 状态（用于切换占位色） |
| disabled | Boolean | false | 是否禁用（禁用时点击无效） |

| 事件 | 说明 |
|------|------|
| tap | 点击触发器，由父级负责打开弹层 |

动态表单体系内公用的选择触发器，被 `DynamicFormPicker` / `DynamicFormDate` 内部复用。组件只负责「显示文案 / placeholder 色 / 箭头 / 禁用态 / 派发 tap」，弹层与选项内容由父级组合。

#### DynamicCopmBoolean（布尔开关）

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| value | [Boolean, null] | null | 当前值：true（右）/ false（左）/ null（中） |
| mode | String | 'circle' | 开关类型，取 BOOLEAN_MODE 枚举值 |

| 事件 | 说明 |
|------|------|
| change | 值改变时触发（true / false / null） |

动态表单体系内公用的布尔滑动开关，被 `DynamicFormBoolean` 内部复用。支持三种类型（circle 圆形 / round 圆角 / line 线性），滑块在左/中/右三位置间滑动对应 false/null/true 三态，点击循环切换 null → true → false → null。

#### DynamicCopmCheckbox（复选框图标）

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| checked | Boolean | false | 是否选中 |
| disabled | Boolean | false | 是否禁用（禁用时点击无效） |

| 事件 | 说明 |
|------|------|
| toggle | 点击图标，由父级负责切换选中状态 |

动态表单体系内公用的复选框图标，被 `DynamicFormCheckbox` 内部复用。组件只负责「选中态 / 禁用态 / 勾号绘制 / 派发 toggle」，布局与选项内容由父级组合。

**选项级禁用：** 父级在 `options` 数组的某个选项对象上设置 `disabled: true`，即可禁用该选项（图标变灰、点击无响应）。

#### DynamicCopmRadio（单选图标）

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| checked | Boolean | false | 是否选中 |
| disabled | Boolean | false | 是否禁用（禁用时点击无效） |

| 事件 | 说明 |
|------|------|
| toggle | 点击图标，由父级负责切换选中状态 |

动态表单体系内公用的单选图标，被 `DynamicFormRadio` 内部复用。组件只负责「选中态 / 禁用态 / 圆点绘制 / 派发 toggle」，布局与选项内容由父级组合。

**选项级禁用：** 父级在 `options` 数组的某个选项对象上设置 `disabled: true`，即可禁用该选项（图标变灰、点击无响应）。

---

## 四、配置项字段说明

页面 `formItems` 数组中每项配置的字段：

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| fieldLabel | String | 是 | 表单项标签 |
| fieldKey | String | 是 | 表单字段名（唯一标识） |
| componentType | String | 是 | 组件类型：text / number / textarea / checkbox / picker / date / radio / boolean / upload / custom |
| required | Boolean | 否 | 是否必填，默认 false |
| placeholder | String | 否 | 占位提示文字 |
| fieldValue | any | 是 | 初始值（文本类 ''，数字类 null，checkbox []，picker ''，date ''） |
| explain | String | 否 | 说明文字 |
| labelPosition | String | 否 | 标签位置：top（上下）/ left（左右），默认 top（所有类型） |
| labelWidth | String / Number | 否 | 标签宽度，仅 left 时生效，数字按 rpx，默认 '160rpx'（所有类型） |
| clearable | Boolean | 否 | 是否可清除（text / number / textarea） |
| disabled | Boolean | 否 | 是否禁用（text / number / textarea） |
| readonly | Boolean | 否 | 是否只读（text / number / textarea） |
| maxLength | Number | 否 | 最大长度（text / number / textarea） |
| minNumber | Number | 否 | 最小值（number） |
| maxNumber | Number | 否 | 最大值（number） |
| displayMode | String | 否 | 数值类型（number，取 NUMBER_TYPE 枚举值） |
| precision | Number | 否 | 小数位数（number） |
| prefix | String | 否 | 前置文本（number） |
| suffix | String | 否 | 后置文本（number） |
| options | Array | 否 | 选项列表（checkbox / picker） |
| autoHeight | Boolean | 否 | 自动增高（textarea） |
| showWordCount | Boolean | 否 | 显示字数统计（text / textarea） |
| dateFormat | String | 否 | 日期格式（date） |
| startDate | String | 否 | 日期范围起始（date） |
| endDate | String | 否 | 日期范围结束（date） |
| displayMode | String | 否 | 展示模式/数值类型/选择器粒度/开关类型（number/date/boolean/upload） |
| maxCount | Number | 否 | 最大上传数量（upload，默认 9） |
| maxSize | Number | 否 | 单个文件最大大小 MB（upload，默认 10） |
| accept | String | 否 | 允许的文件类型：image / video / all（upload，默认 image） |
| multiple | Boolean | 否 | 是否允许多选（upload，默认 true） |
| showUploadTips | Boolean | 否 | 是否显示提示信息（upload，默认 true） |
| bodyPositionRight | Boolean | 否 | body 区域是否居右对齐（所有类型，默认 false） |


---

## 五、代码规范

### 5.1 Props 声明顺序

通用属性放上面，私有属性放下面：

```
1. fieldLabel
2. fieldKey
3. required
4. placeholder（checkbox 无此属性）
5. isLast
6. value
7. explain
8. errorMsg
9. labelPosition
10. labelWidth
11. bodyPositionRight
─── 以上通用，以下私有 ───
12. 组件专属属性（按逻辑分组排列）
```

### 5.2 JSDoc 注释规范

- 每个组件文件顶部只保留一个 JSDoc 块
- 包含 `@description`、`@name`、所有 `@param`、所有 `@emits`
- `@param` 顺序与 props 声明顺序一致
- props 内部和 methods 内部不再单独写注释
- **枚举类型属性**：`@param` 描述中使用 `枚举值中文描述（默认） | 枚举值中文描述` 格式，将 `（默认）` 标注在实际默认值对应的枚举项后

```javascript
/**
 * @description 文本输入框组件
 * @name DynamicFormText
 * @param {String} fieldLabel - 表单项标签
 * @param {String} fieldKey - 表单字段名
 * ...
 * @emits input 输入值改变时触发
 * @emits clear 清除按钮点击时触发
 */

// 枚举类型示例
/**
 * @param {String} displayMode - 数值类型：number数字（默认） | integer整数 | decimal小数 | negative-integer负整数 | negative-decimal负小数
 * @param {String} displayMode - 选择器粒度：year年 | month月 | day日（默认）
 * @param {String} mode - 开关类型：circle圆形（默认） | round圆角 | line线性
 */
```

### 5.3 emits 声明

所有组件必须显式声明 `emits` 选项：

```javascript
export default {
    name: "DynamicFormText",
    emits: ['input', 'clear'],
    ...
}
```

### 5.4 CSS 命名规范（BEM）

所有样式类名必须加组件命名空间前缀，禁止使用通用名：

| 组件 | 前缀 | 示例 |
|------|------|------|
| text | `text__` | `.text__wrapper`、`.text__field`、`.text__clear` |
| number | `number__` | `.number__wrapper`、`.number__field` |
| textarea | `textarea__` | `.textarea__wrapper`、`.textarea__field` |
| checkbox | `checkbox__` | `.checkbox__item`、`.checkbox__item--disabled`、`.checkbox__label` |
| checkbox-icon | `checkbox-icon__` | （已抽离到 `DynamicCopmCheckbox`，checkbox 自身无独有样式） |
| radio | `radio__` | `.radio__group`、`.radio__group--right`、`.radio__item`、`.radio__item--disabled`、`.radio__label` |
| radio-icon | `radio-icon__` | （已抽离到 `DynamicCopmRadio`，radio 自身无独有样式） |
| picker | `picker__` | （已抽离到 `DynamicCopmSelect`，picker 自身无独有样式） |
| select | `select__` | `.select__trigger`、`.select__trigger--disabled`、`.select__value`、`.select__value--placeholder`、`.select__arrow` |
| date | `date__` | （已抽离到 `DynamicCopmSelect`，date 自身无独有样式） |
| layout | `form-item__` | `.form-item__label`、`.form-item__body`、`.form-item__body--right`、`.form-item__content`、`.form-item__error`、`.form-item--horizontal` |
| clearable | `clearable__` | `.clearable`、`.clearable--disabled`、`.clearable__text` |

修饰符使用 `--` 连接：`.text__field--disabled`

### 5.5 文件命名规范

动态表单体系下组件文件命名遵循两套规则：

| 命名格式 | 用途 | 示例 |
|------|------|------|
| `dynamic-form-xxx.vue` | 动态表单的 **item 项**（控件子组件），每个文件对应一个 `componentType` | `dynamic-form-text.vue`、`dynamic-form-number.vue`、`dynamic-form-checkbox.vue` |
| `dynamic-copm-xxx.vue` | 动态表单的 **公用组件**（被 item 项内部引用，不直接对应 `componentType`） | `dynamic-copm-layout.vue` |

**约定：**
- `dynamic-form-` 前缀：凡是会被容器 `dynamic-form.vue` 通过 `componentType` 映射渲染的控件子组件，统一用此命名
- `dynamic-copm-` 前缀：仅供动态表单体系内部复用、不作为独立 `componentType` 出现的公用组件（如布局、未来可能抽离的公用触发器等）
- 新增控件时按 `dynamic-form-<控件简称>.vue` 命名，并在容器 `componentMap` 中注册对应的 `componentType → 组件名` 映射

### 5.6 公用样式文件（dynamic-form.scss）

`components/dynamicForm/dynamic-form.scss` 集中定义动态表单控件的公用变量与混入，所有控件子组件的 `<style lang="scss">` 通过 `@import './dynamic-form.scss'` 引入。

**颜色变量：**

| 变量 | 值 | 用途 |
|------|------|------|
| `$df-field-bg` | `#F2F3F5` | 字段默认背景 |
| `$df-field-bg-disabled` | `#f5f5f5` | 禁用 / 只读背景 |
| `$df-field-color` | `#333333` | 字段文字颜色 |
| `$df-field-color-disabled` | `#c0c4cc` | 禁用态文字颜色 |
| `$df-field-color-readonly` | `#606266` | 只读态文字颜色 |
| `$df-field-color-placeholder` | `#c8c9cc` | placeholder 颜色 |
| `$df-clear-bg` | `#c0c4cc` | 清除按钮背景 |
| `$df-clear-color` | `#ffffff` | 清除按钮文字颜色 |
| `$df-count-color` | `#999999` | 字数统计颜色 |
| `$df-adorn-color` | `#666666` | 前置/后置文本颜色 |
| `$df-primary-color` | `#1890ff` | 主色（选中态） |

**尺寸变量：**

| 变量 | 值 | 用途 |
|------|------|------|
| `$df-field-height` | `60rpx` | 字段默认高度 |
| `$df-field-padding-x` | `20rpx` | 字段水平内边距 |
| `$df-field-radius` | `4rpx` | 字段圆角 |
| `$df-field-font-size` | `26rpx` | 字段字号 |
| `$df-clear-size` | `32rpx` | 清除按钮尺寸 |
| `$df-clear-font-size` | `20rpx` | 清除按钮文字字号 |
| `$df-count-font-size` | `22rpx` | 字数统计字号 |
| `$df-count-offset` | `-30rpx` | 字数统计底部偏移 |
| `$df-adorn-gap` | `12rpx` | 前置/后置文本与输入框间距 |

**混入：**

| 混入 | 用途 |
|------|------|
| `@include df-field-base($min-height, $padding-y)` | 字段基础样式（高度 / 内边距 / 背景 / 圆角 / 字号 / 颜色） |
| `@include df-field-disabled` | 禁用态 |
| `@include df-field-readonly` | 只读态 |
| `@include df-clear-btn` | 清除按钮圆形骨架（供 `DynamicCopmClearable` 内部使用，父级一般不直接调用） |
| `@include df-clear-text` | 清除按钮内文字（供 `DynamicCopmClearable` 内部使用） |
| `@include df-field-placeholder` | placeholder 颜色 |

**使用示例：**

```scss
.text__field {
    @include df-field-base;
}

.textarea__field {
    @include df-field-base($min-height: 120rpx, $padding-y: 16rpx);
    line-height: 1.5;
}

.text__clear {
    position: absolute;
    right: $df-field-padding-x;
    top: 50%;
    transform: translateY(-50%);
}
```

清除按钮的视觉与交互由 `DynamicCopmClearable` 组件统一提供，父级只负责定位。

调整视觉风格时只改 `dynamic-form.scss` 中的变量，所有控件自动同步。

### 5.7 枚举常量

枚举值必须定义为常量对象统一引用，禁止硬编码字符串：

```javascript
const NUMBER_TYPE = {
    NUMBER: 'number',
    INTEGER: 'integer',
    DECIMAL: 'decimal',
    NEGATIVE_INTEGER: 'negative-integer',
    NEGATIVE_DECIMAL: 'negative-decimal'
};
```

使用 `Object.values(NUMBER_TYPE).includes(value)` 做 validator。

---

## 六、属性透传链路

新增任何可配置属性时，必须同步修改三处：

```
页面配置项（form.vue formItems）
  → 容器组装函数（dynamic-form.vue getComponentProps）
    → 子组件 props 声明并使用
```

**缺任一处则功能不生效。**

custom 与其他控件共用上述属性及事件透传链路，布局属性由 DynamicFormCustom 继续转交 DynamicCopmLayout。插槽内容由容器显式桥接：

```vue
<component
    v-for="(item, index) in formItems"
    :key="item.fieldKey"
    :is="getComponentByType(item.componentType)"
    :value="formData[item.fieldKey]"
    :error-msg="errorMessages[item.fieldKey] || ''"
    v-bind="getComponentProps(item, index)"
    v-on="getComponentEvents(item)"
>
    <template v-slot:custom="{ value, onChange }">
        <slot
            :name="'custom-' + item.fieldKey"
            :value="value"
            :on-change="onChange"
        ></slot>
    </template>
</component>
```

未使用 `custom` 插槽的普通控件不会渲染这段转发内容。本方案面向 H5/App，本次不考虑小程序兼容性。

---

## 七、新增控件注册链路

新增整个控件类型时，在 `dynamic-form.vue` 中必须补齐五处：

1. **import** — 导入组件
2. **components** — 注册组件
3. **componentMap** — `componentType → 组件名` 映射
4. **eventNameMap** — `componentType → 事件名` 映射
5. **getComponentProps** — 新增属性透传分支

---

## 八、关键约束

- **readonly 实现**：uni-app `<input>` 不支持 readonly，统一走 `:disabled="disabled || readonly"`，仅 CSS 类区分视觉
- **数字初始值**：number 的 value prop 为 Number 类型，初始值必须写 `null` 而非 `''`
- **字数统计布局**：count 用 `position: absolute; bottom: -24rpx` 溢出 wrapper 下沿显示，wrapper 不加 padding，避免推远 errorMessage
- **错误提示时机**：初始不显示，校验失败后才显示；禁止把静态文案直接透传成 errorMsg
- **防抖校验**：number 使用 500ms 防抖执行 validateRange，解决 uni-app input 事件周期内 prop 更新无效问题
- **居右对齐实现**：`bodyPositionRight` 由 layout 消费，body 与 content 使用 `flex-direction: column` + `align-items: flex-end` 控制水平居右，左右布局的 content 保留 `justify-content: center` 做垂直居中，explain/error 使用 `text-align: right`；radio 等内部含 flex 排列的控件需自行处理选项组居右
