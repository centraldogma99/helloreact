import React from "react";
import { AddForm } from "./AddForm"
import { Todo } from "./Todo"

interface TodoListStates {
  todos: {
    index: number,
    text: string
  }[]
}
export class TodoList extends React.Component<Record<string, never>, TodoListStates> {  //TODO what Record<string, never> means?
  state = {
    todos: [
      { index: 0, text: "just a random todo" }, { index: 1, text: "play LOL" }
    ]
  }

  renderTodos() {
    let i = 0;
    return this.state.todos.map(todo => {
      i++;
      return <Todo key={i} content={i + ". " + todo.text} onDeleteClick={() => this.handleDeleteClick(todo.index)} />
    })
  }

  handleClick = (content: string) => {
    const todos = this.state.todos;
    this.setState({
      todos: [...todos, { index: todos[todos.length - 1].index + 1, text: content }]
    })
  }

  handleDeleteClick = (i: number) => {
    const todos = this.state.todos.slice();
    this.setState({
      todos: todos.filter(todo => todo.index != i)
    })
  }

  render() {
    return (
      <div>
        <h1>ToDoList v{new Date().toLocaleDateString('ko-KR')}</h1>
        <table>
          <tr>
            <td><h2>ToDos</h2></td>
          </tr>
          {this.renderTodos()}
        </table>
        <AddForm onClick={this.handleClick} />
      </div>
    )
  }
}