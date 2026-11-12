/**
 * @kext/dynamicform 包入口文件
 * 导出动态表单主组件，供 uni-app 项目通过 npm 安装后直接引用
 */
import DynamicForm from './src/dynamic-form.vue';

/**
 * 默认导出：动态表单组件
 * 用法：import DynamicForm from '@kext/dynamicform'
 */
export default DynamicForm;

/**
 * 具名导出：动态表单组件
 * 用法：import { DynamicForm } from '@kext/dynamicform'
 */
export { DynamicForm };
