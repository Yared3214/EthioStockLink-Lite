// hooks/useIpoCompanies.ts
import { useEffect, useState } from 'react';

const API_URL = "https://ethiostocklink-lite-1.onrender.com/api/companies/ipo";

export const useIpoCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIPOCompanies = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error("Failed to fetch IPO companies");
        }
        const data = await response.json();
        setCompanies(data.companies || []);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchIPOCompanies();
  }, []);

  return { companies, loading, error };
};
