import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import useAuthStore from '../store/authStore';
import { View, Text } from 'react-native';

export default function Index() {
  const router = useRouter();
  const { isLoggedIn, userType } = useAuthStore();

  useEffect(() => {
    // Timer para dar tempo do store carregar
    const timer = setTimeout(() => {
      if (isLoggedIn) {
        if (userType === 'admin') {
          router.replace('/admin');
        } else {
          router.replace('/home');
        }
      } else {
        router.replace('/login');
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isLoggedIn, userType]);

  return (
    <View className="flex-1 justify-center items-center bg-light">
      <Text className="text-lg text-gray-600">Carregando...</Text>
    </View>
  );
}