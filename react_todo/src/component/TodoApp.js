import React, { Component } from 'react';
import './TodoApp.css';

export default class TodoApp extends Component {
  state = {
    input: '',
    items: [],
    editingIndex: null,
    isChecked: []
  };

  handleChange = (event) => {
    this.setState({
      input: event.target.value
    });
  };

  storeItem = (event) => {
    event.preventDefault();
    const { input, items, editingIndex, isChecked } = this.state;

    if (input.trim() !== '') {
      if (editingIndex !== null) {
        const updatedItems = [...items];
        updatedItems[editingIndex] = input;

        this.setState({
          items: updatedItems,
          input: '',
          editingIndex: null
        });
      } else {
        this.setState({
          items: [...items, input],
          input: '',
          isChecked: [...isChecked, false]
        });
      }
    }
  };

  deleteItem = (index) => {
    const { items, isChecked } = this.state;
    const updatedItems = items.filter((_, i) => i !== index);
    const updatedChecked = isChecked.filter((_, i) => i !== index);

    this.setState({
      items: updatedItems,
      isChecked: updatedChecked
    });
  };

  editItem = (index) => {
    this.setState({
      input: this.state.items[index],
      editingIndex: index
    });
  };

  handleCheckboxChange = (index) => {
    const updatedChecked = [...this.state.isChecked];
    updatedChecked[index] = !updatedChecked[index];

    this.setState({
      isChecked: updatedChecked
    });
  };

  render() {
    const { input, items, editingIndex, isChecked } = this.state;
    return (
      <div className="todo-container">
        <form className="input-section" onSubmit={this.storeItem}>
          <h1>Todo App</h1>
          <input
            type="text"
            value={input}
            onChange={this.handleChange}
            placeholder="Enter items..."
          />
          <button type="submit">{editingIndex !== null ? 'Save' : 'Add'}</button>
        </form>
        <ul>
          {items.map((data, index) => (
            <li key={index} className={isChecked[index] ? 'completed' : ''}>
              <input
                type="checkbox"
                checked={isChecked[index]}
                onChange={() => this.handleCheckboxChange(index)}
              />
              {data}
              <div>
                <i className="fas fa-edit" onClick={() => this.editItem(index)}></i>
                <i className="fas fa-trash-alt" onClick={() => this.deleteItem(index)}></i>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
