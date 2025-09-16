/**
 * 坐标系统配置常量
 * 用于统一管理贝塞尔编辑器和预览区之间的坐标转换
 */

// 编辑器坐标系统配置
export const EDITOR_CONFIG = {
  // 编辑器画布尺寸
  WIDTH: 300,
  HEIGHT: 300,

  // 编辑器中心点坐标 (对应预览区的圆心位置)
  CENTER_X: 100,
  CENTER_Y: 150,

  // 编辑器中的参考半径 (用于缩放计算)
  REFERENCE_RADIUS: 200,
} as const

// 预览区坐标系统配置
export const PREVIEW_CONFIG = {
  // 预览区画布尺寸
  SIZE: 400,

  // 预览区半径比例 (相对于画布尺寸)
  RADIUS_RATIO: 0.4,
} as const

// 坐标转换工具函数
export const COORDINATE_TRANSFORM = {
  /**
   * 计算从编辑器到预览区的缩放因子
   * @param previewRadius 预览区的实际半径
   * @returns 缩放因子
   */
  getScale: (previewRadius: number) => previewRadius / EDITOR_CONFIG.REFERENCE_RADIUS,

  /**
   * 将编辑器坐标转换为预览区坐标
   * @param editorX 编辑器X坐标
   * @param editorY 编辑器Y坐标
   * @param scale 缩放因子
   * @returns 转换后的坐标 [x, y]
   */
  editorToPreview: (editorX: number, editorY: number, scale: number): [number, number] => [
    (editorX - EDITOR_CONFIG.CENTER_X) * scale,
    (editorY - EDITOR_CONFIG.CENTER_Y) * scale,
  ],
} as const
