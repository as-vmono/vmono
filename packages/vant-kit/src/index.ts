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
// 脱敏文本组件
export { default as MaskTxt, type TMaskTxtProps } from './MaskTxt/MaskTxt.vue';
// 单选组件
export {
  default as SinglePicker,
  type TSinglePickerProps,
  type TSPConfirmDisabledOptionPayload,
} from './SinglePicker/SinglePicker.vue';
// 多选组件
export {
  default as MultiPicker,
  type TMultiPickerProps,
  type TConfirmEventPayload,
} from './MultiPicker/MultiPicker.vue';
// 日期选择组件
export {
  default as DatePicker,
  type TDatePickerProps,
  type TDatePickerConfirmPayload,
} from './DatePicker/DatePicker.vue';
// 日期范围选择组件
export {
  default as DateRangePicker,
  type TDateRangePickerProps,
  type TDateRangePickerConfirmPayload,
  type TDRPickerShowValueFormatterPayload,
  type TSetDRPickerRealtimeDatePayload,
} from './DateRangePicker/DateRangePicker.vue';

/**
 * 表单组件
 */
// 脱敏文本表单组件
export { default as FieldMaskTxt, type TFieldMaskTxtProps } from './FieldMaskTxt/FieldMaskTxt.vue';
// 单选表单组件
export { default as FieldSinglePicker } from './FieldSinglePicker/FieldSinglePicker.vue';
// 多选表单组件
export { default as FieldMultiPicker } from './FieldMultiPicker/FieldMultiPicker.vue';
// 多选表单组件
export { default as FieldDatePicker } from './FieldDatePicker/FieldDatePicker.vue';
// 日期范围表单组件
export { default as FieldDateRangePicker } from './FieldDateRangePicker/FieldDateRangePicker.vue';
