import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authActions } from '../../store';
import { login } from '../../store/api';
import './Login.css';

const Login = () => {
  const [Inputs, setInputs] = useState({ username: '', password: '' });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const change = (e) => {
    setInputs({ ...Inputs, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      const response = await login(Inputs);
      const { token, message } = response.data;

      alert(message);
      localStorage.setItem('token', token);
      sessionStorage.setItem('username', Inputs.username);

      // Optional: if you want to store user ID, the backend must return it.
      // sessionStorage.setItem('id', response.data.id); ← remove or add only if backend includes it

      dispatch(authActions.login());
      navigate("/todo");
    } catch (error) {
      console.error("Login error:", error);
      alert(error.response?.data?.message || "Login failed.");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={submit}>
        <h2 className="text-center">Login</h2>
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            name="username"
            value={Inputs.username}
            onChange={change}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            name="password"
            value={Inputs.password}
            onChange={change}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">Login</button>
      </form>
    </div>
  );
};

export default Login;
