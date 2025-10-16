# SliderVerify

### 介绍

移动端的滑块验证组件

**主要功能描述**

- 基础滑块功能与交互
  - 同时支持鼠标、触摸事件 (兼容更多设备的同时，也方便日常开发和测试)
- 支持一些事件的自定义拦截处理，方便业务层做其它特殊逻辑
  - 点击 `关闭按钮` 时的处理
  - 验证成功后的处理
  - 验证失败后的处理
- 抽象的 api 暴露，无需关注实现细节，自己决定调用时机
  - open 打开滑动验证组件
  - close 关闭滑动验证组件
  - reset 重置(刷新)滑块验证组件的视图

## 代码演示

### 基础用法

```html
<template>
  <demo-block title="基础用法">
    <section class="demo-section">
      <van-button
        type="primary"
        @click="
          () => {
            SliderVerifyRef?.open?.();
          }
        "
      >
        打开滑块验证码组件
      </van-button>
      <div class="flexrcc">
        <van-switch size="small" v-model="isVerifySuccess" />是否验证成功
      </div>
      <SliderVerify
        ref="SliderVerifyRef"
        :get-verify-code="getVerifyCode"
        :check-verify-code="checkVerifyCode"
      />
    </section>
  </demo-block>
</template>

<script setup lang="ts">
import {
  SliderVerify,
  TCheckSliderVerifyCodeFuncPayload,
  TCheckSliderVerifyCodeFuncRes,
  TVerifyCodeDatasource,
} from '@vmono/vant-kit';
import { ref } from 'vue';
import { Button as VanButton, Switch as VanSwitch } from 'vant';

const SliderVerifyRef = ref<InstanceType<typeof SliderVerify>>();

const isVerifySuccess = ref(true);

// 模拟接口调用
const getVerifyCode = (): Promise<TVerifyCodeDatasource> => {
  const res = {
    id: 'bf576c727a9c46b2897d790204bbf40a',
    captcha: {
      type: 'SLIDER',
      backgroundImage: 'xxx',
      templateImage: 'xxx',
      backgroundImageTag: 'default',
      templateImageTag: 'default',
      backgroundImageWidth: 590,
      backgroundImageHeight: 360,
      templateImageWidth: 110,
      templateImageHeight: 360,
      data: null,
    },
  };
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(res);
    }, 1000);
  });
};

const checkVerifyCode = (
  p: TCheckSliderVerifyCodeFuncPayload,
): Promise<TCheckSliderVerifyCodeFuncRes> => {
  return new Promise((resolve) => {
    // eslint-disable-next-line no-console
    console.log('checkVerifyCode payload', p);
    setTimeout(() => {
      resolve({ matching: isVerifySuccess.value, smsSendKey: '12345678' });
    }, 500);
  });
};
</script>

<style scoped lang="less">
//
</style>
```

### 点击关闭按钮时的自定义处理

props.processingClose

```html
<template>
  <demo-block title="点击关闭按钮时的自定义处理">
    <section class="demo-section">
      <van-button
        type="primary"
        @click="
          () => {
            SliderVerifyRef?.open?.();
          }
        "
      >
        点击关闭按钮时的自定义处理
      </van-button>
      <SliderVerify
        ref="SliderVerifyRef"
        :get-verify-code="getVerifyCode"
        :check-verify-code="checkVerifyCode"
        :processing-close="processingClose"
      />
    </section>
  </demo-block>
</template>

<script setup lang="ts">
import {
  SliderVerify,
  TCheckSliderVerifyCodeFuncPayload,
  TCheckSliderVerifyCodeFuncRes,
  TSliderVerifyProcessingCloseFuncPayload,
  TVerifyCodeDatasource,
} from '@vmono/vant-kit';
import { ref } from 'vue';
import { showToast, Button as VanButton } from 'vant';

const SliderVerifyRef = ref<InstanceType<typeof SliderVerify>>();

// 模拟接口调用
const getVerifyCode = (): Promise<TVerifyCodeDatasource> => {
  const res = {
    id: 'bf576c727a9c46b2897d790204bbf40a',
    captcha: {
      type: 'SLIDER',
      backgroundImage: 'xxx',
      templateImage: 'xxx',
      backgroundImageTag: 'default',
      templateImageTag: 'default',
      backgroundImageWidth: 590,
      backgroundImageHeight: 360,
      templateImageWidth: 110,
      templateImageHeight: 360,
      data: null,
    },
  };
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(res);
    }, 1000);
  });
};

const checkVerifyCode = (
  p: TCheckSliderVerifyCodeFuncPayload,
): Promise<TCheckSliderVerifyCodeFuncRes> => {
  return new Promise((resolve) => {
    // eslint-disable-next-line no-console
    console.log('checkVerifyCode payload', p);
    setTimeout(() => {
      resolve({ matching: false, smsSendKey: '12345678' });
    }, 500);
  });
};

const processingClose = (p: TSliderVerifyProcessingCloseFuncPayload) => {
  const { close } = p;
  let delay = 2;
  showToast(`${delay}s 后关闭`);
  setTimeout(close, delay * 1000);
};
</script>

<style scoped lang="less">
//
</style>
```

### 触发验证时的自定义处理

props.processingVerifySuccess

props.processingVerifyFailed

```html
<template>
  <demo-block title="触发验证时的自定义处理">
    <section class="demo-section">
      <van-button
        type="primary"
        @click="
          () => {
            SliderVerifyRef?.open?.();
          }
        "
      >
        open
      </van-button>
      <div class="flexrcc">
        <van-switch size="small" v-model="isVerifySuccess" />是否验证成功
      </div>
      <SliderVerify
        ref="SliderVerifyRef"
        :get-verify-code="getVerifyCode"
        :check-verify-code="checkVerifyCode"
        :processing-verify-success="processingVerifySuccess"
        :processing-verify-failed="processingVerifyFailed"
      />
    </section>
  </demo-block>
</template>

<script setup lang="ts">
import {
  SliderVerify,
  TCheckSliderVerifyCodeFuncPayload,
  TCheckSliderVerifyCodeFuncRes,
  TProcessingSliderVerifyFailedFuncPayload,
  TProcessingSliderVerifySuccessFuncPayload,
  TVerifyCodeDatasource,
} from '@vmono/vant-kit';
import { ref } from 'vue';
import {
  showConfirmDialog,
  showToast,
  Button as VanButton,
  Switch as VanSwitch,
} from 'vant';

const SliderVerifyRef = ref<InstanceType<typeof SliderVerify>>();

const isVerifySuccess = ref(true);

// 模拟接口调用
const getVerifyCode = (): Promise<TVerifyCodeDatasource> => {
  const res = {
    id: 'bf576c727a9c46b2897d790204bbf40a',
    captcha: {
      type: 'SLIDER',
      backgroundImage: 'xxx',
      templateImage: 'xxx',
      backgroundImageTag: 'default',
      templateImageTag: 'default',
      backgroundImageWidth: 590,
      backgroundImageHeight: 360,
      templateImageWidth: 110,
      templateImageHeight: 360,
      data: null,
    },
  };
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(res);
    }, 1000);
  });
};

const checkVerifyCode = (
  _p: TCheckSliderVerifyCodeFuncPayload,
): Promise<TCheckSliderVerifyCodeFuncRes> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ matching: isVerifySuccess.value, smsSendKey: '12345678' });
    }, 500);
  });
};

const processingVerifySuccess = (
  p: TProcessingSliderVerifySuccessFuncPayload,
) => {
  const { checkVerifyCodePayload, checkVerifyRes, close } = p;
  showConfirmDialog({
    title: '验证结果',
    message: `matching: ${checkVerifyRes.matching}`,
  })
    .then(() => {
      let delay = 2;
      showToast(`${delay}s 后关闭`);
      setTimeout(close, delay * 1000);
    })
    .catch(() => {
      SliderVerifyRef.value?.reset?.();
    })
    .finally(() => {
      // eslint-disable-next-line no-console
      console.log(checkVerifyCodePayload);
    });
};
const processingVerifyFailed = (
  p: TProcessingSliderVerifyFailedFuncPayload,
) => {
  const { checkVerifyCodePayload, checkVerifyRes, close } = p;
  showConfirmDialog({
    title: '验证结果',
    message: `matching: ${checkVerifyRes.matching}`,
  })
    .then(() => {
      let delay = 1;
      showToast(`${delay}s 后关闭`);
      setTimeout(close, delay * 1000);
    })
    .catch(() => {
      SliderVerifyRef.value?.reset?.();
    })
    .finally(() => {
      // eslint-disable-next-line no-console
      console.log(checkVerifyCodePayload);
    });
};
</script>

<style scoped lang="less">
//
</style>
```



## API

### Props

```
TSliderVerifyProps
```

| 参数                    | 说明                         | 类型                                                         | 默认值 |
| :---------------------- | :--------------------------- | :----------------------------------------------------------- | :----- |
| getVerifyCode           | 获取验证码数据源函数         | `() => Promise<TVerifyCodeDatasource>`                       | -      |
| checkVerifyCode         | 验证码校验函数               | `(p: TCheckSliderVerifyCodeFuncPayload) => Promise<TCheckSliderVerifyCodeFuncRes>` | -      |
| processingClose         | 自定义处理点击按钮关闭的逻辑 | `(p: TSliderVerifyProcessingCloseFuncPayload) => any`        | -      |
| processingVerifySuccess | 自定义处理验证成功逻辑       | `(p: TProcessingSliderVerifySuccessFuncPayload) => any`      | -      |
| processingVerifyFailed  | 自定义处理验证失败逻辑       | `(p: TProcessingSliderVerifyFailedFuncPayload) => any`       | -      |

```ts
export type TCurrentCaptchaConfig = {
  startSlidingTime: Date;
  endSlidingTime: Date;
  trackList: any[];

  bgImageWidth: number;
  bgImageHeight: number;
  templateImageWidth: number;
  templateImageHeight: number;

  end: number;
  startX: number;
  startY: number;
  isMoving: boolean;
  moveX: number;
  movePercent: number;
};

// getVerifyCode 函数的类型
export type TVerifyCodeDatasource = {
  id: string;
  captcha: {
    // 背景图片
    backgroundImage: string;
    backgroundImageWidth: number;
    backgroundImageHeight: number;
    // 滑块图片;
    templateImage: string;
    templateImageWidth: number;
    templateImageHeight: number;
  };
};

// checkVerifyCode 函数类型
export type TCheckSliderVerifyCodeFuncPayload = {
  id: string;
  captchaInfo: TCurrentCaptchaConfig;
};
export type TCheckSliderVerifyCodeFuncRes = {
  matching: boolean;
  smsSendKey: string;
};

// processingClose 函数类型
export type TSliderVerifyProcessingCloseFuncPayload = {
  close: () => void;
};

// processingVerifySuccess 函数类型
export type TProcessingSliderVerifySuccessFuncPayload = {
  checkVerifyCodePayload: TCheckSliderVerifyCodeFuncPayload;
  checkVerifyRes: TCheckSliderVerifyCodeFuncRes;
  close: () => void;
};

// processingVerifyFailed 函数类型
export type TProcessingSliderVerifyFailedFuncPayload = {
  checkVerifyCodePayload: TCheckSliderVerifyCodeFuncPayload;
  checkVerifyRes: TCheckSliderVerifyCodeFuncRes;
  close: () => void;
};

// 组件 Props 类型
export type TSliderVerifyProps = {
  // 获取验证码数据源函数
  getVerifyCode: () => Promise<TVerifyCodeDatasource>;
  // 验证码校验函数
  checkVerifyCode: (p: TCheckSliderVerifyCodeFuncPayload) => Promise<TCheckSliderVerifyCodeFuncRes>;
  // 自定义处理点击按钮关闭的逻辑
  processingClose?: (p: TSliderVerifyProcessingCloseFuncPayload) => any;
  // 自定义处理验证成功逻辑
  processingVerifySuccess?: (p: TProcessingSliderVerifySuccessFuncPayload) => any;
  // 自定义处理验证失败逻辑
  processingVerifyFailed?: (p: TProcessingSliderVerifyFailedFuncPayload) => any;
};
```

### 方法

| 方法名 | 说明                         | 类型                         |
| :----- | :--------------------------- | :--------------------------- |
| open   | 打开滑动验证组件             | `() => void`                 |
| close  | 关闭滑动验证组件             | `() => void`                 |
| reset  | 重置(刷新)滑块验证组件的视图 | `reset: () => Promise<void>` |