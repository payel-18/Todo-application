import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Update = ({ display, update, onUpdateSuccess }) => {
  const [inputs, setInputs] = useState({ title: '', status: 'pending' });

  useEffect(() => {
    if (update) {
      setInputs({
        title: update.title || '',
        status: update.status || 'pending',
      });
    }
  }, [update]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const submit = async () => {
    const token = localStorage.getItem('token');
    const todoId = update?.stringId;

    if (!todoId || !token) {
      console.error('Missing todo ID or token');
      return;
    }

    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/todos/${todoId}`,
        {
          title: inputs.title,
          status: inputs.status,
          isCompleted: inputs.status === 'done',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert('Update successful');
      onUpdateSuccess();
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  return (
    <div className="p-4 bg-light border rounded shadow mt-3">
      <h4>Update Todo</h4>
      <input
        type="text"
        name="title"
        value={inputs.title}
        onChange={handleChange}
        className="form-control mb-2"
      />
      <select
        name="status"
        value={inputs.status}
        onChange={handleChange}
        className="form-select mb-3"
      >
        <option value="pending">Pending</option>
        <option value="ongoing">Ongoing</option>
        <option value="done">Done</option>
      </select>
      <div>
        <button className="btn btn-success me-2" onClick={submit}>Update</button>
        <button className="btn btn-secondary" onClick={() => display(false)}>Cancel</button>
      </div>
    </div>
  );
};

export default Update;
