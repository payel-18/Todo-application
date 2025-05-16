import React from 'react';
import "./Home.css";
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate(); // navigate to different pages

  const handleGetStarted = () => {
    navigate("/register"); // take user to register page when button is clicked
  };

  return (
    <div className='home d-flex justify-content-center align-items-center'>
      <div className='container d-flex justify-content-center align-items-center flex-column text-center'>
        <h2>'Plan Your Day, Own Your Time' <br />but with more variety and flair.</h2>
        <h1>"Success is the sum of small efforts, repeated day in and day out."</h1>

        {/* navigate to register */}
        <button className='btn home-btn' onClick={handleGetStarted}>
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Home;
