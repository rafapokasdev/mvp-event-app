import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthState, StaticUser, User, LoginResult } from '../types/auth';

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
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
        
        console.log('Tentando fazer login com:', { email, password });
        
        // Simula delay de API
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Busca usuário nos dados estáticos
        const user = staticUsers.find(u => 
          u.email === email && u.password === password
        );
        
        console.log('Usuário encontrado:', user);
        
        if (user) {
          const userData: User = {
            id: user.id,
            email: user.email,
            name: user.name
          };
          
          console.log('Login bem-sucedido, atualizando estado:', {
            user: userData,
            isLoggedIn: true,
            userType: user.type
          });
          
          set({
            user: userData,
            isLoggedIn: true,
            userType: user.type
          });
          
          return { success: true };
        } else {
          console.log('Login falhou - credenciais inválidas');
          return { success: false, error: 'Email ou senha inválidos' };
        }
      },

      // Função de logout
      logout: () => {
        console.log('Fazendo logout');
        set({
          user: null,
          isLoggedIn: false,
          userType: null
        });
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ 
        user: state.user, 
        isLoggedIn: state.isLoggedIn, 
        userType: state.userType 
      }),
    }
  )
);

export default useAuthStore;