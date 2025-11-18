const genTelephonePattern = (patterns: string[]): RegExp => new RegExp(`^(${patterns.join('|')})$`);

const LandlinePatternStr = '\\(\\d{3,4}\\)\\s?\\d{7,8}|\\d{3,4}-\\d{7,8}'; // 适应多种座机格式
const PhonePatternStr = '1[3-9]\\d{9}'; // 手机号的标准格式

export const LandlineRule = {
  pattern: genTelephonePattern([LandlinePatternStr]),
  message: '请输入正确的座机号',
};

export const PhoneRule = {
  pattern: genTelephonePattern([PhonePatternStr]),
  message: '请输入正确的手机号',
};

export const PhoneAndLandlineRule = {
  pattern: genTelephonePattern([PhonePatternStr, LandlinePatternStr]),
  message: '请输入正确的手机号或座机号',
};

export const EmailRule = {
  pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  message: '请输入正确的邮箱地址',
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

export const PositiveNumRule = {
  validator: (value) => {
    return value >= 0;
  },
  message: '请输入正数',
};

export const PositiveIntegerRule = {
  pattern: /^[1-9]\d*$/,
  message: '只能输入正整数',
};
