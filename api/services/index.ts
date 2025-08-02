import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE = 'https://ethiostocklink-lite-1.onrender.com/api';

const getAuthHeaders = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export const fetchUserBalance = async () => {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE}/user/balance`, { headers });
  if (!res.ok) throw new Error("Failed to fetch balance");
  return res.json();
};

export const fetchUserHoldings = async () => {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE}/user/stocks`, { headers });
  if (!res.ok) throw new Error("Failed to fetch holdings");
  return res.json();
};

export const fetchTransactionHistory = async () => {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE}/transactions/history`, { headers });
  if (!res.ok) throw new Error("Failed to fetch transaction history");
  return res.json();
};

export const fetchIPOCompanies = async () => {
  const res = await fetch(`${API_BASE}/companies/ipo`);
  if (!res.ok) throw new Error("Failed to fetch IPO companies");
  return res.json();
};

export const fetchCompanyPerformance = async (companyId: number, timeframe = '1m') => {
  if (!companyId) return [];
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE}/stock/${companyId}/graph?timeframe=${timeframe}`, { headers });
  if (!res.ok) throw new Error("Failed to fetch performance data");
  return res.json();
};

export const fetchUserStockQuantity = async (companyId: number) => {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE}/user/stocks/${companyId}`, { headers });
  if (!res.ok) throw new Error("Failed to fetch stock quantity");
  const data = await res.json();
  return data.quantity ?? 0;
};
