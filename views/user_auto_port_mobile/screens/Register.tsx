import React from 'react';
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const register = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <Image source={require('../assets/cable-car.png')} style={styles.logo} />

      <Text style={styles.title}>AUTO PORT</Text>

      <Text style={styles.subTitle}>
        SIGN UP AND REQUSET{'\n'}VEHICLES NOW
      </Text>

      <TouchableOpacity style={styles.googleButton}>
        <View style={styles.googleContent}>
          <Image source={require('../assets/Google.png')} style={styles.googleIcon} />
          <Text style={styles.googleText}>Cotinue with Google</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
        <Text style={styles.orText}>or sign up locally</Text>
        <View style={styles.divider} />
      </View>

      <TextInput
        style={styles.input}
        placeholder="email@domain.com"
        keyboardType="email-address"
      />

      <TouchableOpacity style={styles.emailButton} onPress={() => {navigation.navigate("registerLocally1" as never)}}>
        <Text style={styles.emailButtonText}>Sign up with email</Text>
      </TouchableOpacity>

      <Text style={styles.terms}>
        By clicking continue, you agree to our{' '}
        <Text style={styles.link}>Terms of Service</Text> and{' '}
        <Text style={styles.link}>Privacy Policy</Text>
      </Text>
    </SafeAreaView>
  );
};

export default register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: '5%',
  },
  logo: {
    width: '12%',
    height: undefined,
    aspectRatio: 1,
    marginBottom: '4%',
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    color: '#000',
    marginBottom: '10%',
  },
  subTitle: {
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 24,
    marginBottom: '6%',
    marginTop: '20%',
  },
  googleButton: {
    backgroundColor: '#EAEAEA',
    width: '100%',
    borderRadius: 6,
    paddingVertical: '3%',
    paddingHorizontal: '5%',
    // alignItems: 'center',
    marginBottom: '8%',
  },
  googleContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  googleIcon: {
    width: 18,
    height: 18,
    marginRight: 75,
  },
  googleText: {
    fontSize: 16,
    color: '#000',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '8%',
    width: '100%',
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#CCC',
  },
  orText: {
    marginHorizontal: '2%',
    color: '#777',
    fontSize: 12,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#D1D1D1',
    borderRadius: 6,
    padding: '3%',
    marginBottom: '4%',
    fontSize: 20,
  },
  emailButton: {
    backgroundColor: '#000',
    paddingVertical: '3%',
    borderRadius: 6,
    width: '100%',
    alignItems: 'center',
    marginBottom: '8%',
  },
  emailButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  terms: {
    textAlign: 'center',
    color: '#888',
    fontSize: 14,
    paddingHorizontal: '5%',
  },
  link: {
    fontWeight: 'bold',
    color: '#000',
  },
});
