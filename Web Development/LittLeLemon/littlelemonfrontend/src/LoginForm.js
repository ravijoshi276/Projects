import { useState, useMemo } from "react";
import { NavLink, useNavigate } from "react-router";
import { useAuth } from "./context/AuthContext";
import Heading from "./Heading";
import Alert from "./Alert";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";

const BASE_URL = process.env.REACT_APP_API_URL;



const LoginForm = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const { login } = useAuth();
  const [error, setError] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();


  const resetCredentials = () => {
    setCredentials({ username: '', password: '' });
    setError(false);
   
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    

    try {
      setError(false);
      const response = await fetch(`${BASE_URL}/auth/token/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status : ${response.status}`);
      }

      setIsSubmitted(true);
      const data = await response.json();
      
      login(data);
      resetCredentials();

      setTimeout(() => {
        if (data.groups.length === 0) {
          navigate('/menu-items');
        } else {
          navigate('/dashboard');
        }
        setIsSubmitted(false);
      }, 3000);

    } catch (err) {
      setError(true);
      console.error(err.message);
    }
  };

  return (
    <main className="w-full px-4">
      <Heading>Login !!!</Heading>
      
      
      {(isSubmitted && !error) ? <Alert type='success' heading="Success✅" message='Logged in successfully' /> : (isSubmitted || error) ? <Alert type='failure' heading="Error!1" message='Invalid credentials or unmet guidelines' /> : ""}
      
      <form className="flex flex-col gap-5 items-center mx-auto my-10 border-solid border-2 rounded border-gray-300 max-w-md p-6 bg-white shadow-sm" onSubmit={handleSubmit}>
        <h2 className="text-center text-xl font-bold my-1 text-gray-800">Login</h2>
        
        {/* Username field */}
        <div className="flex flex-col w-full gap-1.5">
          <label htmlFor="login-username" className="text-sm font-semibold text-gray-700">Username: </label>
          <input 
            name="username" 
            type="text" 
            id="login-username" 
            value={credentials.username} 
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            required
          />
        </div>
        
        {/* Password field */}
        <div className="flex flex-col w-full gap-1.5">
          <div className="flex justify-between items-baseline">
            <label htmlFor="login-password" className="text-sm font-semibold text-gray-700">Password: </label>
            {credentials.password.length > 0 }
          </div>
          
          <div className="relative w-full">
            <input 
              name="password" 
              type={showPassword ? "text" : "password"} 
              id="login-password" 
              value={credentials.password} 
              onChange={handleChange}
              className={`w-full px-3 py-2 pr-10 border rounded-lg outline-none transition-all focus:ring-2 focus:bg-white`}
              aria-describedby="login-password-hints login-live-region"
              aria-invalid={credentials.password.length > 0 ? false : undefined}
              autoComplete="current-password"
              required
            />
            <button
              type="button" // type="button" prevents accidental form submission on button click
              onClick={() => setShowPassword(prev => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-blue-500 p-1 flex items-center justify-center transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="w-4 h-4" />
            </button>
          </div>
        </div>

     

        {error && <div className="error text-red-500 text-sm font-medium w-full text-center">Invalid Username or Password </div>}
        
        <div className="flex gap-3 lg:gap-10 w-full justify-center mt-2">
          <button type="button" onClick={resetCredentials} className="btn-outline border border-gray-300 px-4 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">Clear</button>
          <button disabled={!( credentials.username && credentials.password)} className="btn-primary btn-accent px-4 py-1.5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed  font-medium  transition-colors">Login</button>
        </div>
        <p className="text-sm text-gray-600 mt-2">Dont have an account?? <NavLink to='/sign-up' className="text-[var(--color-secondary)] hover:underline">Sign Up</NavLink></p>
      </form>
    </main>
  );
};

export default LoginForm;
