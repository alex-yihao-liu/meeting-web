import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface User {
    id: string;
    name: string;
    email: string;
    token: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const storedUser = localStorage.getItem('user');
    const [user, setUser] = useState<User | null>(JSON.parse(storedUser || 'null'));

    const login = async (email: string, password: string) => {
        try {
            // TODO: Send Login request

            const data = {
                user: {
                    id: '1',
                    name: 'John Doe',
                    email: email,
                    token: ''
                }
            };
            setUser(data.user);
            localStorage.setItem('user', JSON.stringify(data.user));
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    // 持久化登录状态（页面刷新时恢复用户）
    useEffect(() => {
        console.log('AuthContext: useEffect');
        const storedUser = localStorage.getItem('user');
        console.log(storedUser);
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout }
        }>
            {children}
        </AuthContext.Provider>
    );
};

// 自定义 Hook 方便访问认证状态
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
