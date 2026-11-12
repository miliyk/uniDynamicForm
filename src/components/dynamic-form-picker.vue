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
        <view class="dynamic-form-picker">
            <dynamic-copm-select
                :display-text="displayText"
                :is-placeholder="!hasValue"
                @tap="openPicker"
            />
            <mly-popup
                :title="fieldLabel || '请选择'"
                :visible="popupVisible"
                height="30%"
                @confirm="confirmPicker"
                @close="closePicker"
            >
                <mly-picker
                    :columns="[options]"
                    :value="[tempIndex]"
                    @change="handlePickerChange"
                ></mly-picker>
            </mly-popup>
        </view>
    </dynamic-copm-layout>
</template>

<script>
import DynamicCopmLayout from '../common/dynamic-copm-layout.vue';
import DynamicCopmSelect from '../common/dynamic-copm-select.vue';
import MlyPicker from '../common/mly-picker.vue';
import MlyPopup from '../common/mly-popup.vue';

/**
 * @description 选择器组件
 * @name DynamicFormPicker
 * @param {String} fieldLabel - 表单项标签
 * @param {String} fieldKey - 表单字段名
 * @param {Boolean} required - 是否必填
 * @param {String} placeholder - 占位提示文字
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
    name: "DynamicFormPicker",
    emits: ['change'],
    components: {
        DynamicCopmLayout,
        DynamicCopmSelect,
        MlyPicker,
        MlyPopup
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
            default: '请选择'
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
    data() {
        return {
            popupVisible: false,
            tempIndex: 0
        };
    },
    computed: {
        /**
         * picker 当前选中项的索引
         * @returns {Number} 索引值
         */
        selectedIndex() {
            const index = this.options.findIndex(opt => opt.value === this.value);
            return index > -1 ? index : 0;
        },
        hasValue() {
            return this.value !== '' && this.value !== null && this.value !== undefined;
        },
        displayText() {
            if (!this.hasValue) return this.placeholder;
            const selected = this.options.find(opt => opt.value === this.value);
            return selected ? selected.label : this.placeholder;
        }
    },
    methods: {
        openPicker() {
            this.tempIndex = this.selectedIndex;
            this.popupVisible = true;
        },
        closePicker() {
            this.popupVisible = false;
        },
        confirmPicker() {
            const selected = this.options[this.tempIndex];
            if (selected) {
                this.$emit('change', selected.value);
            }
            this.closePicker();
        },
        /**
         * picker 选中回调
         * @param {Array} indexes - mly-picker 回传的各列选中下标数组
         */
        handlePickerChange(indexes) {
            this.tempIndex = indexes[0];
        }
    }
}
</script>

<style lang="scss">
@import '../dynamic-form.scss';

.dynamic-form-picker {
    width: 100%;
}
</style>
