import React from 'react';
import { Download, Star } from 'lucide-react';
import { APKItem, ThemeMode } from '../types';
import { Language, translations } from '../utils/translations';

interface ApkCardProps {
  apk: APKItem;
  lang: Language;
  theme?: ThemeMode;
  isHot?: boolean;
  onSelect: (apk: APKItem) => void;
  onQuickDownload: (apk: APKItem, e: React.MouseEvent) => void;
  onDeleteApk?: (apkId: string, e: React.MouseEvent) => void;
}

export const ApkCard: React.FC<ApkCardProps> = ({
  apk,
  lang,
  theme = 'dark',
  isHot = false,
  onSelect,
  onQuickDownload,
}) => {
  const t = translations[lang];
  const isDark = theme === 'dark';

  const formattedDownloads =
    apk.downloadCount > 1000
      ? `${(apk.downloadCount / 1000).toFixed(1)}K`
      : `${apk.downloadCount}`;

  if (isHot) {
    return (
      <div
        onClick={() => onSelect(apk)}
        className={`group relative min-w-[108px] sm:min-w-[124px] max-w-[118px] sm:max-w-[135px] border rounded-2xl p-2 transition-all duration-200 active:scale-[0.96] cursor-pointer flex flex-col items-center justify-between text-center overflow-hidden shrink-0 ${
          isDark
            ? 'bg-slate-900/90 hover:bg-slate-800 border-slate-800/80 hover:border-emerald-500/40 shadow-xs'
            : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-emerald-400 shadow-2xs'
        }`}
      >
        {/* Top-Left HOT Badge */}
        <div className="absolute top-1.5 left-1.5 z-10">
          <span className="bg-gradient-to-r from-rose-500 to-pink-500 text-white font-black text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded-full shadow-2xs">
            HOT
          </span>
        </div>

        {/* Centered App Icon */}
        <div className="mt-2 mb-1 relative">
          <img
            src={apk.iconUrl}
            alt={apk.title}
            referrerPolicy="no-referrer"
            className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl object-cover shadow-xs group-hover:scale-105 transition-transform duration-300 border border-black/10"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=160&q=80';
            }}
          />
        </div>

        {/* App Title */}
        <h3 className={`text-[10px] sm:text-[11px] font-extrabold truncate leading-tight w-full text-center my-0.5 ${
          isDark ? 'text-slate-100 group-hover:text-emerald-300' : 'text-slate-900 group-hover:text-emerald-700'
        }`}>
          {apk.title}
        </h3>

        {/* 5 Stars Rating */}
        <div className="flex items-center justify-center gap-0.5 my-0.5 text-amber-400">
          {[1, 2, 3, 4, 5].map((starNum) => (
            <Star key={`star-hot-${apk.id}-${starNum}`} className="w-2 h-2 fill-amber-400 text-amber-400" />
          ))}
        </div>

        {/* Download Count Pill Badge */}
        <button
          onClick={(e) => onQuickDownload(apk, e)}
          className={`inline-flex items-center justify-center gap-0.5 px-2 py-0.5 rounded-lg text-[9px] sm:text-[10px] font-black transition-all cursor-pointer active:scale-95 ${
            isDark
              ? 'bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 border border-emerald-500/30'
              : 'bg-emerald-100/90 text-emerald-800 hover:bg-emerald-600 hover:text-white border border-emerald-200'
          }`}
        >
          <Download className="w-2.5 h-2.5" />
          <span>{formattedDownloads}</span>
        </button>
      </div>
    );
  }

  // Standard Grid Card (compact mobile 3-col design)
  return (
    <div
      onClick={() => onSelect(apk)}
      className={`group relative border rounded-2xl p-2 sm:p-2.5 transition-all duration-200 active:scale-[0.96] cursor-pointer flex flex-col justify-between items-center text-center overflow-hidden ${
        isDark
          ? 'bg-slate-900/80 hover:bg-slate-800/90 border-slate-800/80 hover:border-emerald-500/40 shadow-2xs'
          : 'bg-white hover:bg-slate-50/90 border-slate-200 hover:border-emerald-300 shadow-2xs'
      }`}
    >
      {/* App Icon */}
      <div className="relative mt-1 mb-1">
        <img
          src={apk.iconUrl}
          alt={apk.title}
          referrerPolicy="no-referrer"
          className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl object-cover shadow-2xs group-hover:scale-105 transition-transform duration-300 border ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200/80'
          }`}
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=160&q=80';
          }}
        />
      </div>

      {/* App Title */}
      <div className="space-y-0.5 w-full text-center">
        <h3 className={`text-[10px] sm:text-[11px] font-extrabold line-clamp-2 leading-tight transition-colors ${
          isDark ? 'text-slate-100 group-hover:text-emerald-300' : 'text-slate-900 group-hover:text-emerald-600'
        }`}>
          {apk.title}
        </h3>

        {/* 5-Star Row */}
        <div className="flex items-center justify-center gap-0.5 text-amber-400 py-0.5">
          {[1, 2, 3, 4, 5].map((starNum) => (
            <Star key={`star-${apk.id}-${starNum}`} className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
          ))}
        </div>
      </div>

      {/* Bottom Download Button */}
      <button
        onClick={(e) => onQuickDownload(apk, e)}
        className={`w-full mt-1.5 font-bold py-1 px-1.5 rounded-xl text-[9px] sm:text-[10px] transition duration-200 flex items-center justify-center gap-1 border shadow-2xs cursor-pointer active:scale-95 ${
          isDark
            ? 'bg-slate-800 hover:bg-emerald-500 text-slate-200 hover:text-slate-950 border-slate-700/80 hover:border-emerald-400'
            : 'bg-emerald-50 hover:bg-emerald-500 text-emerald-800 hover:text-white border-emerald-200 hover:border-emerald-500'
        }`}
      >
        <Download className="w-2.5 h-2.5" />
        <span>{t.download} ({formattedDownloads})</span>
      </button>
    </div>
  );
};
