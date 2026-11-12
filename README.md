一款基于vue2开发的移动版动态表单生成器。






### 一、动态表单属性说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| formItems | Array | 是| 表单项配置数组 |
| showSubmit | Boolean |  | 是否显示提交按钮 |
| submitText | String |  | 提交按钮的文本，默认为"提交" |
| @change | Function |  | 字段值改变时触发 |
| @submit | Function |  | 表单提交时触发 |

---


### 二、`formItems` 配置项属性说明


| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| fieldLabel | String | 是 | 表单项标签 |
| fieldKey | String | 是 | 表单字段名（唯一标识） |
| componentType | String | 是 | 组件类型，见下图 |
| required | Boolean | 否 | 是否必填，默认 false |
| placeholder | String | 否 | 占位提示文字 |
| fieldValue | any | 是 | 初始值 |
| explain | String | 否 | 说明文字 |
| labelPosition | String | 否 | 标签位置：top上下（默认） / left左右 |
| labelWidth | String / Number | 否 | 标签宽度，仅 left 时生效，数字按 rpx，默认 '160rpx' |
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
| displayMode | String | 否 | 展示模式（number/date/boolean/upload） |
| maxCount | Number | 否 | 最大上传数量（upload，默认 9） |
| maxSize | Number | 否 | 单个文件最大大小 MB（upload，默认 10） |
| accept | String | 否 | 允许的文件类型：image / video / all（upload，默认 image） |
| multiple | Boolean | 否 | 是否允许多选（upload，默认 true） |
| showUploadTips | Boolean | 否 | 是否显示提示信息（upload，默认 true） |
| bodyPositionRight | Boolean | 否 | body 区域是否居右对齐（所有类型，默认 false） |

---

###  `componentType` 组件类型和 `fieldValue` 初始值规范

| 组件类型 | 初始值 | 说明 |
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


**NUMBER_TYPE 枚举**

| 常量 | 值 | 说明 |
|------|------|------|
| NUMBER | number | 合法数字（正负整数小数均可） |
| INTEGER | integer | 正整数 |
| DECIMAL | decimal | 正小数 |
| NEGATIVE_INTEGER | negative-integer | 负整数 |
| NEGATIVE_DECIMAL | negative-decimal | 负小数 |

---

**displayMode 枚举**

| 组件类型 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| date | String | day | year年 / month月 / day日 |
| boolean | String | circle | circle圆形 / round圆角 / line线性  |
| upload | String | card | card卡片 / list列表  |
| number | String | number | number数字 / integer整数 / decimal小数 / negative-integer负整数 / negative-decimal负小数  |
---

## 一、使用示例

### 1.1 页面引入

```vue
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
