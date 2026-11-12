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
        <view class="dynamic-form-radio">
            <view class="radio__group" :class="{ 'radio__group--right': bodyPositionRight }">
                <view 
                    class="radio__item" 
                    :class="{ 'radio__item--disabled': item.disabled }"
                    v-for="item in options" 
                    :key="item.value"
                    @click="handleSelect(item)"
                >
                    <dynamic-copm-radio
                        :checked="item.value === value"
                        :disabled="item.disabled"
                        @toggle="handleSelect(item)"
                    />
                    <text class="radio__label">{{ item.label }}</text>
                </view>
            </view>
        </view>
    </dynamic-copm-layout>
</template>

<script>
import DynamicCopmLayout from '../common/dynamic-copm-layout.vue';
import DynamicCopmRadio from '../common/dynamic-copm-radio.vue';

/**
 * @description 单选框组件
 * @name DynamicFormRadio
 * @param {String} fieldLabel - 表单项标签
 * @param {String} fieldKey - 表单字段名
 * @param {Boolean} required - 是否必填
 * @param {Boolean} isLast - 是否是最后一项（用于控制分割线显示）
 * @param {String|Number} value - 选中的值
 * @param {String} explain - 表单项说明文字
 * @param {String} errorMsg - 错误提示信息
 * @param {String} labelPosition - 标签位置
 * @param {String|Number} labelWidth - 标签宽度
 * @param {Array} options - 选项列表 [{ label: '选项1', value: 'value1' }]
 * @param {Boolean} bodyPositionRight - body区域是否居右对齐
 * @emits change 选中值改变时触发
 */
export default {
    name: "DynamicFormRadio",
    emits: ['change'],
    components: {
        DynamicCopmLayout,
        DynamicCopmRadio
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
            type: [String, Number],
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
        options: {
            type: Array,
            default: () => []
        },
        bodyPositionRight: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        handleSelect(item) {
            if (item.disabled) return;
            this.$emit('change', item.value);
        }
    }
}
</script>

<style>
.dynamic-form-radio {
    width: 100%;
}

.radio__group {
    display: flex;
    flex-wrap: wrap;
    gap: 16rpx 32rpx;
}

.radio__group--right {
    justify-content: flex-end;
}

.radio__item {
    display: flex;
    align-items: center;
    cursor: pointer;
}

.radio__item--disabled {
    cursor: not-allowed;
    opacity: 0.6;
}

.radio__label {
    line-height: 1;
    font-size: 28rpx;
    color: #333333;
}
</style>
