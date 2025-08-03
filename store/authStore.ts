import { create } from 'zustand';
import { AuthState, StaticUser, User, LoginResult } from '../types/auth';

const useAuthStore = create<AuthState>((set, get) => ({
  // Estado inicial
  user: null,
  isLoggedIn: false,
  userType: null,
  
  // Dados estáticos de usuários para teste
  staticUsers: [
    {
      id: 1,
      email: 'admin@test.com',
      password: '123456',
      name: 'Admin User',
      type: 'admin'
    },
    {
      id: 2,
      email: 'user@test.com',
      password: '123456',
      name: 'João Silva',
      type: 'user'
    }
  ] as StaticUser[],

  // Função de login
  login: async (email: string, password: string): Promise<LoginResult> => {
    const { staticUsers } = get();
    
    // Simula delay de API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Busca usuário nos dados estáticos
    const user = staticUsers.find(u => 
      u.email === email && u.password === password
    );
    
    if (user) {
      const userData: User = {
        id: user.id,
        email: user.email,
        name: user.name
      };
      
      set({
        user: userData,
        isLoggedIn: true,
        userType: user.type
      });
      return { success: true };
    } else {
      return { success: false, error: 'Email ou senha inválidos' };
    }
  },

  // Função de logout
  logout: () => {
    set({
      user: null,
      isLoggedIn: false,
      userType: null
    });
  }
}));

export default useAuthStore;