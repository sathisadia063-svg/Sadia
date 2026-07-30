import React, { useState, useEffect } from 'react';
import { Download, Upload, Search, ShieldCheck, Zap, Globe, Sparkles, Sun, Moon, Menu, Send, Settings, X, Crown, KeyRound } from 'lucide-react';
import { Language, translations } from '../utils/translations';
import { APKCategory, ThemeMode } from '../types';

interface NavbarProps {
  lang: Language;
  setLang: (lang: Language) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  onOpenUpload: () => void;
  onOpenInstallGuide: () => void;
  serverSpeedMbps: number;
  isAdmin?: boolean;
  onOpenAdmin?: () => void;
}

const CATEGORIES: { labelKey: keyof typeof translations.bn; value: string }[] = [
  { labelKey: 'allCategories', value: 'All' },
  { labelKey: 'apps', value: 'Apps' },
  { labelKey: 'games', value: 'Games' },
  { labelKey: 'tools', value: 'Tools' },
  { labelKey: 'productivity', value: 'Productivity' },
  { labelKey: 'social', value: 'Social' },
  { labelKey: 'entertainment', value: 'Entertainment' },
];

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  setLang,
  theme,
  setTheme,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  onOpenUpload,
  onOpenInstallGuide,
  serverSpeedMbps,
  isAdmin = false,
  onOpenAdmin,
}) => {
  const t = translations[lang];
  const isDark = theme === 'dark';
  const [showMenuDrawer, setShowMenuDrawer] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  useEffect(() => {
    if (showMenuDrawer || showSettingsModal) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [showMenuDrawer, showSettingsModal]);

  return (
    <header className={`sticky top-0 z-40 backdrop-blur-xl border-b transition-colors ${
      isDark
        ? 'bg-slate-900/95 border-slate-800 text-slate-100'
        : 'bg-white/95 border-slate-200 text-slate-800 shadow-xs'
    }`}>
      {/* Top Banner Row */}
      <div className="max-w-7xl mx-auto px-4 py-2.5">
        <div className="flex items-center justify-between gap-3">
          {/* Left: Hamburger Menu + Site Logo & Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowMenuDrawer(!showMenuDrawer)}
              className={`p-2 rounded-xl transition cursor-pointer ${
                isDark ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-slate-100 text-slate-800'
              }`}
              title="Menu"
            >
              <Menu className="w-6 h-6 stroke-[2.5]" />
            </button>

            {/* Site Title - Keeping Website Name exact as requested! */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-md flex items-center justify-center">
                <div className={`w-full h-full rounded-[9px] flex items-center justify-center ${isDark ? 'bg-slate-950' : 'bg-slate-900'}`}>
                  <Download className="w-4 h-4 text-emerald-400" />
                </div>
              </div>
              <h1 className={`text-base sm:text-lg font-black tracking-wider uppercase bg-gradient-to-r bg-clip-text text-transparent ${
                isDark ? 'from-white via-slate-100 to-emerald-400' : 'from-slate-900 via-emerald-800 to-emerald-600'
              }`}>
                {t.siteTitle}
              </h1>
            </div>
          </div>

          {/* Right Action Buttons (Telegram + Direct Theme Toggle icon) */}
          <div className="flex items-center gap-2">
            {/* Telegram Channel Icon */}
            <a
              href="https://t.me"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-teal-500/10 hover:bg-teal-500/20 text-teal-500 flex items-center justify-center transition border border-teal-500/20 cursor-pointer shadow-xs"
              title={t.telegramChannel}
            >
              <Send className="w-4 h-4 -mr-0.5" />
            </a>

            {/* Admin Panel Button */}
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className={`h-9 px-3 rounded-full flex items-center gap-1.5 transition cursor-pointer text-xs font-bold border shadow-xs ${
                  isAdmin
                    ? 'bg-amber-500/15 border-amber-500/30 text-amber-400 hover:bg-amber-500/25'
                    : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/20'
                }`}
                title={isAdmin ? t.adminPanel : t.adminLogin}
              >
                {isAdmin ? <Crown className="w-4 h-4 text-amber-400" /> : <KeyRound className="w-4 h-4 text-emerald-500" />}
                <span className="hidden sm:inline">{isAdmin ? t.adminPanel : t.adminLogin}</span>
              </button>
            )}

            {/* Direct Theme Toggle Icon (Marked in User Screenshot) */}
            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className="w-9 h-9 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 flex items-center justify-center transition border border-emerald-500/20 cursor-pointer shadow-xs"
              title={isDark ? t.lightTheme : t.darkTheme}
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400 fill-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-emerald-600 fill-emerald-600" />
              )}
            </button>
          </div>
        </div>

        {/* Search Input Bar */}
        <div className="mt-2.5">
          <div className="relative max-w-2xl mx-auto">
            <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className={`w-full border rounded-2xl pl-10 pr-8 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all ${
                isDark
                  ? 'bg-slate-800/90 border-slate-700/80 focus:border-emerald-500 text-slate-100 placeholder-slate-400'
                  : 'bg-slate-100/90 border-slate-200 focus:border-emerald-500 text-slate-900 placeholder-slate-500'
              }`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs px-1.5 py-0.5 rounded cursor-pointer ${
                  isDark ? 'text-slate-400 hover:text-slate-200 bg-slate-700' : 'text-slate-500 hover:text-slate-800 bg-slate-200'
                }`}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Categories Tab Bar with Green Active Underline (Screenshot style) */}
        <div className="flex items-center gap-6 overflow-x-auto pt-3 pb-1 no-scrollbar text-xs border-t border-slate-800/40 mt-3">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.value;
            const catLabel = t[cat.labelKey] || cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`relative pb-2 font-extrabold uppercase tracking-wide whitespace-nowrap transition cursor-pointer ${
                  isSelected
                    ? isDark
                      ? 'text-emerald-400'
                      : 'text-emerald-600'
                    : isDark
                    ? 'text-slate-400 hover:text-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{catLabel}</span>
                {isSelected && (
                  <span className="absolute bottom-0 inset-x-0 h-0.5 bg-emerald-500 rounded-full shadow-sm shadow-emerald-500"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Menu Side Drawer */}
      {showMenuDrawer && (
        <div className="fixed inset-0 z-[100] flex">
          {/* Opaque dark backdrop overlay */}
          <div
            onClick={() => setShowMenuDrawer(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[101]"
          ></div>

          {/* Drawer Content Panel - Solid background with full screen height */}
          <div className={`relative z-[102] w-72 max-w-[85vw] h-full min-h-screen p-5 flex flex-col justify-between shadow-2xl overflow-y-auto border-r ${
            isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="space-y-5">
              {/* Drawer Header */}
              <div className={`flex items-center justify-between border-b pb-4 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-md flex items-center justify-center">
                    <div className={`w-full h-full rounded-[9px] flex items-center justify-center ${isDark ? 'bg-slate-950' : 'bg-slate-900'}`}>
                      <Download className="w-4 h-4 text-emerald-400" />
                    </div>
                  </div>
                  <h3 className="font-extrabold text-sm uppercase tracking-wider">{t.siteTitle}</h3>
                </div>
                <button
                  onClick={() => setShowMenuDrawer(false)}
                  className={`p-1.5 rounded-xl transition cursor-pointer ${
                    isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Category List with solid backgrounds */}
              <div className="space-y-1 text-xs">
                <p className={`text-[10px] font-bold uppercase tracking-wider px-3 mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {t.allCategories}
                </p>
                {CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat.value;
                  const catLabel = t[cat.labelKey] || cat.value;
                  return (
                    <button
                      key={cat.value}
                      onClick={() => {
                        setSelectedCategory(cat.value);
                        setShowMenuDrawer(false);
                      }}
                      className={`w-full text-left font-bold px-3.5 py-2.5 rounded-xl transition cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-sm'
                          : isDark
                          ? 'hover:bg-slate-800 text-slate-300'
                          : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <span>{catLabel}</span>
                      {isSelected && <span className="w-2 h-2 rounded-full bg-slate-950"></span>}
                    </button>
                  );
                })}
              </div>

              {/* Navigation Options inside drawer */}
              <div className={`pt-3 border-t space-y-1.5 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                {/* Admin Panel Link */}
                {onOpenAdmin && (
                  <button
                    onClick={() => {
                      setShowMenuDrawer(false);
                      onOpenAdmin();
                    }}
                    className={`w-full text-left font-semibold px-3.5 py-2.5 rounded-xl text-xs flex items-center justify-between transition cursor-pointer ${
                      isAdmin
                        ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 font-bold'
                        : isDark ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      {isAdmin ? <Crown className="w-4 h-4 text-amber-400" /> : <KeyRound className="w-4 h-4 text-emerald-400" />}
                      <span>{isAdmin ? t.adminPanel : t.adminLogin}</span>
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                      isAdmin ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {isAdmin ? 'Active' : 'Login'}
                    </span>
                  </button>
                )}

                {/* Install Guide button */}
                <button
                  onClick={() => {
                    setShowMenuDrawer(false);
                    onOpenInstallGuide();
                  }}
                  className={`w-full text-left font-semibold px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-2.5 transition cursor-pointer ${
                    isDark ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>{t.howToInstall}</span>
                </button>

                {/* Switch Language */}
                <button
                  onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
                  className={`w-full text-left font-semibold px-3.5 py-2.5 rounded-xl text-xs flex items-center justify-between transition cursor-pointer ${
                    isDark ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Globe className="w-4 h-4 text-teal-400" />
                    <span>Language</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-teal-500/20 text-teal-400 font-bold">
                    {lang === 'bn' ? 'English' : 'বাংলা'}
                  </span>
                </button>

                {/* Theme Toggle */}
                <button
                  onClick={() => setTheme(isDark ? 'light' : 'dark')}
                  className={`w-full text-left font-semibold px-3.5 py-2.5 rounded-xl text-xs flex items-center justify-between transition cursor-pointer ${
                    isDark ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-emerald-600" />}
                    <span>{t.themeMode}</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold">
                    {isDark ? t.darkTheme : t.lightTheme}
                  </span>
                </button>
              </div>
            </div>

            {/* Bottom Action: Upload APK */}
            <div className="pt-4 mt-auto">
              <button
                onClick={() => {
                  setShowMenuDrawer(false);
                  onOpenUpload();
                }}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold py-3 rounded-2xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition"
              >
                <Upload className="w-4 h-4 stroke-[2.5]" />
                <span>{t.uploadApk}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className={`relative w-full max-w-sm rounded-3xl p-5 border shadow-2xl space-y-4 ${
            isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between border-b pb-3 border-slate-800">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Settings className="w-4 h-4 text-emerald-500" />
                <span>{t.themeMode} / Settings</span>
              </h3>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {/* Theme Toggle */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/40 border border-slate-700/50">
                <span className="font-semibold">{t.themeMode}</span>
                <button
                  onClick={() => setTheme(isDark ? 'light' : 'dark')}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                  <span>{isDark ? t.lightTheme : t.darkTheme}</span>
                </button>
              </div>

              {/* Language Switcher */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/40 border border-slate-700/50">
                <span className="font-semibold">Language</span>
                <button
                  onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
                  className="px-3 py-1.5 rounded-xl bg-teal-500 text-white font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? 'English' : 'বাংলা'}</span>
                </button>
              </div>

              {/* Upload APK button */}
              <button
                onClick={() => {
                  setShowSettingsModal(false);
                  onOpenUpload();
                }}
                className="w-full mt-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 rounded-2xl text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>{t.uploadApk}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
