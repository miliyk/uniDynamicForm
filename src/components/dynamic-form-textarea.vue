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
        <view class="dynamic-form-textarea">
            <view class="textarea__wrapper">
                <textarea 
                    class="textarea__field"
                    :class="{
                        'textarea__field--disabled': disabled,
                        'textarea__field--readonly': readonly
                    }"
                    :value="value"
                    :maxlength="maxLength"
                    :placeholder="placeholder"
                    :disabled="disabled || readonly"
                    :auto-height="autoHeight"
                    @input="handleInput"
                />
                <dynamic-copm-clearable
                    :visible="clearable && !!value && !disabled && !readonly"
                    :disabled="disabled || readonly"
                    class="textarea__clear"
                    @clear="handleClear"
                />
                <text v-if="showWordCount" class="textarea__count">{{ value.length }}/{{ maxLength }}</text>
            </view>
        </view>
    </dynamic-copm-layout>
</template>

<script>
import DynamicCopmLayout from '../common/dynamic-copm-layout.vue';
import DynamicCopmClearable from '../common/dynamic-copm-clearable.vue';

/**
 * @description 多行文本输入框组件
 * @name DynamicFormTextarea
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
 * @param {Number} maxLength - 输入框最大长度，默认值为500
 * @param {Boolean} clearable - 是否可清除，默认值为false
 * @param {Boolean} disabled - 是否禁用，默认值为false
 * @param {Boolean} readonly - 是否只读，默认值为false
 * @param {Boolean} autoHeight - 是否自动增高，默认值为true
 * @param {Boolean} showWordCount - 是否显示字数统计，默认值为false
 * @param {Boolean} bodyPositionRight - body区域是否居右对齐
 * @emits input 输入值改变时触发
 * @emits clear 清除按钮点击时触发
 */
export default {
    name: "DynamicFormTextarea",
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
            default: 500
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
        autoHeight: {
            type: Boolean,
            default: true
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

.dynamic-form-textarea {
    width: 100%;
}

.textarea__wrapper {
    position: relative;
}

.textarea__field {
    @include df-field-base($min-height: 120rpx, $padding-y: 16rpx);
    line-height: 1.5;
}

.textarea__field--disabled {
    @include df-field-disabled;
}

.textarea__field--readonly {
    @include df-field-readonly;
}

.textarea__clear {
    position: absolute;
    right: 12rpx;
    top: 12rpx;
}

.textarea__count {
    position: absolute;
    right: 0;
    bottom: $df-count-offset;
    font-size: $df-count-font-size;
    color: $df-count-color;
}

.textarea__field::placeholder {
    @include df-field-placeholder;
}
</style>
