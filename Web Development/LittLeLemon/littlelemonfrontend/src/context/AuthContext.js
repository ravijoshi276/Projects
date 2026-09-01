import { useState, useContext, createContext, useEffect, useCallback, useMemo } from "react";

const BASE_URL = process.env.REACT_APP_API_URL;

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem('authToken') || null);
    const [user, setUser] = useState(null);
    const [group, setGroup] = useState(() => localStorage.getItem('group') || null);
    const [loading, setLoading] = useState(true);

    const isLoggedIn = !!token;

    
    const fetchUser = useCallback(async (signal) => {
        if (!token) return;

        try {
            const response = await fetch(`${BASE_URL}/auth/users/me`, {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json',
                },
                signal,
            });

            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
            } else {
                logout();
            }
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error("Failed to fetch user profile:", error);
                logout();
            }
        } finally {
            setLoading(false);
        }
    }, [token]);

    // Handle Logout wrapped in useCallback
    const logout = useCallback(() => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('group');
        setToken(null);
        setUser(null);
        setGroup(null);
        setLoading(false);
    }, []);

    // Handle Login wrapped in useCallback to stabilize its reference
    const login = useCallback(async (data) => {
        try {
            const authToken = data.auth_token;
            localStorage.setItem('authToken', authToken);
            setToken(authToken);

            const groups = data.groups || [];
            let detectedGroup = 'user';

            if (groups.includes("Manager")) {
                detectedGroup = 'manager';
            } else if (groups.includes("Delivery Crew")) {
                detectedGroup = 'deliverycrew';
            }

            localStorage.setItem('group', detectedGroup);
            setGroup(detectedGroup);

            setLoading(true);
            await fetchUser();
        } catch (error) {
            console.error("Login processing error:", error);
        }
    }, [fetchUser]);

    // Effect for initial session validation & token tracking
    useEffect(() => {
        const controller = new AbortController();

        if (token) {
            setLoading(true);
            fetchUser(controller.signal);
        } else {
            setLoading(false);
        }

        return () => {
            controller.abort();
        };
    }, [token, fetchUser]);

    // Memoize context value safely now that login and logout have stable references
    const value = useMemo(() => ({
        token,
        user,
        group,
        loading,
        isLoggedIn,
        login,
        logout,
        setUser,
    }), [token, user, group, loading, isLoggedIn, login, logout]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};