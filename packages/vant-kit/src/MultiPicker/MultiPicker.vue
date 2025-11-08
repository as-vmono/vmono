<template>
  <div class="vantkit-multi-picker">
    <slot
      name="trigger"
      :trigger-popup-show="triggerPopupShow"
      :show-value="showValue"
      :selected-options="selectedOptions"
    >
    </slot>
    <van-popup v-model:show="popupShow" @click-overlay="handleCancel" position="bottom" round>
      <van-checkbox-group v-model="checkboxModelValue">
        <div class="multi-picker-header van-picker__toolbar">
          <button :class="['van-picker__cancel', 'van-haptics-feedback']" @click="handleCancel">取消</button>

          <template v-if="showSearch">
            <van-search
              shape="round"
              placeholder="请输入搜索关键词"
              v-model="keywords"
              @update:model-value="onSearch"
            />
          </template>
          <slot v-else name="title">
            <div class="van-picker__title van-ellipsis">{{ title }}</div>
          </slot>

          <button :class="['van-picker__confirm', 'van-haptics-feedback']" @click="onConfirm">确定</button>
        </div>
        <div class="multi-picker-main">
          <div v-if="tipTxt" class="multi-picker-tip">
            {{ tipTxt }}
          </div>
          <van-cell-group class="multi-picker-cell-group" inset>
            <van-cell
              v-for="(item, index) in showOptions"
              clickable
              :key="item?.[computedFieldNames.value]"
              :title="item?.[computedFieldNames.label]"
              @click="toggle(item, index)"
            >
              <template #right-icon>
                <van-checkbox
                  :name="item?.[computedFieldNames.value]"
                  :disabled="item?.disabled"
                  :ref="
                    (el) => {
                      (checkboxRefs as any)[index] = el;
                    }
                  "
                  @click.stop="toggle(item, index)"
                />
              </template>
            </van-cell>
          </van-cell-group>
        </div>
      </van-checkbox-group>
    </van-popup>
  </div>
</template>

<script lang="ts">
type IdMapData = {
  [key in string]: any;
};

type TFieldNames = {
  label: string;
  value: string;
};

export type TMPProcessingFallbackOptsPayload = { prePatchValues: any[] };

export type TMultiPickerProps = {
  // ids
  modelValue: any[];
  // 选项列表
  options: any[];
  // 字段别名
  fieldNames?: TFieldNames;
  // title
  title?: string;
  // 提示信息
  tipTxt?: string;
  // 搜索功能
  showSearch?: boolean;
  searchDelay?: number;
  // 处理 id 未匹配到选项时展示的值
  processingFallbackOpts?: (p: TMPProcessingFallbackOptsPayload) => any[];
};

export type TConfirmEventPayload = { values: any[]; options: any[] };
</script>

<script lang="ts" setup>
import { computed, watch } from 'vue';
import { debounce } from 'lodash';
import { useWrapperRef } from '@vmono/vhooks';

import { ref } from 'vue';
import { isNullOrUndefined } from '@vmono/utils';

const Props = withDefaults(defineProps<TMultiPickerProps>(), {
  showSearch: false,
  searchDelay: 300,

  title: undefined,
  fieldNames: undefined,
  tipTxt: undefined,
  processingFallbackOpts: undefined,
});

const computedFieldNames = computed(() => Object.assign({ label: 'label', value: 'value' }, Props?.fieldNames ?? {}));

const Emitter = defineEmits<{
  (e: 'search', value: string): void;
  (e: 'toggleCheckbox', value: any[]): void;
  (e: 'confirm', p: TConfirmEventPayload): void;
  (e: 'update:modelValue', value: any[]);
}>();

const [popupShow, setPopupShow] = useWrapperRef<boolean>(false);
// 用于展示的选项值
const [showValue, setShowValue] = useWrapperRef<string>('');
// checkbox实时绑定的选项值
const [checkboxModelValue, setCheckboxModelValue] = useWrapperRef<any[]>([]);
watch(
  Props.modelValue,
  (newValue) => {
    setCheckboxModelValue(newValue);
  },
  { immediate: true }
);

/**
 * 展示的 options
 */
const [showOptions, setShowOptions] = useWrapperRef<any[]>(Props.options ?? []);
watch(() => Props.options, setShowOptions, { immediate: true });

/**
 * value 映射的选项信息
 */
const genIdMapOptionData = (options: any[]): IdMapData => {
  const res = {} as IdMapData;
  options?.forEach?.((item) => {
    res[item[computedFieldNames.value.value]] = item;
  });
  // console.log('genIdMapOptionData', res);
  return res;
};

const [optionsIdMapData, _setOptionsIdMapData] = useWrapperRef<IdMapData>(genIdMapOptionData(showOptions.value));
const patchIdMapOptionData = (newOptions) => {
  newOptions?.forEach?.((item) => {
    optionsIdMapData.value[item[computedFieldNames.value.value]] = item;
  });
};
watch(showOptions, patchIdMapOptionData, { immediate: true });

const [selectedOptions, setSelectedOptions] = useWrapperRef<any[]>([]);
const handleUpdateModelValue = (values: any[]) => {
  Emitter('update:modelValue', values);
  setSelectedOptions(values?.map?.((v) => optionsIdMapData.value?.[v]));
};

/**
 * 根据 modelValue 回显 showModelValue
 */
const updateShowModelValueByModelValue = () => {
  // 补丁 idMapData 与 showOptions
  let prePatchValues: any[] = [];
  for (let i = 0; i < Props?.modelValue?.length; i++) {
    const newValue = Props.modelValue[i];
    const matchedOption = optionsIdMapData.value?.[newValue];
    if (isNullOrUndefined(matchedOption)) {
      prePatchValues.push(newValue);
    }
  }

  if (prePatchValues.length) {
    let patchOpts: any[] = [];
    if (Props.processingFallbackOpts) {
      patchOpts = Props.processingFallbackOpts({ prePatchValues });
    } else {
      patchOpts = prePatchValues.map((value) => {
        return {
          [computedFieldNames.value.value]: value,
          [computedFieldNames.value.label]: value,
        };
      });
    }

    setShowOptions([...showOptions.value, ...patchOpts]);
    patchIdMapOptionData(showOptions.value);
  }

  setShowValue(
    Props.modelValue?.map?.((item) => optionsIdMapData.value?.[item]?.[computedFieldNames.value?.label])?.join?.('、')
  );
};
watch(
  [optionsIdMapData, () => Props.modelValue],
  () => {
    updateShowModelValueByModelValue();
  },
  { immediate: true }
);

/**
 * 打开 popup
 */
const triggerPopupShow = () => {
  setPopupShow(true);
};

/**
 * 点击取消
 */
const handleCancel = () => {
  setPopupShow(false);
  // checkbox选中状态回滚
  setCheckboxModelValue(Props.modelValue);
};

/**
 * checkbox
 */
const checkboxRefs = ref([]);
const toggle = (item: any, index: number) => {
  if (item?.disabled) return;
  (checkboxRefs.value?.[index] as any)?.toggle?.();
  Emitter('toggleCheckbox', checkboxModelValue.value);
};

/**
 * 确认选择
 */
const onConfirm = () => {
  const newValue = checkboxModelValue.value;
  handleUpdateModelValue(newValue);
  Emitter('confirm', { values: newValue, options: selectedOptions.value });
  setPopupShow(false);
};

/**
 * 搜索功能
 */
const [keywords, _] = useWrapperRef<string | undefined>(undefined);

const onSearch = debounce((keywords: string) => {
  Emitter('search', keywords);
}, Props.searchDelay);

defineExpose({
  getOptionsIdMapData() {
    return optionsIdMapData.value;
  },
});
</script>

<style scoped lang="less">
.multi-picker-header {
  :deep(.van-search) {
    flex: 1;
  }
}

.multi-picker-main {
  min-height: 200px;
  max-height: 60vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .multi-picker-tip {
    padding: 10px 16px;
    text-align: center;
    font-size: 13px;
    color: #666666;
  }

  .multi-picker-cell-group {
    overflow-y: auto;
  }
}
</style>
