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
        <view class="dynamic-form-date">
            <dynamic-copm-select
                :display-text="displayText"
                :is-placeholder="!hasValue"
                @tap="openPicker"
            />

            <!-- 自定义日期弹层（替代原生 picker，样式各端统一） -->
            <mly-popup
                :title="fieldLabel || '选择日期'"
                :visible="popupVisible"
                height="260px"
                @confirm="confirmPicker"
                @close="closePicker"
            >
                <mly-picker
                    :columns="wheelColumns"
                    :value="pickerIndexes"
                    @change="handleWheelChange"
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
 * 选择器粒度枚举
 */
const DATE_MODE = {
    YEAR: 'year',
    MONTH: 'month',
    DAY: 'day'
};

/**
 * 未配置 startDate / endDate 时的默认可选范围
 */
const DEFAULT_START = { year: 1900, month: 1, day: 1 };
const DEFAULT_END = { year: 2100, month: 12, day: 31 };

/**
 * @description 日期选择组件（自定义底部弹层 + 通用滚轮组件 MlyPicker）
 * @name DynamicFormDate
 * @param {String} fieldLabel - 表单项标签
 * @param {String} fieldKey - 表单字段名
 * @param {Boolean} required - 是否必填
 * @param {String} placeholder - 占位提示文字
 * @param {Boolean} isLast - 是否是最后一项（用于控制分割线显示）
 * @param {String} value - 选中的日期值
 * @param {String} explain - 表单项说明文字
 * @param {String} errorMsg - 错误提示信息
 * @param {String} labelPosition - 标签位置
 * @param {String|Number} labelWidth - 标签宽度
 * @param {String} dateFormat - 日期格式，默认值为YYYY-MM-DD
 * @param {String} startDate - 可选日期范围起始（YYYY-MM-DD）
 * @param {String} endDate - 可选日期范围结束（YYYY-MM-DD）
 * @param {String} displayMode - 选择器粒度：year年 | month月 | day日（默认）
 * @param {Boolean} bodyPositionRight - body区域是否居右对齐
 * @emits change 确认选择后触发，值随 displayMode 粒度：year→YYYY，month→YYYY-MM，day→YYYY-MM-DD
 */
export default {
    name: "DynamicFormDate",
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
            default: '请选择日期'
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
        dateFormat: {
            type: String,
            default: 'YYYY-MM-DD'
        },
        startDate: {
            type: String,
            default: ''
        },
        endDate: {
            type: String,
            default: ''
        },
        displayMode: {
            type: String,
            default: DATE_MODE.DAY
        },
        bodyPositionRight: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            popupVisible: false,
            tempDate: { year: DEFAULT_START.year, month: DEFAULT_START.month, day: DEFAULT_START.day }
        };
    },
    computed: {
        hasValue() {
            return this.value !== '' && this.value !== null && this.value !== undefined;
        },
        displayText() {
            if (!this.hasValue) return this.placeholder;
            return this.value;
        },
        /**
         * 归一化后的选择粒度，非法值回退为 day
         */
        mode() {
            return Object.values(DATE_MODE).includes(this.displayMode) ? this.displayMode : DATE_MODE.DAY;
        },
        showMonthColumn() {
            return this.mode === DATE_MODE.MONTH || this.mode === DATE_MODE.DAY;
        },
        showDayColumn() {
            return this.mode === DATE_MODE.DAY;
        },
        startBoundary() {
            return this.parseBoundary(this.startDate, DEFAULT_START);
        },
        endBoundary() {
            return this.parseBoundary(this.endDate, DEFAULT_END);
        },
        yearOptions() {
            const min = Math.min(this.startBoundary.year, this.endBoundary.year);
            const max = Math.max(this.startBoundary.year, this.endBoundary.year);
            return this.buildRangeList(min, max);
        },
        /**
         * 月份列选项随当前滚动年份收窄（受 start/end 边界约束）
         */
        monthOptions() {
            const [min, max] = this.monthRangeOf(this.tempDate.year);
            return this.buildRangeList(min, max);
        },
        /**
         * 日期列选项随当前滚动年月收窄（受 start/end 边界与当月天数约束）
         */
        dayOptions() {
            const [min, max] = this.dayRangeOf(this.tempDate.year, this.tempDate.month);
            return this.buildRangeList(min, max);
        },
        /**
         * 滚轮列配置，每列为 [{ label, value }]：year 恒显，month 见 month/day，day 仅 day
         */
        wheelColumns() {
            const columns = [
                this.yearOptions.map(year => ({ label: `${year}年`, value: year }))
            ];
            if (this.showMonthColumn) {
                columns.push(this.monthOptions.map(month => ({ label: `${month}月`, value: month })));
            }
            if (this.showDayColumn) {
                columns.push(this.dayOptions.map(day => ({ label: `${day}日`, value: day })));
            }
            return columns;
        },
        /**
         * 滚轮各列的选中下标（由临时选中值反查）
         */
        pickerIndexes() {
            const indexes = [this.indexOfOption(this.yearOptions, this.tempDate.year)];
            if (this.showMonthColumn) {
                indexes.push(this.indexOfOption(this.monthOptions, this.tempDate.month));
            }
            if (this.showDayColumn) {
                indexes.push(this.indexOfOption(this.dayOptions, this.tempDate.day));
            }
            return indexes;
        }
    },
    methods: {
        /**
         * 解析 YYYY / YYYY-MM / YYYY-MM-DD 形式的边界串，缺省或非法部分用 fallback 补齐
         * @param {String} str - 边界字符串
         * @param {Object} fallback - 解析失败时的兜底值 { year, month, day }
         * @returns {Object} { year, month, day }
         */
        parseBoundary(str, fallback) {
            const parts = String(str || '').split('-');
            const year = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10);
            const day = parseInt(parts[2], 10);
            return {
                year: year > 0 ? year : fallback.year,
                month: month >= 1 && month <= 12 ? month : fallback.month,
                day: day >= 1 && day <= 31 ? day : fallback.day
            };
        },
        buildRangeList(min, max) {
            const list = [];
            for (let i = min; i <= max; i++) {
                list.push(i);
            }
            return list;
        },
        /**
         * 指定年份下月份的可选范围（起始/结束年份时被边界收窄）
         * @returns {Array} [min, max]
         */
        monthRangeOf(year) {
            let min = 1;
            let max = 12;
            if (year === this.startBoundary.year) min = this.startBoundary.month;
            if (year === this.endBoundary.year) max = this.endBoundary.month;
            return min <= max ? [min, max] : [min, min];
        },
        /**
         * 指定年月下日期的可选范围（起始/结束年月时被边界收窄，并限制在当月天数内）
         * @returns {Array} [min, max]
         */
        dayRangeOf(year, month) {
            const daysInMonth = new Date(year, month, 0).getDate();
            let min = 1;
            let max = daysInMonth;
            if (year === this.startBoundary.year && month === this.startBoundary.month) {
                min = this.startBoundary.day;
            }
            if (year === this.endBoundary.year && month === this.endBoundary.month) {
                max = Math.min(this.endBoundary.day, daysInMonth);
            }
            return min <= max ? [min, max] : [min, min];
        },
        indexOfOption(list, value) {
            const index = list.indexOf(value);
            return index > -1 ? index : 0;
        },
        clampValue(min, max, value) {
            return Math.min(max, Math.max(min, value));
        },
        /**
         * 从滚轮列配置中按下标取选项值
         */
        pickValue(column, index, fallback) {
            return column && column[index] !== undefined ? column[index].value : fallback;
        },
        /**
         * 打开弹层：以当前值（空值取今天）收窄到合法范围后初始化临时选中值
         */
        openPicker() {
            this.tempDate = this.resolveTempDate();
            this.popupVisible = true;
        },
        resolveTempDate() {
            const parts = String(this.value || '').split('-').map(n => parseInt(n, 10));
            const now = new Date();
            let year = parts[0] > 0 ? parts[0] : now.getFullYear();
            let month = parts[1] >= 1 && parts[1] <= 12 ? parts[1] : now.getMonth() + 1;
            let day = parts[2] >= 1 && parts[2] <= 31 ? parts[2] : now.getDate();
            year = this.clampValue(this.startBoundary.year, this.endBoundary.year, year);
            const [minMonth, maxMonth] = this.monthRangeOf(year);
            month = this.clampValue(minMonth, maxMonth, month);
            const [minDay, maxDay] = this.dayRangeOf(year, month);
            day = this.clampValue(minDay, maxDay, day);
            return { year, month, day };
        },
        closePicker() {
            this.popupVisible = false;
        },
        /**
         * 滚轮滚动回调：按各列下标回取年月日，并逐列收窄到新范围（如 1月31日 滚到 2月自动变 28 日）
         * @param {Array} indexes - mly-picker 回传的各列选中下标数组
         */
        handleWheelChange(indexes) {
            let cursor = 0;
            const year = this.pickValue(this.wheelColumns[cursor], indexes[cursor], this.tempDate.year);
            cursor++;
            let month = this.tempDate.month;
            let day = this.tempDate.day;
            if (this.showMonthColumn) {
                const [minMonth, maxMonth] = this.monthRangeOf(year);
                month = this.clampValue(minMonth, maxMonth, this.pickValue(this.wheelColumns[cursor], indexes[cursor], month));
                cursor++;
            }
            if (this.showDayColumn) {
                const [minDay, maxDay] = this.dayRangeOf(year, month);
                day = this.clampValue(minDay, maxDay, this.pickValue(this.wheelColumns[cursor], indexes[cursor], day));
            }
            this.tempDate = { year, month, day };
        },
        /**
         * 确认选择：按 displayMode 粒度输出值并通知父级
         */
        confirmPicker() {
            this.$emit('change', this.buildValue());
            this.closePicker();
        },
        buildValue() {
            const { year, month, day } = this.tempDate;
            const pad = n => (n < 10 ? '0' + n : '' + n);
            if (this.showDayColumn) return `${year}-${pad(month)}-${pad(day)}`;
            if (this.showMonthColumn) return `${year}-${pad(month)}`;
            return `${year}`;
        }
    }
}
</script>

<style>
.dynamic-form-date {
    width: 100%;
}
</style>
