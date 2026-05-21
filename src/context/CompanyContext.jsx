import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../utils/api';
import { CompanyContext } from './companyContextConfig';

export const CompanyProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    companyName: 'Cabptoid Solutions',
    logo: null,
    favicon: null,
    industry: 'Software & IT Services',
    website: 'www.cabptoid.com',
    supportEmail: 'support@cabptoid.com',
    phone: '+1 (555) 000-0000',
    address: '123 Innovation Drive, Silicon Valley, CA 94025, USA',
    gstNumber: '',
    description: '',
    primaryColor: '#1E3A8A',
    workingHours: []
  });

  const [loading, setLoading] = useState(true);

  const fetchSettings = useCallback(async (signal = { active: true }) => {
    try {
      if (!signal.active) return;
      setLoading(true);

      const data = await apiFetch('/api/settings');
      if (!signal.active) return;

      const defaultHours = [
        { day: 'Monday', start: '10:00', end: '18:30', isOpen: true },
        { day: 'Tuesday', start: '10:00', end: '18:30', isOpen: true },
        { day: 'Wednesday', start: '10:00', end: '18:30', isOpen: true },
        { day: 'Thursday', start: '10:00', end: '18:30', isOpen: true },
        { day: 'Friday', start: '10:00', end: '18:30', isOpen: true },
        { day: 'Saturday', start: '10:00', end: '16:30', isOpen: true },
        { day: 'Sunday', start: '00:00', end: '00:00', isOpen: false },
      ];

      let mergedHours = defaultHours;
      if (Array.isArray(data.workingHours) && data.workingHours.length > 0) {
        mergedHours = defaultHours.map(def => {
          const backendDay = data.workingHours.find(h => h.day === def.day);
          if (backendDay) {
            const isOpen = backendDay.isOpen !== undefined ? backendDay.isOpen : (backendDay.open !== undefined ? backendDay.open : false);
            return { ...def, ...backendDay, isOpen };
          }
          return def;
        });
      }

      const normalizedData = {
        companyName: data.companyName || data.company_name || data.companyName || 'Cabptoid Solutions',
        industry: data.industry || '',
        website: data.website || '',
        supportEmail: data.supportEmail || data.support_email || '',
        phone: data.phone || '',
        address: data.address || '',
        latitude: data.latitude || data.lat || '17.3850',
        longitude: data.longitude || data.lng || data.longitude || '78.4867',
        gstNumber: data.gstNumber || data.gst_number || data.taxId || data.tax_id || data.gst || data.taxNumber || '',
        description: data.description || data.company_description || data.companyDescription || data.about || data.bio || '',
        logo: data.logo || null,
        favicon: data.favicon || null,
        workingHours: mergedHours,
      };

      setSettings(prev => ({ ...prev, ...normalizedData }));

      if (normalizedData.companyName) {
        document.title = `${normalizedData.companyName} | CRM Portal`;
      }
      if (normalizedData.favicon) {
        const favicon = document.querySelector("link[rel*='icon']");
        if (favicon) favicon.href = normalizedData.favicon;
      }
    } catch (err) {
      console.error('Failed to fetch global company settings:', err);
    } finally {
      if (signal.active) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const signal = { active: true };

    const loadSettings = async () => {
      await fetchSettings(signal);
    };

    void loadSettings();
    return () => {
      signal.active = false;
    };
  }, []);

  const updateSettings = useCallback((newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    if (newSettings.companyName) {
      document.title = `${newSettings.companyName} | CRM Portal`;
    }
  }, []);

  return (
    <CompanyContext.Provider value={{ settings, updateSettings, refreshSettings: fetchSettings, loading }}>
      {children}
    </CompanyContext.Provider>
  );
};
