<template>
  <div v-if="visible" class="slide_model">
    <div class="slide_wrapper">
      <div id="canvas_img" class="canvas_img">
        <img ref="BgImageEleRef" class="big-img" :src="verifyCodeDatasource?.captcha?.backgroundImage" />
        <img class="slider-img" :src="verifyCodeDatasource?.captcha?.templateImage" />
      </div>
      <!-- 滑块 -->
      <div class="canvas_slide">
        <div class="canvas_kus" @mousedown.prevent="slide_start" @touchstart.prevent="slide_start">
          <div>
            <img :src="SlideTriggerImg" class="slide-icon" />
          </div>
        </div>
        <div>拖动左边滑块完成上方拼图</div>
      </div>
      <!-- 底部按钮 -->
      <div class="canvas_guil">
        <img class="footer-icon" :src="CloseImg" @click="onClose" />
        <img class="footer-icon" :src="RefreshImg" @click="reset" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
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

export type TFormatedCurrentCaptchaConfig = TCurrentCaptchaConfig & {
  startSlidingTime: string;
  endSlidingTime: string;
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
  captchaInfo: TFormatedCurrentCaptchaConfig;
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

// 组件 Event 类型
export type TVerifySuccessEventPayload = {
  checkVerifyCodePayload: TCheckSliderVerifyCodeFuncPayload;
  checkVerifyRes: TCheckSliderVerifyCodeFuncRes;
};
export type TVerifyFailedEventPayload = {
  checkVerifyCodePayload: TCheckSliderVerifyCodeFuncPayload;
  checkVerifyRes: TCheckSliderVerifyCodeFuncRes;
};

// 组件 Expose api 类型

// other
type TEvent = MouseEvent | TouchEvent;

// 常量
const CanvasImgWidth = 294.5;
const CanvasImgWidthCssValue = computed(() => {
  return CanvasImgWidth + 'px';
});
</script>

<script lang="ts" setup>
import { computed, onUnmounted, ref } from 'vue';
import { useWrapperRef } from '@vmono/vhooks';
import SlideTriggerImg from '@/assets/sliderVerify/slideTrigger.png';
import CloseImg from '@/assets/sliderVerify/close.png';
import RefreshImg from '@/assets/sliderVerify/refresh.png';
import dayjs from 'dayjs';

const Props = defineProps<TSliderVerifyProps>();

// Emits 定义
const Emitter = defineEmits<{
  (e: 'close'): void;
  (e: 'verifySuccess', p: TVerifySuccessEventPayload): void;
  (e: 'verifyFailed', p: TVerifyFailedEventPayload): void;
}>();

// template refs
const BgImageEleRef = ref<HTMLImageElement>();

// 显示/隐藏弹窗
const [visible, setVisible] = useWrapperRef(false);
const open = () => {
  reset();
  setVisible(true);
};
const close = () => {
  setVisible(false);
  Emitter('close');
};

const onClose = () => {
  if (Props.processingClose) {
    Props.processingClose({ close });
  } else {
    close();
  }
};

// 滑动验证码数据源
const [verifyCodeDatasource, setVerifyCodeDatasource] = useWrapperRef<TVerifyCodeDatasource>({} as any);

// 滑块位置
const [sliderClientX, setSliderClientX] = useWrapperRef(0);
const sliderClientXCssValue = computed(() => {
  return sliderClientX.value + 'px';
});

// 验证码配置
const genCaptchaConfigInitValue = (): TCurrentCaptchaConfig => {
  return {
    startSlidingTime: new Date(),
    endSlidingTime: new Date(),
    trackList: [],
    bgImageWidth: 0,
    bgImageHeight: 0,
    templateImageWidth: 0,
    templateImageHeight: 0,
    end: (BgImageEleRef?.value?.width ?? CanvasImgWidth) - 40,
    startX: 0,
    startY: 0,
    isMoving: false,
    moveX: 0,
    movePercent: 0,
  };
};
let currentCaptchaConfig: TCurrentCaptchaConfig = genCaptchaConfigInitValue();
const getFormatedCurrentCaptchaConfig = (): TFormatedCurrentCaptchaConfig => {
  return Object.assign({}, currentCaptchaConfig, {
    startSlidingTime: dayjs(currentCaptchaConfig.startSlidingTime).format('YYYY-MM-DD HH:mm:ss'),
    endSlidingTime: dayjs(currentCaptchaConfig.endSlidingTime).format('YYYY-MM-DD HH:mm:ss'),
  });
};

const initCurrentCaptchaConfig = () => {
  currentCaptchaConfig = genCaptchaConfigInitValue();
};
const patchCaptchaConfig = (patch: Partial<TCurrentCaptchaConfig>) => {
  currentCaptchaConfig = {
    ...currentCaptchaConfig,
    ...patch,
  };
};

// 初始化视图配置
const initViewConfig = () => {
  setSliderClientX(0);
  initCurrentCaptchaConfig();
};

// 刷新/重置
const reset = async () => {
  try {
    // 初始化数据
    initViewConfig();
    setVerifyCodeDatasource({} as any);
    // 接口调用获取信息
    const verifyDataSource = await Props?.getVerifyCode?.();
    if (!verifyDataSource) return;
    setVerifyCodeDatasource(verifyDataSource);
    const { captcha } = verifyDataSource;
    // 更新配置
    patchCaptchaConfig({
      bgImageWidth: captcha?.backgroundImageWidth,
      bgImageHeight: captcha?.backgroundImageHeight,
      templateImageWidth: captcha?.templateImageWidth,
      templateImageHeight: captcha?.templateImageHeight,
    });
  } catch (error) {
    showFailToast('获取验证码逻辑异常');
    console.error('获取验证码逻辑异常:', error);
  }
};

// 获取事件代理
const getEventShim = () => {
  const ua = navigator.userAgent.toLowerCase();
  const isSupportTouch = /mobile|android|iphone|ipad|ipod|phone/.test(ua);
  return isSupportTouch
    ? {
        start: 'touchstart',
        move: 'touchmove',
        end: 'touchend',
      }
    : {
        start: 'mousedown',
        move: 'mousemove',
        end: 'mouseup',
      };
};

// 获取鼠标/触摸点信息
const getMousePageInfo = (event: TEvent) => {
  if ('pageX' in event) {
    return {
      x: event.pageX,
      y: event.pageY,
    };
  }

  if ('touches' in event) {
    const touch = event.touches[0] || event.changedTouches[0];
    return {
      x: touch.pageX,
      y: touch.pageY,
    };
  }

  return {
    x: 0,
    y: 0,
  };
};

// 滑动中
const slide_move = (e: TEvent) => {
  const { x: pageX, y: pageY } = getMousePageInfo(e);
  if (!currentCaptchaConfig.isMoving) return; // 检查是否在移动状态
  const { startX, startY, startSlidingTime, end, bgImageWidth, trackList } = currentCaptchaConfig;
  // 计算滑动距离
  let moveX = pageX - startX;
  let moveY = pageY - startY;
  // 边界检查
  if (moveX < 0) {
    moveX = 0;
  } else if (moveX > end) {
    moveX = end;
  }
  // 更新数据
  setSliderClientX(moveX);
  patchCaptchaConfig({
    moveX,
    movePercent: moveX / bgImageWidth,
    trackList: [
      ...trackList,
      {
        x: moveX, // 直接使用计算后的 moveX
        y: moveY,
        type: 'move',
        t: new Date().getTime() - startSlidingTime.getTime(),
      },
    ],
  });
};

const addEvents = () => {
  document.addEventListener(getEventShim().move, slide_move as any, {
    passive: false,
  });
  document.addEventListener(getEventShim().end, slide_end as any, {
    passive: false,
  });
};

const removeEvents = () => {
  document.removeEventListener(getEventShim().move, slide_move as any);
  document.removeEventListener(getEventShim().end, slide_end as any);
};

// 滑动结束
const slide_end = async (e: TEvent) => {
  removeEvents();
  if (!currentCaptchaConfig.isMoving) return; // 检查是否在移动状态
  const { x: pageX, y: pageY } = getMousePageInfo(e);
  const { startX, startY, startSlidingTime, trackList } = currentCaptchaConfig;
  // 计算最终位置
  const finalX = pageX - startX;
  const finalY = pageY - startY;
  // 更新数据
  patchCaptchaConfig({
    isMoving: false,
    bgImageWidth: BgImageEleRef?.value?.width ?? 0,
    bgImageHeight: BgImageEleRef?.value?.height ?? 0,
    endSlidingTime: new Date(),
    trackList: [
      ...trackList,
      {
        x: finalX,
        y: finalY,
        type: 'up',
        t: new Date().getTime() - startSlidingTime.getTime(),
      },
    ],
  });
  // 触发验证逻辑
  await validate();
};

// 滑动开始
const slide_start = (e: TEvent) => {
  const { x: startX, y: startY } = getMousePageInfo(e);
  // 记录初始触摸点位置
  patchCaptchaConfig({
    isMoving: true, // 添加移动状态标记
    startX,
    startY,
    trackList: [
      ...currentCaptchaConfig.trackList,
      { x: 0, y: 0, type: 'down', t: new Date().getTime() - currentCaptchaConfig.startSlidingTime.getTime() },
    ],
  });

  addEvents();
};

// 组件销毁时取消事件监听
onUnmounted(() => {
  removeEvents();
});

// 验证逻辑
const validate = async () => {
  try {
    const checkVerifyCodePayload: TCheckSliderVerifyCodeFuncPayload = {
      id: verifyCodeDatasource.value?.id,
      captchaInfo: getFormatedCurrentCaptchaConfig(),
    };
    const checkVerifyRes = await Props?.checkVerifyCode?.(checkVerifyCodePayload);
    if (checkVerifyRes.matching) {
      if (Props.processingVerifySuccess) {
        // 自定义处理验证成功逻辑
        await Props.processingVerifySuccess({
          checkVerifyCodePayload,
          checkVerifyRes,
          close,
        });
      } else {
        Emitter('verifySuccess', { checkVerifyCodePayload, checkVerifyRes });
        close();
      }
    } else {
      if (Props.processingVerifyFailed) {
        // 自定义处理验证失败逻辑
        await Props.processingVerifyFailed({
          checkVerifyCodePayload,
          checkVerifyRes,
          close,
        });
      } else {
        Emitter('verifyFailed', { checkVerifyCodePayload, checkVerifyRes });
        reset();
      }
    }
  } catch (err: any) {
    reset();
    const errorMsg = '滑动验证码验证逻辑异常';
    showFailToast(err?.data?.errorMsg || errorMsg);
    console.error(err?.data?.errorMsg || errorMsg);
  }
};

// 暴露方法供父组件调用
defineExpose({
  open,
  close,
  reset,
});
</script>

<style lang="less" scoped>
.slide_model {
  width: 100%;
  height: 100vh;
  z-index: 999;
  position: fixed;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.slide_wrapper {
  float: left;
  z-index: 1;
  position: relative;
  background-color: #fff;
  width: 335px;
  padding-top: 20px;
}

.canvas_img {
  width: v-bind(CanvasImgWidthCssValue);
  min-height: 150px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 0 20px 20px;

  img[src=''],
  img:not([src]) {
    visibility: hidden;
  }
}

.big-img {
  width: 100%;
  height: 180px;
}

.slider-img {
  width: 55px;
  height: 180px;
  position: absolute;
  top: 0;
  left: v-bind(sliderClientXCssValue);
  z-index: 2;
}

.canvas_slide {
  width: 295px;
  height: 45px;
  background: #eee;
  text-align: center;
  line-height: 40px;
  margin: 0 auto;
  position: relative;
  font-size: 13px;
}

.canvas_kus {
  width: 48px;
  height: 45px;
  background-color: #fff;
  font-size: 18px;
  font-weight: 700;
  position: absolute;
  left: v-bind(sliderClientXCssValue);
  top: 0;
  border: 1px solid #ddd;
  color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  user-select: none;
  -webkit-user-select: none;
  cursor: grab;
  touch-action: none; // 禁用浏览器默认的触摸行为
  -webkit-touch-callout: none; // 禁用长按菜单
  -webkit-tap-highlight-color: transparent; // 禁用触摸高亮

  .slide-icon {
    width: 20px;
    height: 20px;
    margin-top: 10px;
  }

  &:active {
    cursor: grabbing;
  }
}

.canvas_guil {
  width: 100%;
  border-top: 1px solid #f4f4f4;
  height: 50px;
  display: flex;
  align-items: center;
  float: left;
  font-size: 15px;
  color: #666;

  .footer-icon {
    width: 25px;
    height: 25px;
    margin-left: 15px;
  }
}
</style>
