import { renderComponent } from '../react-dom'
import { enqueueSetState } from './set_state_queue';

class Component {
  constructor(props = {}) {
    this.props = props;
    this.state = {}
  }

  setState(stateUpdate) {
    // // 对象拷贝
    // Object.assign(this.state, stateUpdate);
    // // 渲染组件
    // renderComponent(this);
    enqueueSetState(stateUpdate, this);
  }

}

export default Component;