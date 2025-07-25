import { Ref, ref, UnwrapRef } from 'vue';

/**
 * import { IfAny } from '@vue/shared'
 * 不能从vue内部模块直接引入,自己定义一个一模一样的
 * 而且单独下载 @vue/shared 包后引入也不行，会告知推荐从 vue 引入(因为@vue/shared就是vue的内部模块)
 * 但前面也说了，不能从vue内部模块直接引入，因为没有导出(也挺搞笑的)
 * 因为与编写普通的 web 项目不同，将 hook 抽历程单独库
 * 虽然也有默认的类型推导，但是其中包含了属于外部包的类型，需要显式声明类型，这样才能被打包过程中的类型生成工具追踪到
 */
//
type IfAny<T, Y, N> = 0 extends 1 & T ? Y : N;
export function useWrapperRef<T>(
  defaultValue: T
): readonly [
  [T] extends [Ref<any, any>] ? IfAny<T, Ref<T, T>, T> : Ref<UnwrapRef<T>, T | UnwrapRef<T>>,
  (newValue: T) => void,
] {
  const state = ref<T>(defaultValue);
  const setState = (newValue: T) => {
    state.value = newValue;
  };
  return [state, setState] as const;
}
