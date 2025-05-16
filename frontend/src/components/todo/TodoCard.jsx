import React from 'react';
import { MdDelete } from 'react-icons/md';
import { GrUpdate } from 'react-icons/gr';

const TodoCard = ({ id, title, status, onDelete, onUpdate }) => {
  return (
    <div className="p-3 todo-card border rounded shadow-sm bg-light">
      <div>
        <h6>{title}</h6>
        <p><strong>Status:</strong> {status || 'N/A'}</p>
      </div>
      <div className="d-flex justify-content-around mt-2">
        <div
          className="text-primary"
          style={{ cursor: 'pointer' }}
          onClick={onUpdate}
        >
          <GrUpdate /> Update
        </div>
        <div
          className="text-danger"
          style={{ cursor: 'pointer' }}
          onClick={() => onDelete(id)}
        >
          <MdDelete /> Delete
        </div>
      </div>
    </div>
  );
};

export default TodoCard;
