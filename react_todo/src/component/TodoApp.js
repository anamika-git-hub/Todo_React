import React, { Component } from 'react';
import './TodoApp.css';
import { db } from '../firebase';
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';

export default class TodoApp extends Component {
  state = {
    input: '',
    items: [],
    editingIndex: null,
    isChecked: []
  };

  async componentDidMount() {
    const querySnapshot = await getDocs(collection(db, 'todos'));
    const items = [];
    const isChecked = [];

    querySnapshot.forEach((doc) => {
      items.push({ id: doc.id, text: doc.data().text });
      isChecked.push(doc.data().completed || false);
    });

    this.setState({ items, isChecked });
  }

  handleChange = (event) => {
    this.setState({ input: event.target.value });
  };

  storeItem = async (event) => {
    event.preventDefault();
    const { input, items, editingIndex, isChecked } = this.state;

    if (input.trim() === '') return;

    if (editingIndex !== null) {
      // Editing
      const updatedItem = { ...items[editingIndex], text: input };
      const itemRef = doc(db, 'todos', updatedItem.id);
      await updateDoc(itemRef, { text: input });

      const updatedItems = [...items];
      updatedItems[editingIndex] = updatedItem;

      this.setState({ items: updatedItems, input: '', editingIndex: null });
    } else {
      // Adding
      const docRef = await addDoc(collection(db, 'todos'), {
        text: input,
        completed: false
      });

      this.setState({
        items: [...items, { id: docRef.id, text: input }],
        input: '',
        isChecked: [...isChecked, false]
      });
    }
  };

  deleteItem = async (index) => {
    const { items, isChecked } = this.state;
    const idToDelete = items[index].id;
    await deleteDoc(doc(db, 'todos', idToDelete));

    const updatedItems = items.filter((_, i) => i !== index);
    const updatedChecked = isChecked.filter((_, i) => i !== index);

    this.setState({ items: updatedItems, isChecked: updatedChecked });
  };

  editItem = (index) => {
    this.setState({
      input: this.state.items[index].text,
      editingIndex: index
    });
  };

  handleCheckboxChange = async (index) => {
    const updatedChecked = [...this.state.isChecked];
    updatedChecked[index] = !updatedChecked[index];

    const item = this.state.items[index];
    const itemRef = doc(db, 'todos', item.id);
    await updateDoc(itemRef, { completed: updatedChecked[index] });

    this.setState({ isChecked: updatedChecked });
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
            <li key={data.id} className={isChecked[index] ? 'completed' : ''}>
              <input
                type="checkbox"
                checked={isChecked[index]}
                onChange={() => this.handleCheckboxChange(index)}
              />
              {data.text}
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
