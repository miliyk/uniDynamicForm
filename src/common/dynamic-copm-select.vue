<template>
    <view
        class="select__trigger"
        :class="{ 'select__trigger--disabled': disabled }"
        @tap="handleTap"
    >
        <text class="select__value" :class="{ 'select__value--placeholder': isPlaceholder }">
            {{ displayText }}
        </text>
        <text class="select__arrow">▾</text>
    </view>
</template>

<script>
/**
 * @description 动态表单公用选择触发器组件
 * @name DynamicCopmSelect
 * @param {String} displayText - 触发器上显示的文案（已选中时为选项 label，未选中时为 placeholder）
 * @param {Boolean} isPlaceholder - 是否处于 placeholder 状态（用于切换占位色）
 * @param {Boolean} disabled - 是否禁用（禁用时点击无效）
 * @emits tap 点击触发器时派发，由父级负责打开弹层
 */
export default {
    name: "DynamicCopmSelect",
    emits: ['tap'],
    props: {
        displayText: {
            type: String,
            default: ''
        },
        isPlaceholder: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        handleTap() {
            if (this.disabled) return;
            this.$emit('tap');
        }
    }
}
</script>

<style lang="scss">
@import '../dynamic-form.scss';

.select__trigger {
    @include df-field-base;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.select__trigger--disabled {
    @include df-field-disabled;
}

.select__value {
    font-size: $df-field-font-size;
    color: $df-field-color;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.select__value--placeholder {
    @include df-field-placeholder;
}

.select__arrow {
    font-size: 48rpx;
    color: $df-clear-bg;
    margin-left: 12rpx;
    margin-bottom: 4rpx;
    line-height: 1;
}
</style>
