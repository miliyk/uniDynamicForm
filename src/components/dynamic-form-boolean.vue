<template>
    <dynamic-copm-layout
        :field-label="fieldLabel"
        :required="required"
        :is-last="isLast"
        :explain="explain"
        label-position="left"
        :label-width="labelWidth"
        :error-message="errorMsg"
        body-position-right
    >
        <view class="dynamic-form-boolean">
            <view class="boolean__control">
                <dynamic-copm-boolean
                    :value="value"
                    :mode="displayMode"
                    @change="handleChange"
                />
            </view>
        </view>
    </dynamic-copm-layout>
</template>

<script>
import DynamicCopmLayout from '../common/dynamic-copm-layout.vue';
import DynamicCopmBoolean from '../common/dynamic-copm-boolean.vue';
import { BOOLEAN_MODE_ENUM } from '../dynamic-form.js';

/**
 * @description 布尔选择组件
 * @name DynamicFormBoolean
 * @param {String} fieldLabel - 表单项标签
 * @param {String} fieldKey - 表单字段名
 * @param {Boolean} required - 是否必填
 * @param {Boolean} isLast - 是否是最后一项（用于控制分割线显示）
 * @param {Boolean|Null} value - 选中值：true | false | null（默认）
 * @param {String} explain - 表单项说明文字
 * @param {String} errorMsg - 错误提示信息
 * @param {String|Number} labelWidth - 标签宽度
 * @param {String} displayMode - 开关类型：circle圆形（默认） | round圆角 | line线性
 * @emits change 选中值改变时触发
 */
export default {
    name: "DynamicFormBoolean",
    emits: ['change'],
    components: {
        DynamicCopmLayout,
        DynamicCopmBoolean
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
            type: [Boolean, null],
            default: null
        },
        explain: {
            type: String,
            default: ''
        },
        errorMsg: {
            type: String,
            default: ''
        },
        labelWidth: {
            type: [String, Number]
        },
        displayMode: {
            type: String,
            default: BOOLEAN_MODE_ENUM.CIRCLE,
            validator: (v) => Object.values(BOOLEAN_MODE_ENUM).includes(v)
        }
    },
    methods: {
        /**
         * 转发公用组件的 change 事件
         * @param {Boolean|Null} val - 新值
         */
        handleChange(val) {
            this.$emit('change', val);
        }
    }
}
</script>

<style lang="scss">
@import '../dynamic-form.scss';

.dynamic-form-boolean {
    width: 100%;
}

.boolean__control {
    display: flex;
    justify-content: flex-end;
    align-items: center;
}
</style>
