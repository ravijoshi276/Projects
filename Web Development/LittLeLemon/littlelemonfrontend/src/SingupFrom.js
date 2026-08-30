import { useState, useMemo } from "react";
import { useNavigate, NavLink } from "react-router";
import Alert from "./Alert";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";

const BASE_URL = process.env.REACT_APP_API_URL;

// Shared password criteria configuration array
const PASSWORD_RULES = [
  { id: 'length', label: '8+ characters', test: (val) => val.length >= 8 },
  { id: 'number', label: '1 number', test: (val) => /\d/.test(val) },
  { id: 'lowercase', label: '1 lowercase letter', test: (val) => /[a-z]/.test(val) },
  { id: 'uppercase', label: '1 uppercase letter', test: (val) => /[A-Z]/.test(val) },
  { id: 'special', label: '1 special character (@$!%*?&)', test: (val) => /[@$!%*?&]/.test(val) },
];

function SignupForm() {
  const [formdata, setFromdata] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    password: '',
    re_password: ''
  });
  
  const [error, setError] = useState(false);
  const [errorMessage, setErrormessage] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Custom interactive states for input visibility and focus
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  
  const navigate = useNavigate();

  // Runs evaluation checks on password string without re-running on eye-toggle clicks
  const validationStates = useMemo(() => {
    return PASSWORD_RULES.map(rule => ({
      ...rule,
      isValid: rule.test(formdata.password)
    }));
  }, [formdata.password]);

  // Aggregate rule completion status metrics
  const totalPassed = useMemo(() => validationStates.filter(r => r.isValid).length, [validationStates]);
  const isPasswordValid = totalPassed === PASSWORD_RULES.length;

  
  const passwordsMatch = formdata.password === formdata.re_password;

  const handleChange = (e) => {
    setFromdata((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(false);

    // Security block preventing backend submission if validation prerequisites fail
    if (!isPasswordValid || !passwordsMatch) {
      setError(true);
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/auth/users/`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formdata),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setIsSubmitted(true);
        setFromdata({
          first_name: '',
          last_name: '',
          username: '',
          email: '',
          password: '',
          re_password: ''
        });
        
        setTimeout(() => {
          navigate('/login');
          setIsSubmitted(false);
        }, 3000);
      } else {
        setErrormessage(data);
        throw new Error(`Some Error occurred`);
      }
    } catch (err) {
      setError(true);
      console.log(err);
    }
  };

  return (
    <main className="w-full px-4">
      <h1 className="text-center text-2xl font-bold my-4">Sign Up</h1>
      

      {(isSubmitted && !error) ? <Alert type='success' heading="Success✅" message='Account created successfully' /> : isSubmitted ? <Alert type='failure' heading="Error!1" message={errorMessage} /> : ""}
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 items-center mx-auto my-6 border-solid border-2 rounded border-gray-300 max-w-md p-6 bg-white shadow-sm">
        
        {/* Username */}
        <div className="flex flex-col w-full gap-1">
          <label className="required text-sm font-semibold text-gray-700" htmlFor='signup-username'>Username</label>
          <input type="text" name='username' id='signup-username' className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all" value={formdata.username} onChange={handleChange} required />
        </div>
        {error && errorMessage?.username && <div className="error text-red-500 text-xs mt-1 w-full">{errorMessage.username}</div>}

        {/* First Name */}
        <div className="flex flex-col w-full gap-1">
          <label className="required text-sm font-semibold text-gray-700" htmlFor='signup-firstname'>First Name:</label>
          <input type="text" name='first_name' id='signup-firstname' className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all" value={formdata.first_name} onChange={handleChange} required />
        </div>

        {/* Last Name */}
        <div className="flex flex-col w-full gap-1">
          <label className="text-sm font-semibold text-gray-700" htmlFor='signup-lastname'>Last Name:</label>
          <input type="text" name='last_name' id='signup-lastname' className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all" value={formdata.last_name} onChange={handleChange} />
        </div>

        {/* Email */}
        <div className="flex flex-col w-full gap-1">
          <label className="required text-sm font-semibold text-gray-700" htmlFor='signup-email'>Email:</label>
          <input type="email" name='email' id='signup-email' className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all" value={formdata.email} onChange={handleChange} required />
        </div>

        {/* Password input with toggle button */}
        <div className="flex flex-col w-full gap-1">
          <div className="flex justify-between items-baseline">
            <label className="required text-sm font-semibold text-gray-700" htmlFor='signup-password'>Password:</label>
            {formdata.password.length > 0 && (
              <span className={`text-xs font-bold transition-colors ${isPasswordValid ? 'text-green-600' : 'text-amber-500'}`}>
                {isPasswordValid ? 'Strong Password' : `${totalPassed}/${PASSWORD_RULES.length} Rules Met`}
              </span>
            )}
          </div>
          <div className="relative w-full">
            <input 
              type={showPassword ? "text" : "password"} 
              name='password' 
              id='signup-password' 
              className={`w-full px-3 py-2 pr-10 border rounded-lg outline-none transition-all focus:ring-2
                ${formdata.password.length > 0 ? (isPasswordValid ? 'focus:ring-green-500/20 focus:border-green-500 border-green-300' : 'focus:ring-amber-500/20 focus:border-amber-500 border-amber-300') : 'focus:ring-blue-500/20 border-gray-300'}`}
              value={formdata.password} 
              onChange={handleChange} 
              onFocus={() => setIsPasswordFocused(true)}
              aria-describedby="signup-password-hints signup-live-region"
              required 
            />
            <button
              type="button" // type="button" handles enterprise clicks without causing unintended form submissions
              onClick={() => setShowPassword(prev => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none p-1 flex items-center justify-center"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Requirements grid dropdown displaying current criterion matches */}
        <div 
          id="signup-password-hints"
          className={`w-full grid transition-all duration-200 ease-in-out ${
            isPasswordFocused || formdata.password.length > 0 ? 'grid-rows-[1fr] opacity-100 mt-0.5' : 'grid-rows-[0fr] opacity-0 pointer-events-none'
          }`}
        >
          <div className="overflow-hidden">
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 text-xs font-medium" aria-label="Password rules">
                {validationStates.map((rule) => {
                  const hasTyped = formdata.password.length > 0;
                  return (
                    <li 
                      key={rule.id} 
                      className={`flex items-center gap-2 transition-colors ${
                        hasTyped ? (rule.isValid ? 'text-green-700' : 'text-red-600') : 'text-gray-500'
                      }`}
                    >
                      {hasTyped ? (
                        <FontAwesomeIcon icon={rule.isValid ? faCheck : faXmark} className={`w-3 h-3 ${rule.isValid ? 'text-green-600' : 'text-red-500'}`} />
                      ) : (
                        <div className="w-1.5 h-1.5 ml-1 rounded-full bg-gray-400" />
                      )}
                      <span>{rule.label}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>

        {/* Re-type Password field  */}

        <div className="flex flex-col w-full gap-1">
          <label className="required text-sm font-semibold text-gray-700" htmlFor='signup-re-password'>
            Re-type Password:
          </label>
          <div className="relative w-full">
            <input 
              type={showRePassword ? "text" : "password"} 
              name='re_password' 
              id='signup-re-password' 
              className={`w-full px-3 py-2 pr-10 border rounded-lg outline-none transition-all focus:ring-2
                ${formdata.re_password.length > 0 
                  ? (passwordsMatch ? 'focus:ring-green-500/20 focus:border-green-500 border-green-300' : 'focus:ring-red-500/20 focus:border-red-500 border-red-300') 
                  : 'focus:ring-blue-500/20 border-gray-300'
                }`}
              value={formdata.re_password} 
              onChange={handleChange} 
              required 
            />
            <button
              type="button"
              onClick={() => setShowRePassword(prev => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none p-1 flex items-center justify-center"
              aria-label={showRePassword ? 'Hide validation password' : 'Show validation password'}
            >
              <FontAwesomeIcon icon={showRePassword ? faEyeSlash : faEye} className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* password mismatch error box */}
        {formdata.re_password.length > 0 && !passwordsMatch && (
          <div className="error text-red-500 text-xs w-full text-left">
            Passwords do not match
          </div>
        )}
        
        {/* Fallback generic error box */}
        {error && (!errorMessage || !errorMessage.username) && (
          <p className="error text-red-500 text-xs w-full text-center">
            Some error occurred
          </p>
        )}

        {/* Create form submit button */}
        <button 
          type="submit" 
          disabled={!(formdata.username && formdata.first_name && formdata.email && isPasswordValid && passwordsMatch)} 
          className="w-full btn-primary btn-accent text-white font-medium py-2 rounded-lg mt-2 disabled:opacity-50 disabled:cursor-not-allowed "
        >
          Create Account
        </button>

        <p className="text-sm text-gray-600 mt-1">
          Already have an account?? <NavLink to='/login' className="text-[var(--color-secondary)] hover:underline">Login</NavLink>
        </p>
      </form>
    </main>
  );
}

export default SignupForm;
