import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {CheckCircleIcon, LogoutIcon} from './icons';

interface HomeScreenProps {
  onLogout: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({onLogout}) => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.container} testID="home-screen">
        <CheckCircleIcon width={64} height={64} color="#34D399" />
        <View style={styles.textContainer}>
          <Text style={styles.title} testID="welcome-message">
            Login Successful!
          </Text>
          <Text style={styles.subtitle}>Welcome to the Home Screen.</Text>
        </View>
        <Text style={styles.description}>
          This screen confirms that the E2E login test has passed and navigation
          was successful.
        </Text>
        <TouchableOpacity
          onPress={onLogout}
          style={styles.button}
          testID="logout-button">
          <LogoutIcon style={{marginRight: 8}} color="#FFFFFF" />
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
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
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#34D399',
  },
  subtitle: {
    color: '#D1D5DB',
    marginTop: 8,
    fontSize: 16,
  },
  description: {
    color: '#9CA3AF',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4B5563',
    paddingVertical: 14,
    borderRadius: 8,
    width: '100%',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default HomeScreen;
