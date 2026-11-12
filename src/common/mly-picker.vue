<template>
    <picker-view
        class="mly-picker"
        :value="value"
        :indicator-style="indicatorStyle"
        @change="handleChange"
    >
        <picker-view-column v-for="(column, columnIndex) in columns" :key="columnIndex">
            <view v-for="item in column" :key="item.value" class="mly-picker__cell">
                {{ item.label }}
            </view>
        </picker-view-column>
    </picker-view>
</template>

<script>
/**
 * @description 通用滚轮选择器（picker-view 封装），列数与列内容由调用方组织
 * @name MlyPicker
 * @param {Array} columns - 列配置，形如 [[{ label: '2024年', value: 2024 }], ...]，每列为该列的选项数组，value 需在列内唯一（用作 key）
 * @param {Array} value - 各列当前选中的下标数组，与 picker-view 的 value 一致
 * @param {String} indicatorStyle - 选中指示条样式，默认值为height: 88rpx（需与 __cell 高度保持一致）
 * @emits change 滚轮滚动时触发，携带各列选中下标数组 (indexes) => {}
 */
export default {
    name: "MlyPicker",
    emits: ['change'],
    props: {
        columns: {
            type: Array,
            default: () => []
        },
        value: {
            type: Array,
            default: () => []
        },
        indicatorStyle: {
            type: String,
            default: 'height: 88rpx; border-top: 1rpx solid #789cff; border-bottom: 1rpx solid #789cff;'
        }
    },
    methods: {
        /**
         * 滚轮滚动回调，抽取下标数组后上抛
         * @param {Event} e - picker-view change 事件
         */
        handleChange(e) {
            const indexes = (e.detail && e.detail.value) || [];
            this.$emit('change', indexes);
        }
    }
}
</script>

<style>
.mly-picker {
    height: 420rpx;
}

.mly-picker__cell {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 88rpx;
    font-size: 30rpx;
    color: #333333;
}
</style>
