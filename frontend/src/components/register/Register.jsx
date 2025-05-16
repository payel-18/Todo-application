import React, { useState } from 'react';
import './Register.css';
import { useNavigate } from 'react-router-dom';
import { register } from '../../store/api'; // ✅ use API wrapper

const Register = () => {
  const history = useNavigate();
  const [Inputs, setInputs] = useState({ email: '', username: '', password: '' });
  const [loading, setLoading] = useState(false);

  const change = (e) => {
    const { name, value } = e.target;
    setInputs({ ...Inputs, [name]: value });
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!Inputs.username || !Inputs.password || !Inputs.email) {
      alert('Please fill in all fields!');
      return;
    }

    setLoading(true);

    try {
      const response = await register(Inputs);
      alert(response.data.message);
      setInputs({ email: '', username: '', password: '' });
      history('/login');
    } catch (error) {
      console.error(error);
      if (error.response?.data?.Errors) {
        alert(error.response.data.Errors.map(err => err.ErrorMessage).join('\n'));
      } else if (error.response?.data?.Message) {
        alert(error.response.data.Message);
      } else {
        alert('Something went wrong. Please try again!');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5 register-form">
      <h2 className="text-center mb-4">Register</h2>

      <form onSubmit={submit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="username"
            placeholder="Enter your full name"
            onChange={change}
            value={Inputs.username}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            placeholder="Enter your email"
            onChange={change}
            value={Inputs.email}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            placeholder="Enter your password"
            onChange={change}
            value={Inputs.password}
          />
        </div>

        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default Register;
