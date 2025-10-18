'use client';

import { useState, useEffect } from 'react';

interface UseUserSettingsReturn {
  value: any;
  setValue: (value: any) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export function useUserSettings(key: string, defaultValue: any = null): UseUserSettingsReturn {
  const [value, setValueState] = useState(defaultValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load setting on mount
  useEffect(() => {
    const loadSetting = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try to load from localStorage first as fallback
        const localStorageKey = `user_setting_${key}`;
        const localValue = localStorage.getItem(localStorageKey);
        
        if (localValue !== null) {
          try {
            const parsedValue = JSON.parse(localValue);
            setValueState(parsedValue);
            setLoading(false);
            return;
          } catch (parseError) {
            console.warn('Failed to parse localStorage value:', parseError);
          }
        }
        
        const response = await fetch(`/api/user-settings?key=${encodeURIComponent(key)}`);
        
        if (!response.ok) {
          // If API fails, use localStorage fallback
          if (localValue !== null) {
            try {
              const parsedValue = JSON.parse(localValue);
              setValueState(parsedValue);
            } catch {
              setValueState(defaultValue);
            }
          } else {
            setValueState(defaultValue);
          }
          return;
        }
        
        const data = await response.json();
        const apiValue = data.value !== null ? data.value : defaultValue;
        setValueState(apiValue);
        
        // Save to localStorage as backup
        localStorage.setItem(localStorageKey, JSON.stringify(apiValue));
        
      } catch (err) {
        console.error('Error loading user setting:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        
        // Fallback to localStorage
        const localStorageKey = `user_setting_${key}`;
        const localValue = localStorage.getItem(localStorageKey);
        if (localValue !== null) {
          try {
            const parsedValue = JSON.parse(localValue);
            setValueState(parsedValue);
          } catch {
            setValueState(defaultValue);
          }
        } else {
          setValueState(defaultValue);
        }
      } finally {
        setLoading(false);
      }
    };

    loadSetting();
  }, [key, defaultValue]);

  // Save setting function
  const setValue = async (newValue: any) => {
    try {
      setError(null);
      
      // Always save to localStorage first for immediate feedback
      const localStorageKey = `user_setting_${key}`;
      localStorage.setItem(localStorageKey, JSON.stringify(newValue));
      setValueState(newValue);
      
      // Try to save to database
      try {
        const response = await fetch('/api/user-settings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            key,
            value: newValue,
          }),
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.warn('API Error (using localStorage fallback):', errorData);
          // Don't throw error, localStorage already saved
        }
      } catch (apiError) {
        console.warn('API Error (using localStorage fallback):', apiError);
        // Don't throw error, localStorage already saved
      }
      
    } catch (err) {
      console.error('Error saving user setting:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    }
  };

  return {
    value,
    setValue,
    loading,
    error,
  };
}
