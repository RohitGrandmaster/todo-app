import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  getItem,
  removeItem,
  setItem,
} from '../storage/storage';

import APP_CONFIG from '../constants/appConfig';

import {
  loginUser,
  signupUser,
  resetPassword as resetPasswordRequest,
} from '../services/authService';

const AuthContext = createContext(null);

function AuthProvider({children}) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSession() {
      const savedUser = await getItem(
        APP_CONFIG.STORAGE_KEYS.AUTH_USER,
        null,
      );

      setUser(savedUser);
      setLoading(false);
    }

    loadSession();
  }, []);

  async function login(email, password) {
    const result = await loginUser(
      email,
      password,
    );

    if (result.success) {
      setUser(result.user);

      await setItem(
        APP_CONFIG.STORAGE_KEYS.AUTH_USER,
        result.user,
      );
    }

    return result;
  }

  async function signup(name, email, password) {
    const result = await signupUser(
      name,
      email,
      password,
    );

    if (result.success) {
      setUser(result.user);

      await setItem(
        APP_CONFIG.STORAGE_KEYS.AUTH_USER,
        result.user,
      );
    }

    return result;
  }

  async function resetPassword(email) {
    return resetPasswordRequest(email);
  }

  async function updateProfile(name) {
    if (!user) {
      return;
    }

    const updatedUser = {
      ...user,
      name: name.trim(),
    };

    setUser(updatedUser);

    await setItem(
      APP_CONFIG.STORAGE_KEYS.AUTH_USER,
      updatedUser,
    );
  }

  async function logout() {
    setUser(null);

    await removeItem(
      APP_CONFIG.STORAGE_KEYS.AUTH_USER,
    );
  }

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      loading,

      login,
      signup,
      resetPassword,
      updateProfile,
      logout,
    }),
    [user, loading],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuthContext must be used inside AuthProvider.',
    );
  }

  return context;
}

export {
  AuthProvider,
  useAuthContext,
};