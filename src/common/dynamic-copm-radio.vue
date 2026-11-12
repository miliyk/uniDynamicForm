<template>
    <view
        class="radio-icon"
        :class="{
            'radio-icon--checked': checked,
            'radio-icon--disabled': disabled
        }"
        @click.stop="handleClick"
    >
    </view>
</template>

<script>
/**
 * @description 动态表单公用单选图标组件
 * @name DynamicCopmRadio
 * @param {Boolean} checked - 是否选中
 * @param {Boolean} disabled - 是否禁用（禁用时点击无效）
 * @emits toggle 点击图标时派发，由父级负责切换选中状态
 */
export default {
    name: "DynamicCopmRadio",
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

.radio-icon {
    width: 32rpx;
    height: 32rpx;
    border: 2rpx solid #dcdfe6;
    border-radius: 50%;
    margin-right: 12rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: $df-field-bg;
    transition: all 0.2s;
    position: relative;
    cursor: pointer;
}

.radio-icon--checked {
    border-color: $df-primary-color;
}

.radio-icon--checked::after {
    content: '';
    display: block;
    width: 16rpx;
    height: 16rpx;
    border-radius: 50%;
    background-color: $df-primary-color;
    position: absolute;
}

.radio-icon--disabled {
    @include df-field-disabled;
    cursor: not-allowed;
}
</style>
