/**
 * 通过 URL 触发浏览器下载
 * @param url - 文件地址
 * @param filename - 下载文件名，缺省取 url 末段，兜底 'download'
 * - 跨域 URL 时 a.download 指定文件名会被浏览器忽略（按源站 Content-Disposition），属浏览器机制
 */
export function downloadFileByUrl(url: string, filename?: string) {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || url?.split?.('/')?.pop?.() || 'download';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
