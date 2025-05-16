import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TodoCard from './TodoCard';
import Update from './Update';
import './todo.css';

const Todo = () => {
  const [todos, setTodos] = useState([]);
  const [inputs, setInputs] = useState({ title: '', status: 'pending' });
  const [showUpdate, setShowUpdate] = useState(false);
  const [updateData, setUpdateData] = useState(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/todos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodos(res.data.data || []);
    } catch (err) {
      console.error('Error fetching todos:', err);
    }
  };

  const handleInputChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    const { title, status } = inputs;
    const token = localStorage.getItem('token');

    if (!title.trim()) return;

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/todos`,
        {
          title,
          status,
          isCompleted: status === 'done',
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTodos([...todos, res.data]);
      setInputs({ title: '', status: 'pending' });
    } catch (err) {
      console.error('Add failed:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!id || typeof id !== 'string') {
      console.error('Invalid ID passed to handleDelete');
      return;
    }

    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/todos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodos(todos.filter((todo) => todo.stringId !== id));
      alert('Todo deleted successfully'); 
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };


  const handleUpdate = (todo) => {
    if (!todo || !todo.stringId) {
      console.error('Invalid todo for update');
      return;
    }
    setUpdateData(todo);
    setShowUpdate(true);
  };

  const onUpdateSuccess = () => {
    fetchTodos();
    setShowUpdate(false);
  };

  return (
    <div className="container mt-4">

      <div className="p-3 mb-4 border rounded bg-light">
        <input
          type="text"
          name="title"
          placeholder="Enter title"
          value={inputs.title}
          onChange={handleInputChange}
          className="form-control mb-2"
        />
        <select
          name="status"
          value={inputs.status}
          onChange={handleInputChange}
          className="form-select mb-2"
        >
          <option value="pending">Pending</option>
          <option value="ongoing">Ongoing</option>
          <option value="done">Done</option>
        </select>
        <button className="btn btn-primary" onClick={handleAdd}>Add Todo</button>
      </div>

      <div className="row">
        {todos.length ? (
          todos.map((todo) => (
            <div className="col-md-4 mb-3" key={todo.stringId}>
              <TodoCard
                id={todo.stringId}
                title={todo.title}
                status={todo.status}
                onDelete={handleDelete}
                onUpdate={() => handleUpdate(todo)}
              />
            </div>
          ))
        ) : (
          <p>No todos available.</p>
        )}
      </div>

      {showUpdate && (
        <Update
          display={setShowUpdate}
          update={updateData}
          onUpdateSuccess={onUpdateSuccess}
        />
      )}
    </div>
  );
};

export default Todo;
