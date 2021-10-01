import React from "react";

interface AddFormProps {
  onClick: (content: string) => any
}
interface AddFormStates {
  text: string
}
export class AddForm extends React.Component<AddFormProps, AddFormStates> {
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
    this.setState({
      text: ""
    });
  }

  render() {
    return (
      <div id="addForm">
        <input type="text" name="whatToAdd" onChange={this.handleChange} value={this.state.text} />
        <input type="button" name="addBtn" onClick={this.handleClick} value="추가" />
      </div>
    )
  }
}