import { useState, useEffect, useRef } from 'react';
import { 
  Building2, 
  MapPin, 
  Clock, 
  Globe, 
  Mail, 
  Phone, 
  Save, 
  CheckCircle2,
  Loader2,
  Edit3,
  X,
  Camera,
  Hash
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCompany } from '../../../context/useCompany';
import { settingsService } from '../../../services/settingsService';
import defaultLogo from '../../../assets/logo.png';

const CompanySettingsTab = () => {
  const { updateSettings } = useCompany();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    website: '',
    supportEmail: '',
    phone: '',
    address: '',
    latitude: '',
    longitude: '',
    gstNumber: '',
    description: '',
    logo: null,
    favicon: '',
    workingHours: [
      { day: 'Monday', start: '10:00', end: '18:30', isOpen: true, open: true },
      { day: 'Tuesday', start: '10:00', end: '18:30', isOpen: true, open: true },
      { day: 'Wednesday', start: '10:00', end: '18:30', isOpen: true, open: true },
      { day: 'Thursday', start: '10:00', end: '18:30', isOpen: true, open: true },
      { day: 'Friday', start: '10:00', end: '18:30', isOpen: true, open: true },
      { day: 'Saturday', start: '10:00', end: '16:30', isOpen: true, open: true },
      { day: 'Sunday', start: '00:00', end: '00:00', isOpen: false, open: false },
    ]
  });

  const [originalData, setOriginalData] = useState(null);

  useEffect(() => {
    let active = true;

    const loadSettings = async () => {
      setFetching(true);
      setError(null);

      try {
        const data = await settingsService.getSettings();
        if (!active) return;

        const defaultHours = [
          { day: 'Monday', start: '10:00', end: '18:30', isOpen: true, open: true },
          { day: 'Tuesday', start: '10:00', end: '18:30', isOpen: true, open: true },
          { day: 'Wednesday', start: '10:00', end: '18:30', isOpen: true, open: true },
          { day: 'Thursday', start: '10:00', end: '18:30', isOpen: true, open: true },
          { day: 'Friday', start: '10:00', end: '18:30', isOpen: true, open: true },
          { day: 'Saturday', start: '10:00', end: '16:30', isOpen: true, open: true },
          { day: 'Sunday', start: '00:00', end: '00:00', isOpen: false, open: false },
        ];

        let mergedHours = defaultHours;
        if (Array.isArray(data.workingHours) && data.workingHours.length > 0) {
          mergedHours = defaultHours.map(def => {
            const backendDay = data.workingHours.find(h => h.day === def.day);
            if (backendDay) {
              const isOpen = backendDay.isOpen !== undefined ? backendDay.isOpen : (backendDay.open !== undefined ? backendDay.open : false);
              return { ...def, ...backendDay, isOpen, open: isOpen };
            }
            return def;
          });
        }

        const sanitizedData = {
          companyName: data.companyName || '',
          industry: data.industry || '',
          website: data.website || '',
          supportEmail: data.supportEmail || '',
          phone: data.phone || '',
          address: data.address || '',
          latitude: data.latitude !== undefined && data.latitude !== null ? data.latitude.toString() : '17.3850',
          longitude: data.longitude !== undefined && data.longitude !== null ? data.longitude.toString() : '78.4867',
          gstNumber: data.gstNumber || data.gst_number || data.taxId || data.tax_id || data.gst || data.taxNumber || '',
          description: data.description || data.company_description || data.companyDescription || data.about || data.bio || '',
          logo: data.logo || null,
          favicon: data.favicon || null,
          workingHours: mergedHours
        };

        setFormData(sanitizedData);
        setOriginalData(sanitizedData);
        updateSettings(sanitizedData);
      } catch (err) {
        if (active) {
          console.error('Fetch error:', err);
          setError(err.message || 'Could not load settings. Is the backend server running?');
        }
      } finally {
        if (active) setFetching(false);
      }
    };

    loadSettings();
    return () => {
      active = false;
    };
  }, [updateSettings]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, logo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleHourChange = (index, field, value) => {
    setFormData(prev => {
      const updatedHours = prev.workingHours.map((hour, idx) => {
        if (idx === index) {
          const updated = { ...hour, [field]: value };
          if (field === 'isOpen' || field === 'open') {
            updated.isOpen = value;
            updated.open = value;
          }
          return updated;
        }
        return hour;
      });
      return { ...prev, workingHours: updatedHours };
    });
  };

  const formatDisplayLink = (value) => {
    if (!value) return 'Not set';
    return value.startsWith('http') ? value : `https://${value}`;
  };

  const renderSummaryTable = (rows) => (
    <table className="settings-summary-table" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px' }}>
      <tbody>
        {rows.map((row) => (
          <tr key={row.label} style={{ borderBottom: '1px solid #E5E7EB' }}>
            <th style={{ textAlign: 'left', padding: '12px 14px', color: '#111827', fontSize: '0.9rem', width: '170px', verticalAlign: 'top' }}>{row.label}</th>
            <td style={{ padding: '12px 14px', color: '#374151', fontSize: '0.9rem' }}>{row.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const handleSave = async () => {
    if (!formData.companyName || !formData.companyName.trim()) {
      setError('⚠️ Please enter a Company Name before saving.');
      return;
    }

    setLoading(true);
    setSuccess(false);
    setError(null);
    
    try {
      await settingsService.updateSettings({
          companyName: formData.companyName,
          industry: formData.industry,
          website: formData.website,
          supportEmail: formData.supportEmail,
          phone: formData.phone,
          address: formData.address,
          latitude: formData.latitude ? formData.latitude.toString() : "0.0",
          longitude: formData.longitude ? formData.longitude.toString() : "0.0",
          gstNumber: formData.gstNumber,
          companyDescription: formData.description,
          logo: formData.logo,
          favicon: formData.favicon,
          workingHours: formData.workingHours.map(hour => ({
            day: hour.day,
            start: hour.start,
            end: hour.end,
            open: hour.isOpen ?? hour.open ?? false
          }))
        });

      setOriginalData(formData);
      updateSettings(formData);
      setIsEditing(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Save Error:', err);
      setError(err.message || 'Could not reach server to save.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (originalData) {
      setFormData(originalData);
    }
    setIsEditing(false);
    setError(null);
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setFormData(prev => ({
          ...prev,
          latitude: latitude.toFixed(6),
          longitude: longitude.toFixed(6)
        }));
        setLoading(false);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
      },
      (err) => {
        console.error('Geolocation error:', err);
        setError(`Location access denied: ${err.message}`);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const fetchFromAddress = async () => {
    if (!formData.address || formData.address.length < 5) {
      setError('Please enter a more specific address first');
      return;
    }

    setLoading(true);
    try {
      // Added User-Agent as per Nominatim usage policy to avoid blocked/cached requests
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(formData.address)}&limit=1`, {
        headers: { 'User-Agent': 'CRM-Software-App' }
      });
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const newLat = parseFloat(lat).toFixed(6);
        const newLon = parseFloat(lon).toFixed(6);
        
        setFormData(prev => ({
          ...prev,
          latitude: newLat,
          longitude: newLon
        }));
        
        setSuccess(true);
        // Inform user clearly that the coordinates changed
        setError(null); 
        console.log(`Geocoding successful: ${newLat}, ${newLon}`);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        throw new Error('Could not find coordinates for this address. Please check the spelling.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="tab-loading-overlay">
        <div className="loading-content">
          <Loader2 className="animate-spin text-primary" size={48} />
          <p className="mt-4 font-bold">Syncing Enterprise Branding...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tab-content settings-tab">
      <div className="tab-header-actions">
        <div className="tab-header-text">
          <h2>Company Branding & Settings</h2>
          <p className="text-muted">Manage your organization's global identity, contact info, and business hours.</p>
        </div>
        
        <div className="action-buttons-group">
          <AnimatePresence>
            {success && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="status-toast success"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10B981', fontWeight: '600', marginRight: '16px' }}
              >
                <CheckCircle2 size={18} />
                <span>Branding Updated Successfully</span>
              </motion.div>
            )}
          </AnimatePresence>

          {!isEditing ? (
            <button className="secondary-btn" onClick={() => setIsEditing(true)}>
              <Edit3 size={18} />
              <span>Edit Branding</span>
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="secondary-btn" onClick={handleCancel} disabled={loading}>
                <X size={18} />
                <span>Cancel</span>
              </button>
              <button className="primary-btn" onClick={handleSave} disabled={loading}>
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                <span>{loading ? 'Saving...' : 'Save Branding'}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="error-alert" style={{ background: '#FEF2F2', color: '#DC2626', padding: '12px 16px', borderRadius: '12px', marginBottom: '20px', border: '1px solid #FEE2E2', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>⚠️ Error:</span> {error}
        </div>
      )}

      <div className={`settings-grid ${isEditing ? 'is-editing' : 'is-viewing'}`}>
        {/* Branding & Logo */}
        <div className="settings-section-card">
          <div className="card-header-icon">
            <Building2 className="header-icon" size={24} />
            <div>
              <h3>Corporate Identity</h3>
              <p>Configure your company name and official logo</p>
            </div>
          </div>
          
          <div className="settings-form">
            <div className="logo-upload-section">
              <div className="logo-preview-box">
                <img src={formData.logo || defaultLogo} alt="Preview" className="branding-logo-preview" />
                {isEditing && (
                  <button className="logo-edit-btn" onClick={() => fileInputRef.current.click()}>
                    <Camera size={16} />
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleLogoUpload} 
                      accept="image/*" 
                      style={{ display: 'none' }} 
                    />
                  </button>
                )}
              </div>
              <div className="logo-upload-text">
                <p className="font-bold">Company Logo</p>
                <p className="text-muted text-xs">Recommended: PNG with transparent background. Max 2MB.</p>
              </div>
            </div>

            <div className="form-input-group">
              <label>Company Name</label>
              <input 
                type="text" 
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                readOnly={!isEditing}
                placeholder="Enter company name" 
              />
            </div>
            {isEditing && (
              <div className="form-input-group">
                <label>Favicon URL</label>
                <input 
                  type="text"
                  name="favicon"
                  value={formData.favicon}
                  onChange={handleInputChange}
                  placeholder="https://example.com/favicon.ico"
                />
              </div>
            )}
            {renderSummaryTable([
              { label: 'Company Name', value: formData.companyName || 'Not set' },
              { label: 'Industry', value: formData.industry || 'Not set' },
              { label: 'GST / Tax ID', value: formData.gstNumber || 'Not set' },
              { label: 'Description', value: formData.description || 'Not set' },
            ])}
            
            <div className="form-row-double">
              <div className="form-input-group">
                <label>Industry</label>
                <input 
                  type="text" 
                  name="industry"
                  value={formData.industry}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                  placeholder="e.g. Technology" 
                />
              </div>
              <div className="form-input-group">
                <label>GST / Tax ID</label>
                <div className={`input-with-prefix ${!isEditing ? 'read-only' : ''}`}>
                  <Hash size={16} />
                  <input 
                    type="text" 
                    name="gstNumber"
                    value={formData.gstNumber}
                    onChange={handleInputChange}
                    readOnly={!isEditing}
                    placeholder="Enter GST number" 
                  />
                </div>
              </div>
            </div>
            
            <div className="form-input-group">
              <label>Company Description</label>
              <textarea 
                rows="3" 
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                readOnly={!isEditing}
                placeholder="Write a brief overview of your company..."
                style={{ 
                  background: isEditing ? 'var(--bg-main)' : 'transparent', 
                  border: isEditing ? '1px solid var(--border)' : '1px solid transparent', 
                  padding: isEditing ? '0.75rem' : '0', 
                  borderRadius: '12px',
                  resize: 'none',
                  fontWeight: isEditing ? '400' : '600',
                  fontSize: '0.85rem',
                  lineHeight: '1.4'
                }}
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="settings-section-card">
          <div className="card-header-icon">
            <Globe className="header-icon" size={24} />
            <div>
              <h3>Contact Channels</h3>
              <p>Official website and support contact details</p>
            </div>
          </div>
          
          <div className="settings-form">
            <div className="form-input-group">
              <label>Website URL</label>
              <div className={`input-with-prefix ${!isEditing ? 'read-only' : ''}`}>
                <Globe size={16} />
                {!isEditing ? (
                  <a 
                    href={formData.website && (formData.website.startsWith('http') ? formData.website : `https://${formData.website}`)} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="settings-link"
                  >
                    {formData.website || 'Add website'}
                  </a>
                ) : (
                  <input 
                    type="text" 
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="www.example.com" 
                  />
                )}
              </div>
            </div>

            <div className="form-row-double">
              <div className="form-input-group">
                <label>Support Email</label>
                <div className={`input-with-prefix ${!isEditing ? 'read-only' : ''}`}>
                  <Mail size={16} />
                  {!isEditing ? (
                    <a href={`mailto:${formData.supportEmail}`} className="settings-link">
                      {formData.supportEmail || 'Add support email'}
                    </a>
                  ) : (
                    <input 
                      type="email" 
                      name="supportEmail"
                      value={formData.supportEmail}
                      onChange={handleInputChange}
                      placeholder="support@example.com" 
                    />
                  )}
                </div>
              </div>
              <div className="form-input-group">
                <label>Phone Number</label>
                <div className={`input-with-prefix ${!isEditing ? 'read-only' : ''}`}>
                  <Phone size={16} />
                  <input 
                    type="text" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    readOnly={!isEditing}
                    placeholder="+1 (555) 000-0000" 
                  />
                </div>
              </div>
            </div>
            {renderSummaryTable([
              { label: 'Website', value: formData.website ? <a href={formatDisplayLink(formData.website)} target="_blank" rel="noreferrer">{formatDisplayLink(formData.website)}</a> : 'Not set' },
              { label: 'Support Email', value: formData.supportEmail || 'Not set' },
              { label: 'Phone Number', value: formData.phone || 'Not set' },
            ])}
          </div>
        </div>

        {/* Office Location */}
        <div className="settings-section-card">
          <div className="card-header-icon">
            <MapPin className="header-icon" size={24} />
            <div>
              <h3>Global Headquarters</h3>
              <p>Official registered address and map location</p>
            </div>
          </div>
          
          <div className="settings-form">
            <div className="form-input-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ marginBottom: 0 }}>Full Address</label>
                {isEditing && (
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      type="button" 
                      className="text-btn" 
                      onClick={fetchFromAddress}
                      style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px', color: '#3b82f6' }}
                    >
                      <Globe size={14} />
                      Fetch from Address
                    </button>
                    <button 
                      type="button" 
                      className="text-btn" 
                      onClick={detectLocation}
                      style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <MapPin size={14} />
                      GPS Detect
                    </button>
                  </div>
                )}
              </div>
              <textarea 
                rows="2" 
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                readOnly={!isEditing}
                placeholder="Enter company address"
                style={{ 
                  background: isEditing ? 'var(--bg-main)' : 'transparent', 
                  border: isEditing ? '1px solid var(--border)' : '1px solid transparent', 
                  padding: isEditing ? '0.75rem' : '0', 
                  borderRadius: '12px',
                  resize: 'none',
                  fontWeight: isEditing ? '400' : '600',
                  fontSize: '0.85rem',
                  lineHeight: '1.4'
                }}
              />
            </div>
            
            <div className="map-view-container">
              <iframe 
                title="Company Location"
                width="100%" 
                height="160" 
                frameBorder="0" 
                scrolling="no" 
                marginHeight="0" 
                marginWidth="0" 
                src={`https://maps.google.com/maps?q=${encodeURIComponent(formData.address || `${formData.latitude},${formData.longitude}`)}&t=h&z=19&ie=UTF8&iwloc=&output=embed`}
              />
            </div>

            <div className="form-row-double mt-4">
              <div className="form-input-group">
                <label>Latitude</label>
                <input 
                  type="text" 
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                  placeholder="37.4419" 
                />
              </div>
              <div className="form-input-group">
                <label>Longitude</label>
                <input 
                  type="text" 
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                  placeholder="-122.1430" 
                />
              </div>
            </div>

            {renderSummaryTable([
              { label: 'Address', value: formData.address || 'Not set' },
              { label: 'Latitude', value: formData.latitude || 'Not set' },
              { label: 'Longitude', value: formData.longitude || 'Not set' },
            ])}
          </div>
        </div>

        {/* Working Hours */}
        <div className="settings-section-card">
          <div className="card-header-icon">
            <Clock className="header-icon" size={24} />
            <div>
              <h3>Business Availability</h3>
              <p>Define business availability and service hours</p>
            </div>
          </div>
          
          <div className="working-hours-list">
            {formData.workingHours.map((hour, idx) => (
              <div key={hour.day} className="day-config-row">
                <div className="day-info">
                  <span className="day-name">{hour.day}</span>
                  <div className="time-inputs">
                    <input 
                      type="time" 
                      value={hour.start} 
                      disabled={!hour.isOpen || !isEditing}
                      onChange={(e) => handleHourChange(idx, 'start', e.target.value)}
                    />
                    <span className="time-separator">to</span>
                    <input 
                      type="time" 
                      value={hour.end} 
                      disabled={!hour.isOpen || !isEditing}
                      onChange={(e) => handleHourChange(idx, 'end', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="day-status-toggle">
                  <span style={{ fontSize: '0.8rem', color: hour.isOpen ? '#10B981' : '#64748B', fontWeight: 600 }}>
                    {hour.isOpen ? 'Open' : 'Closed'}
                  </span>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={hour.isOpen} 
                      disabled={!isEditing}
                      onChange={(e) => handleHourChange(idx, 'isOpen', e.target.checked)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanySettingsTab;


