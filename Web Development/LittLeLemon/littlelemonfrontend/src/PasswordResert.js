import React, { useState } from "react";
import { useAuth } from "./context/AuthContext";
import Alert from "./Alert";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import BackButton from './BackButton';
import { useNavigate } from "react-router";

const BASE_URL = process.env.REACT_APP_API_URL;

export default function PasswordReset() {
    const navigate = useNavigate();  
    const { logout, user, token } = useAuth();
    
    const [formData, setFormData] = useState({ current_password: "", new_password: "", re_new_password: "" });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showReNewPassword, setShowReNewPassword] = useState(false);
    const [currentPasswordError, setCurrentPasswordError] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(false);
        setCurrentPasswordError(false);
        setIsSubmitted(false);

        try {
            const response = await fetch(`${BASE_URL}/auth/users/set_password/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`,
                },
                // Djoser set_password endpoint typically requires current_password and new_password
                body: JSON.stringify({
                    current_password: formData.current_password,
                    new_password: formData.new_password
                })
            });

            setIsSubmitted(true);

            if (!response.ok) {
                setError(true);
                const errordata = await response.json();
                
                // Safe check using optional chaining
                if (errordata?.current_password?.[0] === 'Invalid password.') {
                    setCurrentPasswordError(true);
                }
                throw new Error("Failed to change password");
            }

            // Success flow: notify, logout, and redirect after 5 seconds
            setTimeout(() => {
                setIsSubmitted(false);
                logout();
                navigate("../login");
            }, 5000);

        } catch (err) {
            setError(true);
            console.error("Password reset error:", err);
        }
    };

    const handleClear = () => {
        setFormData({ current_password: "", new_password: "", re_new_password: "" });
        setCurrentPasswordError(false);
        setError(false);
        setIsSubmitted(false);
    };

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const isValidPassword = formData.current_password.length > 0 && 
                            formData.new_password.length > 0 && 
                            formData.re_new_password.length > 0 
                            ? formData.re_new_password === formData.new_password 
                            : null;

    return (
        <main className="max-w-xl mx-auto px-4 py-8 text-[var(--text-main)]">
            <BackButton />
            <h1 className="my-3 text-2xl font-bold">Reset Password</h1>

            {/* Alert Notifications */}
            {isSubmitted && !error && (
                <div className="mb-4">
                    <Alert type='success' message="✅ Password Changed Successfully!" />
                </div>
            )}
            {isSubmitted && error && (
                <div className="mb-4">
                    <Alert type='failed' message="Failed to Change Password" />
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5 items-center mx-auto my-6 border rounded-xl p-6 shadow-sm bg-[var(--bg-surface)] border-[var(--border-color)]">
                <h2 className="text-center text-xl font-bold my-1 text-[var(--text-main)]">Update Your Password</h2>

                {/* Current Password Field */}
                <div className="flex flex-col w-full gap-1.5">
                    <label htmlFor="current_password" className="text-sm font-semibold text-[var(--text-main)]">
                        Current Password:
                    </label>
                    <div className="relative w-full">
                        <input 
                            name="current_password" 
                            type={showCurrentPassword ? "text" : "password"} 
                            id="current_password" 
                            value={formData.current_password} 
                            onChange={handleChange}
                            className="w-full px-3 py-2 pr-10 border rounded-lg outline-none transition-all bg-[var(--bg-input)] text-[var(--text-main)] border-[var(--border-color)] focus:ring-2 focus:ring-[var(--color-primary)]"
                            autoComplete="current-password"
                            required
                        />
                        <button
                            type="button" 
                            onClick={() => setShowCurrentPassword(prev => !prev)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-main)] focus:outline-none p-1 flex items-center justify-center transition-colors"
                            aria-label={showCurrentPassword ? 'Hide password' : 'Show password'}
                        >
                            <FontAwesomeIcon icon={showCurrentPassword ? faEyeSlash : faEye} className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                {currentPasswordError && (
                    <div className="text-[var(--color-error)] text-sm font-medium w-full text-center">
                        Invalid Current Password
                    </div>
                )}

                {/* New Password Field */}
                <div className="flex flex-col w-full gap-1.5">
                    <label htmlFor="new_password" className="text-sm font-semibold text-[var(--text-main)]">
                        New Password:
                    </label>
                    <div className="relative w-full">
                        <input 
                            name="new_password" 
                            type={showNewPassword ? "text" : "password"} 
                            id="new_password" 
                            value={formData.new_password} 
                            onChange={handleChange}
                            className="w-full px-3 py-2 pr-10 border rounded-lg outline-none transition-all bg-[var(--bg-input)] text-[var(--text-main)] border-[var(--border-color)] focus:ring-2 focus:ring-[var(--color-primary)]"
                            autoComplete="new-password"
                            required
                        />
                        <button
                            type="button" 
                            onClick={() => setShowNewPassword(prev => !prev)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-main)] focus:outline-none p-1 flex items-center justify-center transition-colors"
                            aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                        >
                            <FontAwesomeIcon icon={showNewPassword ? faEyeSlash : faEye} className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Re-Type New Password Field */}
                <div className="flex flex-col w-full gap-1.5">
                    <label htmlFor="re_new_password" className="text-sm font-semibold text-[var(--text-main)]">
                        Re-Type New Password:
                    </label>
                    <div className="relative w-full">
                        <input 
                            name="re_new_password" 
                            type={showReNewPassword ? "text" : "password"} 
                            id="re_new_password" 
                            value={formData.re_new_password} 
                            onChange={handleChange}
                            className="w-full px-3 py-2 pr-10 border rounded-lg outline-none transition-all bg-[var(--bg-input)] text-[var(--text-main)] border-[var(--border-color)] focus:ring-2 focus:ring-[var(--color-primary)]"
                            autoComplete="new-password"
                            required
                        />
                        <button
                            type="button" 
                            onClick={() => setShowReNewPassword(prev => !prev)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-main)] focus:outline-none p-1 flex items-center justify-center transition-colors"
                            aria-label={showReNewPassword ? 'Hide password' : 'Show password'}
                        >
                            <FontAwesomeIcon icon={showReNewPassword ? faEyeSlash : faEye} className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {isValidPassword !== null && !isValidPassword && (
                    <div className="text-[var(--color-error)] text-sm font-medium w-full text-center">
                        Passwords do not match
                    </div>
                )}

                {/* Buttons */}
                <div className="flex gap-4 w-full justify-end mt-2 pt-4 border-t border-[var(--border-color)]">
                    <button 
                        type="button" 
                        onClick={handleClear} 
                        className="px-4 py-2 rounded-lg transition-colors bg-[var(--bg-container)] text-[var(--text-main)] hover:bg-[var(--card-hover)] border border-[var(--border-color)]"
                    >
                        Clear
                    </button>
                    <button 
                        type="submit"
                        disabled={!isValidPassword} 
                        style={{
                            backgroundColor: isValidPassword ? 'var(--color-primary)' : undefined,
                            color: isValidPassword ? 'var(--bg-surface)' : undefined
                        }}
                        className="px-5 py-2 rounded-lg font-medium transition-opacity disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </main>
    );
}