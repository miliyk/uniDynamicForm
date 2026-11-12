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
        <view class="dynamic-form-checkbox">
            <view
                v-for="(option, index) in options"
                :key="option.value"
                class="checkbox__item"
                :class="{ 'checkbox__item--disabled': option.disabled }"
                @click="handleClick(option)"
            >
                <dynamic-copm-checkbox
                    :checked="isChecked(option.value)"
                    :disabled="option.disabled"
                    @toggle="handleClick(option)"
                />
                <text class="checkbox__label">{{ option.label }}</text>
            </view>
        </view>
    </dynamic-copm-layout>
</template>

<script>
import DynamicCopmLayout from '../common/dynamic-copm-layout.vue';
import DynamicCopmCheckbox from '../common/dynamic-copm-checkbox.vue';

/**
 * @description 复选框组件
 * @name DynamicFormCheckbox
 * @param {String} fieldLabel - 表单项标签
 * @param {String} fieldKey - 表单字段名
 * @param {Boolean} required - 是否必填
 * @param {Boolean} isLast - 是否是最后一项（用于控制分割线显示）
 * @param {Array} value - 选中的值数组
 * @param {String} explain - 表单项说明文字
 * @param {String} errorMsg - 错误提示信息
 * @param {String} labelPosition - 标签位置
 * @param {String|Number} labelWidth - 标签宽度
 * @param {Array} options - 选项列表 [{ label: '选项1', value: 'value1' }]
 * @param {Boolean} bodyPositionRight - body区域是否居右对齐
 * @emits change 选中值改变时触发
 */
export default {
    name: "DynamicFormCheckbox",
    emits: ['change'],
    components: {
        DynamicCopmLayout,
        DynamicCopmCheckbox
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
            type: Array,
            default: () => []
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
        /**
         * 判断选项是否被选中
         * @param {String} optionValue - 选项的值
         * @returns {Boolean} 选项是否被选中
         */
        isChecked(optionValue) {
            return this.value.includes(optionValue);
        },
        /**
         * 处理复选框点击事件
         * @param {Object} option - 选项对象
         */
        handleClick(option) {
            if (option.disabled) return;
            const newValue = [...this.value];
            const index = newValue.indexOf(option.value);
            if (index > -1) {
                newValue.splice(index, 1);
            } else {
                newValue.push(option.value);
            }
            this.$emit('change', newValue);
        }
    }
}
</script>

<style lang="scss">
@import '../dynamic-form.scss';

.dynamic-form-checkbox {
    display: flex;
    flex-wrap: wrap;
    gap: 24rpx;
}

.checkbox__item {
    display: flex;
    align-items: center;
    cursor: pointer;
}

.checkbox__item--disabled {
    cursor: not-allowed;
    opacity: 0.6;
}

.checkbox__label {
    line-height: 1;
    font-size: 28rpx;
    color: #333333;
}
</style>
