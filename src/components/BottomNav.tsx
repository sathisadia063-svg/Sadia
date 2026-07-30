import React from 'react';
import { Home, Smartphone, Bot, Sliders, GraduationCap } from 'lucide-react';
import { Language, translations } from '../utils/translations';
import { ThemeMode } from '../types';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  lang: Language;
  theme?: ThemeMode;
  isInstallGuideOpen?: boolean;
  onOpenInstallGuide: () => void;
  onOpenTelegram?: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  lang,
  theme = 'dark',
  isInstallGuideOpen = false,
  onOpenInstallGuide,
  onOpenTelegram,
}) => {
  const t = translations[lang];
  const isDark = theme === 'dark';

  const navItems = [
    {
      id: 'home',
      label: t.home,
      icon: Home,
      isActive: !isInstallGuideOpen && (activeTab === 'All' || activeTab === 'home'),
      action: () => setActiveTab('home'),
    },
    {
      id: 'apps',
      label: t.apps,
      icon: Smartphone,
      isActive: !isInstallGuideOpen && activeTab === 'Apps',
      action: () => setActiveTab('Apps'),
    },
    {
      id: 'aiPrompt',
      label: t.aiPrompt,
      icon: Bot,
      isActive: !isInstallGuideOpen && (activeTab === 'Tools' || activeTab === 'aiPrompt'),
      action: () => setActiveTab('Tools'),
    },
    {
      id: 'preset',
      label: t.preset,
      icon: Sliders,
      isActive: !isInstallGuideOpen && (activeTab === 'Productivity' || activeTab === 'preset'),
      action: () => setActiveTab('Productivity'),
    },
    {
      id: 'tutorial',
      label: t.tutorial,
      icon: GraduationCap,
      isActive: isInstallGuideOpen,
      action: onOpenInstallGuide,
    },
  ];

  return (
    <div className="fixed bottom-3 inset-x-0 z-40 flex justify-center px-3 pointer-events-none">
      <nav
        className={`pointer-events-auto flex items-center justify-around gap-1 p-2 rounded-3xl border shadow-2xl backdrop-blur-xl transition-all max-w-lg w-full ${
          isDark
            ? 'bg-slate-900/95 border-slate-800 text-slate-300 shadow-emerald-500/10'
            : 'bg-white/95 border-slate-200 text-slate-700 shadow-slate-300/50'
        }`}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.isActive;

          return (
            <button
              key={item.id}
              onClick={item.action}
              className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-2xl transition duration-200 cursor-pointer text-center group relative ${
                isActive
                  ? isDark
                    ? 'bg-emerald-500/20 text-emerald-400 font-bold shadow-xs'
                    : 'bg-emerald-100/90 text-emerald-800 font-bold shadow-xs'
                  : isDark
                  ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              <div
                className={`p-1 rounded-xl transition ${
                  isActive
                    ? isDark
                      ? 'bg-emerald-500/25 text-emerald-400 scale-110'
                      : 'bg-emerald-200 text-emerald-800 scale-110'
                    : ''
                }`}
              >
                <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive ? 'text-emerald-500 stroke-[2.5]' : ''}`} />
              </div>
              <span className={`text-[10px] sm:text-[11px] leading-none mt-1 whitespace-nowrap ${
                isActive ? 'font-black text-emerald-400' : 'font-medium'
              }`}>
                {item.label}
              </span>
              {isActive && (
                <span className="absolute -bottom-1 w-2 h-1 bg-emerald-500 rounded-full shadow-xs"></span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
