import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  Lock,
  KeyRound,
  LogOut,
  Upload,
  Trash2,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  Crown
} from 'lucide-react';
import { APKItem, ThemeMode } from '../types';
import { Language, translations } from '../utils/translations';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAdmin: boolean;
  onLogin: (password: string) => boolean;
  onLogout: () => void;
  onChangePassword: (newPass: string) => void;
  onOpenUpload: () => void;
  apks: APKItem[];
  onDeleteApk: (id: string, e?: React.MouseEvent) => void;
  lang: Language;
  theme?: ThemeMode;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  isAdmin,
  onLogin,
  onLogout,
  onChangePassword,
  onOpenUpload,
  apks,
  onDeleteApk,
  lang,
  theme = 'dark',
}) => {
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Change Password form state
  const [showChangePass, setShowChangePass] = useState(false);
  const [newPass, setNewPass] = useState('');
  const [passSuccess, setPassSuccess] = useState(false);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const t = translations[lang];
  const isDark = theme === 'dark';

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setPasswordInput('');
      setErrorMsg('');
      setPassSuccess(false);
      setShowChangePass(false);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const success = onLogin(passwordInput);
    if (!success) {
      setErrorMsg(t.invalidPassword);
    }
  };

  const handleChangePassSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPass.trim()) return;
    onChangePassword(newPass.trim());
    setNewPass('');
    setPassSuccess(true);
    setTimeout(() => setPassSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-md animate-fadeIn"
      />

      {/* Modal Container */}
      <div
        className={`relative w-full max-w-lg rounded-3xl p-5 sm:p-6 shadow-2xl border transition-all duration-300 max-h-[90vh] flex flex-col z-10 overflow-hidden ${
          isDark
            ? 'bg-slate-900 border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between pb-4 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-2xl flex items-center justify-center ${
              isAdmin
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
            }`}>
              {isAdmin ? <Crown className="w-5 h-5 text-amber-400" /> : <Lock className="w-5 h-5 text-emerald-400" />}
            </div>
            <div>
              <h2 className="font-extrabold text-base sm:text-lg leading-tight">
                {isAdmin ? t.adminPanel : t.adminLogin}
              </h2>
              <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {isAdmin ? t.adminModeActive : t.adminOnlyUploadNotice}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-2xl transition cursor-pointer ${
              isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-5 no-scrollbar">
          {!isAdmin ? (
            /* --- LOGIN FORM --- */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className={`p-4 rounded-2xl border text-xs leading-relaxed flex items-start gap-3 ${
                isDark ? 'bg-slate-800/50 border-slate-700/60 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}>
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">{t.adminLoginPrompt}</p>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className={`block text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  {t.adminPassword}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="পাসওয়ার্ড দিন..."
                    autoFocus
                    required
                    className={`w-full pl-3.5 pr-10 py-3 rounded-2xl text-xs font-medium border outline-none transition ${
                      isDark
                        ? 'bg-slate-950 border-slate-800 text-white focus:border-emerald-500'
                        : 'bg-white border-slate-300 text-slate-900 focus:border-emerald-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold py-3.5 rounded-2xl text-xs sm:text-sm transition cursor-pointer shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 mt-2"
              >
                <KeyRound className="w-4 h-4 stroke-[2.5]" />
                <span>{t.login}</span>
              </button>
            </form>
          ) : (
            /* --- ADMIN DASHBOARD PANEL --- */
            <div className="space-y-5">
              {/* Quick Actions Grid */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    onClose();
                    onOpenUpload();
                  }}
                  className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-slate-950 font-extrabold text-xs flex flex-col items-center justify-center gap-2 shadow-md hover:opacity-95 transition cursor-pointer"
                >
                  <Upload className="w-6 h-6 stroke-[2.5]" />
                  <span>{t.uploadApk}</span>
                </button>

                <button
                  onClick={() => setShowChangePass(!showChangePass)}
                  className={`p-4 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center gap-2 transition cursor-pointer ${
                    isDark
                      ? 'bg-slate-800/80 border-slate-700 hover:bg-slate-800 text-slate-200'
                      : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  <KeyRound className="w-6 h-6 text-amber-400" />
                  <span>{t.changePassword}</span>
                </button>
              </div>

              {/* Password Change Form */}
              {showChangePass && (
                <form onSubmit={handleChangePassSubmit} className={`p-4 rounded-2xl border space-y-3 animate-fadeIn ${
                  isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <h4 className="text-xs font-bold flex items-center gap-1.5 text-amber-400">
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>{t.changePassword}</span>
                  </h4>

                  {passSuccess && (
                    <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      <span>{t.passwordChanged}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <input
                      type="password"
                      value={newPass}
                      onChange={(e) => setNewPass(e.target.value)}
                      placeholder={t.newPassword}
                      required
                      className={`flex-1 px-3 py-2 rounded-xl text-xs border outline-none ${
                        isDark
                          ? 'bg-slate-900 border-slate-700 text-white focus:border-emerald-500'
                          : 'bg-white border-slate-300 text-slate-900 focus:border-emerald-500'
                      }`}
                    />
                    <button
                      type="submit"
                      className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition cursor-pointer shrink-0"
                    >
                      {t.savePassword}
                    </button>
                  </div>
                </form>
              )}

              {/* APK Management List */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">
                    {t.manageApks} ({apks.length})
                  </h3>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-1 no-scrollbar">
                  {apks.length === 0 ? (
                    <p className={`text-xs text-center py-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      {t.noApksFound}
                    </p>
                  ) : (
                    apks.map((apk) => (
                      <div
                        key={`admin-apk-${apk.id}`}
                        className={`p-2.5 rounded-2xl border flex items-center justify-between gap-3 ${
                          isDark ? 'bg-slate-800/50 border-slate-700/60' : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={apk.iconUrl}
                            alt={apk.title}
                            className="w-9 h-9 rounded-xl object-cover shrink-0 border border-black/10"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=160&q=80';
                            }}
                          />
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold truncate leading-tight">{apk.title}</h4>
                            <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                              {apk.size} • v{apk.version}
                            </p>
                          </div>
                        </div>

                        {deletingId === apk.id ? (
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => setDeletingId(null)}
                              className="px-2 py-1 rounded-lg text-[10px] font-bold bg-slate-700 text-white"
                            >
                              {t.close}
                            </button>
                            <button
                              onClick={(e) => {
                                onDeleteApk(apk.id, e);
                                setDeletingId(null);
                              }}
                              className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-rose-600 text-white"
                            >
                              {t.deleteApk}
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeletingId(apk.id)}
                            className="p-2 rounded-xl bg-rose-500/15 text-rose-400 hover:bg-rose-500 hover:text-white transition cursor-pointer shrink-0"
                            title={t.deleteApk}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className={`w-full py-3 rounded-2xl border text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                  isDark
                    ? 'border-slate-800 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/30'
                    : 'border-slate-200 text-slate-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200'
                }`}
              >
                <LogOut className="w-4 h-4" />
                <span>{t.adminLogout}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
