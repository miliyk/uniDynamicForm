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
        <view class="dynamic-form-upload">
            <!-- 文件列表 -->
            <view class="upload__list" :class="{ 'upload__list--card': displayMode === UPLOAD_DISPLAY_MODE.CARD }">
                <view class="upload__item" v-for="(file, index) in fileList" :key="file.uid">
                    <!-- 卡片模式 -->
                    <view class="upload__card" v-if="displayMode === UPLOAD_DISPLAY_MODE.CARD">
                        <image class="upload__preview" :src="file.url" mode="aspectFill" @click="handlePreview(index)" />
                        <view class="upload__delete" @click.stop="handleDelete(index)">×</view>
                    </view>
                    <!-- 列表模式 -->
                    <view class="upload__row" v-else>
                        <text class="upload__name">{{ file.name }}</text>
                        <view class="upload__action" @click="handleDelete(index)">删除</view>
                    </view>
                </view>
                <!-- 上传按钮 -->
                <view class="upload__trigger" v-if="fileList.length < maxCount" @click="handleChoose">
                    <text class="upload__icon">+</text>
                    <text class="upload__text">点击上传</text>
                </view>
            </view>
            <!-- 提示信息 -->
            <view class="upload__tips" v-if="showUploadTips">
                <text class="upload__tips-text">
                    单个文件不超过 {{ maxSize }}MB，已上传 {{ fileList.length }}/{{ maxCount }} 个文件。
                </text>
            </view>
        </view>
    </dynamic-copm-layout>
</template>

<script>
import DynamicCopmLayout from '../common/dynamic-copm-layout.vue';

/**
 * 上传展示模式枚举常量
 */
const UPLOAD_DISPLAY_MODE = {
    CARD: 'card',
    LIST: 'list'
};

/**
 * 上传文件类型枚举常量
 */
const UPLOAD_ACCEPT = {
    IMAGE: 'image',
    VIDEO: 'video',
    ALL: 'all'
};

/**
 * @description 文件上传组件
 * @name DynamicFormUpload
 * @param {String} fieldLabel - 表单项标签
 * @param {String} fieldKey - 表单字段名
 * @param {Boolean} required - 是否必填
 * @param {Boolean} isLast - 是否是最后一项（用于控制分割线显示）
 * @param {Array} value - 文件列表 [{ uid, name, url, size }]
 * @param {String} explain - 表单项说明文字
 * @param {String} errorMsg - 错误提示信息
 * @param {String} labelPosition - 标签位置
 * @param {String|Number} labelWidth - 标签宽度
 * @param {String} displayMode - 展示模式：card卡片（默认） | list列表
 * @param {Number} maxCount - 最大上传数量，默认值为9
 * @param {Number} maxSize - 单个文件最大大小（MB），默认值为10
 * @param {String} accept - 文件类型：image图片（默认） | video视频 | all全部
 * @param {Boolean} multiple - 是否允许多选，默认值为true
 * @param {Boolean} showUploadTips - 是否显示提示信息，默认值为true
 * @param {Boolean} bodyPositionRight - body区域是否居右对齐
 * @emits change 文件列表改变时触发
 */
export default {
    name: "DynamicFormUpload",
    emits: ['change'],
    components: {
        DynamicCopmLayout
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
        isLast: {
            type: Boolean,
            default: false
        },
        value: {
            type: Array,
            default: () => []
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
        displayMode: {
            type: String,
            default: UPLOAD_DISPLAY_MODE.CARD,
            validator: (value) => Object.values(UPLOAD_DISPLAY_MODE).includes(value)
        },
        maxCount: {
            type: Number,
            default: 9
        },
        maxSize: {
            type: Number,
            default: 10
        },
        accept: {
            type: String,
            default: UPLOAD_ACCEPT.IMAGE,
            validator: (value) => Object.values(UPLOAD_ACCEPT).includes(value)
        },
        multiple: {
            type: Boolean,
            default: true
        },
        showUploadTips: {
            type: Boolean,
            default: true
        },
        bodyPositionRight: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            fileList: [],
            UPLOAD_DISPLAY_MODE,
            UPLOAD_ACCEPT
        };
    },
    watch: {
        value: {
            handler(val) {
                this.fileList = val || [];
            },
            immediate: true,
            deep: true
        }
    },
    methods: {
        handleChoose() {
            const remainCount = this.maxCount - this.fileList.length;
            if (remainCount <= 0) {
                uni.showToast({ title: `最多上传 ${this.maxCount} 个文件`, icon: 'none' });
                return;
            }
            if (this.accept === UPLOAD_ACCEPT.IMAGE) {
                this.chooseImage(remainCount);
            } else if (this.accept === UPLOAD_ACCEPT.VIDEO) {
                this.chooseVideo();
            } else {
                this.chooseFile(remainCount);
            }
        },
        chooseImage(count) {
            uni.chooseImage({
                count: this.multiple ? count : 1,
                sizeType: ['compressed'],
                sourceType: ['album', 'camera'],
                success: (res) => {
                    this.processFiles(res.tempFilePaths, res.tempFiles);
                }
            });
        },
        chooseVideo() {
            uni.chooseVideo({
                sourceType: ['album', 'camera'],
                compressed: true,
                success: (res) => {
                    const files = [{ path: res.tempFilePath, size: res.size, name: res.name || '视频文件' }];
                    this.processFiles([res.tempFilePath], files);
                }
            });
        },
        chooseFile(count) {
            // #ifdef H5
            uni.chooseFile && uni.chooseFile({
                count: this.multiple ? count : 1,
                success: (res) => {
                    this.processFiles(res.tempFilePaths, res.tempFiles);
                }
            });
            // #endif
            // #ifndef H5
            this.chooseImage(count);
            // #endif
        },
        processFiles(paths, files) {
            const maxSizeBytes = this.maxSize * 1024 * 1024;
            const newFiles = [];
            for (let i = 0; i < paths.length; i++) {
                const file = files[i];
                if (file.size > maxSizeBytes) {
                    uni.showToast({ title: `文件 ${file.name || i + 1} 超过 ${this.maxSize}MB`, icon: 'none' });
                    continue;
                }
                newFiles.push({
                    uid: Date.now() + '_' + i,
                    name: file.name || `文件${i + 1}`,
                    url: paths[i],
                    size: file.size
                });
            }
            this.fileList = [...this.fileList, ...newFiles].slice(0, this.maxCount);
            this.emitChange();
        },
        handleDelete(index) {
            this.fileList.splice(index, 1);
            this.emitChange();
        },
        handlePreview(index) {
            const urls = this.fileList.map(f => f.url);
            uni.previewImage({
                current: index,
                urls: urls
            });
        },
        emitChange() {
            this.$emit('change', this.fileList);
        }
    }
}
</script>

<style lang="scss">
@import '../dynamic-form.scss';

.dynamic-form-upload {
    width: 100%;
}

.upload__list {
    display: flex;
    flex-wrap: wrap;
}

.upload__list--card {
    gap: 12rpx;
}

.upload__item {
    position: relative;
}

.upload__list:not(.upload__list--card) .upload__item {
    width: 100%;
}

.upload__card {
    width: 140rpx;
    height: 140rpx;
    border-radius: 8rpx;
    overflow: hidden;
    position: relative;
}

.upload__preview {
    width: 100%;
    height: 100%;
}

.upload__delete {
    position: absolute;
    top: 0;
    right: 0;
    width: 36rpx;
    height: 36rpx;
    line-height: 36rpx;
    background-color: rgba(0, 0, 0, 0.5);
    color: #ffffff;
    font-size: 28rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom-left-radius: 8rpx;
}

.upload__row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 8rpx;
    width: 100%;
}

.upload__name {
    flex: 1;
    min-width: 0;
    font-size: 24rpx;
    color: #333333;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.upload__action {
    font-size: 24rpx;
    color: #ff4d4f;
    padding: 8rpx 16rpx;
    flex-shrink: 0;
}

.upload__trigger {
    width: 140rpx;
    height: 140rpx;
    border: 2rpx dashed #d9d9d9;
    border-radius: 8rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: $df-field-bg;
}

.upload__list:not(.upload__list--card) .upload__trigger {
    margin-top: 16rpx;
}

.upload__icon {
    font-size: 32rpx;
    color: #999999;
    line-height: 1;
}

.upload__text {
    font-size: 20rpx;
    color: #999999;
    margin-top: 8rpx;
}

.upload__tips {
    margin-top: 10rpx;
}

.upload__tips-text {
    font-size: 20rpx;
    color: #999999;
}
</style>
