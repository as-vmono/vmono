import qs from 'query-string';
import { checkStrIsEmpty, isNullOrUndefined } from './validate';
import { EmptyPlaceholder } from '@/constants';

/**
 * 属性别名转换工具函数
 */
type AliasMap<T> = {
  [key: string]: keyof T;
};
export function resolveAlias<T>(obj: T, aliasMap: AliasMap<T>): Partial<T> {
  const resolvedObj: Partial<T> = {};
  for (const key in obj) {
    if (key in aliasMap) {
      const alias = aliasMap[key];
      resolvedObj[alias] = obj[key];
    } else {
      resolvedObj[key] = obj[key];
    }
  }
  return resolvedObj;
}

/**
 *  对字符串脱敏的工具函数
 */
export function maskShowStr(idNumber: string, frontN: number, backN: number): string {
  if (idNumber.length < frontN + backN) {
    throw new Error('字符串长度不足以进行脱敏');
  }

  const frontPart = idNumber.slice(0, frontN);
  const backPart = idNumber.slice(-backN);
  const maskedPart = '*'.repeat(idNumber.length - frontN - backN);

  return `${frontPart}${maskedPart}${backPart}`;
}

type TSingle2ArrayRes<T> = T extends (infer _U)[] ? T : T extends null | undefined ? [] : T[];
/**
 * 单值->数组
 */
export function single2Array<T>(value: T): TSingle2ArrayRes<T> {
  if (Array.isArray(value)) {
    return value as TSingle2ArrayRes<T>;
  }
  return (isNullOrUndefined(value) ? [] : [value]) as TSingle2ArrayRes<T>;
}

type TArray2SingleRes<T> = T extends (infer U)[] ? U : T;
/**
 * 数组->单值
 */
export function array2Single<T>(value: T): TArray2SingleRes<T> {
  if (Array.isArray(value)) {
    return value?.[0];
  }
  return value as TArray2SingleRes<T>;
}

type THandleEmptyDisplayPreset = { emptyTxt: string; judgeEmptyLogic: (value: any) => boolean };
const handleEmptyDisplayDefaultPreset: THandleEmptyDisplayPreset = {
  emptyTxt: EmptyPlaceholder,
  judgeEmptyLogic: (value: any) => {
    if (checkStrIsEmpty(value)) return true;
    return false;
  },
};
/**
 * 处理空值展示
 */
export function handleEmptyDisplay(value: any, preset?: Partial<THandleEmptyDisplayPreset>) {
  const presetConfig = { ...handleEmptyDisplayDefaultPreset, ...(preset ?? {}) };
  const { emptyTxt, judgeEmptyLogic } = presetConfig;
  if (judgeEmptyLogic(value)) return emptyTxt;
  return value;
}

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
export const showFormatToPositiveNumber = (input: string | number, fractionDigits: number = 2): string => {
  const formatedNum = formatToPositiveNumber(input, fractionDigits);
  return formatedNum?.toFixed?.(2) ?? EmptyPlaceholder;
};

/**
 * 从 url 参数中进行枚举解析
 * 1. 支持类型转换
 * 2. 内置判空与 trim 逻辑
 *        http://localhost:8002/testpage/chidren?a=    1&b=2
 *        * 这种情况下也能够拿到 a 为数字枚举 1
 */
export function qsParseFormatNumberEnum<T>(name: string) {
  const paseInfo = qs.parse(window.location.search);
  const param = paseInfo[name] as string;
  if (checkStrIsEmpty(param)) return undefined;
  const toNumber = Number(param) as T;
  return isNaN(toNumber as any) ? undefined : toNumber;
}

/**
 * 从 url 中获取 query 部分参数
 * 1. 支持类型转换
 * 2. 内置判空逻辑
 * const { paramName1, paramName2 } = qsParseAssertString(['paramName1', 'paramName2']);
 */
export function qsParseAssertString<T extends string>(paramNames: T[]): { [key in T]: string | undefined } {
  const paseInfo = qs.parse(window.location.search);
  const formatedParseInfo = {} as any;
  paramNames.forEach((paramName) => {
    const param = paseInfo[paramName] as string;
    formatedParseInfo[paramName] = checkStrIsEmpty(param) ? undefined : param;
  });
  return formatedParseInfo;
}
