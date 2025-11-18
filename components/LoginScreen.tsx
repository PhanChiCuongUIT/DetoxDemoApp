import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {UserIcon, LockIcon, LoginIcon} from './icons';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({onLoginSuccess}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);

    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (email === 'test@detox.com' && password === 'password123') {
      onLoginSuccess();
    } else {
      setError('Invalid email or password. Please try again.');
    }
    setIsLoading(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.containerWrapper}>
      <View style={styles.container} testID="login-screen">
        <View style={styles.header}>
          <Text style={styles.title}>Detox E2E Demo</Text>
          <Text style={styles.subtitle}>Enter credentials to proceed</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <UserIcon style={styles.inputIcon} color="#9CA3AF" />
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Email (test@detox.com)"
              placeholderTextColor="#6B7280"
              keyboardType="email-address"
              autoCapitalize="none"
              testID="email-input"
            />
          </View>
          <View style={styles.inputContainer}>
            <LockIcon style={styles.inputIcon} color="#9CA3AF" />
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Password (password123)"
              placeholderTextColor="#6B7280"
              secureTextEntry
              testID="password-input"
            />
          </View>
        </View>

        {error && (
          <View style={styles.errorContainer} testID="error-message">
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <TouchableOpacity
          onPress={handleLogin}
          disabled={isLoading}
          style={[styles.button, isLoading && styles.buttonDisabled]}
          testID="login-button">
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <LoginIcon style={{marginRight: 8}} color="#FFFFFF" />
              <Text style={styles.buttonText}>Login</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  containerWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111827',
    padding: 16,
  },
  container: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#1F2937',
    padding: 32,
    borderRadius: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#22D3EE',
  },
  subtitle: {
    color: '#9CA3AF',
    marginTop: 8,
  },
  form: {
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    borderWidth: 1,
    borderColor: '#4B5563',
    borderRadius: 8,
    marginBottom: 16,
    height: 50, // Added fixed height
  },
  inputIcon: {
    marginLeft: 12,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    padding: 12,
    fontSize: 16,
  },
  errorContainer: {
    backgroundColor: 'rgba(190, 38, 38, 0.5)',
    borderColor: '#BE2626',
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#F87171',
    textAlign: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0891B2',
    paddingVertical: 14,
    borderRadius: 8,
  },
  buttonDisabled: {
    backgroundColor: '#0E7490',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default LoginScreen;
