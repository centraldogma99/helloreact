import React from "react";

interface TodoProps {
  content: string
}

class Todo extends React.Component<TodoProps> {
  render() {
    return (
      <tr>
        <td>{this.props.content ?? ""}</td>
      </tr>
    );
  }
}

interface AddFormProps {
  onClick: (content: string) => any
}
interface AddFormStates {
  text: string
}
class AddForm extends React.Component<AddFormProps, AddFormStates> {
  state = {
    text: ""
  }

  handleChange = (e: any) => {
    const target = e.target as HTMLInputElement;
    this.setState({
      text: target.value
    })
  }

  handleClick = () => {
    this.props.onClick(this.state.text);
    (document.getElementById("whatToAdd") as HTMLInputElement).value = "";
  }

  render() {
    return (
      <div id="addForm">
        <input type="text" name="whatToAdd" id="whatToAdd" onChange={this.handleChange} />
        <input type="button" name="addBtn" onClick={this.handleClick} />\
      </div>
    )
  }
}

// interface TodoListProps {
// }

interface TodoListStates {
  todos: string[]
}
export class TodoList extends React.Component<Record<string, never>, TodoListStates> {
  state = {
    todos: [
      "hi", "ho"
    ]
  }

  renderTodos() {
    let i = 0;
    return this.state.todos.map(todo => {
      return <Todo key={++i} content={i + ". " + todo} />
    })
  }

  // handleClick(content: string) {
  //   this.setState({
  //     todos: this.state.todos.concat(content)
  //   })
  // }

  handleClick = (content: string) => {
    this.setState({
      todos: [...this.state.todos, content]
    })
  }

  render() {
    return (
      <div>
        <h1>ToDoList 20210930</h1>
        <table>
          <tr>
            <td>ToDos</td>
          </tr>
          {this.renderTodos()}
        </table>
        <AddForm onClick={this.handleClick} />
      </div>
    )
  }
}