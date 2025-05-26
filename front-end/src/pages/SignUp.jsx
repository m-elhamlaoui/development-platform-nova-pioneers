import "../css/signup.css";
import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
const getApiBaseUrl = () => {
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  return isLocalhost ? 'http://localhost:9092' : 'http://141.144.226.68:9092'; // Replace with your actual production API URL
};
const SignUp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const menuItems = [
    { label: "Parent", path: "/sign-up" },
    { label: "Teacher", path: "/Signupteacher" }
  ];

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  const defaultIndex = menuItems.findIndex(item => item.path === location.pathname);
  const [activeIndex, setActiveIndex] = useState(defaultIndex);

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
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
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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
      
      const response = await fetch(`${getApiBaseUrl()}/signup/parent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      
      toast.success('Registration successful! Please sign in.', {
        position: 'top-center',
        autoClose: 5000
      });
      
      // Redirect to login
      navigate('/login');
      
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Failed to register.');
      setErrors({ form: error.message || 'Registration failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[100vh] flex justify-center items-center bg-[url('./assets/space.jpg')] bg-no-repeat">
      <div className="w-4xl rounded-2xl border border-gray-400 bg-[url('./assets/astronaut.png')] bg-no-repeat bg-right">
        <div className="bg-white h-[70vh] flex flex-col items-center justify-center shadow-xl rounded-2xl border-2 border-gray-300 w-lg">
          <h1 className="text-3xl text-blue-900 honeparent font-bold text-center">CREATE YOUR ACCOUNT</h1>
          <h2 className="font-light text-sm text-center htwoparent flex justify-center h-2 text-black mt-2">
            Choose a status and fill the infos below.
          </h2>

          {errors.form && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 w-3/4">
              {errors.form}
            </div>
          )}

          <form className="flex flex-col items-center w-3/4" onSubmit={handleSubmit}>
            <nav className="border-gray-200 h-17 mb-6">
              <ul
                className="bg-blue-900 border border-gray-100 flex w-60 justify-between"
                style={{
                  padding: "6px 12px",
                  borderRadius: "50px",
                  fontSize: "14px",
                  textTransform: "uppercase"
                }}
              >
                {menuItems.map((item, index) => (
                  <li
                    key={index}
                    className={`cursor-pointer font-bold rounded-xl transition duration-200 
                      ${activeIndex === index ? "bg-white text-black border border-blue-400 shadow-md" : "text-white"}
                    `}
                    style={{
                      padding: "2px 10px",
                      borderRadius: "50px",
                      fontSize: "14px"
                    }}
                  >
                    <Link
                      to={item.path}
                      className="no-underline w-full h-full block"
                      onClick={() => setActiveIndex(index)}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex space-x-4 w-full mb-4">
              <div className="w-1/2">
                <input
                  type="text"
                  placeholder="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 signup focus:ring-indigo-500 ${errors.lastName ? 'border-red-500' : ''}`}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                )}
              </div>
              <div className="w-1/2">
                <input
                  type="text"
                  placeholder="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 signup focus:ring-indigo-500 ${errors.firstName ? 'border-red-500' : ''}`}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                )}
              </div>
            </div>

            <div className="w-full mb-4">
              <input
                type="email"
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full block p-3 border rounded-lg focus:outline-none focus:ring-2 signup focus:ring-indigo-500 ${errors.email ? 'border-red-500' : ''}`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div className="relative w-full mb-6">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full p-3 pr-10 signup border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.password ? 'border-red-500' : ''}`}
              />
              <span onClick={toggleShowPassword} className="absolute right-4 top-6 transform -translate-y-1/2 text-gray-600 cursor-pointer">
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`bg-red-500 btnparent text-white font-bold py-2 w-xs px-4 rounded-2xl ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-red-600'}`}
            >
              {loading ? 'Signing up...' : 'Sign up'}
            </button>
          </form>

          <div className="gotosignin mt-6">
            <span>
              Already have an account? <Link to="/login" className="font-bold text-red-500">Sign in</Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;