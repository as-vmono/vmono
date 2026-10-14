import { FieldProps } from 'vant';

export const CommonFieldProps: Partial<FieldProps> = Object.freeze({
  inputAlign: 'left',
  errorMessageAlign: 'right',
  autosize: { maxHeight: 118 },
  type: 'textarea',
  rows: 1,
});
