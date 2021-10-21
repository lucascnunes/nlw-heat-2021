import { createContext, ReactNode, useState } from "react";
import { useEffect } from 'react';
import { api } from '../sevices/api';

type User = {
  id: string;
  name: string;
  login: string;
  avatar_url: string;
}

type AuthContextData = {
  user: User | null;
  signInUrl: string;
  signOut: () => void;
}

export const AuthContext = createContext({} as AuthContextData);

type AuthProvider = {
  children: ReactNode;
}

type AuthResponse = {
  token: string;
  user: {
    id: string;
    avatar_url: string;
    name: string;
    login: string;
  }
}
export function AuthProvider(props: AuthProvider) {

  const [user, setUser] = useState<User | null>(null);

  const signInUrl = `https://github.com/login/oauth/authorize?client_id=32b577b6a393680d5523&redirect_uri=http://localhost:3000&scope=user`;


  async function signIn(githubCode: string) {

    // send githubcode to node backend
    const response = await api.post<AuthResponse>('authenticate', {
      code: githubCode,
      app_request: 'react'
    });

    const { token, user } = response.data;
    if (token) {
      localStorage.setItem('@dowhile:token', token);
      api.defaults.headers.common.authorization = `Bearer ${token}`;
  
      setUser(user);  
    }

    console.log(response);
  }

  function signOut() {
    localStorage.removeItem('@dowhile:token');
    setUser(null);
  }

  // get logged in user data
  useEffect(() => {
    const token = localStorage.getItem('@dowhile:token');

    if (token) {
      api.defaults.headers.common.authorization = `Bearer ${token}`;
      api.get<User>('profile').then(response => {
        setUser(response.data);
      });
    }
  })

  // get github code from url after login
  useEffect(() => {
    const url = window.location.href;
    const hasGithubCode = url.includes('?code=');

    if (hasGithubCode) {
      const [urlWithoutCode, githubCode] = url.split('?code=');
      window.history.pushState({}, '', urlWithoutCode);
      
      signIn(githubCode);
    }

  }, []);

  return (
    <AuthContext.Provider value={{ signInUrl, user, signOut }}>
      {props.children}
    </AuthContext.Provider>
  )
}
