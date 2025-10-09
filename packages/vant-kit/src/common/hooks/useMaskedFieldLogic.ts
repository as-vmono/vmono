import { maskShowStr, TMaskShowStrPayload } from '@vmono/utils';
import { useWrapperRef } from '@vmono/vhooks';
import { watch, computed, ComputedRef } from 'vue';

// 内置脱敏策略类型
export type TMaskType = 'id' | 'phone' | 'bankCard' | 'email';
// 内置策略配置表
const MASK_PRESETS: Record<TMaskType, Omit<TMaskShowStrPayload, 'str'>> = {
  id: { front: 4, end: 4 }, // 身份证：保留前后4位
  phone: { front: 3, end: 4 }, // 手机号：3+4
  bankCard: { front: 6, end: 4 }, // 银行卡：前6后4
  email: { front: 2, end: 2 }, // 邮箱：保留前后2字符
};

export interface IUseMaskedFieldOptions {
  modelValue: ComputedRef<string>;
  maskId: ComputedRef<string>;
  fetchPlaintext: (maskId: string) => Promise<string>;
  decrypt: (cipher: string) => string;
  encrypt?: (plain: string) => string;
  placeholder?: string;
  /**
   * 自定义脱敏函数（最高优先级）
   * 若提供，则忽略 maskType 和 placeholder
   */
  maskStrategy?: (str: string) => string;
  /**
   * 使用内置脱敏策略（中优先级）
   * 若未提供 maskStrategy，则使用此策略
   */
  maskType?: TMaskType;
  onValueUpdate?: (value: string) => void;
}

export function useMaskedField(options: IUseMaskedFieldOptions) {
  const {
    modelValue,
    maskId,
    fetchPlaintext,
    decrypt,
    encrypt = (v) => v,
    placeholder = '*',
    maskStrategy, // 优先使用自定义策略
    maskType, // 备用内置策略
    onValueUpdate,
  } = options;

  // 是否处于展示明文的状态
  const [isPlaintextVisible, setIsPlaintextVisible] = useWrapperRef(false);
  // 获取明文的加载状态
  const [fetchPlaintextLoading, setFetchPlaintextLoading] = useWrapperRef(false);
  // 明文值
  const [plainTextValue, setPlaintextValue] = useWrapperRef('');
  // 密文值
  const [cipherValue, setCipherValue] = useWrapperRef(modelValue.value);

  // 展示值
  const showValue = computed(() => {
    const plainTxt = plainTextValue.value;
    // 展示明文状态
    if (isPlaintextVisible.value) {
      return plainTxt;
    }
    // 展示脱敏数据: 脱敏策略优先级：自定义 > 内置类型 > 默认（兜底）
    // 1. 自定义策略
    if (maskStrategy) {
      return maskStrategy(plainTxt);
    }
    try {
      // 2. 内置策略类型
      if (maskType && MASK_PRESETS[maskType]) {
        const preset = MASK_PRESETS[maskType];
        return maskShowStr({
          ...preset,
          str: plainTxt,
          placeholder,
        });
      }
      //3. 默认策略（兜底）：保留前后3位
      return maskShowStr({
        str: plainTxt,
        front: 3,
        end: 3,
        placeholder,
      });
    } catch (err) {
      console.error('useMaskedField —> showValue 脱敏失败', err);
      return plainTxt;
    }
  });

  // 是否使用后端解密获取明文：
  // 1. 有 maskId
  // 2. 明文包含 placeholder
  const canUseBackendUnmask = computed(() => {
    return !!maskId.value && plainTextValue.value?.includes?.(placeholder);
  });

  // === 初始化 ===
  const initDecryption = () => {
    try {
      setPlaintextValue(decrypt(cipherValue.value));
    } catch (err) {
      console.warn('useMaskedField —> initDecryption 解密失败', err);
    }
  };

  watch(
    modelValue,
    (val) => {
      setCipherValue(val);
      initDecryption();
    },
    { immediate: true }
  );

  // 更新密文（用于表单输入）: inputValue 是用户输入的纯文本(明文，未脱敏)
  const updateModelValue = (inputValue: string) => {
    const cipher = encrypt(inputValue?.trim?.() ?? '');
    setCipherValue(cipher);
    onValueUpdate?.(cipher);
  };

  // === 明确的 API ===
  /**
   * 展示明文，获取脱敏后的数据
   */
  const revealPlaintext = async () => {
    if (fetchPlaintextLoading.value || isPlaintextVisible.value) return;

    setFetchPlaintextLoading(true);
    try {
      let plainText: string;

      if (canUseBackendUnmask.value) {
        const cipherFromBackend = await fetchPlaintext(maskId.value);
        setCipherValue(cipherFromBackend);
        plainText = decrypt(cipherFromBackend);
      } else {
        plainText = plainTextValue.value;
      }

      setPlaintextValue(plainText);
      setIsPlaintextVisible(true);
      onValueUpdate?.(cipherValue.value);
    } catch (err) {
      console.error('useMaskedField -> revealPlaintext 获取明文失败', err);
    } finally {
      setFetchPlaintextLoading(false);
    }
  };

  /**
   * 展示脱敏后的数据，隐藏明文
   */
  const hidePlaintext = () => {
    if (!isPlaintextVisible.value) return;
    setIsPlaintextVisible(false);
  };

  /**
   * 切换明文/脱敏状态（默认入口）
   */
  const toggleVisibility = async () => {
    if (isPlaintextVisible.value) {
      hidePlaintext();
    } else {
      await revealPlaintext();
    }
  };

  return {
    // 展示
    showValue,
    isPlaintextVisible,
    fetchPlaintextLoading,
    canUseBackendUnmask,
    // API
    revealPlaintext,
    hidePlaintext,
    toggleVisibility,
    // 其他
    plainTextValue: computed(() => plainTextValue.value),
    updateModelValue,
  };
}
