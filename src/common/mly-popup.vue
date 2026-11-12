<template>
    <view class="mly-popup" :class="{show: visible}">
        <view class="mly-popup__overlay" @tap="onClose"></view>
        <view class="mly-popup__container">
            <view class="mly-popup__header">
                <view class="header-btn" @tap="onClose">取消</view>
                <view class="header-title ellipsis">{{title}}</view>
                <view class="header-btn" @tap="onConfirm">确认</view>
            </view>
            <view class="mly-popup__content">
                <slot></slot>
            </view>
        </view>
    </view>
</template>

<script>
    /** header 高度常量（padding-top 41.66667rpx + padding-bottom 33.33333rpx + 行高约 50rpx ≈ 125rpx） */
    const HEADER_HEIGHT = 125;

    /**
     * @description 公用弹出组件，弹出方向为底部
     * @param {String} title 标题
     * @param {Boolean} visible 是否可见
     * @param {String} height 内容区域高度，支持百分比或具体数值（如 '50%'、'500rpx'），容器总高度会自动加上 header 部分
     * @emits confirm 确认事件
     * @emits close 关闭事件
     * @example 示例：<mly-popup title="标题" :visible="visible" height="50%"></mly-popup>
     */
    export default {
        name: "MlyPopup",
        emits: ['confirm', 'close'],
        props: {
            title: {
                type: String,
                default: '请选择'
            },
            visible: {
                type: Boolean,
                default: false
            },
            height: {
                type: String,
                default: '50%'
            }
        },
        computed: {
            /** 容器总高度 = 内容区高度 + header 高度 */
            containerHeight() {
                return `calc(${this.height} + ${HEADER_HEIGHT}rpx)`;
            }
        },
        methods: {
            onConfirm() {
                this.$emit("confirm");
            },
            onClose() {
                this.$emit("close");
            }
        }
    }
</script>

<style lang="scss">
    .mly-popup {
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
        visibility: hidden;
        z-index: 810;
        -webkit-transition: visibility 300ms cubic-bezier(0.36, 0.66, 0.04, 1);
        transition: visibility 300ms cubic-bezier(0.36, 0.66, 0.04, 1);

        .mly-popup__container {
            width: 100%;
            height: v-bind(containerHeight);
            max-height: 1979.16667rpx;
            position: absolute;
            bottom: 0;
            padding: 0rpx 0 20.83333rpx 0;
            border-radius: 20.83333rpx 20.83333rpx 0 0;
            background-color: #FFF;
            display: flex;
            flex-direction: column;
            -webkit-transform: translate3d(0, 100%, 0);
            transform: translate3d(0, 100%, 0);
            -webkit-transition: -webkit-transform 300ms cubic-bezier(0.36, 0.66, 0.04, 1);
            transition: -webkit-transform 300ms cubic-bezier(0.36, 0.66, 0.04, 1);
            transition: transform 300ms cubic-bezier(0.36, 0.66, 0.04, 1);
            transition: transform 300ms cubic-bezier(0.36, 0.66, 0.04, 1), -webkit-transform 300ms cubic-bezier(0.36, 0.66, 0.04, 1);
            
            .mly-popup__header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 41.66667rpx 33.33333rpx 33.33333rpx;
                box-sizing: border-box;
                line-height: 1.5;
                font-size: 33.33333rpx;
                font-weight: bold;
                .header-title {
                    width: 65%;
                    display: block;
                    color: #333;
                    text-align: center;
                }
                .header-btn {
                    color: #3355ff;
                }
            }
            
            .mly-popup__content {
                flex: 1;
                overflow: auto;
            }
        }

        .mly-popup__overlay {
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            background-color: rgba(0, 0, 0, 0.3);
            opacity: 0;
            -webkit-transition: opacity 150ms ease-in;
            transition: opacity 150ms ease-in;
        }
    }

    .mly-popup.show {
        visibility: visible;
        .mly-popup__container {
            -webkit-transform: translate3d(0, 0, 0);
            transform: translate3d(0, 0, 0);
        }
        .mly-popup__overlay {
            opacity: 1;
        }
    }
</style>
