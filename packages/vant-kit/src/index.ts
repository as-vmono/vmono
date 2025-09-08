/**
 * 组件导出
 */
// 着色名称头像
export { default as ColoringAvatar } from './ColoringAvatar/ColoringAvatar.vue';
// 多选表单组件
export { default as FieldMultiPicker } from './FieldMultiPicker/FieldMultiPicker.vue';
// 单选表单组件
export { default as FieldSinglePicker } from './FieldSinglePicker/FieldSinglePicker.vue';
// 多选组件
export {
  default as MultiPicker,
  type TMultiPickerProps,
  type TConfirmEventPayload,
} from './MultiPicker/MultiPicker.vue';
// 单选组件
export {
  default as SinglePicker,
  type TSinglePickerProps,
  type TSPConfirmDisabledOptionPayload,
} from './SinglePicker/SinglePicker.vue';
