<template>
  <slot :copy="copyText">
    <div class="default-trigger-btn" @click="copyText(txt!)">复制</div>
  </slot>
</template>

<script lang="ts">
export type TCopyTxtTriggerProps = {
  txt: string;
};
</script>

<script lang="ts" setup>
import { showFailToast, showSuccessToast } from 'vant';

defineProps<TCopyTxtTriggerProps>();

// 移动端优化兼容方案
const mobileFriendlyCopy = (text) => {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', ''); // 防止键盘弹出
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';

  // 3. iOS 特殊处理
  if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
    textarea.contentEditable = 'true';
    textarea.style.fontSize = '16px'; // 避免 iOS 缩放
  }

  document.body.appendChild(textarea);

  // 4. 处理选区范围
  const range = document.createRange();
  range.selectNodeContents(textarea);

  const selection = window.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);

  // 5. 处理 iOS 全选需求
  if (textarea.setSelectionRange) {
    const length = textarea.value.length;
    textarea.setSelectionRange(0, length);

    if (length > 0) {
      textarea.focus(); // iOS 需要焦点
    }
  } else {
    textarea.select();
  }

  // 6. 执行复制
  try {
    const success = document.execCommand('copy');
    success ? showSuccessToast('复制成功') : showFailToast('复制失败');
  } catch (_err) {
    showFailToast('该浏览器不支持自动复制，请手动选择文字后长按复制');
    console.error(_err);
  }

  // 7. 清理 DOM
  document.body.removeChild(textarea);
  selection?.removeAllRanges();
};

// 兼容性方案（旧浏览器）
const legacyCopy = (text) => {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed'; // 防止滚动
  document.body.appendChild(textarea);
  textarea.select();

  try {
    const success = document.execCommand('copy');
    showFailToast(success ? '复制成功 旧方案!' : '复制失败，请手动复制');
  } catch (err) {
    showFailToast('浏览器不支持自动复制，请手动选择文本进行复制');
    throw new Error(String(err) || '复制失败');
  }

  document.body.removeChild(textarea);
};

// 复制函数
const copyText = (_text) => {
  const txt = _text ?? '';
  // 1. 优先检测 Clipboard API 可用性
  if (window?.navigator?.clipboard?.writeText) {
    window?.navigator?.clipboard
      ?.writeText(txt)
      .then(() => showSuccessToast('复制成功'))
      .catch(() => legacyCopy(txt)); // 权限拒绝时降级
  } else {
    // 2. 移动端专用兼容方案
    mobileFriendlyCopy(txt);
  }
};

defineExpose({
  copy: copyText,
});
</script>

<style scoped lang="less">
.default-trigger-btn {
  width: 32px;
  height: 15px;
  box-sizing: border-box;
  cursor: pointer;

  /* 自动布局 */
  display: flex;
  justify-content: center;
  align-items: center;

  border: 0.5px solid rgba(0, 0, 0, 0.45);
  border-radius: 112px;

  font-size: 10px;
  color: #333333;
}
</style>
