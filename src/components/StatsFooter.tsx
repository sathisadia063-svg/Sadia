import React from 'react';
import { Download, ShieldCheck, Zap, Server, Globe, Heart } from 'lucide-react';
import { ThemeMode } from '../types';
import { Language, translations } from '../utils/translations';

interface StatsFooterProps {
  lang: Language;
  setLang: (lang: Language) => void;
  totalApks: number;
  totalDownloads: number;
  onOpenUpload: () => void;
  theme?: ThemeMode;
}

export const StatsFooter: React.FC<StatsFooterProps> = ({
  lang,
  setLang,
  totalApks,
  totalDownloads,
  onOpenUpload,
  theme = 'dark',
}) => {
  const t = translations[lang];
  const isDark = theme === 'dark';

  return (
    <footer className={`border-t text-xs py-10 px-4 transition-colors ${
      isDark ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
    }`}>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: About */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-lg border flex items-center justify-center ${
                isDark ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' : 'bg-emerald-100 border-emerald-200 text-emerald-700'
              }`}>
                <Download className="w-4 h-4" />
              </div>
              <span className={`text-base font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{t.siteTitle}</span>
            </div>
            <p className={`text-xs max-w-md leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {lang === 'bn'
                ? 'আপনার পছন্দের যেকোনো অ্যান্ড্রয়েড এপিকে (APK) ড্র্যাগ-এন্ড-ড্রপ করে আপলোড করুন এবং যেকোনো ডিভাইস থেকে হাই-স্পিড ডাইরেক্ট ডাউনলোড উপভোগ করুন।'
                : 'Upload any Android APK file effortlessly and share direct high-speed download links across all devices.'}
            </p>

            <div className={`flex items-center gap-2 pt-1 font-semibold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
              <Zap className="w-4 h-4 fill-emerald-500 text-emerald-500" />
              <span>{t.fastSpeed}</span>
            </div>
          </div>

          {/* Col 2: Live Metrics */}
          <div className="space-y-2">
            <h4 className={`font-bold uppercase tracking-wider text-[11px] ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
              {lang === 'bn' ? 'নেটওয়ার্ক স্টেটাস' : 'Network Metrics'}
            </h4>
            <ul className={`space-y-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              <li className="flex items-center justify-between">
                <span>{lang === 'bn' ? 'হোস্টেড ফাইল:' : 'Hosted Files:'}</span>
                <strong className={isDark ? 'text-slate-200' : 'text-slate-900'}>{totalApks} APKs</strong>
              </li>
              <li className="flex items-center justify-between">
                <span>{lang === 'bn' ? 'মোট ডাউনলোড:' : 'Total Downloads:'}</span>
                <strong className={isDark ? 'text-emerald-400' : 'text-emerald-600'}>
                  {totalDownloads > 1000 ? `${(totalDownloads / 1000).toFixed(1)}K` : totalDownloads}
                </strong>
              </li>
              <li className="flex items-center justify-between">
                <span>{lang === 'bn' ? 'সার্ভার স্পিড:' : 'Server Speed:'}</span>
                <strong className={isDark ? 'text-amber-400' : 'text-amber-600'}>120 MB/s CDN</strong>
              </li>
              <li className="flex items-center justify-between">
                <span>{lang === 'bn' ? 'আপটাইম:' : 'Uptime:'}</span>
                <strong className={isDark ? 'text-teal-400' : 'text-teal-600'}>99.98%</strong>
              </li>
            </ul>
          </div>

          {/* Col 3: Actions */}
          <div className="space-y-3">
            <h4 className={`font-bold uppercase tracking-wider text-[11px] ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
              {lang === 'bn' ? 'দ্রুত নেভিগেশন' : 'Quick Actions'}
            </h4>
            <div className="flex flex-col gap-2">
              <button
                onClick={onOpenUpload}
                className={`border font-bold px-3 py-2 rounded-xl text-xs transition text-left cursor-pointer flex items-center justify-between ${
                  isDark
                    ? 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
                    : 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-700'
                }`}
              >
                <span>{t.uploadApk}</span>
                <Zap className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
                className={`border px-3 py-2 rounded-xl text-xs transition text-left cursor-pointer flex items-center justify-between ${
                  isDark
                    ? 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300'
                    : 'bg-white hover:bg-slate-200 border-slate-300 text-slate-700'
                }`}
              >
                <span>{lang === 'bn' ? 'Switch to English' : 'বাংলা ভাষায় দেখুন'}</span>
                <Globe className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className={`pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] ${
          isDark ? 'border-slate-900 text-slate-500' : 'border-slate-200 text-slate-500'
        }`}>
          <p>© {new Date().getFullYear()} {t.siteTitle}. All rights reserved.</p>
          <div className="flex items-center gap-1 text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>100% Virus Free Direct Downloads</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
