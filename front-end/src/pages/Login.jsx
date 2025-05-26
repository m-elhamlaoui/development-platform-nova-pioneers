import "../css/Login.css";
import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
const getApiBaseUrl = () => {
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  return isLocalhost ? 'http://localhost:9092' : 'https://http://141.144.226.68/9092'; // Replace with your actual production API URL
};
const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      
      const response = await fetch(`${getApiBaseUrl()}/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      // Store token and user info according to documentation
      if (formData.rememberMe) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({
          id: data.userId,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          role: data.role
        }));
      } else {
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('user', JSON.stringify({
          id: data.userId,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          role: data.role
        }));
      }
      
      // Redirect based on role
      if (data.role === 'parent') {
        navigate('/parents-dashboard');
      } else if (data.role === 'teacher') {
        navigate('/teachers/dashboard');
      } else if (data.role === 'admin') {
        navigate('/admin');
      } else if (data.role === 'kid') {
        navigate('/kid/dashboard');
      } else {
        navigate('/');
      }
      
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message || 'Failed to login. Please check your credentials.');
      setErrors({ form: error.message || 'Invalid credentials' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[100vh] flex justify-center items-center bg-[url('./assets/space.jpg')] bg-no-repeat">
      <div className="w-4xl rounded-2xl border border-gray-400 bg-[url('./assets/astronaut.png')] bg-no-repeat bg-right">
        <div className="bg-white h-[70vh] flex flex-col items-center justify-center shadow-xl rounded-2xl border-2 border-gray-300 w-lg">
          <h1 className='text-4xl text-blue-900 honesignin font-bold text-center'>WELCOME BACK</h1>
          <h2 className="text-sm text-black htwosignin font-light text-center">Welcome Back! Please enter your details</h2>
          
          {errors.form && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 w-3/4">
              {errors.form}
            </div>
          )}
          
          <form className="flex flex-col items-center w-3/4" onSubmit={handleSubmit}>
            <div className="w-full relative mb-4">
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium signinl text-gray-900">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`border w-full signin rounded-lg py-2 px-4 bg-white ${errors.email ? 'border-red-500' : ''}`}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>
              
              <div className="mb-5">
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 signinl">Password</label>
                <div className="relative w-full">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    className={`w-full p-3 pr-10 signin border rounded-lg focus:outline-none ${errors.password ? 'border-red-500' : ''}`}
                  />
                  <span
                    onClick={toggleShowPassword}
                    className="absolute right-4 top-6 transform -translate-y-1/2 text-gray-600 cursor-pointer"
                  >
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                  </span>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>
            </div>
            
            <div className="flex justify-center items-center w-full mb-4">
              <div className="w-1/2">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="signin transition duration-150 ease-in-out"
                />
                <span className="blockrem">Remember me</span>
              </div>
              
              <div className="flex whitespace-nowrap h-8 w-1/2">
                <Link to="#" className="forgotpswd">
                  Forgot your password
                </Link>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className={`bg-red-500 btnsignin text-white font-bold py-2 w-xs px-4 rounded-2xl ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-red-600'}`}
            >
              {loading ? 'Signing in...' : 'Log in'}
            </button>
          </form>
          
          <div className="gotosignup mt-6">
            <span>
              Don't have an account? <Link to="/sign-up" className="font-bold text-red-500">Sign up</Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;