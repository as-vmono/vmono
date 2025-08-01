export const PositiveNumRule = {
  validator: (value) => {
    return value >= 0;
  },
  message: '请输入正数',
};

export const PhoneRule = {
  pattern: /^1[3-9]\d{9}$/,
  message: '请输入正确的手机号',
};

export const IdRule = {
  pattern:
    /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$)/,
  message: '请输入正确的身份证号码',
};

export const BankCardRule = {
  pattern: /^[1-9]\d{15,18}$/,
  message: '请输入正确的银行卡号',
};
