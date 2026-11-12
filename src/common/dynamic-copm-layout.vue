<template>
    <view
        class="form-item"
        :class="{
            'form-item--last': isLast,
            'form-item--horizontal': isHorizontal
        }"
    >
        <!-- 表单标签 -->
        <view class="form-item__label" v-if="fieldLabel" :style="labelStyle">
            <text v-if="required" class="form-item__required">*</text>
            <text class="form-item__label-text">{{ fieldLabel }}</text>
        </view>

        <view class="form-item__body" :class="{ 'form-item__body--right': bodyPositionRight }">
            <!-- 表单内容区域 -->
            <view class="form-item__content">
                <slot></slot>
            </view>

            <!-- 说明文字 -->
            <view class="form-item__explain" v-if="explain">
                <text class="form-item__explain-text">{{ explain }}</text>
            </view>

            <!-- 错误提示 -->
            <view class="form-item__error" v-if="errorMessage">
                <text class="form-item__error-text">{{ errorMessage }}</text>
            </view>
        </view>
    </view>
</template>

<script>
/**
 * 标签位置枚举
 * TOP：标签在上、控件在下（上下结构）
 * LEFT：标签在左、控件在右（左右结构）
 */
const LABEL_POSITION = {
    TOP: 'top',
    LEFT: 'left'
};

/**
 * @description 动态表单布局组件
 * @name DynamicCopmLayout
 * @param {String} fieldLabel - 表单项标签，默认值为--
 * @param {Boolean} required - 是否必填，默认值为false
 * @param {Boolean} isLast - 是否是最后一项（用于控制分割线显示）
 * @param {String} explain - 表单项说明文字
 * @param {String} errorMessage - 错误提示信息
 * @param {String} labelPosition - 标签位置：top（上下结构）/ left（左右结构），默认值为top
 * @param {String|Number} labelWidth - 标签宽度，仅左右结构生效；数字按 rpx 处理，字符串原样使用（如 '200rpx'），默认值为160rpx
 * @param {Boolean} bodyPositionRight - body区域是否居右对齐，默认值为false
 */
export default {
    name: "DynamicCopmLayout",
    props: {
        fieldLabel: {
            type: String,
            default: '--'
        },
        required: {
            type: Boolean,
            default: false
        },
        isLast: {
            type: Boolean,
            default: false
        },
        explain: {
            type: String,
            default: ''
        },
        errorMessage: {
            type: String,
            default: ''
        },
        labelPosition: {
            type: String,
            default: LABEL_POSITION.TOP,
            validator: (value) => Object.values(LABEL_POSITION).includes(value)
        },
        labelWidth: {
            type: [String, Number],
            default: '160rpx'
        },
        bodyPositionRight: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        /**
         * 是否为左右结构
         * @returns {Boolean}
         */
        isHorizontal() {
            return this.labelPosition === LABEL_POSITION.LEFT;
        },
        /**
         * 标签行内样式，左右结构时设置标签宽度
         * @returns {Object}
         */
        labelStyle() {
            if (!this.isHorizontal) return {};
            const width = typeof this.labelWidth === 'number' ? `${this.labelWidth}rpx` : this.labelWidth;
            return { width };
        }
    }
}
</script>

<style>
.form-item {
    padding: 32rpx 24rpx;
    border-bottom: 1rpx solid #f0f0f0;
}

.form-item--last {
    border-bottom: none;
}

.form-item__label {
    display: flex;
    align-items: center;
    margin-bottom: 16rpx;
}

.form-item__required {
    color: #ff4d4f;
    font-size: 28rpx;
    margin-right: 4rpx;
}

.form-item__label-text {
    font-size: 28rpx;
    color: #333333;
    font-weight: 500;
}

.form-item__body {
    width: 100%;
}

.form-item__body--right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
}

.form-item__body--right .form-item__content {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    width: 100%;
}

.form-item__body--right .form-item__explain {
    text-align: right;
}

.form-item__body--right .form-item__error {
    text-align: right;
}

.form-item__content {
    width: 100%;
}

.form-item__explain {
    line-height: 1.1;
    margin-top: 0rpx;
}

.form-item__explain-text {
    font-size: 22rpx;
    color: #909399;
}

.form-item__error {
    line-height: 1.1;
    margin-top: 0rpx;
}

.form-item__error-text {
    font-size: 22rpx;
    color: #ff4d4f;
}

/* 左右结构：标签固定宽度居左，控件区域占满剩余空间 */
.form-item--horizontal {
    display: flex;
    align-items: flex-start;
    padding: 20rpx 24rpx;
}

.form-item--horizontal .form-item__label {
    flex-shrink: 0;
    min-height: 60rpx;
    margin-bottom: 0;
    padding-right: 16rpx;
    box-sizing: border-box;
}

.form-item--horizontal .form-item__label-text {
    word-break: break-all;
}

.form-item--horizontal .form-item__body {
    flex: 1;
    min-width: 0;
}

.form-item--horizontal .form-item__content {
    min-height: 60rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;
}
</style>
