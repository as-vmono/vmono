# 不能被 form 代理

## 问题描述

vant-kit 组件库在 **打包后，field 相关二开组件被外部宿主项目使用时**，与宿主项目中的原生 vant form 组件结合使用，字段不能被原生 vant form 收集。导致：通过 vant form 的事件、ref api，不能获取到相关 field 字段信息，也不能触发相关字段的校验，与 vant form 完全失联。

vant-kit 组件库中的 field 相关二开组件，如果直接将源码复制到宿主项目中使用，一切功能都是正常的。

- 为了方便调试，我们后续直接将 vant-kit-engineering 作为宿主项目进行调试
- 真实的宿主不仅包含 vant-kit-engineering(用于文档产出), 更重要的是应用在实际的 web 项目中，但是在实际的 web 项目中逐步调试比较麻烦，需要频繁发版。

### 最小问题复现示例

在 vant-kit 中编写一个只有 filed 的组件，没有其他逻辑

但为了和其它 filed 相关组件基础逻辑保持一致，因此有两个 filed ，分别处理字段的展示值与真实收集的值。

#### 组件源码

**vant-kit/src/TestField/TestField.vue**

```XML
<template>
  <van-field v-bind="computedFieldProps" v-model="modelFieldValue" />
  <van-field v-bind="computedFieldProps" readonly :name="undefined" v-model="showValue!" />
</template>

<script lang="ts" setup>
import type { FieldProps } from 'vant';
import { computed } from 'vue';

const Props = defineProps<{
  modelValue: string;
  fieldProps: Partial<Omit<FieldProps, 'modelValue'>>;
}>();

const computedFieldProps = computed(() => {
  const defaultProps: typeof Props.fieldProps = {
    inputAlign: 'right',
    errorMessageAlign: 'right',
  };
  return Object.assign(Props?.fieldProps ?? {}, defaultProps);
});

const Emitter = defineEmits<{
  (e: 'update:modelValue', value: any);
}>();

const modelFieldValue = computed({
  get() {
    return Props.modelValue;
  },
  set(newValue) {
    Emitter('update:modelValue', newValue);
  },
});

const showValue = computed(() => `prefix--${modelFieldValue.value}--suffix`);

defineExpose({});
</script>

<style scoped lang="less">
.hidden {
  display: none;
}
</style>
```

#### demo1

然后在宿主项目 vant-kit-engineering （vant-cli 文档工程）中使用：

1. 编写一个 demo 组件
2. 随便在一个已经写好的组件文档 demo 中引入

demo 组件：**TestFieldUsage.vue**

```XML
<template>
  <van-form ref="VantFormRef">
    <p>modelValue:{{ modelValue }}</p>
    <TestField
      ref="TestFieldRef"
      v-model="modelValue"
      :field-props="{
        name: 'testField',
        label: 'testField',
        readonly: false,
        required: true,
        rules: [{ required: true, message: '请输入' }],
      }"
    />
  </van-form>

  <van-button type="primary" @click="() => validate()"> 验证 </van-button>
</template>

<script lang="ts" setup>
import { useWrapperRef } from '@vmono/vhooks';
import { ref } from 'vue';
import { TestField } from '@vmono/vant-kit';
import { Form as VanForm, Button as VanButton, FormInstance } from 'vant';

const TestFieldRef = ref<InstanceType<typeof TestField>>();

const VantFormRef = ref<FormInstance>();

const validate = async () => {
  VantFormRef.value?.validate?.().then(() => {
    console.log(VantFormRef.value?.getValues?.());
  });
};

const [modelValue] = useWrapperRef('');
</script>

<style scoped lang="less"></style>
```

效果：

![img](x.assets/asynccode)

此时并没有在第一行(处理真正收集的值)表单中输入内容，此时点击`验证`按钮，正常情况下是要触发字段校验逻辑的。期望现象为：

1. 视图上出现红色的 '请输入' 提示文案
2. 未通过字段校验方法，因此不会触发字段的打印

而实际的现象与期望现象完全不一致：

1. 未出现必填提示文案
2. 通过了字段校验，并且打印了`getValues`获取的结果，且结果为空对象，不包含`testField`字段

#### demo2

更新示例代码，让宿主项目(vant-kit-engineering)中的原生 vant form 组件同时包裹 vant-kit 中的 filed 二开组件与 vant 原生 field 组件，进行观察

```XML
<template>
  <van-form ref="VantFormRef">
    <p>modelValue:{{ modelValue }}</p>
    <TestField
      ref="TestFieldRef"
      v-model="modelValue"
      :field-props="{
        name: 'testField',
        label: 'testField',
        readonly: false,
        required: true,
        rules: [{ required: true, message: '请输入' }],
      }"
    />
    <van-field
      v-model="vantFieldModelValue"
      name="vantField"
      label="vantField"
      required
      :rules="[{ required: true, message: '请选择' }]"
    ></van-field>
  </van-form>

  <van-button type="primary" @click="() => validate()"> 验证 </van-button>
</template>

<script lang="ts" setup>
import { useWrapperRef } from '@vmono/vhooks';
import { ref } from 'vue';
import { TestField } from '@vmono/vant-kit';
import {
  Form as VanForm,
  Field as VanField,
  Button as VanButton,
  FormInstance,
} from 'vant';

const TestFieldRef = ref<InstanceType<typeof TestField>>();

const VantFormRef = ref<FormInstance>();

const validate = async () => {
  VantFormRef.value?.validate?.().then(() => {
    console.log(VantFormRef.value?.getValues?.());
  });
};

const [modelValue] = useWrapperRef('');
const [vantFieldModelValue] = useWrapperRef('');
</script>

<style scoped lang="less"></style>
```

效果：

![img](x.assets/asynccode)

同样的，此时并没有在任何表单中输入内容，点击`验证`按钮的现象：

![img](x.assets/asynccode)

1. testField 组件表现和上面效果一致，视图上没有出现必填提示
2. vantField 组件表现正常，出现了必填提示，并且由于 form 的 validate 方法并未通过，因此控制台不会出现打印结果

而且由于出现未处理的 promise 错误(validate 方法并未通过)，控制台会自动打印相关错误信息，可以观察到：也只有 vantField 字段，testField 并未被原生 vant form 收集。

![img](x.assets/asynccode)

只填写 vantField 的表单值，不填写 testField 表单，点击`验证`按钮的现象：

![img](x.assets/asynccode)

1. testField 组件表现和上面效果一致，视图上没有出现必填提示
2. vantField 组件表现正常，由于有表单值，不会出现必填提示

由于 testField 并未被原生 vant form 收集，form 只代理了 vantField 字段，此时表单会通过校验，并打印字段信息：结果也只有 vantField 字段。

![img](https://vegn03wty9.feishu.cn/space/api/box/stream/download/asynccode/?code=ZGRmNGI4NWE0OTMwY2M2MjIyNDYwMWZlYzkxNDU3YTBfVVA5M3FVWGZwTXZKWEVmZWdSQ2VwUTNIUnhFanZwTndfVG9rZW46RjJldWJXa3RDb1g2bVZ4RG05RWNEZDdtbkhmXzE3NTg4NzIxNjc6MTc1ODg3NTc2N19WNA)

## 回顾现有信息

vant-kit 组件库中的 field 相关二开组件

- 如果直接将源码复制到宿主项目中使用，一切功能都是正常的。
- 在打包后，被外部宿主项目使用时，则不能够被外部的原生 vant form 收集和处理

**看起来问题好像出现在 vant-kit 组件库的打包上?**

但是为什么，其他二开组件功能都正常，只有 field 相关二开组件有问题？

带着这两个问题，我们需要研读一下 vant form、field 组件的源码，看一下二者是如何关联在一起的。

## 源码研读

### 相互关联的主要逻辑框架

[vant form](https://github.com/youzan/vant/blob/main/packages/vant/src/form/Form.tsx)

- 使用 [useChildren](https://github.com/youzan/vant/blob/main/packages/vant-use/src/useRelation/useChildren.ts)
  - children 收集
  - 关联 children: 通过 provide 把与 filed 进行关联的 api 进行暴露

[vant field](https://github.com/youzan/vant/blob/main/packages/vant/src/field/Field.tsx)

- 使用 [useParent](https://github.com/youzan/vant/blob/main/packages/vant-use/src/useRelation/useParent.ts)
  - 关联父级 form: 通过 inject 把 form 暴露的 api 进行使用，与 form 进行关联

[injectionKey](https://github.com/youzan/vant/blob/main/packages/vant/src/utils/constant.ts)

- 将 provide 与 inject 关联的 key，放到了 vant 工程中的 utils/constant 中

```TypeScript
export const FORM_KEY: InjectionKey<FormProvide> = Symbol('van-form');
```

### 抓住嫌疑

form 与 field 组件的关联逻辑是通过 vue3 的 provide 与 inject 实现的。

所以问题很可能出现在 provide 与 inject 断联。

根据 vue 以及 provide 与 inject 的特性，可能导致断联的原因如下：

1. provide 与 inject 使用的 key 不同
2. 使用的 key 完全一致，但还是关联不上
   1. 多个使用相同 key 的 provide 组件互为嵌套关系，则较外层的组件将不会被关联（provide & inject 的原理是利用原型链逐层攀爬进行查找，因此一旦在攀爬过程中找到了目标，就会停止攀爬）
   2. 二者不在同一个 vue 实例下，例如多页应用（多个 vue 根节点）

## 定位问题

### ❎多 vue 实例？

相对其它嫌疑点，这个问题比较好验证，因为我们几乎可以排除掉它

为什么 '几乎可以排除掉它' ?

因为在 [01-规避 vant-cli 打包出错问题](https://vegn03wty9.feishu.cn/docx/XlAXdHUTUov911xYdkZcWkfFnfQ) 中，我们已经将 vue 设置成外部依赖了，不会在 vant-kit 中再次打包一次 vue

#### demo 验证

1. 在 vant-kit 的入口文件中暴露 vue 的 h 函数，并打包
2. 在宿主项目(vant-kit-engineering)中分别从 vue、vant-kit 中引入 h 函数做比较，观察是否 `===`

**vant-kit/src/index.ts**

```TypeScript
……
export { h } from 'vue';
```

vant-kit-engineering 中的 demo 组件：**TestFieldUsage.vue**

```HTML
<script lang="ts" setup>
import { h } from 'vue';
import { h as kit_h } from '@vmono/vant-kit';

console.log('Vue h function:', h === kit_h);
</script>
```

打印结果为 true

![img](x.assets/asynccode)

### ✅injectionKey 不同

#### 疑惑点

injectionKey 是在 vant 源码中的，而在 [01-规避 vant-cli 打包出错问题](https://vegn03wty9.feishu.cn/docx/XlAXdHUTUov911xYdkZcWkfFnfQ) 中，我们已经将 vant 设置成外部依赖了，按理说引入的应该是同一份 vant。

我们需要编写 demo 验证下

#### demo1

验证是否引入同一份 vant

1. 在 vant-kit 的入口文件中暴露 vant 的 Field 组件，并打包
2. 在宿主项目(vant-kit-engineering)中分别从 vant、vant-kit 中引入 Field 组件做比较，观察是否 `===`

**vant-kit/src/index.ts**

```TypeScript
……
export { h } from 'vue';
export { Field } from 'vant';
```

vant-kit-engineering 中的 demo 组件：**TestFieldUsage.vue**

```HTML
<script lang="ts" setup>
import { h } from 'vue';
import { Field as VanField } from 'vant';
import { h as kit_h, Field as kit_Field} from '@vmono/vant-kit';

console.log('Vue h function:', h === kit_h);
console.log('Field cpn:', VanField === kit_Field);
</script>
```

打印结果为 true

![img](x.assets/asynccode)

#### demo2

直接验证 injectionKey 是否相等

1. 为了进一步的观察 injectionKey 我们在 vant-kit 的 TestField.vue 中 inject FORM_KEY 观察是否能够获取到相关信息
2. 在 vant-kit 的入口文件中暴露 'vant/es/utils' 中的 FORM_KEY，并打包
3. 在宿主项目(vant-kit-engineering)中分别从 'vant/es/utils'、vant-kit 中引入 FORM_KEY 做比较，观察是否 `===`

**vant-kit/src/TestField/TestField.vue**

```HTML
<script lang="ts" setup>
import { FORM_KEY } from 'vant/es/utils';
import { inject } from 'vue';

const vanForm = inject(FORM_KEY, null);
console.log('vanForm inject result:', FORM_KEY, vanForm);
</script>
```

**vant-kit/src/index.ts**

```TypeScript
……
export { h } from 'vue';
export { Field } from 'vant';
export { FORM_KEY as VanKitFormKey } from 'vant/es/utils';
```

vant-kit-engineering 中的 demo 组件：**TestFieldUsage.vue**

```HTML
<script lang="ts" setup>
import { h } from 'vue';
import { Field as VanField } from 'vant';
import { h as kit_h, Field as kit_Field, VanKitFormKey } from '@vmono/vant-kit';

console.log('Vue h function:', h === kit_h);
console.log('Field cpn:', VanField === kit_Field);
console.log(
  'FORM_KEY:',
  VanKitFormKey === FORM_KEY,
  VanKitFormKey?.description,
  FORM_KEY.description,
);
</script>
```

打印结果:

- 虽然 FORM_KEY 的 description 都一致，但二者不相同
- **所以：宿主项目中的 FORM_KEY 与 vant-kit 中的 FORM_KEY 不是从同一个文件中引入的**。

![img](x.assets/asynccode)

当然了，在上述的三个用例中，在 vant-kit 中的 TestField 组件的打印结果中，也并没有成功的 inject 到信息

![img](x.assets/asynccode)

#### demo3

尝试 vant-kit 中的 form 能否代理 vant-kit 中的 field

1. 在 vant-kit 中编写 FormWrapper 组件，并在入口文件中暴露，打包。
2. 在 vant-kit-engineering 宿主项目中使用 FormWrapper 组件包裹 field 二开组件，测试功能

**vant-kit/src/FormWrapper/FormWrapper.vue**

```XML
<template>
  <van-form ref="formRef" v-bind="Props">
    <!-- 暴露默认支持的插槽 -->
    <template v-for="(_slot, name) in $slots" #[name]="slotData" :key="name">
      <slot :name="name" v-bind="slotData" :key="name"></slot>
    </template>
  </van-form>
</template>

<script lang="ts" setup>
import type { FormInstance } from 'vant';
import { ref } from 'vue';
const Props = defineProps<{ formProps: any }>();
const formRef = ref<FormInstance>();

defineExpose({ formRef });
</script>

<style scoped lang="less"></style>
```

**vant-kit/src/index.ts**

```JavaScript
……
// 测试表单组件
export { default as TestField } from './TestField/TestField.vue';
// 表单包装组件
export { default as FormWrapper } from './FormWrapper/FormWrapper.vue';

export { h } from 'vue';
export { Field } from 'vant';
export { FORM_KEY as VanKitFormKey } from 'vant/es/utils';
```

vant-kit-engineering 中的 demo 组件：**TestFieldUsage.vue**

```XML
<template>
  <van-form ref="VantFormRef">
    <FormWrapper ref="FormWrapperRef">
      <p>modelValue:{{ modelValue }}</p>
      <TestField
        v-model="modelValue"
        :field-props="{
          name: 'testField',
          label: 'testField',
          readonly: false,
          required: true,
          rules: [{ required: true, message: '请输入' }],
        }"
      />
      <van-field
        v-model="vantFieldModelValue"
        name="vantField"
        label="vantField"
        required
        :rules="[{ required: true, message: '请选择' }]"
      ></van-field>
    </FormWrapper>
  </van-form>

  <van-button type="primary" @click="validate"> 验证 </van-button>
</template>

<script lang="ts" setup>
import { useWrapperRef } from '@vmono/vhooks';
import { ref } from 'vue';
import { TestField, FormWrapper } from '@vmono/vant-kit';
import {
  Form as VanForm,
  Field as VanField,
  Button as VanButton,
  FormInstance,
} from 'vant';

import { h } from 'vue';
import { h as kit_h } from '@vmono/vant-kit';
import { Field as kit_Field, VanKitFormKey } from '@vmono/vant-kit';
import { FORM_KEY } from 'vant/es/utils';

console.log('Vue h function:', h === kit_h);
console.log('Field cpn:', VanField === kit_Field);
console.log(
  'FORM_KEY:',
  VanKitFormKey === FORM_KEY,
  VanKitFormKey?.description,
  FORM_KEY.description,
);

const FormWrapperRef = ref<InstanceType<typeof FormWrapper>>();
const VantFormRef = ref<FormInstance>();

const validate = async () => {
  //   原生、和组件库的表单只能分开验证
  await Promise.all([
    FormWrapperRef.value?.formRef?.validate?.(),
    VantFormRef.value?.validate?.(),
  ]);
  console.log(FormWrapperRef.value?.formRef?.getValues?.());
  console.log(VantFormRef.value?.getValues?.());
};

const [modelValue] = useWrapperRef('');
const [vantFieldModelValue] = useWrapperRef('');
</script>

<style scoped lang="less"></style>
```

**能够立刻观察到，在 vant-kit 中的 TestField 组件的打印结果中，已经能够 inject 到信息了**

- 展开 children 数组，发现有两个对象，点开后观察 name 字段，发现是用 **TestField** 组件生成的 field 表单字段，分别是 `testField`(真实绑定的 name)，`undefined`(绑定给用于展示的 field)

![img](x.assets/asynccode)

- 这里其实已经说明 vant-kit 中的 form 是可以代理 vant-kit 中的 field

让我们进行不同用例测试，进一步了解情况👇

**用例1：填写 testField、vantField，点击验证按钮，观察结果。**

![img](x.assets/asynccode)

VantFormRef、FormWrapperRef 校验均通过，getValues 也只能获取到各自的表单组件 field 字段信息：

![img](x.assets/asynccode)

**用例2：填写 testField，不填写 vantField，点击验证按钮，观察结果。**

![img](x.assets/asynccode)

VantFormRef 的校验未通过，视图出现必填提示，控制台打印 VantFormRef validate 方法的 promise 错误，可观察到其中也只有对 vantField 字段的验证。

![img](x.assets/asynccode)

**用例3：填写 vantField，不填写 testField，点击验证按钮，观察结果。**

![img](x.assets/asynccode)

同理：FormWrapperRef 的校验未通过，视图出现必填提示，控制台打印 FormWrapperRef validate 方法的 promise 错误，可观察到其中也只有对 testField 字段的验证。

![img](x.assets/asynccode)

### 结论

通过编写 demo 示例，现象为：

1. vant-kit 中的 vue 与宿主环境一致
2. vant-kit 中的组件实例与宿主环境一致
3. vant-kit 中的 injectionKey 与宿主环境引入的不一致

并且，vant-kit 中的 injectionKey 也能正常运转，具有代理能力，只不过和宿主环境的 injectionKey 隔离的

## Bug 解决

上述得到的结论中: vant-kit 中的组件实例与宿主环境一致，但是 injectionKey 却不一致。

这个现象还挺反直觉的。

因为 vant-kit 项目的 **vite.config.ts** 中，我们确实把 vant 作为了外部依赖

```TypeScript
    rollupOptions: {
      /**
       * 👇 告诉 Rollup：不要打包这些模块
       *    因为这些模块在使用该库的外部项目中会被提供
       *    1. 这样可以避免重复打包，减小库的体积
       *    2. 防止 vant 组件库被多次引入，避免样式冲突
       */
      external: ['vue', 'vant'],
      output: {
        // 👇 将使用该库的外部项目中，需要自行引入的模块映射为全局变量
        globals: {
          vue: 'Vue',
          vant: 'Vant',
        },
      },
    },
```

而 injectionKey 也是通过从 vant 包内部去引入的。

只不过是通过其子目录 `vant/es/utils` 中进行引入的（当然了，也可以从 `vant/lib/utils` 中引入）

**经过了解后，这里只是将 vant 进行了外部化，并没有将 vant 的子模块进行外部化😩。**

因此我们要新增配置项，将 vant 的子包也进行外部化

1. external 新增 `/^vant\//` 匹配 vant 的子包
2. 在 globals 中添加 'vant/es/utils': 'Vant.utils' 映射。这将体现在构建产物中的 umd.js 文件中

```TypeScript
    rollupOptions: {
      /**
       * 👇 告诉 Rollup：不要打包这些模块
       *    因为这些模块在使用该库的外部项目中会被提供
       *    1. 这样可以避免重复打包，减小库的体积
       *    2. 防止 vant 组件库被多次引入，避免样式冲突
       */
      external: ['vue', 'vant', /^vant\//],
      output: {
        // 👇 将使用该库的外部项目中，需要自行引入的模块映射为全局变量
        globals: {
          vue: 'Vue',
          vant: 'Vant',
          'vant/es/utils': 'Vant.utils',
        },
      },
    },
```

应用该配置将 vant-kit 打包后，更新宿主项目(vant-kit-engineering)中的 demo 组件：**TestFieldUsage.vue** 代码

1. 只使用宿主环境中的原生 vant form 组件包裹 TestField、原生 vant filed 组件
2. 验证、获取字段也只使用 VantFormRef 进行操作

```XML
<template>
  <van-form ref="VantFormRef">
    <p>modelValue:{{ modelValue }}</p>
    <TestField
      v-model="modelValue"
      :field-props="{
        name: 'testField',
        label: 'testField',
        readonly: false,
        required: true,
        rules: [{ required: true, message: '请输入' }],
      }"
    />
    <van-field
      v-model="vantFieldModelValue"
      name="vantField"
      label="vantField"
      required
      :rules="[{ required: true, message: '请选择' }]"
    ></van-field>
  </van-form>

  <van-button type="primary" @click="validate"> 验证 </van-button>
</template>

<script lang="ts" setup>
import { useWrapperRef } from '@vmono/vhooks';
import { ref } from 'vue';
import { TestField, FormWrapper } from '@vmono/vant-kit';
import {
  Form as VanForm,
  Field as VanField,
  Button as VanButton,
  FormInstance,
} from 'vant';

import { h } from 'vue';
import { h as kit_h } from '@vmono/vant-kit';
import { Field as kit_Field, VanKitFormKey } from '@vmono/vant-kit';
import { FORM_KEY } from 'vant/es/utils';

console.log('Vue h function:', h === kit_h);
console.log('Field cpn:', VanField === kit_Field);
console.log(
  'FORM_KEY:',
  VanKitFormKey === FORM_KEY,
  VanKitFormKey?.description,
  FORM_KEY.description,
);

const FormWrapperRef = ref<InstanceType<typeof FormWrapper>>();
const VantFormRef = ref<FormInstance>();

const validate = async () => {
  await VantFormRef.value?.validate?.();
  console.log(VantFormRef.value?.getValues?.());
};

const [modelValue] = useWrapperRef('');
const [vantFieldModelValue] = useWrapperRef('');
</script>

<style scoped lang="less"></style>
```

vant-kit 中的 FORM_KEY 与宿主项目中的相同

![img](x.assets/asynccode)

在 vant-kit 中的 TestField 组件的打印结果中，inject 到的 children 也变成了 3 个(包含了 vant-kit 的二开 field，与宿主项目中的原生 field)

![img](x.assets/asynccode)

**用例1：不输入任何字段，点击验证按钮触发校验**

![img](x.assets/asynccode)

- 所有字段的必填校验全部正常触发，出现必填提示信息
- 控制台报错信息中能够打印所有未通过验证的字段

![img](x.assets/asynccode)

**用例2：输入所有字段，点击验证按钮触发校验**

![img](x.assets/asynccode)

表单验证通过，能够正常打印所有字段

![img](x.assets/asynccode)
