import AsyncStorage from '@react-native-async-storage/async-storage';

async function setItem(key, value) {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

async function getItem(key, fallback = null) {
  const value = await AsyncStorage.getItem(key);

  if (value === null) {
    return fallback;
  }

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

async function removeItem(key) {
  await AsyncStorage.removeItem(key);
}

export {
  setItem,
  getItem,
  removeItem,
};