import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import useAuthStore from '../store/authStore';
import { View, Text, ActivityIndicator } from 'react-native';

export default function Index() {
  const router = useRouter();
  const { isLoggedIn, userType } = useAuthStore();

  useEffect(() => {
    console.log('Index - Estado atual:', { isLoggedIn, userType });
    
    // Timer para dar tempo do store carregar e evitar loop
    const timer = setTimeout(() => {
      if (isLoggedIn && userType) {
        console.log('Usuário logado, redirecionando para:', userType === 'admin' ? '/admin' : '/home');
        if (userType === 'admin') {
          router.replace('/admin');
        } else {
          router.replace('/home');
        }
      } else {
        console.log('Usuário não logado, redirecionando para /login');
        router.replace('/login');
      }
    }, 500); // Aumentei para 500ms para dar mais tempo

    return () => clearTimeout(timer);
  }, [isLoggedIn, userType, router]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9fafb' }}>
      <ActivityIndicator size="large" color="#6366f1" />
      <Text style={{ marginTop: 16, fontSize: 16, color: '#6b7280' }}>Carregando...</Text>
    </View>
  );
}