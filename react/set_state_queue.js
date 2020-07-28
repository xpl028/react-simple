/*
1、异步更新state,短时间内把多个setState合并为一个
2、一段时间后，循环清空队列，渲染组件
*/

import { renderComponent } from "../react-dom";

const setStateQueue = [];
// 保存当前组件
const renderQueue = [];

function defer(fn) {
  return Promise.resolve().then(fn);
}

export function enqueueSetState(stateUpdate, comp) {
  if (setStateQueue.length === 0) {
    defer(flush);
  }
  setStateQueue.push({
    stateUpdate,
    comp,
  });

  // 如果renderQueue没有组件，添加到队列中
  let r = renderQueue.some(item => item === comp);

  if (!r) {
    renderQueue.push(comp);
  }
}

export function flush() {
  let item;
  let comp;

  while (item = setStateQueue.shift()) {
    const { stateUpdate, comp } = item;

    // 保存之前状态
    if (!comp.prevState) {
      comp.prevState = Object.assign({}, comp.state);
    }

    if (typeof stateUpdate === 'function') {
      // 是一个回调函数
      Object.assign(comp.state, stateUpdate(comp.prevState, comp.props));
    } else {
      // 是一个对象
      Object.assign(comp.state, stateUpdate);
    }

    comp.prevState = comp.state;
  }

  while (comp = renderQueue.shift()) {
    renderComponent(comp);
  }
}