import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { login as loginService } from '../services/AuthService';
import { useNavigate, useLocation } from 'react-router';

interface AuthUser {
    username: string;
    displayName: string;
    email: string;
    expiresAt: string;
}

interface AuthContextType {
    user: AuthUser | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState<AuthUser | null>(null);

    useEffect(() => {
        const savedUser = localStorage.getItem('auth_user');
        console.log('savedUser', savedUser);
        if (savedUser) {
            const parsedUser = JSON.parse(savedUser);
            const expiresAt = new Date(parsedUser.expiresAt);

            if (expiresAt > new Date()) {
                setUser(parsedUser);
                if(location.pathname === '/login'){
                    navigate('/');
                }
            } else {
                localStorage.removeItem('auth_user');
                localStorage.removeItem('token');
                setUser(null);
                if(location.pathname !== '/login'){
                    navigate('/login');
                }
            }
        }
        else {
            if(location.pathname !== '/login'){
                navigate('/login');
            }
        }
    }, []);

    const login = async (username: string, password: string) => {
        try {
            const response = await loginService({ username, password });
            setUser(response satisfies AuthUser);
            localStorage.setItem('auth_user', JSON.stringify(response));
            localStorage.setItem('token',response.token);
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('auth_user');
        localStorage.removeItem('token');
    };

    const value = {
        user,
        login,
        logout,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
