export function isNullOrUndefined(value: any) {
  return value === null || value === undefined;
}

export function checkStrIsEmpty(value: string | null | undefined) {
  if (isNullOrUndefined(value)) return true;
  if (typeof value === 'string' && value?.trim?.() === '') return true;
  return false;
}
