import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import authService from '../services/authService';
import {loginSuccess, setError,setLoading} from '../store/authSlice';

const LoginForm: React.FC=() => {
  const [username, setUsername]=useState('');
  const [password,setPassword]=useState('');
  const[error,setLocalError]=useState('');
  const dispatch= useDispatch();
  const navigate =useNavigate();

  const handleSubmit=async(e: React.FormEvent)=>{
    e.preventDefault();
    setLocalError('');
    dispatch(setLoading(true));

    try{
      const response=await authService.login({username,password});
      dispatch(loginSuccess(response));
      navigate('/dashboard');

    } catch(err:any){
      const errorMessage= err.response?.data?.message || 'Login failed. Try again.';
      setLocalError(errorMessage);
      dispatch(setError(errorMessage));
    } finally{
      dispatch(setLoading(false));
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <h2>login</h2>
      {error && <div style={{color:'red', marginBottom:'1rem'}}>{error}</div>}
      <div style={{marginBottom:'1rem'}}>
        <label>Username:</label>
        <input type="text" value={username} onChange={(e)=> setUsername(e.target.value)}
        required
        style={{width:'100%',padding:'0.5rem',marginTop:'0.25rem'}}
        />
      </div>
      <div style={{marginBottom:'1rem'}}>
        <label>Password:</label>
        <input type="password" value={password} onChange={(e)=> setPassword(e.target.value)}
        required
        style={{width:'100%',padding:'0.5rem',marginTop:'0.25rem'}}
        />
      </div>
      <button type="submit" style={{width:'100%', padding:'0.75rem'}}>
        Login
      </button>
      <p style={{textAlign:'center', marginTop:'1rem'}}>
        Don't have an account? <a href="/register">Register here</a>
      </p>
    </form>
  );
};
export default LoginForm;