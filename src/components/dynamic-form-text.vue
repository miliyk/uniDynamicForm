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
        <view class="dynamic-form-text">
            <view class="text__wrapper">
                <input 
                    class="text__field"
                    :class="{
                        'text__field--disabled': disabled,
                        'text__field--readonly': readonly
                    }"
                    :value="value"
                    :maxlength="maxLength"
                    :placeholder="placeholder"
                    :disabled="disabled || readonly"
                    type="text"
                    @input="handleInput"
                />
                <dynamic-copm-clearable
                    :visible="clearable && !!value && !disabled && !readonly"
                    :disabled="disabled || readonly"
                    class="text__clear"
                    @clear="handleClear"
                />
                <text v-if="showWordCount" class="text__count">{{ value.length }}/{{ maxLength }}</text>
            </view>
        </view>
    </dynamic-copm-layout>
</template>

<script>
import DynamicCopmLayout from '../common/dynamic-copm-layout.vue';
import DynamicCopmClearable from '../common/dynamic-copm-clearable.vue';

/**
 * @description 文本输入框组件
 * @name DynamicFormText
 * @param {String} fieldLabel - 表单项标签
 * @param {String} fieldKey - 表单字段名
 * @param {Boolean} required - 是否必填
 * @param {String} placeholder - 输入框占位符
 * @param {Boolean} isLast - 是否是最后一项（用于控制分割线显示）
 * @param {String} value - 输入框的值
 * @param {String} explain - 表单项说明文字
 * @param {String} errorMsg - 错误提示信息
 * @param {String} labelPosition - 标签位置
 * @param {String|Number} labelWidth - 标签宽度
 * @param {Number} maxLength - 输入框最大长度，默认值为100
 * @param {Boolean} clearable - 是否可清除，默认值为false
 * @param {Boolean} disabled - 是否禁用，默认值为false
 * @param {Boolean} readonly - 是否只读，默认值为false
 * @param {Boolean} showWordCount - 是否显示字数统计，默认值为false
 * @param {Boolean} bodyPositionRight - body区域是否居右对齐
 * @emits input 输入值改变时触发
 * @emits clear 清除按钮点击时触发
 */
export default {
    name: "DynamicFormText",
    emits: ['input', 'clear'],
    components: {
        DynamicCopmLayout,
        DynamicCopmClearable
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
        placeholder: {
            type: String,
            default: '请输入'
        },
        isLast: {
            type: Boolean,
            default: false
        },
        value: {
            type: String,
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
        maxLength: {
            type: Number,
            default: 100
        },
        clearable: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        },
        readonly: {
            type: Boolean,
            default: false
        },
        showWordCount: {
            type: Boolean,
            default: false
        },
        bodyPositionRight: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        /**
         * 处理输入框的输入事件
         * @param {Event} e - 输入框的输入事件
         */
        handleInput(e) {
            this.$emit('input', e.detail.value);
        },
        /**
         * 处理清除按钮点击事件
         */
        handleClear() {
            this.$emit('input', '');
            this.$emit('clear');
        }
    }
}
</script>

<style lang="scss">
@import '../dynamic-form.scss';

.dynamic-form-text {
    width: 100%;
}

.text__wrapper {
    position: relative;
}

.text__field {
    @include df-field-base;
}

.text__field--disabled {
    @include df-field-disabled;
}

.text__field--readonly {
    @include df-field-readonly;
}

.text__clear {
    position: absolute;
    right: $df-field-padding-x;
    top: 50%;
    transform: translateY(-50%);
}

.text__count {
    position: absolute;
    right: 0;
    bottom: $df-count-offset;
    font-size: $df-count-font-size;
    color: $df-count-color;
}

.text__field::placeholder {
    @include df-field-placeholder;
}
</style>
