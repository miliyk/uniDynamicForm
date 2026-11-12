<template>
    <view class="dynamic-form">
        <view class="form-card">
            <!-- 根据 componentType 自动渲染对应的子组件 -->
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

            <!-- 提交按钮 -->
            <view class="form-submit" v-if="showSubmit">
                <button class="form-submit__btn" @click="handleSubmit">{{ submitText }}</button>
                <button class="form-submit__btn" @click="handleReset">重置</button>
            </view>
        </view>
    </view>
</template>

<script>
import DynamicFormText from './components/dynamic-form-text.vue';
import DynamicFormTextarea from './components/dynamic-form-textarea.vue';
import DynamicFormNumber from './components/dynamic-form-number.vue';
import DynamicFormRadio from './components/dynamic-form-radio.vue';
import DynamicFormCheckbox from './components/dynamic-form-checkbox.vue';
import DynamicFormPicker from './components/dynamic-form-picker.vue';
import DynamicFormDate from './components/dynamic-form-date.vue';
import DynamicFormBoolean from './components/dynamic-form-boolean.vue';
import DynamicFormUpload from './components/dynamic-form-upload.vue';
import DynamicFormCustom from './components/dynamic-form-custom.vue';

/**
 * @description 动态表单组件
 * @name DynamicForm
 * @param {Array} formItems - 表单项配置数组
 * @param {Boolean} showSubmit - 是否显示提交按钮
 * @param {String} submitText - 提交按钮的文本，默认为"提交"
 * @emits change 字段值改变时触发
 * @emits submit 表单提交时触发
 */
export default {
    name: "DynamicForm",
    emits: ['change', 'submit'],
    components: {
        DynamicFormText,
        DynamicFormNumber,
        DynamicFormTextarea,
        DynamicFormCheckbox,
        DynamicFormPicker,
        DynamicFormDate,
        DynamicFormRadio,
        DynamicFormBoolean,
        DynamicFormUpload,
        DynamicFormCustom
    },
    props: {
        formItems: {
            type: Array,
            default: () => []
        },
        showSubmit: {
            type: Boolean,
            default: true
        },
        submitText: {
            type: String,
            default: '提交'
        },
    },
    data() {
        return {
            formData: {},
            errorMessages: {}
        };
    },
    methods: {
        /**
         * 根据 componentType 获取对应的组件名称
         * @param {String} componentType - 组件类型
         * @returns {String} 组件名称
         */
        getComponentByType(componentType) {
            const componentMap = {
                'text': 'DynamicFormText',
                'number': 'DynamicFormNumber',
                'textarea': 'DynamicFormTextarea',
                'checkbox': 'DynamicFormCheckbox',
                'picker': 'DynamicFormPicker',
                'date': 'DynamicFormDate',
                'radio': 'DynamicFormRadio',
                'boolean': 'DynamicFormBoolean',
                'upload': 'DynamicFormUpload',
                'custom': 'DynamicFormCustom'
            };
            return componentMap[componentType] || null;
        },
        /**
         * 获取组件的额外 props
         * @param {Object} item - 表单项配置对象
         * @returns {Object} 组件的 props
         */
        getComponentProps(item, index) {
            const props = {
                fieldLabel: item.fieldLabel || item.fieldKey,
                fieldKey: item.fieldKey,
                required: item.required,
                isLast: index === this.formItems.length - 1,
            };
            // 通用属性
            if (item.placeholder !== undefined) props.placeholder = item.placeholder;
            if (item.clearable !== undefined) props.clearable = item.clearable;
            if (item.disabled !== undefined) props.disabled = item.disabled;
            if (item.readonly !== undefined) props.readonly = item.readonly;
            if (item.maxLength !== undefined) props.maxLength = item.maxLength;
            if (item.options !== undefined) props.options = item.options || [];
            if (item.explain !== undefined) props.explain = item.explain;
            if (item.labelPosition !== undefined) props.labelPosition = item.labelPosition;
            if (item.labelWidth !== undefined) props.labelWidth = item.labelWidth;
            if (item.displayMode !== undefined) props.displayMode = item.displayMode;
            if (item.autoHeight !== undefined) props.autoHeight = item.autoHeight;
            if (item.showWordCount !== undefined) props.showWordCount = item.showWordCount;
            if (item.bodyPositionRight !== undefined) props.bodyPositionRight = item.bodyPositionRight;
            // 数字专属
            if (item.minNumber !== undefined) props.minNumber = item.minNumber;
            if (item.maxNumber !== undefined) props.maxNumber = item.maxNumber;
            if (item.precision !== undefined) props.precision = item.precision;
            if (item.prefix !== undefined) props.prefix = item.prefix;
            if (item.suffix !== undefined) props.suffix = item.suffix;
            // 日期专属
            if (item.dateFormat !== undefined) props.dateFormat = item.dateFormat;
            if (item.startDate !== undefined) props.startDate = item.startDate;
            if (item.endDate !== undefined) props.endDate = item.endDate;
            // 上传专属
            if (item.maxCount !== undefined) props.maxCount = item.maxCount;
            if (item.maxSize !== undefined) props.maxSize = item.maxSize;
            if (item.accept !== undefined) props.accept = item.accept;
            if (item.multiple !== undefined) props.multiple = item.multiple;
            if (item.showUploadTips !== undefined) props.showUploadTips = item.showUploadTips;
            return props;
        },
        /**
         * 获取组件的事件处理函数
         * @param {Object} item - 表单项配置对象
         * @returns {Object} 组件的事件处理函数
         */
        getComponentEvents(item) {
            const eventNameMap = {
                'text': 'input',
                'number': 'input',
                'textarea': 'input',
                'checkbox': 'change',
                'picker': 'change',
                'date': 'change',
                'radio': 'change',
                'boolean': 'change',
                'upload': 'change',
                'custom': 'change'
            };
            const eventName = eventNameMap[item.componentType];
            if (!eventName) return {};
            return {
                [eventName]: (value) => this.handleFieldChange(item.fieldKey, value)
            };
        },
        /**
         * 处理字段值变化
         * @param {String} fieldKey - 表单字段名
         * @param {any} value - 字段的新值
         */
        handleFieldChange(fieldKey, value) {
            this.formData[fieldKey] = value;
            this.errorMessages[fieldKey] = '';
            this.$emit('change', fieldKey, value);
        },
        /**
         * 处理表单提交
         */
        handleSubmit() {
            const errors = {};
            let hasError = false;
            for (let item of this.formItems) {
                if (item.required) {
                    const value = this.formData[item.fieldKey];
                    if (!value || (Array.isArray(value) && value.length === 0)) {
                        errors[item.fieldKey] = `${item.fieldLabel}不能为空`;
                        hasError = true;
                    }
                }
            }
            this.errorMessages = errors;
            if (!hasError) {
                this.$emit('submit', this.formData);
            }
        },
        handleReset() {
            this.formData = {};
            this.errorMessages = {};
        },
        /**
         * 初始化表单数据
         */
        initFormData() {
            this.formItems.forEach(item => {
                this.formData[item.fieldKey] = item.fieldValue !== undefined ? item.fieldValue : '';
            });
        }
    },
    created() {
        this.initFormData();
    }
}
</script>

<style>
.dynamic-form {
    width: 100%;
}

.form-card {
    background-color: #ffffff;
    border-radius: 16rpx;
    overflow: hidden;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
}

.form-submit {
    padding: 40rpx 24rpx;
    background-color: #f9f9f9;
}

.form-submit__btn {
    width: 100%;
    height: 88rpx;
    background-color: #1890ff;
    color: #ffffff;
    border-radius: 12rpx;
    font-size: 32rpx;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
