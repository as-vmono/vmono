<template>
  <div class="vantkit-single-picker">
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
          <slot :name="name" v-bind="slotData" :key="name"></slot>
        </template>
        <template v-if="showSearch" #title>
          <van-search shape="round" placeholder="请输入搜索关键词" v-model="keywords" @update:model-value="onSearch" />
        </template>
      </van-picker>
    </van-popup>
  </div>
</template>

<script lang="ts">
export type TSinglePickerProps = {
  showSearch?: boolean;
  searchDelay?: number;
  modelValue: any;
  pickerProps: Partial<PickerProps>;
};

export type TSPConfirmDisabledOptionPayload = {
  option: any;
  closePopup: () => void;
};
</script>

<script lang="ts" setup>
import { PickerProps, PickerOption, PickerColumn } from 'vant';
import { computed, watch } from 'vue';
import { debounce } from 'lodash';
import { useWrapperRef } from '@vmono/vhooks';
import { array2Single } from '@vmono/utils';

const Props = withDefaults(defineProps<TSinglePickerProps>(), {
  showSearch: false,
  searchDelay: 300,
});

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
  (e: 'confirmDisabledOption', p: TSPConfirmDisabledOptionPayload): void;
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
  let option;
  if (computedPickerProps.value?.columns?.length) {
    option = array2Single(selectedOptions);
  } else {
    const selectedValue = array2Single(selectedValues);
    option = columnsIdMapDataCache.value?.[selectedValue];
  }
  if (option.disabled) {
    Emitter('confirmDisabledOption', {
      option,
      closePopup: () => setPopupShow(false),
    });
    return;
  }
  Emitter('confirm', option);
  const newValue = option?.[columnsFieldNames.value.value];
  updateModelFieldValue(newValue);
  setPopupShow(false);
};

const [keywords, _] = useWrapperRef<string | undefined>(undefined);

const onSearch = debounce((keywords: string) => {
  Emitter('search', keywords);
}, Props.searchDelay);

defineExpose({});
</script>

<style scoped lang="less">
:deep(.van-search) {
  flex: 1;
}
</style>
