import { EmptyPlaceholder } from '@/constants';

/**
 * 格式化数字: 保留 n 位小数
 */
export function formatToPositiveNumber(input: string | number, fractionDigits: number = 2): number | undefined {
  const num = Number(input);
  // 如果输入不是一个有效的数字，则返回 0
  if (isNaN(num)) return undefined;
  // 计算乘数以进行四舍五入
  const multiplier = Math.pow(10, fractionDigits);
  return Math.round(num * multiplier) / multiplier;
}

/**
 * 展示格式化数字:
 * 1. 输出字符串
 * 2. 判空展示占位符
 */
export const showFormatToPositiveNumber = (
  input: string | number,
  preset?: { fractionDigits?: number; placeholder?: string }
): string => {
  const { fractionDigits = 2, placeholder = EmptyPlaceholder } = preset ?? {};
  const formatedNum = formatToPositiveNumber(input, fractionDigits);
  return formatedNum?.toFixed?.(fractionDigits) ?? placeholder;
};
