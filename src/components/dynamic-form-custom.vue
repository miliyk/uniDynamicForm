<template>
    <dynamic-copm-layout
        :field-label="fieldLabel"
        :required="required"
        :is-last="isLast"
        :explain="explain"
        :label-position="labelPosition"
        :label-width="labelWidth"
        :error-message="errorMsg"
        :body-position-right="bodyPositionRight"
    >
        <view class="dynamic-form-custom">
            <slot name="custom" :value="value" :on-change="handleChange"></slot>
        </view>
    </dynamic-copm-layout>
</template>

<script>
import DynamicCopmLayout from '../common/dynamic-copm-layout.vue';

/**
 * @description 自定义插槽容器组件，提供 custom 具名作用域插槽，同时保留表单布局与数据收集能力
 * @name DynamicFormCustom
 * @param {String} fieldLabel - 表单项标签
 * @param {String} fieldKey - 表单字段名
 * @param {Boolean} required - 是否必填
 * @param {Boolean} isLast - 是否是最后一项（用于控制分割线显示）
 * @param {any} value - 当前字段的值
 * @param {String} explain - 表单项说明文字
 * @param {String} errorMsg - 错误提示信息
 * @param {String} labelPosition - 标签位置
 * @param {String|Number} labelWidth - 标签宽度
 * @param {Boolean} bodyPositionRight - body区域是否居右对齐，默认值为false
 * @emits change 自定义内容触发值更新时触发
 */
export default {
    name: "DynamicFormCustom",
    emits: ['change'],
    components: {
        DynamicCopmLayout
    },
    props: {
        fieldLabel: {
            type: String,
            default: ''
        },
        fieldKey: {
            type: String,
            default: ''
        },
        required: {
            type: Boolean,
            default: false
        },
        isLast: {
            type: Boolean,
            default: false
        },
        value: {
            default: ''
        },
        explain: {
            type: String,
            default: ''
        },
        errorMsg: {
            type: String,
            default: ''
        },
        labelPosition: {
            type: String
        },
        labelWidth: {
            type: [String, Number]
        },
        bodyPositionRight: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        /**
         * 处理自定义内容的值更新
         * @param {any} newValue - 新的值
         */
        handleChange(newValue) {
            this.$emit('change', newValue);
        }
    }
}
</script>

<style>
.dynamic-form-custom {
    width: 100%;
}
</style>
