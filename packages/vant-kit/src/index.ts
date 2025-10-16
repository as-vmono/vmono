// 基础样式
import './global.less';

/**
 * 展示组件
 */
// 着色名称头像
export { default as ColoringAvatar } from './ColoringAvatar/ColoringAvatar.vue';

/**
 * 基础组件
 */
// 复制文本触发器组件
export { default as CopyTxtTrigger } from './CopyTxtTrigger/CopyTxtTrigger.vue';
export type * from './CopyTxtTrigger/CopyTxtTrigger.vue';
// 单选组件
export { default as SinglePicker } from './SinglePicker/SinglePicker.vue';
export type * from './SinglePicker/SinglePicker.vue';
// 多选组件
export { default as MultiPicker } from './MultiPicker/MultiPicker.vue';
export type * from './MultiPicker/MultiPicker.vue';
// 日期选择组件
export { default as DatePicker } from './DatePicker/DatePicker.vue';
export type * from './DatePicker/DatePicker.vue';
// 日期范围选择组件
export { default as DateRangePicker } from './DateRangePicker/DateRangePicker.vue';
export type * from './DateRangePicker/DateRangePicker.vue';

/**
 * 表单组件
 */
// 脱敏文本表单组件
export { default as FieldMaskTxt } from './FieldMaskTxt/FieldMaskTxt.vue';
export type * from './FieldMaskTxt/FieldMaskTxt.vue';
// 开关按钮表单组件
export { default as FieldSwitchBtn } from './FieldSwitchBtn/FieldSwitchBtn.vue';
export type * from './FieldSwitchBtn/FieldSwitchBtn.vue';
// 单选表单组件
export { default as FieldSinglePicker } from './FieldSinglePicker/FieldSinglePicker.vue';
// 多选表单组件
export { default as FieldMultiPicker } from './FieldMultiPicker/FieldMultiPicker.vue';
// 多选表单组件
export { default as FieldDatePicker } from './FieldDatePicker/FieldDatePicker.vue';
// 日期范围表单组件
export { default as FieldDateRangePicker } from './FieldDateRangePicker/FieldDateRangePicker.vue';

/**
 * 业务组件
 */
// 脱敏文本组件
export { default as MaskTxt } from './MaskTxt/MaskTxt.vue';
export type * from './MaskTxt/MaskTxt.vue';
// 滑动验证码组件
export { default as SliderVerify } from './SliderVerify/SliderVerify.vue';
export type * from './SliderVerify/SliderVerify.vue';
