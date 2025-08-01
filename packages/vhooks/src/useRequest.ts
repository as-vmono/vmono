import { computed } from 'vue';
import { ComputedRef } from 'vue';
import { useRequest as _useRequest, Options, PluginImplementType, QueryResult, Service } from 'vue-request';

type TUseRequestRes<R, P extends unknown[]> = Omit<QueryResult<R, P>, 'data'> & {
  data: ComputedRef<R extends { data: infer D } ? D : never>;
  res: QueryResult<R, P>['data'];
};
export function useRequest<R, P extends unknown[] = any>(
  service: Service<R, P>,
  options?: Options<R, P>,
  plugins?: PluginImplementType<R, P>[]
): TUseRequestRes<R, P> {
  const useReqRes = _useRequest(service, options, plugins);
  const result = { ...useReqRes } as TUseRequestRes<R, P>;
  result.res = useReqRes.data;
  result.data = computed(() => (useReqRes.data.value as any)?.data);
  return result;
}
