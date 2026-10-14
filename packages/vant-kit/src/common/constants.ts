import { FieldProps } from 'vant';
import type { CSSProperties } from 'vue';

export const CommonFieldProps: Partial<FieldProps> = Object.freeze({
  inputAlign: 'left',
  errorMessageAlign: 'right',
  autosize: { maxHeight: 118 },
  type: 'textarea',
  rows: 1,
});

/**
 * picker 内容区默认样式（自 MultiPicker 原 less 硬编码值抽离）。
 * 各 picker 二开组件共同复用，组件内与调用方传入的 mainStyle 浅合并，调用方优先。
 */
export const CommonPickerMainStyle: CSSProperties = Object.freeze({
  minHeight: '200px',
  maxHeight: '60vh',
});
