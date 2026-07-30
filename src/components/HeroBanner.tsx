import React from 'react';
import { Download, ShieldCheck, Zap, ArrowDownCircle, HardDrive, CheckCircle2 } from 'lucide-react';
import { Language, translations } from '../utils/translations';
import { ThemeMode } from '../types';

interface HeroBannerProps {
  lang: Language;
  theme: ThemeMode;
  onOpenUpload: () => void;
  totalApks: number;
  totalDownloads: number;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  lang,
  theme,
  onOpenUpload,
  totalApks,
  totalDownloads,
}) => {
  const t = translations[lang];
  const isDark = theme === 'dark';

  return (
    <div className={`relative overflow-hidden border-b py-8 px-4 transition-colors ${
      isDark
        ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border-slate-800 text-slate-100'
        : 'bg-gradient-to-br from-slate-100 via-emerald-50/40 to-slate-200/60 border-slate-200 text-slate-800'
    }`}>
      {/* Decorative Glow */}
      <div className={`absolute top-0 right-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none ${isDark ? 'bg-emerald-500/10' : 'bg-emerald-500/15'}`}></div>
      <div className={`absolute bottom-0 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none ${isDark ? 'bg-indigo-500/10' : 'bg-indigo-500/15'}`}></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-8 space-y-4">
            <div className={`inline-flex items-center gap-2 border px-3 py-1 rounded-full text-xs font-semibold ${
              isDark
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-emerald-100 border-emerald-300 text-emerald-800'
            }`}>
              <Zap className={`w-3.5 h-3.5 ${isDark ? 'fill-emerald-400' : 'fill-emerald-600 text-emerald-600'}`} />
              <span>{lang === 'bn' ? 'হাই-স্পিড সিডিএন ও ডাইরেক্ট ডাউনলোড সার্ভার' : 'High-Speed CDN & Direct Download Server'}</span>
            </div>

            <h1 className={`text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight leading-snug ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {lang === 'bn' ? (
                <>
                  আপনার প্রয়োজনীয় <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">এপিকে (APK)</span> আপলোড ও দ্রুত ডাউনলোড করুন
                </>
              ) : (
                <>
                  Host & Download <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">Android APKs</span> at High Speed
                </>
              )}
            </h1>

            <p className={`text-xs sm:text-sm max-w-2xl leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              {lang === 'bn'
                ? 'আপনার ইচ্ছেমত যেকোনো অ্যান্ড্রয়েড অ্যাপ বা গেমের এপিকে সম্পূর্ণ ফ্রিতে আপলোড করুন। আপনার ভিজিটররা সরাসরি উচ্চ গতিতে বিজ্ঞাপনহীন ডাইরেক্ট লিংকে ক্লিক করেই ইনস্ট্যান্ট ডাউনলোড ফাইল পাবেন।'
                : 'Upload any Android app or game APK for free. Users enjoy instant high-speed downloads directly from verified fast mirror servers with zero pop-up ads.'}
            </p>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className={`flex items-center gap-2 border p-2.5 rounded-xl ${isDark ? 'bg-slate-800/80 border-slate-700/60' : 'bg-white/90 border-slate-200 shadow-2xs'}`}>
                <ShieldCheck className={`w-4 h-4 shrink-0 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
                <span className={`font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{t.verifiedSafe}</span>
              </div>
              <div className={`flex items-center gap-2 border p-2.5 rounded-xl ${isDark ? 'bg-slate-800/80 border-slate-700/60' : 'bg-white/90 border-slate-200 shadow-2xs'}`}>
                <Zap className={`w-4 h-4 shrink-0 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
                <span className={`font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{t.fastSpeed}</span>
              </div>
              <div className={`flex items-center gap-2 border p-2.5 rounded-xl col-span-2 sm:col-span-1 ${isDark ? 'bg-slate-800/80 border-slate-700/60' : 'bg-white/90 border-slate-200 shadow-2xs'}`}>
                <CheckCircle2 className={`w-4 h-4 shrink-0 ${isDark ? 'text-teal-400' : 'text-teal-600'}`} />
                <span className={`font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{t.noPopups}</span>
              </div>
            </div>
          </div>

          {/* Right Stats Box */}
          <div className={`border rounded-2xl p-5 backdrop-blur-sm shadow-xl flex flex-col justify-between ${
            isDark
              ? 'bg-slate-800/60 border-slate-700/80'
              : 'bg-white/90 border-slate-200 shadow-slate-200'
          }`}>
            <h3 className={`text-sm font-bold uppercase tracking-wider mb-4 flex items-center justify-between ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              <span>{lang === 'bn' ? 'সার্ভার পারফরম্যান্স' : 'Server Performance'}</span>
              <span className={`inline-flex items-center gap-1.5 text-xs font-normal ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Online
              </span>
            </h3>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-900/80 border-slate-700/50' : 'bg-slate-50 border-slate-200'}`}>
                <div className="text-2xl font-black text-emerald-500">{totalApks}</div>
                <div className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{lang === 'bn' ? 'মোট এপিকে' : 'Total APKs'}</div>
              </div>
              <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-900/80 border-slate-700/50' : 'bg-slate-50 border-slate-200'}`}>
                <div className={`text-2xl font-black ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>
                  {totalDownloads > 1000 ? `${(totalDownloads / 1000).toFixed(1)}K` : totalDownloads}
                </div>
                <div className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t.totalDownloads}</div>
              </div>
            </div>

            <div className={`mt-4 pt-4 border-t flex items-center justify-between text-xs ${
              isDark ? 'border-slate-700/50 text-slate-300' : 'border-slate-200 text-slate-600'
            }`}>
              <span className="flex items-center gap-1.5">
                <HardDrive className={`w-3.5 h-3.5 ${isDark ? 'text-teal-400' : 'text-teal-600'}`} />
                {lang === 'bn' ? 'স্পিড ব্যান্ডউইথ:' : 'Speed Bandwidth:'}
              </span>
              <span className="font-bold text-emerald-500">120 MB/s CDN</span>
            </div>

            <button
              onClick={onOpenUpload}
              className={`mt-4 w-full font-semibold py-2.5 rounded-xl text-xs transition flex items-center justify-center gap-2 border cursor-pointer ${
                isDark
                  ? 'bg-slate-700 hover:bg-slate-600 text-white border-slate-600'
                  : 'bg-slate-900 hover:bg-slate-800 text-white border-slate-800 shadow-sm'
              }`}
            >
              <ArrowDownCircle className="w-4 h-4 text-emerald-400" />
              <span>{t.uploadApk}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
