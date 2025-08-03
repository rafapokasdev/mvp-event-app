import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import useAuthStore from '../store/authStore';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const router = useRouter();
  const login = useAuthStore(state => state.login);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      // Navegação será feita automaticamente pelo index.tsx
    } else {
      Alert.alert('Erro', result.error || 'Erro desconhecido');
    }
  };

  const fillTestUser = (type: 'admin' | 'user') => {
    if (type === 'admin') {
      setEmail('admin@test.com');
      setPassword('123456');
    } else {
      setEmail('user@test.com');
      setPassword('123456');
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <LinearGradient
        colors={['#6366f1', '#8b5cf6']}
        className="flex-1"
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1 }}
          className="flex-1"
        >
          <View className="flex-1 justify-center px-8">
            
            {/* Header */}
            <View className="items-center mb-12">
              <View className="w-20 h-20 bg-white/20 rounded-full items-center justify-center mb-6">
                <Ionicons name="ticket" size={40} color="white" />
              </View>
              <Text className="text-white text-3xl font-bold">EventApp</Text>
              <Text className="text-white/80 text-lg mt-2">Gestão de Eventos</Text>
            </View>

            {/* Form */}
            <View className="bg-white rounded-2xl p-6 shadow-lg">
              <Text className="text-2xl font-bold text-gray-800 text-center mb-8">
                Entrar
              </Text>

              {/* Email Input */}
              <View className="mb-4">
                <Text className="text-gray-700 mb-2 font-medium">Email</Text>
                <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3">
                  <Ionicons name="mail" size={20} color="#6b7280" />
                  <TextInput
                    className="flex-1 ml-3 text-gray-800"
                    placeholder="seu@email.com"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              {/* Password Input */}
              <View className="mb-6">
                <Text className="text-gray-700 mb-2 font-medium">Senha</Text>
                <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3">
                  <Ionicons name="lock-closed" size={20} color="#6b7280" />
                  <TextInput
                    className="flex-1 ml-3 text-gray-800"
                    placeholder="Sua senha"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons 
                      name={showPassword ? "eye-off" : "eye"} 
                      size={20} 
                      color="#6b7280" 
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Login Button */}
              <TouchableOpacity
                onPress={handleLogin}
                disabled={loading}
                className={`py-4 rounded-xl mb-4 ${
                  loading ? 'bg-gray-400' : 'bg-primary'
                }`}
              >
                <Text className="text-white text-center text-lg font-semibold">
                  {loading ? 'Entrando...' : 'Entrar'}
                </Text>
              </TouchableOpacity>

              {/* Test Users */}
              <View className="border-t border-gray-200 pt-4">
                <Text className="text-gray-600 text-center mb-3 text-sm">
                  Usuários de teste:
                </Text>
                <View className="flex-row space-x-2">
                  <TouchableOpacity
                    onPress={() => fillTestUser('admin')}
                    className="flex-1 py-2 px-3 bg-orange-100 rounded-lg"
                  >
                    <Text className="text-orange-600 text-center text-sm font-medium">
                      Admin
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => fillTestUser('user')}
                    className="flex-1 py-2 px-3 bg-blue-100 rounded-lg"
                  >
                    <Text className="text-blue-600 text-center text-sm font-medium">
                      Usuário
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Footer */}
            <Text className="text-white/60 text-center mt-8 text-sm">
              Versão 1.0.0 - MVP
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}