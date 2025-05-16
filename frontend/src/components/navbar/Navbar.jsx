import React, { useState, useEffect, useRef } from 'react';
import "./Navbar.css";
import { RiTodoFill } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from '../../store';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  const [showProfile, setShowProfile] = useState(false);
  const [username, setUsername] = useState("");

  const profileRef = useRef(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("username");
    const id = sessionStorage.getItem("id");
    if (storedUser) setUsername(storedUser);
    if (id) dispatch(authActions.login());
  }, [dispatch]);

  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleProfile = () => {
    const storedUser = sessionStorage.getItem("username");
    if (storedUser) setUsername(storedUser);
    setShowProfile(!showProfile);
  };

  const logout = () => {
    sessionStorage.clear();
    dispatch(authActions.logout());
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container">
        <Link className="navbar-brand" to="/"><b><RiTodoFill /> Todo-app</b></Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 w-100 justify-content-end flex-lg-row flex-column align-items-lg-center">
            <li className="nav-item nav-text mx-2"><Link className="nav-link active" to="/"><b>Home</b></Link></li>
            <li className="nav-item nav-text mx-2"><Link className="nav-link active" to="/todo"><b>Todo</b></Link></li>

            {!isLoggedIn ? (
              <>
                <li className="nav-item mx-2"><Link className="nav-link active btn-nav my-2 my-lg-0 px-3 py-1" to="/register">Register</Link></li>
                <li className="nav-item mx-2"><Link className="nav-link active btn-nav my-2 my-lg-0 px-3 py-1" to="/login">Login</Link></li>
              </>
            ) : (
              <li className="nav-item mx-2">
                <button className="btn-nav my-2 my-lg-0 px-3 py-1 border-0" onClick={logout}>
                  Log Out
                </button>
              </li>
            )}

            <li className="nav-item mx-2 position-relative" ref={profileRef}>
              <img
                className="img-fluid user-img"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTM3FwFWSj9qohGE7FhrwJ-PlcK4-tLdWSlGg&s"
                alt="user"
                onClick={toggleProfile}
                style={{ cursor: 'pointer', borderRadius: '50%', width: '40px', height: '40px' }}
              />
              {showProfile && (
                <div className="profile-popup p-2 shadow bg-white rounded" style={{ position: "absolute", top: "60px", right: "10px", zIndex: "1000" }}>
                  <p className="m-0">Hello, <b>{username || "User"}</b>!</p>
                </div>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
