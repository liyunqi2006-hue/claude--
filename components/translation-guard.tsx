"use client";

import { useEffect } from "react";

/**
 * 修复 React 与浏览器翻译工具（谷歌翻译等）的冲突。
 *
 * 翻译工具会把页面里的文本节点替换/包裹成自己的 <font> 节点，
 * 之后 React 卸载或更新这些节点时会因为“节点已不是原来的子节点”而抛出：
 *   NotFoundError: Failed to execute 'removeChild' on 'Node'
 *   NotFoundError: Failed to execute 'insertBefore' on 'Node'
 * 导致整页崩溃。
 *
 * 这里给 Node.prototype 的 removeChild / insertBefore 打防御补丁：
 * 当目标节点的父节点已不是当前节点时，安全跳过而非抛错。
 * 这是社区通行的兜底方案。
 */
export default function TranslationGuard() {
  useEffect(() => {
    if (typeof Node !== "function" || (Node.prototype as any).__i18nGuardPatched) {
      return;
    }
    (Node.prototype as any).__i18nGuardPatched = true;

    const originalRemoveChild = Node.prototype.removeChild;
    Node.prototype.removeChild = function <T extends Node>(this: Node, child: T): T {
      if (child.parentNode !== this) {
        if (console && console.warn) {
          console.warn(
            "已拦截 removeChild：目标节点不是当前节点的子节点（多为翻译工具改动 DOM 所致）。",
          );
        }
        return child;
      }
      return originalRemoveChild.call(this, child) as T;
    } as typeof Node.prototype.removeChild;

    const originalInsertBefore = Node.prototype.insertBefore;
    Node.prototype.insertBefore = function <T extends Node>(
      this: Node,
      newNode: T,
      referenceNode: Node | null,
    ): T {
      if (referenceNode && referenceNode.parentNode !== this) {
        if (console && console.warn) {
          console.warn(
            "已拦截 insertBefore：参考节点不是当前节点的子节点（多为翻译工具改动 DOM 所致）。",
          );
        }
        return newNode;
      }
      return originalInsertBefore.call(this, newNode, referenceNode) as T;
    } as typeof Node.prototype.insertBefore;
  }, []);

  return null;
}
