import { setAttribute, setComponentProps, createComponent } from './index';

export function diff(dom, vnode, container) {
  const ret = diffNode(dom, vnode);

  if (container) {
    container.appendChild(ret);
  }

  return ret;
};

export function diffNode(dom, vnode) {
  let out = dom;

  // 1、undefined/null/bool
  if (vnode === undefined || vnode === null || typeof vnode === 'boolean') {
    return;
  }

  if (typeof vnode === 'number') {
    vnode = String(vnode);
  }

  // 2、字符串
  if (typeof vnode === 'string') {
    if (dom && dom.nodeType === 3) {
      if (dom.textContent !== vnode) {
        // 更新文本内容
        dom.textContent = vnode;
      }
    } else {
      out = document.createTextNode(vnode);

      if (dom && dom.parentNode) {
        dom.parentNode.replaceChild(out, dom);
      }
    }
    // 创建文本节点
     return out;
  }

  if (typeof vnode.tag === 'function') {
    return diffComponent(out, vnode);
  }

  // 非文本dom节点
  if (!dom) {
    out = document.createElement(vnode.tag);
  }

  // 子节点比较
  if ((vnode.childrens && vnode.childrens.length > 0) ||
    (out.childNodes && out.childNodes.length > 0)) {
      // 对比子节点或组件
      diffChildren(out, vnode.childrens);
  }

  diffAttribute(out, vnode);

  return out;
}

function diffComponent(dom, vnode) {
  let comp = dom;

  // 组件没有变化
  if (comp && comp.constructor === vnode.tag) {
    // 设置属性
    setComponentProps(dom, vnode,attrs);
    // 赋值
    dom = comp.base;
  } else {
    // 组件发生变化
    if (comp) {
      // 先移除旧组件
      unmountComponent(copm);
      comp = null;
    }
    // 创建新组建
    comp = createComponent(vnode.tag, vnode.attrs);
    // 设置属性
    setComponentProps(comp, vnode.attrs);
    // 给当前组件挂在base
    dom = comp.base;
  }

  return dom;
}

function unmountComponent(copm) {
  removeNode(comp.base);
}

function removeNode(dom) {
  if (dom && dom.parentNode) {
    dom.parentNode.removeNode(dom);
  }
}

function diffChildren(dom, vChildren) {
  const domChildren = dom.childNodes;
  const children = [];
  const keyed = {};

  console.log('diffChildren', dom)
  console.log('diffChildren', vChildren)

  // 将有key的节点（用对象保存）和没有key的节点（用数组保存）分开
  if (domChildren.length > 0) {
    domChildren.forEach((c) => {
      if (c.attributes && "key" in c.attributes) {
        keyed[c.attributes["key"]] = c;
      } else {
        children.push(c);
      }
    });
  }

  if (vChildren && vChildren.length > 0) {
    let min = 0;
    let childrenLen = children.length;

    [...vChildren].forEach((vchild, i) => {
      const key = vchild.key;
      let child;

      if (key) {
        // 如果有key，找到对应key的节点
        if (keyed[key]) {
          child = keyed[key];
          keyed[key] = undefined;
        }
      } else if (childrenLen > min) {
        // 如果没有key，优先找类型相同的节点
        for (let j = min; j < childrenLen; j++) {
          let c = children[j];

          if (c) {
            child = c;
            children[j] = undefined;

            if (j === childrenLen - 1) {
              childrenLen--;
            }
            if (j === min) {
              min++;
            }
            break;
          }
        }
      }

      // 对比
      child = diffNode(child, vchild);
      // 更新dom
      const f = domChildren[i];

      if (child && child !== dom && child !== f) {
        // 如果更新前的对应位置为空，说明此节点是新增的
        if (!f) {
          dom.appendChild(child);
        } else if (child === f.nextSibling) {
          // 如果更新后的节点和更新前对应位置的下一个节点一样，
          removeNode(f);
        } else {
          // 将更新后的节点移动到正确位置
          dom.insertBefore(child, f);
        }
      }
    });
  }
}

function diffAttribute(dom, vnode) {
  // 保存之前的DOM的所有属性
  const oldAttrs = {};
  const newAttrs = vnode.attrs;
  // dom 原有节点对象 vnode 虚拟dom
  const domAttrs = dom.attributes;

  [...domAttrs].forEach(item => {
    // console.log(item);
    oldAttrs[item.name] = item.value;
  });

  // 比较 如果原来属性和新属性对比，不在新的属性中，则将其删除
  for (let key in oldAttrs) {
    if (!(key in newAttrs)) {
      setAttribute(dom, key, undefined);
    }
  }

  // 更新
  for (let key in newAttrs) {
    if(oldAttrs[key] !== newAttrs[key]) {
      setAttribute(dom, key, newAttrs[key]);
    }
  }
}
