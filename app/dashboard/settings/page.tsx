'use client';

import { useState, useEffect } from 'react';
import { 
  Settings, User, Bell, Shield, Database, 
  Globe, Moon, Sun, Save, ChevronRight,
  CreditCard, Key, Mail, Phone, Lock, Eye, EyeOff, CheckCircle2, AlertCircle, Plus, MoreHorizontal
} from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';

export default function SettingsPage() {
  const { user } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1000);
  };

  if (!isMounted || !user) return null;

  return (
    <div className="flex-1 p-6 md:p-10 bg-[#F8FAFB] overflow-y-auto">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight font-headline">Settings</h2>
          <p className="text-slate-500 font-medium text-sm mt-1">Manage your account preferences, clinic integrations, and security settings.</p>
        </div>
        <div className="flex items-center gap-4">
          {saveSuccess && (
            <span className="text-sm font-bold text-teal-600 flex items-center gap-2 animate-in fade-in slide-in-from-right-4">
              <CheckCircle2 className="w-4 h-4" />
              Saved successfully
            </span>
          )}
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2 bg-teal-800 text-white rounded-xl text-sm font-bold hover:bg-teal-900 transition-all shadow-lg shadow-teal-900/20 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Settings Navigation */}
        <aside className="lg:col-span-1 space-y-2">
          {[
            { id: 'profile', name: 'Profile', icon: User },
            { id: 'notifications', name: 'Notifications', icon: Bell },
            { id: 'security', name: 'Security', icon: Shield },
            { id: 'integrations', name: 'PMS Integrations', icon: Database },
            { id: 'billing', name: 'Billing & Plans', icon: CreditCard },
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === item.id 
                  ? 'bg-teal-800 text-white shadow-md' 
                  : 'text-slate-500 hover:bg-white hover:shadow-sm'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </button>
          ))}
        </aside>

        {/* Settings Content */}
        <div className="lg:col-span-3 space-y-8">
          {activeTab === 'profile' && (
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-xl font-bold text-slate-900 font-headline mb-8">Profile Information</h3>
              <div className="space-y-6">
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-24 h-24 rounded-full bg-teal-100 flex items-center justify-center text-teal-800 text-3xl font-bold border-4 border-white shadow-lg">
                    {user.email?.charAt(0).toUpperCase() || 'A'}
                  </div>
                  <div>
                    <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all shadow-sm">
                      Upload Photo
                    </button>
                    <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-widest">JPG, GIF or PNG. Max size of 800K</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">First Name</label>
                    <input 
                      type="text" 
                      defaultValue={user.email?.split('@')[0].split('.')[0] || 'Admin'} 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last Name</label>
                    <input 
                      type="text" 
                      defaultValue={user.email?.split('@')[0].split('.')[1] || 'User'} 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="email" 
                        defaultValue={user.email || ''} 
                        disabled
                        className="w-full pl-12 pr-4 py-3 bg-slate-100 border border-slate-200 rounded-2xl text-sm font-medium text-slate-500 cursor-not-allowed"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="tel" 
                        placeholder="+1 (555) 000-0000" 
                        defaultValue="+1 (415) 555-0198"
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Job Title</label>
                    <input 
                      type="text" 
                      defaultValue="Revenue Cycle Director" 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-xl font-bold text-slate-900 font-headline mb-8">Security Settings</h3>
              
              <div className="space-y-8">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-teal-600" />
                    Change Password
                  </h4>
                  <div className="space-y-4 max-w-md">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Current Password</label>
                      <div className="relative">
                        <input 
                          type={showPassword ? "text" : "password"} 
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none"
                        />
                        <button 
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">New Password</label>
                      <input 
                        type={showPassword ? "text" : "password"} 
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none"
                      />
                    </div>
                    <button className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all">
                      Update Password
                    </button>
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-100">
                  <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-teal-600" />
                    Two-Factor Authentication (2FA)
                  </h4>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <div>
                      <p className="text-sm font-bold text-slate-900">Authenticator App</p>
                      <p className="text-xs text-slate-500 mt-1">Use an app like Google Authenticator or Authy to generate codes.</p>
                    </div>
                    <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all shadow-sm">
                      Enable
                    </button>
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-100">
                  <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Key className="w-4 h-4 text-teal-600" />
                    Active Sessions
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-teal-50/50 rounded-2xl border border-teal-100">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                          <Globe className="w-5 h-5 text-teal-600" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">Mac OS • Chrome</p>
                          <p className="text-[10px] text-teal-600 font-bold uppercase tracking-widest mt-0.5">Current Session • San Francisco, CA</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-50 rounded-lg">
                          <Globe className="w-5 h-5 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">iOS • Safari</p>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Last active 2 hours ago • San Francisco, CA</p>
                        </div>
                      </div>
                      <button className="text-[10px] font-bold uppercase tracking-widest text-red-600 hover:underline">Revoke</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'integrations' && (
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 font-headline">PMS Integrations</h3>
                  <p className="text-sm text-slate-500 mt-1">Connect RevRecover AI to your Practice Management System.</p>
                </div>
                <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all">
                  Add Integration
                </button>
              </div>
              
              <div className="space-y-4">
                {[
                  { name: 'Epic Systems', status: 'Connected', lastSync: '2 mins ago', icon: Database, desc: 'Full bi-directional sync enabled.' },
                  { name: 'Cerner', status: 'Available', lastSync: 'N/A', icon: Database, desc: 'Requires API key configuration.' },
                  { name: 'Athenahealth', status: 'Available', lastSync: 'N/A', icon: Database, desc: 'OAuth 2.0 connection supported.' },
                ].map((pms, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-slate-50/50 rounded-[2rem] border border-slate-100 hover:bg-white hover:shadow-md transition-all group gap-4">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-2xl shrink-0 ${pms.status === 'Connected' ? 'bg-teal-50 text-teal-600' : 'bg-slate-100 text-slate-400'}`}>
                        <pms.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900">{pms.name}</h4>
                          {pms.status === 'Connected' && (
                            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-teal-700 bg-teal-100 px-2 py-0.5 rounded-md">
                              <CheckCircle2 className="w-3 h-3" /> Active
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{pms.desc}</p>
                        {pms.status === 'Connected' && (
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">Last Sync: {pms.lastSync}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:self-center self-start ml-14 sm:ml-0">
                      {pms.status === 'Connected' && (
                        <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-[10px] uppercase tracking-widest font-bold hover:bg-slate-50 transition-all">
                          Settings
                        </button>
                      )}
                      <button className={`px-4 py-2 rounded-xl text-[10px] uppercase tracking-widest font-bold transition-all ${
                        pms.status === 'Connected' 
                          ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' 
                          : 'bg-teal-600 text-white hover:bg-teal-700 shadow-md shadow-teal-900/10'
                      }`}>
                        {pms.status === 'Connected' ? 'Disconnect' : 'Connect'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-sm font-bold text-blue-900">Need a custom integration?</h5>
                  <p className="text-xs text-blue-700 mt-1 leading-relaxed">Our engineering team can build custom connectors for legacy or proprietary systems. Contact support to discuss your requirements.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-xl font-bold text-slate-900 font-headline mb-8">Notification Preferences</h3>
              
              <div className="space-y-8">
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 mb-4 uppercase tracking-widest">Email Notifications</h4>
                  <div className="space-y-2">
                    {[
                      { title: 'High-Yield Opportunities', desc: 'Get notified when AI detects recovery cases over $10k.', default: true },
                      { title: 'Compliance Alerts', desc: 'Immediate alerts for potential HIPAA or billing gaps.', default: true },
                      { title: 'Weekly Performance Reports', desc: 'Summary of network-wide recovery yield.', default: false },
                      { title: 'System Updates', desc: 'New AI model deployments and feature releases.', default: true },
                    ].map((pref, i) => (
                      <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:bg-white transition-colors gap-4">
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">{pref.title}</h4>
                          <p className="text-xs text-slate-500 mt-1">{pref.desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer sm:ml-4 shrink-0 self-start sm:self-center">
                          <input type="checkbox" className="sr-only peer" defaultChecked={pref.default} />
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 mb-4 uppercase tracking-widest">In-App Notifications</h4>
                  <div className="space-y-2">
                    {[
                      { title: 'New Claim Denials', desc: 'Alert when a high-value claim is denied.', default: true },
                      { title: 'Patient Payment Received', desc: 'Notification for successful patient payments.', default: true },
                      { title: 'AI Negotiation Complete', desc: 'When the AI finishes a negotiation sequence.', default: true },
                    ].map((pref, i) => (
                      <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:bg-white transition-colors gap-4">
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">{pref.title}</h4>
                          <p className="text-xs text-slate-500 mt-1">{pref.desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer sm:ml-4 shrink-0 self-start sm:self-center">
                          <input type="checkbox" className="sr-only peer" defaultChecked={pref.default} />
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-xl font-bold text-slate-900 font-headline mb-8">Billing & Plans</h3>
              
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-8 text-white mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Shield className="w-32 h-32 -mr-8 -mt-8" />
                </div>
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-[10px] uppercase tracking-widest font-bold mb-4">
                    <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                    Enterprise Plan
                  </div>
                  <div className="flex items-end gap-2 mb-2">
                    <span className="text-4xl font-extrabold">$2,499</span>
                    <span className="text-slate-400 font-medium mb-1">/month</span>
                  </div>
                  <p className="text-sm text-slate-300 mb-6 max-w-md">Includes unlimited AI recovery campaigns, full PMS integration, and dedicated account management.</p>
                  
                  <div className="flex gap-3">
                    <button className="px-5 py-2.5 bg-white text-slate-900 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all">
                      Manage Plan
                    </button>
                    <button className="px-5 py-2.5 bg-white/10 text-white rounded-xl text-sm font-bold hover:bg-white/20 transition-all">
                      View Invoices
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-[10px] font-bold text-slate-400 mb-4 uppercase tracking-widest">Payment Methods</h4>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200 mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-8 bg-white rounded shadow-sm border border-slate-200 flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">•••• •••• •••• 4242</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-0.5">Expires 12/2025</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-teal-700 bg-teal-100 px-2 py-1 rounded-md uppercase tracking-widest">Default</span>
                    <button className="text-slate-400 hover:text-slate-600">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <button className="text-[10px] uppercase tracking-widest font-bold text-teal-600 hover:underline flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Add Payment Method
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
