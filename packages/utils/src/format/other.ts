import { EmptyPlaceholder } from '@/constants';
import { checkStrIsEmpty, isNullOrUndefined } from '@/validate';

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
