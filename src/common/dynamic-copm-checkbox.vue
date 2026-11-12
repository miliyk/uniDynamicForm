<template>
    <view
        class="checkbox-icon"
        :class="{
            'checkbox-icon--checked': checked,
            'checkbox-icon--disabled': disabled
        }"
        @click.stop="handleClick"
    >
    </view>
</template>

<script>
/**
 * @description 动态表单公用复选框图标组件
 * @name DynamicCopmCheckbox
 * @param {Boolean} checked - 是否选中
 * @param {Boolean} disabled - 是否禁用（禁用时点击无效）
 * @emits toggle 点击图标时派发，由父级负责切换选中状态
 */
export default {
    name: "DynamicCopmCheckbox",
    emits: ['toggle'],
    props: {
        checked: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        handleClick() {
            if (this.disabled) return;
            this.$emit('toggle');
        }
    }
}
</script>

<style lang="scss">
@import '../dynamic-form.scss';

.checkbox-icon {
    width: 32rpx;
    height: 32rpx;
    border: 2rpx solid #dcdfe6;
    border-radius: 4rpx;
    margin-right: 12rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: $df-field-bg;
    transition: all 0.2s;
    position: relative;
    cursor: pointer;
}

.checkbox-icon--checked {
    background-color: $df-primary-color;
    border-color: $df-primary-color;
}

.checkbox-icon--checked::after {
    content: '';
    display: block;
    width: 8rpx;
    height: 16rpx;
    border: solid #ffffff;
    border-width: 0 4rpx 4rpx 0;
    transform: rotate(45deg);
    position: absolute;
    left: 10rpx;
    bottom: 8rpx;
}

.checkbox-icon--disabled {
    @include df-field-disabled;
    cursor: not-allowed;
}
</style>
