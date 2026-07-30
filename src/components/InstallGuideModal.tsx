import React, { useEffect } from 'react';
import { X, Smartphone, ShieldAlert, CheckCircle2, FileDown, Settings } from 'lucide-react';
import { ThemeMode } from '../types';
import { Language, translations } from '../utils/translations';

interface InstallGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  theme?: ThemeMode;
}

export const InstallGuideModal: React.FC<InstallGuideModalProps> = ({
  isOpen,
  onClose,
  lang,
  theme = 'dark',
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const t = translations[lang];
  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md">
      <div className={`relative w-full max-w-lg border rounded-3xl shadow-2xl overflow-hidden p-6 space-y-5 transition-colors ${
        isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between border-b pb-4 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${
              isDark ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-600'
            }`}>
              <Smartphone className="w-5 h-5" />
            </div>
            <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{t.howToInstall}</h2>
          </div>

          <button
            onClick={onClose}
            className={`p-1.5 rounded-xl transition cursor-pointer ${
              isDark ? 'text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700' : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps List */}
        <div className="space-y-4 text-xs">
          {/* Step 1 */}
          <div className={`flex items-start gap-3 border p-3.5 rounded-2xl ${
            isDark ? 'bg-slate-800/60 border-slate-700/60' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className={`w-7 h-7 rounded-xl font-extrabold flex items-center justify-center shrink-0 ${
              isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700'
            }`}>
              1
            </div>
            <div className="space-y-0.5">
              <h3 className={`font-bold flex items-center gap-1.5 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                <FileDown className="w-3.5 h-3.5 text-emerald-500" />
                {lang === 'bn' ? 'ফাইল ডাউনলোড করুন' : 'Download APK File'}
              </h3>
              <p className={`leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{t.installStep1}</p>
            </div>
          </div>

          {/* Step 2 */}
          <div className={`flex items-start gap-3 border p-3.5 rounded-2xl ${
            isDark ? 'bg-slate-800/60 border-slate-700/60' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className={`w-7 h-7 rounded-xl font-extrabold flex items-center justify-center shrink-0 ${
              isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-700'
            }`}>
              2
            </div>
            <div className="space-y-0.5">
              <h3 className={`font-bold flex items-center gap-1.5 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                <Settings className="w-3.5 h-3.5 text-amber-500" />
                {lang === 'bn' ? 'Unknown Sources পারমিশন দিন' : 'Allow Unknown Sources'}
              </h3>
              <p className={`leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{t.installStep2}</p>
            </div>
          </div>

          {/* Step 3 */}
          <div className={`flex items-start gap-3 border p-3.5 rounded-2xl ${
            isDark ? 'bg-slate-800/60 border-slate-700/60' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className={`w-7 h-7 rounded-xl font-extrabold flex items-center justify-center shrink-0 ${
              isDark ? 'bg-teal-500/20 text-teal-400' : 'bg-teal-100 text-teal-700'
            }`}>
              3
            </div>
            <div className="space-y-0.5">
              <h3 className={`font-bold flex items-center gap-1.5 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-500" />
                {lang === 'bn' ? 'ইনস্টল সম্পন্ন করুন' : 'Complete Installation'}
              </h3>
              <p className={`leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{t.installStep3}</p>
            </div>
          </div>
        </div>

        {/* Security Note */}
        <div className={`p-3 border rounded-xl text-[11px] flex items-center gap-2 ${
          isDark ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
        }`}>
          <ShieldAlert className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>
            {lang === 'bn'
              ? 'আমাদের সকল ফাইল গুগল প্লে প্রটেক্ট এবং অ্যান্টিভাইরাস দ্বারা স্ক্যানকৃত।'
              : 'All hosted files are scanned with Google Play Protect and VirusTotal engines.'}
          </span>
        </div>

        {/* Footer Button */}
        <button
          onClick={onClose}
          className={`w-full font-bold py-2.5 rounded-xl text-xs transition cursor-pointer ${
            isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
          }`}
        >
          {t.close}
        </button>
      </div>
    </div>
  );
};
