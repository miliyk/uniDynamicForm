<template>
    <view
        v-if="visible"
        class="clearable"
        :class="{ 'clearable--disabled': disabled }"
        @click="handleClick"
    >
        <text class="clearable__text">×</text>
    </view>
</template>

<script>
/**
 * @description 动态表单公用清除按钮组件
 * @name DynamicCopmClearable
 * @param {Boolean} visible - 是否显示清除按钮
 * @param {Boolean} disabled - 是否禁用（禁用时点击无效）
 * @emits clear 点击清除按钮时触发
 */
export default {
    name: "DynamicCopmClearable",
    emits: ['clear'],
    props: {
        visible: {
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
            this.$emit('clear');
        }
    }
}
</script>

<style lang="scss">
@import '../dynamic-form.scss';

.clearable {
    @include df-clear-btn;
}

.clearable--disabled {
    cursor: not-allowed;
    opacity: 0.5;
}

.clearable__text {
    @include df-clear-text;
}
</style>
