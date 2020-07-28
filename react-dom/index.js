import Component from '../react/component';
import { diff, diffNode } from './diff';
const ReactDOM = {
  render
}

function render(vnode, container, dom) {
  console.log('rnder', vnode, container);
  return diff(dom, vnode, container);
}

// 创建组件
export function createComponent(comp, props) {
  // 1、类组件
  let inst;
  if (comp.prototype && comp.prototype.render) {
    inst = new comp(props);
  } else {
    // 如果是函数组件，将函数组件扩展成类组件，方便后面统一管理
    inst = new Component(props);
    inst.constructor = comp;
    // 定义render函数
    inst.render = function() {
      return this.constructor()
    }
  }

  return inst;
}

// 设置组件属性
export function setComponentProps(comp, props) {
  if (!comp.base) {
    if (comp.componentWillMount) {
      comp.componentWillMount();
    }
  } else if (comp.componentWillReceiveProps) {
      comp.componentWillReceiveProps()
  }
  comp.props = props;

  // 渲染组件
  renderComponent(comp);
}

// 渲染组件
export function renderComponent(comp) {
  let base;

  // 返回jsx对象
  const renderer = comp.render();
  base = diffNode(comp.base, renderer);

  if (comp.base && comp.componentWillUpdate) {
    comp.componentWillUpdate();
  }

  if(comp.base) {
    if (comp.componentDidUpdate) {
      comp.componentDidUpdate();
    }
  } else if (comp.componentDidMount){
    comp.componentDidMount();
  }

  // 节点替换
  // if (comp.base && comp.base.parentNode) {
  //   comp.base.parentNode.replaceChild(base, comp.base);
  // }
  comp.base = base;
}

// 1.属性设置
export function setAttribute(dom, attr, value) {
  // 将属性名className转换为class
  if (attr === 'className') {
    attr = 'class';
  }

  // 如果是事件 onClick...
  if (/on\w+/.test(attr)) {
    // 转为小写
    attr = attr.toLowerCase();
    dom[attr] = value || '';
    // 样式
  } else if (attr === 'style') {
    // 样式为字符串
    if (!value || typeof value === 'string') {
      dom.style.cssText = value || '';
    // 样式为object
    } else if (value && typeof value === 'object') {
      for (let k in value) {
        // const {v} = value;
        if (typeof value[k] === 'number') {
          dom.style[k] = value[k] + 'px';
        } else {
          dom.style[k] = value[k];
        }
      }
    }
  } else {
    // 其他属性
    if (attr in dom) {
      dom[attr] = value || '';
    }
    if (value) {
      // 更新值
      dom.setAttribute(attr, value);
    } else {
       dom.removeAttribute(attr);
    }
  }
}

export default ReactDOM;