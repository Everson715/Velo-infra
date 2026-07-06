import { Platform } from 'react-native';

const DEFAULT_URL = Platform.select({
  android: 'http://10.0.2.2',
  default: 'http://localhost',
})!;

export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? DEFAULT_URL;
