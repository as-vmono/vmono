import QueryString from 'query-string';
import { checkStrIsEmpty } from '@/validate';

/**
 * 从 url 参数中进行枚举解析
 * 1. 支持类型转换
 * 2. 内置判空与 trim 逻辑
 *        http://localhost:8002/testpage/chidren?a=    1&b=2
 *        * 这种情况下也能够拿到 a 为数字枚举 1
 */
export function qsParseFormatNumberEnum<T>(name: string) {
  const paseInfo = QueryString.parse(window.location.search);
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
  const paseInfo = QueryString.parse(window.location.search);
  const formatedParseInfo = {} as any;
  paramNames.forEach((paramName) => {
    const param = paseInfo[paramName] as string;
    formatedParseInfo[paramName] = checkStrIsEmpty(param) ? undefined : param;
  });
  return formatedParseInfo;
}

/**
 * 暴露依赖的原始工具
 */
export { QueryString };
