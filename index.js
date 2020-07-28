import React from "./react";
import ReactDOM from './react-dom'

// 1、普通元素
const ele = (
  <div id="app" title="111">
    hello, <span style={{ color: 'red' }}>react</span>
  </div>
);

// 2、组件化开发
// 组件：函数组件、类组件
// function Home() {
//   return (
//     <div id="app" title="111">
//       hello, <span style={{ color: 'red' }}>react</span>
//     </div>
//   );
// }

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      num: 0
    }
  }

  componentWillMount() {
    console.log('组件将要加载');
  }

  componentWillReceiveProps(props) {
    console.log('props', props);
  }

  componentWillUpdate() {
    console.log('组件将要更新');
  }

  componentDidUpdate() {
    console.log('组件更新完成');
  }

  componentDidMount() {
    console.log('组件加载完成');
  }

  handleClick() {
    this.setState({
      num: this.state.num + 1
    });
  }

  render() {
    const { name } = this.props;
    return (
      <div id="app" name={name}>
        hello, <span style={{ color: 'red' }}>react{this.state.num}</span>
        <button onClick={this.handleClick.bind(this)}>点击</button>
      </div>
    );
  }
}

// ReactDOM.render(ele, document.querySelector('#root'))
ReactDOM.render(<Home name="home1" />, document.querySelector('#root'))

// console.log(ele);