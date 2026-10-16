export function isNullOrUndefined(value: any) {
  return value === null || value === undefined;
}

export function checkStrIsEmpty(value: string | null | undefined) {
  if (isNullOrUndefined(value)) return true;
  if (typeof value === 'string' && value?.trim?.() === '') return true;
  return false;
}

/**
 * 判断数据类型
 * 输出 'Number' | 'String' | 'Boolean' | 'Null' | 'Undefined' | 'Array' | 'Object' | 'Symbol' | 'Date' | 'RegExp' | 'FormData' 等
 * 基于 Object.prototype.toString，Map/Set/BigInt 等亦可正确输出
 */
export function typeOfData(data: unknown): string {
  return Object.prototype.toString.call(data).slice(8, -1);
}
