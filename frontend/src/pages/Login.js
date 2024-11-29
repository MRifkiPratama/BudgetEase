import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = ({ setUserId }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
<<<<<<< HEAD
  const [error, setError] = useState('');
=======
  const [errorMessage, setErrorMessage] = useState('');
>>>>>>> 4571913486d353dadd405dc59fd9b2b0847614b5
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
<<<<<<< HEAD
      const response = await fetch('http://localhost:5000/users/login', {
=======
      const response = await fetch(`${process.env.REACT_APP_API_URL}/users/login`, {
>>>>>>> 4571913486d353dadd405dc59fd9b2b0847614b5
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

<<<<<<< HEAD
      if (response.ok) {
        const data = await response.json();
        // Assuming the backend sends a token or some user data
        console.log('Login successful:', data);
        // Save token to localStorage (or a secure place)
        localStorage.setItem('token', data.token);

        // Navigate to the transactions page
        navigate('/transaction');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Invalid email or password');
      }
    } catch (error) {
      setError('Something went wrong. Please try again later.');
      console.error('Error during login:', error);
=======
      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'An error occurred');
        return;
      }

      const data = await response.json();
      alert(data.message);

      const user = data.account;
      localStorage.setItem('userId', user.id);
      localStorage.setItem('userName', user.name);
      localStorage.setItem('userEmail', user.email);
      localStorage.setItem('userBalance', user.balance);
      localStorage.setItem('user', JSON.stringify(user));
      console.log('Logged in user:', user);

      if (setUserId) {
        setUserId(user.id);
      }

      navigate('/profile');
    } catch (error) {
      console.error('Error during login:', error);
      setErrorMessage('An error occurred while trying to log in');
>>>>>>> 4571913486d353dadd405dc59fd9b2b0847614b5
    }
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="error">{error}</p>}
        <button type="submit">Login</button>
      </form>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <p>Don't have an account yet?</p>
      <button onClick={handleSignUp}>Sign Up</button>
    </div>
  );
};

export default Login;
