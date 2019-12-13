import React, {Component} from 'react';
import './Todo.css';
import {Input, List, Button, Modal} from 'antd';

const {Search} = Input;
let reg = /\S/gi

class Todo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      index: 0,
      inputVal: '',
      oldVal: '',
      currentVal: '',
      todoList: [],
      finished: []
    }
  }


  // 获取数据
  getList() {
    let td = [];
    let fin = [];
    if (localStorage.getItem('todoList')) {
      td = JSON.parse(localStorage.getItem('todoList'))
      fin = JSON.parse(localStorage.getItem('finished'))
      this.setState({
        todoList: td,
        finished: fin
      })
    } else {
      this.setState({
        todoList: [],
        finished: []
      })
    }
  }

  // 生命周期
  componentDidMount() {
    this.getList()
  }

  // 输入监听
  inputChange(e) {
    this.setState({
      inputVal: e.target.value
    })
  }

  // 添加todo
  addTodo() {
    if (reg.test(this.state.inputVal)) {
      this.setState({
        todoList: [this.state.inputVal, ...this.state.todoList],
        inputVal: ''
      }, () => {
        localStorage.setItem("todoList", JSON.stringify(this.state.todoList))
      })
    }
  }

  // 编辑todo
  editTodo(index) {
    this.setState({
      visible: true,
      index: index,
      currentVal: this.state.todoList[index],
      oldVal: this.state.todoList[index]
    }, () => {

    });
  }

  dialogChange = e => {
    this.setState({
      currentVal: e.target.value
    })
  }

  handleOk = (e) => {
    let a = this.state.todoList
    let c = this.state.currentVal
    a[this.state.index] = c
    this.setState({
      visible: false,
      todoList: a
    },() => {
      localStorage.setItem("todoList", JSON.stringify(this.state.todoList))
    })
  };

  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };


  // 删除todo
  delTodo(index) {
    let td = this.state.todoList
    td.splice(index, 1)
    this.setState({
      todoList: td
    }, () => {
      localStorage.setItem("todoList", JSON.stringify(this.state.todoList))
    })
  }

  // 已完成todo
  finishTodo(index) {
    let td = this.state.todoList
    let temp = td.splice(index, 1)
    this.setState({
      todoList: td,
      finished: [temp, ...this.state.finished]
    }, () => {
      localStorage.setItem("todoList", JSON.stringify(this.state.todoList))
      localStorage.setItem("finished", JSON.stringify(this.state.finished))
    })
  }


  // 删除已完成
  delFin(index) {
    let fin = this.state.finished
    fin.splice(index, 1)
    this.setState({
      finished: fin
    }, () => {
      localStorage.setItem("finished", JSON.stringify(this.state.finished))
    })
  }


  render() {
    return (
      <div className='searchInp'>
        {/*input*/}
        <div>
          <h1 className='todoinput' style={{margin: '20px 0', textAlign: 'center'}}>Todo Demo</h1>
          <Search
            placeholder="Add Todo"
            enterButton="Add"
            size="large"
            value={this.state.inputVal}
            onChange={this.inputChange.bind(this)}
            onSearch={this.addTodo.bind(this)}
          />
        </div>

        {/*todoList*/}
        <h3 className='todoH' style={{margin: '16px 0'}}>TodoList</h3>
        <List
          size="large"
          bordered
          dataSource={this.state.todoList}
          renderItem={
            (item, index) =>
              <List.Item
                actions={[
                  <Button
                    type="default"
                    icon="edit"
                    size='small'
                    onClick={(e) => this.editTodo(index, e)}/>,
                  <Button
                    type="danger"
                    icon="delete"
                    size='small'
                    onClick={(e) => this.delTodo(index, e)}/>,
                  <Button
                    type="primary"
                    icon="check"
                    size='small'
                    onClick={(e) => this.finishTodo(index, e)}/>
                ]}
              >
                {item}
              </List.Item>
          }
        />
        {/*弹出层*/}
        <Modal
          title="Change Todo"
          visible={this.state.visible}
          destroyOnClose="true"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Input
            value={this.state.currentVal}
            onChange={this.dialogChange}
          />
        </Modal>

        {/*finished*/}
        <h3 className='finishedH' style={{margin: '16px 0'}}>Finished</h3>
        <List
          size="large"
          bordered
          dataSource={this.state.finished}
          renderItem={
            (item, index) =>
              <List.Item
                actions={[
                  <Button
                    type="danger"
                    icon="delete"
                    size='small'
                    onClick={(e) => this.delFin(index, e)}/>
                ]}
              >
                {item}
              </List.Item>
          }
        />

      </div>
    )
  }


}


export default Todo;
