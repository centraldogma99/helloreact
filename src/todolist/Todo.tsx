import React from "react";

interface TodoProps {
  content: string,
  onDeleteClick: () => any
}

export class Todo extends React.Component<TodoProps> {
  render() {
    return (
      <tr>
        <td><p className="todoItem">{this.props.content ?? ""}</p></td>
        <td><input type="button" name="deleteBtn" value="X" onClick={this.props.onDeleteClick} /></td>
      </tr>
    );
  }
}