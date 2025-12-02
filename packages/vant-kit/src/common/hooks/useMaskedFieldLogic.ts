import { BankCardRule, EmailRule, IdRule, maskShowStr, PhoneRule, TMaskShowStrPayload } from '@vmono/utils';
import { useWrapperRef } from '@vmono/vhooks';
import { watch, computed, ComputedRef } from 'vue';

// 内置脱敏策略类型
export type TMaskType = 'id' | 'phone' | 'bankCard' | 'email';
// 内置策略配置表
const MASK_PRESETS: Record<
  TMaskType,
  {
    pattern: RegExp;
    maskRule: Omit<TMaskShowStrPayload, 'str'>;
  }
> = {
  id: {
    pattern: IdRule.pattern,
    // 身份证：保留前后4位
    maskRule: { front: 4, end: 4 },
  },
  phone: {
    pattern: PhoneRule.pattern,
    // 手机号：保留前3后4位
    maskRule: { front: 3, end: 4 },
  },
  bankCard: {
    pattern: BankCardRule.pattern,
    // 银行卡：保留前6后4位
    maskRule: { front: 6, end: 4 },
  },
  email: {
    pattern: EmailRule.pattern,
    // 邮箱：保留前3后4位
    maskRule: { front: 3, end: 4 },
  },
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

  // 来源于后端脱敏数据的缓存（showValue优先展示）
  const [backendDesensitizationStr, setBackendDesensitizationStr] = useWrapperRef('');

  // 明文是否包含占位符
  const plaintextIsContainPlaceholder = computed(() => plainTextValue.value?.includes?.(placeholder));

  // 展示值
  const showValue = computed(() => {
    const plainTxt = plainTextValue.value;
    /**
     * 展示明文数据
     */
    if (isPlaintextVisible.value) {
      return plainTxt;
    }
    /**
     * 展示脱敏数据:
     * 1. 如果明文包含占位符，则直接展示(此时是后端数据源,前端不干预)
     * 2. 不包含占位符，则使用内置脱敏策略 -- 脱敏策略优先级：自定义 > 内置类型 > 默认（兜底）
     *    内置脱敏策略的作用：
     *      1. 兼容前端模拟后端脱敏过程的场景 (例如分步表单场景：在第一步填写完毕后(基于后端数据编辑)，在第二步确认信息时(不可编辑)也要默认关闭小眼睛(展示脱敏数据)，保证交互一致性。
     *         第二步的表单数据已经是纯前端(用户填写)的数据了，所以要前端处理脱敏的展示
     *      2. 为后端兜底：后端直接返回了未脱敏数据
     */

    // 如果缓存的后端脱敏数据存在，则直接展示(防止第一次点击小眼睛成功脱敏后，明文数据不包含 placeholder，下次打开小眼睛导致直接命中前端兜底脱敏策略，而前端兜底脱敏策略不一定能满足对应数据的定制脱敏规则)
    if (backendDesensitizationStr.value) {
      return backendDesensitizationStr.value;
    }
    // 1. 包含占位符
    if (plaintextIsContainPlaceholder.value) {
      return plainTxt;
    }
    // 2. 自定义策略
    if (maskStrategy) {
      return maskStrategy(plainTxt);
    }
    // 3. 内置策略类型
    try {
      // 指定策略
      if (maskType && MASK_PRESETS[maskType]) {
        const maskRule = MASK_PRESETS[maskType]?.maskRule;
        return maskShowStr({
          ...maskRule,
          str: plainTxt,
          placeholder,
        });
      }
      // 未指定定策略: 尝试正则匹配
      const matchedMaskPreset = Object.values(MASK_PRESETS).find((preset) => preset.pattern.test(plainTxt));
      if (matchedMaskPreset) {
        return maskShowStr({
          ...matchedMaskPreset?.maskRule,
          str: plainTxt,
          placeholder,
        });
      }
      //4. 前置逻辑都未走到,转移默认策略（兜底）：保留前后3位
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
    return !!maskId.value && plaintextIsContainPlaceholder.value;
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
        setBackendDesensitizationStr(plainTextValue.value);
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
    setIsPlaintextVisible,
    revealPlaintext,
    hidePlaintext,
    toggleVisibility,
    // 其他
    plainTextValue: computed(() => plainTextValue.value),
    updateModelValue,
  };
}
