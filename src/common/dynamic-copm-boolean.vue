<template>
    <view 
        class="copm-boolean" 
        :class="[`copm-boolean--${mode}`, { 'copm-boolean--active': value === true }]"
        :style="trackStyle"
        @click="handleClick"
    >
        <view class="copm-boolean__knob" :style="knobStyle"></view>
    </view>
</template>

<script>
import { BOOLEAN_MODE_ENUM } from '../dynamic-form.js';

/**
 * @description 布尔开关（公用组件）
 * @name DynamicCopmBoolean
 * @param {Boolean|Null} value - 当前值：true右 | false左 | null中（默认）
 * @param {String} mode - 开关类型：circle圆形（默认） | round圆角 | line线性
 * @emits change 值改变时触发
 */
export default {
    name: "DynamicCopmBoolean",
    emits: ['change'],
    props: {
        value: {
            type: [Boolean, null],
            default: null
        },
        mode: {
            type: String,
            default: BOOLEAN_MODE_ENUM.CIRCLE,
            validator: (v) => Object.values(BOOLEAN_MODE_ENUM).includes(v)
        }
    },
    computed: {
        /**
         * 滑块样式：根据 mode 和 value 计算尺寸与位置
         */
        knobStyle() {
            /**
             * 配置项
             * @property {Number} size - 滑块尺寸
             * @property {Number} padding - 滑块内边距
             * @property {Number} trackWidth - 轨道宽度
             * @property {String} borderRadius - 滑块圆角
             */
            const configs = {
                [BOOLEAN_MODE_ENUM.CIRCLE]: { size: 28, padding: 5, trackWidth: 66, borderRadius: '50%' },
                [BOOLEAN_MODE_ENUM.ROUND]: { size: 28, padding: 5, trackWidth: 66, borderRadius: '6rpx' },
                [BOOLEAN_MODE_ENUM.LINE]: { size: 28, padding: 0, trackWidth: 66, borderRadius: '50%' }
            };
            const cfg = configs[this.mode];
            const travel = cfg.trackWidth - cfg.size - cfg.padding * 2;
            const positions = {
                false: cfg.padding,
                null: cfg.padding + travel / 2,
                true: cfg.padding + travel
            };
            const left = positions[this.value] ?? positions.null;
            return {
                width: `${cfg.size}rpx`,
                height: `${cfg.size}rpx`,
                borderRadius: cfg.borderRadius,
                left: `${left}rpx`
            };
        },
        /**
         * 轨道尺寸与圆角
         */
        trackStyle() {
            const heightMap = { [BOOLEAN_MODE_ENUM.CIRCLE]: 38, [BOOLEAN_MODE_ENUM.ROUND]: 38, [BOOLEAN_MODE_ENUM.LINE]: 10 };
            const radiusMap = { [BOOLEAN_MODE_ENUM.CIRCLE]: '19rpx', [BOOLEAN_MODE_ENUM.ROUND]: '8rpx', [BOOLEAN_MODE_ENUM.LINE]: '5rpx' };
            return {
                width: '66rpx',
                height: `${heightMap[this.mode]}rpx`,
                borderRadius: radiusMap[this.mode]
            };
        }
    },
    methods: {
        /**
         * 点击循环切换：null → true → false → null
         */
        handleClick() {
            const next = { null: true, true: false, false: null };
            this.$emit('change', next[this.value] ?? true);
        }
    }
}
</script>

<style lang="scss">
@import '../dynamic-form.scss';

.copm-boolean {
    position: relative;
    background-color: $df-field-bg;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &--active {
        background-color: $df-primary-color;
    }
}

/* line 模式需要额外上下间距，让滑块不溢出 */
.copm-boolean--line {
    margin: 20rpx 0;
}

.copm-boolean__knob {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background-color: #ffffff;
    box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.15);
    transition: left 0.3s ease;
}
</style>
