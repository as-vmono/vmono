/**
 * 样式文件类型声明
 */
declare module '*.less' {
  const classes: { [key: string]: string };
  export default classes;
}

/**
 * 图片资源类型声明
 */
declare module '*.png' {
  const value: string;
  export default value;
}
declare module '*.jpg' {
  const value: string;
  export default value;
}
declare module '*.jpeg' {
  const value: string;
  export default value;
}
declare module '*.gif' {
  const value: string;
  export default value;
}
declare module '*.svg' {
  const value: string;
  export default value;
}
