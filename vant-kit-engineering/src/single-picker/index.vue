<template>
  <div>
    <slot
      name="trigger"
      :trigger-popup-show="triggerPopupShow"
      :show-value="showValue"
      :selected-option="selectedOption"
    >
    </slot>
    <van-popup v-model:show="popupShow" position="bottom" round>
      <van-picker
        v-bind="computedPickerProps"
        @confirm="(value: any) => onConfirmPicker(value)"
        @cancel="setPopupShow(false)"
      >
        <!-- 暴露默认支持插槽 -->
        <template v-for="(_slot, name) in $slots" #[name]="slotData" :key="name">
          <slot :name="name" v-bind="slotData"></slot>
        </template>
        <template #title>
          <van-search
            v-if="showSearch"
            shape="round"
            placeholder="请输入搜索关键词"
            v-model="keywords"
            @update:model-value="onSearch"
          />
        </template>
      </van-picker>
    </van-popup>
  </div>
</template>

<script lang="ts">
export default {
  name: 'SinglePicker',
};
</script>

<script lang="ts" setup>
import type { PickerColumn, PickerOption, PickerProps } from 'vant';
import { computed, watch } from 'vue';
import { debounce } from 'lodash';
import { array2Single, useWrapperRef } from '@vmono-seed/tools';
import { Popup as VanPopup, Picker as VanPicker, Search as VanSearch } from 'vant';

const Props = withDefaults(
  defineProps<{
    showSearch?: boolean;
    modelValue: any;
    pickerProps: Partial<PickerProps>;
  }>(),
  {
    showSearch: false,
  }
);

const columnsFieldNames = computed(() =>
  Object.assign({ text: 'label', value: 'value' }, Props?.pickerProps?.columnsFieldNames ?? {})
);
const computedPickerProps = computed(() =>
  Object.assign(Props?.pickerProps ?? {}, {
    columnsFieldNames: columnsFieldNames.value,
  })
);

const Emitter = defineEmits<{
  (e: 'search', value: string): void;
  (e: 'confirm', option: any): void;
  (e: 'update:modelValue', value: any);
}>();

const [popupShow, setPopupShow] = useWrapperRef<boolean>(false);
const triggerPopupShow = () => {
  setPopupShow(true);
};

const [modelFieldValue, setModelFieldValue] = useWrapperRef<any>(Props.modelValue);
watch(() => Props.modelValue, setModelFieldValue, { immediate: true });
const updateModelFieldValue = (newValue) => {
  setModelFieldValue(newValue);
  // console.log('updateModelFieldValue');
  Emitter('update:modelValue', newValue);
};

/**
 * idMapData 缓存
 */
const [columnsIdMapDataCache, setColumnsIdMapDataCache] = useWrapperRef<{
  string: (PickerOption | PickerColumn)[];
}>({} as any);
const patchColumnsIdMapDataCache = (columns: (PickerOption | PickerColumn)[]) => {
  const newColumns = { ...(columnsIdMapDataCache.value ?? {}) };
  columns.forEach((item) => {
    const id = item[columnsFieldNames.value.value];
    newColumns[id] = item;
  });
  setColumnsIdMapDataCache({ ...newColumns });
};
watch(
  () => computedPickerProps.value?.columns,
  (columns) => {
    patchColumnsIdMapDataCache(columns! ?? []);
  },
  { immediate: true }
);

/**
 * selectedOption
 */
const [selectedOption, setSelectedOption] = useWrapperRef<string>('');
watch(
  [modelFieldValue, columnsIdMapDataCache],
  ([newValue, columnsIdMapData]) => {
    setSelectedOption(columnsIdMapData?.[newValue]);
  },
  { immediate: true }
);
const showValue = computed(() => {
  return selectedOption.value?.[columnsFieldNames.value.text];
});

/**
 * 兼容搜索模式
 *  如果触发筛选后 columns 不存在，直接点击确认，则依旧选中上次选择的值(selectedValues 能够正确取到，而 selectedOptions 不行)
 */
const onConfirmPicker = (confirmInfo) => {
  const { selectedOptions, selectedValues } = confirmInfo;
  if (computedPickerProps.value?.columns?.length) {
    const option = array2Single(selectedOptions);
    Emitter('confirm', option);
    const newValue = option?.[columnsFieldNames.value.value];
    updateModelFieldValue(newValue);
    setPopupShow(false);
  } else {
    const selectedValue = array2Single(selectedValues);
    const option = columnsIdMapDataCache.value?.[selectedValue];
    Emitter('confirm', option);
    const newValue = option?.[columnsFieldNames.value.value];
    updateModelFieldValue(newValue);
    setPopupShow(false);
  }
};

const [keywords, _] = useWrapperRef<string | undefined>(undefined);

const onSearch = debounce((keywords: string) => {
  Emitter('search', keywords);
}, 300);

defineExpose({});
</script>

<style scoped lang="less">
@import 'vant/lib/index.css';
:deep(.van-search) {
  width: 250px;
}
</style>
