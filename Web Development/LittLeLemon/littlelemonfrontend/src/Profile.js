import Heading from "./Heading";
import { useState, useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import { Link } from "react-router-dom"; // Added for routing
import BackButton from "./BackButton";

const BASE_URL = process.env.REACT_APP_API_URL;

export default function Profile() {
    const { user, setUser, token, loading } = useAuth();
    
    const [formdata, setFormdata] = useState({
        username: "",
        email: "",
        first_name: "",
        last_name: "",
        ...user
    });
    
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (user) {
            setFormdata(user);
        }
    }, [user]);

    const handleChange = (e) => {
        setFormdata((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const clearForm = (e) => {
        if (e) e.preventDefault();
        setFormdata(user || { username: "", email: "", first_name: "", last_name: "" });
        setIsSubmitted(false);
        setError(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitted(false);
        setError(false);

        try {
            const response = await fetch(`${BASE_URL}/auth/users/me/`, {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`,
                },
                body: JSON.stringify(formdata),
            });

            if (response.ok) {
                const updatedData = await response.json();
                setIsSubmitted(true);
                setUser(updatedData);
            } else {
                setError(true);
            }
        } catch (err) {
            console.error("Profile update error:", err);
            setError(true);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <p className="text-[var(--text-muted)] animate-pulse">Loading profile...</p>
            </div>
        );
    }

    return (
        <main className="max-w-xl mx-auto px-4 py-8 text-[var(--text-main)]">
            <BackButton />
            <Heading className='py-3'>Profile Settings</Heading>

            {/* Alert Notifications */}
            {isSubmitted && (
                <div 
                    style={{ backgroundColor: 'var(--color-success)' }}
                    className="mb-6 p-4 text-sm font-medium text-white rounded-lg shadow-sm border border-[var(--border-color)] transition-all"
                >
                    Profile updated successfully!
                </div>
            )}
            
            {error && (
                <div 
                    style={{ backgroundColor: 'var(--color-error)' }}
                    className="mb-6 p-4 text-sm font-medium text-white rounded-lg shadow-sm border border-[var(--border-color)] transition-all"
                >
                    Failed to update profile. Please try again.
                </div>
            )}

            <div className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6 p-6 rounded-xl shadow-md border border-[var(--border-color)] bg-[var(--bg-surface)]">
                    {/* Username */}
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium mb-1 text-[var(--text-main)]">
                            Username
                        </label>
                        <input 
                            type="text" 
                            name="username" 
                            id="username" 
                            value={formdata.username || ""} 
                            disabled 
                            className="w-full px-3 py-2 border rounded-lg cursor-not-allowed bg-[var(--bg-container)] text-[var(--text-muted)] border-[var(--border-color)] focus:outline-none"
                        />
                        <p className="text-xs mt-1 text-[var(--text-muted)]">Username cannot be changed.</p>
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-1 text-[var(--text-main)]">
                            Email Address
                        </label>
                        <input 
                            type="email" 
                            name="email" 
                            id="email" 
                            value={formdata.email || ""} 
                            onChange={handleChange} 
                            className="w-full px-3 py-2 border rounded-lg bg-[var(--bg-input)] text-[var(--text-main)] border-[var(--border-color)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none transition-all"
                            required
                        />
                    </div>

                    {/* First Name */}
                    <div>
                        <label htmlFor="firstname" className="block text-sm font-medium mb-1 text-[var(--text-main)]">
                            First Name
                        </label>
                        <input 
                            type="text" 
                            name="first_name" 
                            id="firstname" 
                            value={formdata.first_name || ""} 
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-lg bg-[var(--bg-input)] text-[var(--text-main)] border-[var(--border-color)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none transition-all"
                        />
                    </div>

                    {/* Last Name */}
                    <div>
                        <label htmlFor="lastname" className="block text-sm font-medium mb-1 text-[var(--text-main)]">
                            Last Name
                        </label>
                        <input 
                            type="text" 
                            name="last_name" 
                            id="lastname" 
                            value={formdata.last_name || ""} 
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-lg bg-[var(--bg-input)] text-[var(--text-main)] border-[var(--border-color)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none transition-all"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end space-x-4 pt-4 border-t border-[var(--border-color)]">
                        <button 
                            type="button" 
                            onClick={clearForm}
                            className="px-4 py-2 text-sm font-medium rounded-lg transition-colors bg-[var(--bg-container)] text-[var(--text-main)] hover:bg-[var(--card-hover)]"
                        >
                            Reset
                        </button>
                        <button 
                            type="submit"
                            style={{
                                backgroundColor: 'var(--color-primary)',
                                color: 'var(--bg-surface)'
                            }}
                            className="px-5 py-2 text-sm font-medium rounded-lg shadow-sm transition-opacity hover:opacity-90 focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>

                {/* Security Section / Reset Password Card */}
                <div className="p-6 rounded-xl shadow-md border border-[var(--border-color)] bg-[var(--bg-surface)] flex items-center justify-between">
                    <div>
                        <h3 className="text-md font-semibold text-[var(--text-main)]">Password & Security</h3>
                        <p className="text-xs text-[var(--text-muted)] mt-0.5">Update your password regularly to keep your account secure.</p>
                    </div>
                    <Link 
                        to="/reset-password" 
                        className="px-4 py-2 text-sm font-medium rounded-lg transition-colors border border-[var(--border-color)] bg-[var(--bg-container)] text-[var(--text-main)] hover:bg-[var(--card-hover)] whitespace-nowrap"
                    >
                        Reset Password
                    </Link>
                </div>
            </div>
        </main>
    );
}