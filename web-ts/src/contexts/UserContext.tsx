import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  settings: {
    theme: 'light' | 'dark';
    language: string;
    notifications: boolean;
  }
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserSettings: (settings: Partial<User['settings']>) => void;
}

const defaultUser: UserContextType = {
  user: null,
  isLoading: false,
  error: null,
  login: async () => {},
  logout: () => {},
  updateUserSettings: () => {},
};

export const UserContext = createContext<UserContextType>(defaultUser);

export const useUser = () => useContext(UserContext);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Имитация загрузки пользователя при первом рендере
  useEffect(() => {
    const loadUser = async () => {
      try {
        // В реальном приложении здесь был бы запрос к API
        setIsLoading(true);
        
        // Имитация задержки загрузки
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Установка демонстрационного пользователя
        setUser({
          id: '1',
          name: 'Тестовий Користувач',
          email: 'test@example.com',
          settings: {
            theme: 'dark',
            language: 'uk',
            notifications: true
          }
        });
        
        setError(null);
      } catch (err) {
        setError('Помилка завантаження користувача');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      // Имитация запроса авторизации
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUser({
        id: '1',
        name: 'Тестовий Користувач',
        email: email,
        settings: {
          theme: 'dark',
          language: 'uk',
          notifications: true
        }
      });
      
      setError(null);
    } catch (err) {
      setError('Помилка авторизації');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const updateUserSettings = (settings: Partial<User['settings']>) => {
    if (user) {
      setUser({
        ...user,
        settings: { ...user.settings, ...settings }
      });
    }
  };

  const value = {
    user,
    isLoading,
    error,
    login,
    logout,
    updateUserSettings,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}; 