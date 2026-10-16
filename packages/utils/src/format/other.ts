import { EmptyPlaceholder } from '@/constants';
import { checkStrIsEmpty, isNullOrUndefined, typeOfData } from '@/validate';

/**
 * 单值->数组
 */
type TSingle2ArrayRes<T> = T extends (infer _U)[] ? T : T extends null | undefined ? [] : T[];
export function single2Array<T>(value: T): TSingle2ArrayRes<T> {
  if (Array.isArray(value)) {
    return value as TSingle2ArrayRes<T>;
  }
  return (isNullOrUndefined(value) ? [] : [value]) as TSingle2ArrayRes<T>;
}

/**
 * 数组->单值
 */
type TArray2SingleRes<T> = T extends (infer U)[] ? U : T;
export function array2Single<T>(value: T): TArray2SingleRes<T> {
  if (Array.isArray(value)) {
    return value?.[0];
  }
  return value as TArray2SingleRes<T>;
}

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
 * 处理空值展示
 */
type THandleEmptyDisplayPreset = { emptyTxt: string; judgeEmptyLogic: (value: any) => boolean };
const HandleEmptyDisplayDefaultPreset: THandleEmptyDisplayPreset = {
  emptyTxt: EmptyPlaceholder,
  judgeEmptyLogic: (value: any) => {
    if (checkStrIsEmpty(value)) return true;
    return false;
  },
};
export function handleEmptyDisplay(value: any, preset?: Partial<THandleEmptyDisplayPreset>) {
  const presetConfig = { ...HandleEmptyDisplayDefaultPreset, ...(preset ?? {}) };
  const { emptyTxt, judgeEmptyLogic } = presetConfig;
  if (judgeEmptyLogic(value)) return emptyTxt;
  return value;
}

/**
 * 对象第一层字符串属性值 trim
 * - 仅处理第一层，嵌套对象不动；返回新对象，不修改入参
 * - 非纯对象（数组/基本类型/null 等）原样返回
 */
export function trimObjectValuesFirstLayer<T extends Record<string, any>>(obj: T): T {
  if (typeOfData(obj) !== 'Object') return obj;
  const result = {} as T;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = typeof obj[key] === 'string' ? obj[key].trim() : obj[key];
    }
  }
  return result;
}

/**
 * 移除对象中值为 null 或 undefined 的属性（浅层过滤）
 * - 仅处理第一层；返回新对象，不修改入参
 */
export function removeNullishFirstLayer<T extends Record<string, any>>(obj: T): Partial<T> {
  const result = {} as Partial<T>;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      if (value !== null && value !== undefined) {
        result[key] = value;
      }
    }
  }
  return result;
}

/**
 * 将一维数组按指定列数转换为二维数组，用于网格布局
 * @param data - 一维数据源
 * @param cols - 每行显示的列数
 * @returns 二维数组，每行最多 cols 个元素
 */
export function toGrid<T>(data: T[], cols: number): T[][] {
  if (!data || data.length === 0 || cols <= 0) {
    return [];
  }

  const result: T[][] = [];
  const length = data.length;

  for (let i = 0; i < length; i += cols) {
    result.push(data.slice(i, i + cols));
  }

  return result;
}
