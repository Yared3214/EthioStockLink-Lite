import * as SecureStore from 'expo-secure-store';

export async function saveItem(key, value) {
  await SecureStore.setItemAsync(key, value);
}

export async function getItem(key) {
  return await SecureStore.getItemAsync(key);
}

export async function deleteItem(key) {
  await SecureStore.deleteItemAsync(key);
}
