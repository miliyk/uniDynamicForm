<template>
    <dynamic-copm-layout
        :field-label="fieldLabel"
        :required="required"
        :is-last="isLast"
        :explain="explain"
        :label-position="labelPosition"
        :label-width="labelWidth"
        :error-message="localError || errorMsg"
        :body-position-right="bodyPositionRight"
    >
        <view class="dynamic-form-number">
            <view class="number__wrapper" :class="{
                'number__wrapper--disabled': disabled,
                'number__wrapper--readonly': readonly
            }">
                <text v-if="prefix" class="number__prefix">{{ prefix }}</text>
                <input 
                    class="number__field"
                    :value="inputValue"
                    :maxlength="maxLength"
                    :placeholder="placeholder"
                    :disabled="disabled || readonly"
                    :type="inputType"
                    @input="handleInput"
                />
                <dynamic-copm-clearable
                    :visible="clearable && inputValue != null && inputValue !== '' && !disabled && !readonly"
                    :disabled="disabled || readonly"
                    class="number__clear"
                    @clear="handleClear"
                />
                <text v-if="suffix" class="number__suffix">{{ suffix }}</text>
            </view>
        </view>
    </dynamic-copm-layout>
</template>

<script>
import DynamicCopmLayout from '../common/dynamic-copm-layout.vue';
import DynamicCopmClearable from '../common/dynamic-copm-clearable.vue';

/**
 * 数值类型枚举常量
 */
const NUMBER_TYPE = {
    NUMBER: 'number',                      // 合法数字（正负整数小数均可）
    INTEGER: 'integer',                    // 正整数
    DECIMAL: 'decimal',                    // 正小数
    NEGATIVE_INTEGER: 'negative-integer',  // 负整数
    NEGATIVE_DECIMAL: 'negative-decimal'   // 负小数
};

/**
 * @description 数字输入框组件
 * @name DynamicFormNumber
 * @param {String} fieldLabel - 表单项标签
 * @param {String} fieldKey - 表单字段名
 * @param {Boolean} required - 是否必填
 * @param {String} placeholder - 输入框占位符
 * @param {Boolean} isLast - 是否是最后一项（用于控制分割线显示）
 * @param {Number} value - 输入框的值
 * @param {String} explain - 表单项说明文字
 * @param {String} errorMsg - 错误提示信息
 * @param {String} labelPosition - 标签位置
 * @param {String|Number} labelWidth - 标签宽度
 * @param {Number} maxLength - 输入框最大长度，默认值为10
 * @param {Number} minNumber - 输入框最小值
 * @param {Number} maxNumber - 输入框最大值
 * @param {String} displayMode - 数值类型：number数字（默认） | integer整数 | decimal小数 | negative-integer负整数 | negative-decimal负小数
 * @param {Number} precision - 小数位数，小数时生效，默认值为2
 * @param {String} prefix - 输入框前置文本（如货币符号），默认值为''
 * @param {String} suffix - 输入框后置文本（如单位），默认值为''
 * @param {Boolean} clearable - 是否可清除，默认值为false
 * @param {Boolean} disabled - 是否禁用，默认值为false
 * @param {Boolean} readonly - 是否只读，默认值为false
 * @param {Boolean} bodyPositionRight - body区域是否居右对齐
 * @emits input 输入值改变时触发
 * @emits clear 清除按钮点击时触发
 */
export default {
    name: "DynamicFormNumber",
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
            type: Number,
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
        labelPosition: {
            type: String
        },
        labelWidth: {
            type: [String, Number]
        },
        maxLength: {
            type: Number,
            default: 10
        },
        minNumber: {
            type: Number,
            default: null
        },
        maxNumber: {
            type: Number,
            default: null
        },
        displayMode: {
            type: String,
            default: NUMBER_TYPE.NUMBER,
            validator: (value) => Object.values(NUMBER_TYPE).includes(value)
        },
        precision: {
            type: Number,
            default: 2
        },
        prefix: {
            type: String,
            default: ''
        },
        suffix: {
            type: String,
            default: ''
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
        bodyPositionRight: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            inputValue: this.value,
            debounceTimer: null,
            localError: ''
        };
    },
    watch: {
        value(val) {
            this.inputValue = val;
        }
    },
    computed: {
        /**
         * 根据 displayMode 返回对应的 input type
         * @returns {String} input 类型：'number'(整数) 或 'digit'(小数)
         */
        inputType() {
            const isInteger = this.displayMode === NUMBER_TYPE.INTEGER || this.displayMode === NUMBER_TYPE.NEGATIVE_INTEGER;
            return isInteger ? 'number' : 'digit';
        }
    },
    methods: {
        /**
         * 根据 displayMode、min、max、precision 自动生成校验提示文案
         * @returns {String} 校验失败提示文案
         */
        getValidationMessage() {
            const isNegative = this.displayMode === NUMBER_TYPE.NEGATIVE_INTEGER || this.displayMode === NUMBER_TYPE.NEGATIVE_DECIMAL;
            const isInteger = this.displayMode === NUMBER_TYPE.INTEGER || this.displayMode === NUMBER_TYPE.NEGATIVE_INTEGER;
            const isDecimal = this.displayMode === NUMBER_TYPE.DECIMAL || this.displayMode === NUMBER_TYPE.NEGATIVE_DECIMAL;
            const signText = this.displayMode === NUMBER_TYPE.NUMBER ? '' : (isNegative ? '负' : '正');
            let formatText = '';
            if (isInteger) {
                formatText = '整数';
            } else if (isDecimal) {
                formatText = `数，包含${this.precision}位小数`;
            } else {
                formatText = '数字';
            }
            let msg = `${signText}${formatText}`;
            if (this.minNumber !== null && this.maxNumber !== null) {
                msg = `${this.minNumber}到${this.maxNumber}之间的${signText}${formatText}`;
            }
            return msg;
        },
        /**
         * 校验数值格式、符号和范围
         * @param {String|Number} val - 待校验的值
         * @returns {Number} 校验后的合法值
         */
        validateRange(val) {
            if (val === '' || val === null || val === undefined) return null;
            let num = Number(val);
            if (isNaN(num)) return null;
            const isInteger = this.displayMode === NUMBER_TYPE.INTEGER || this.displayMode === NUMBER_TYPE.NEGATIVE_INTEGER;
            const isNegative = this.displayMode === NUMBER_TYPE.NEGATIVE_INTEGER || this.displayMode === NUMBER_TYPE.NEGATIVE_DECIMAL;
            const isDecimal = this.displayMode === NUMBER_TYPE.DECIMAL || this.displayMode === NUMBER_TYPE.NEGATIVE_DECIMAL;
            if (isInteger && !Number.isInteger(num)) return null;
            if (isDecimal && String(num).includes('.') && String(num).split('.')[1].length > this.precision) return null;
            if (!isNegative && this.displayMode !== NUMBER_TYPE.NUMBER && num < 0) return null;
            if (isNegative && num > 0) return null;
            if (this.minNumber !== null && num < this.minNumber) return null;
            if (this.maxNumber !== null && num > this.maxNumber) return null;
            return num;
        },
        /**
         * 处理输入框的输入事件
         * @param {Event} e - 输入框的输入事件
         */
        handleInput(e) {
            this.inputValue = e.detail.value;
            clearTimeout(this.debounceTimer);
            this.debounceTimer = setTimeout(() => {
                const val = this.validateRange(this.inputValue);
                if (val === null) this.localError = this.getValidationMessage();
                else this.localError = '';
                this.inputValue = val;
                this.$emit('input', val);
            }, 500);
        },
        /**
         * 处理清除按钮点击事件
         */
        handleClear() {
            this.inputValue = null;
            this.localError = '';
            this.$emit('input', null);
            this.$emit('clear');
        }
    }
}
</script>

<style lang="scss">
@import '../dynamic-form.scss';

.dynamic-form-number {
    width: 100%;
}

.number__wrapper {
    position: relative;
    display: flex;
    align-items: center;
    @include df-field-base;
}

.number__wrapper--disabled {
    @include df-field-disabled;
}

.number__wrapper--readonly {
    @include df-field-readonly;
}

.number__field {
    flex: 1;
    min-width: 0;
    background: transparent;
    border: none;
    padding: 0;
    margin: 0;
    height: 100%;
    font-size: inherit;
    color: inherit;
}

.number__prefix,
.number__suffix {
    white-space: nowrap;
}

.number__prefix {
    margin-right: $df-adorn-gap;
}

.number__suffix {
    margin-left: $df-adorn-gap;
}

.number__clear {
    position: static;
    margin-left: 8rpx;
}

.number__field::placeholder {
    @include df-field-placeholder;
}
</style>
