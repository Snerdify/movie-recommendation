import React, { useState } from 'react';
import './Form.css';
// import {GoogleLogin} from 'react-google-login';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };



  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const respoense = await fetch('http://localhost:3000/login'){
        method: 'POST' ,
        headers : {
          'Content-Type': 'application/json',
        }, 
        body : JSON.stringify(formData),
      
    };
    if (!response.ok){
      throw new Error('Login failed');

    }
    const data = await response.json();
    console.log('Login successful ': data.token);
  } catch(error){
    console.log('Error during login : ' error.message);

  };
    

  return (
    <div className="form-container">
      <h2>Clone Login</h2>
      <form onSubmit={handleSubmit}>
      <label>
          Enter email/ Username: 
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginForm;