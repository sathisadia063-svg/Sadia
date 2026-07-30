import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { ApkCard } from './components/ApkCard';
import { ApkDetailModal } from './components/ApkDetailModal';
import { UploadApkModal } from './components/UploadApkModal';
import { InstallGuideModal } from './components/InstallGuideModal';
import { AdminModal } from './components/AdminModal';
import { BottomNav } from './components/BottomNav';
import { StatsFooter } from './components/StatsFooter';
import { APKItem, ServerStats, ThemeMode } from './types';
import { Language, translations } from './utils/translations';
import {
  Download,
  Flame,
  Layers,
  Sparkles,
  Zap,
  TrendingUp,
  SearchX,
  CheckCircle2,
  ListOrdered
} from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('apk_lang');
    return (saved === 'bn' || saved === 'en') ? saved : 'bn';
  });

  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('apk_theme');
    return (saved === 'light' || saved === 'dark') ? saved : 'dark';
  });

  useEffect(() => {
    localStorage.setItem('apk_lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('apk_theme', theme);
  }, [theme]);

  // Admin Mode state with localStorage persistence
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('apk_is_admin') === 'true';
  });

  const [adminPassword, setAdminPassword] = useState<string>(() => {
    return localStorage.getItem('apk_admin_password') || 'admin123';
  });

  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  const handleAdminLogin = (inputPass: string) => {
    if (inputPass === adminPassword) {
      setIsAdmin(true);
      localStorage.setItem('apk_is_admin', 'true');
      return true;
    }
    return false;
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('apk_is_admin');
  };

  const handleChangeAdminPassword = (newPass: string) => {
    setAdminPassword(newPass);
    localStorage.setItem('apk_admin_password', newPass);
  };

  const handleTriggerUpload = () => {
    if (isAdmin) {
      setIsUploadOpen(true);
    } else {
      setIsAdminModalOpen(true);
    }
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOption, setSortOption] = useState<'downloads' | 'newest' | 'rating'>('downloads');

  const [apks, setApks] = useState<APKItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [selectedApk, setSelectedApk] = useState<APKItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isInstallGuideOpen, setIsInstallGuideOpen] = useState(false);

  // Download notification toast
  const [downloadToast, setDownloadToast] = useState<{ show: boolean; title: string } | null>(null);

  // Server stats
  const [stats, setStats] = useState<ServerStats>({
    totalApks: 0,
    totalDownloads: 0,
    serverSpeedMbps: 120,
    uptimePercentage: 99.98,
  });

  const t = translations[lang];

  // Fetch APKs from API
  const fetchApks = () => {
    setLoading(true);
    const queryParams = new URLSearchParams();
    if (selectedCategory && selectedCategory !== 'All') {
      queryParams.append('category', selectedCategory);
    }
    if (searchQuery.trim()) {
      queryParams.append('search', searchQuery.trim());
    }
    if (sortOption) {
      queryParams.append('sort', sortOption);
    }

    fetch(`/api/apks?${queryParams.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.apks) {
          setApks(data.apks);
        }
      })
      .catch((err) => console.error('Error loading APKs:', err))
      .finally(() => setLoading(false));
  };

  // Fetch Server Stats
  const fetchStats = () => {
    fetch('/api/stats')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.stats) {
          setStats(data.stats);
        }
      })
      .catch((err) => console.error('Stats fetch error:', err));
  };

  useEffect(() => {
    fetchApks();
  }, [selectedCategory, searchQuery, sortOption]);

  useEffect(() => {
    fetchStats();
  }, []);

  // Handle Quick Download from card
  const handleQuickDownload = (apk: APKItem, e: React.MouseEvent) => {
    e.stopPropagation();
    // Open detail modal with active download trigger
    setSelectedApk(apk);
    setIsDetailOpen(true);
  };

  // Handle Download Started Notification Toast
  const handleDownloadStarted = (apk: APKItem) => {
    setDownloadToast({ show: true, title: apk.title });
    fetchStats(); // update totals
    setTimeout(() => {
      setDownloadToast(null);
    }, 4000);
  };

  // Handle New APK Uploaded
  const handleUploadSuccess = (newApk: APKItem) => {
    setApks((prev) => [newApk, ...prev]);
    fetchStats();
    setSelectedApk(newApk);
    setIsDetailOpen(true);
  };

  // Handle APK Deletion
  const handleDeleteApk = async (apkId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      await fetch(`/api/apks/${apkId}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Delete API error', err);
    }
    setApks((prev) => prev.filter((item) => item.id !== apkId));
    setStats((prev) => ({
      ...prev,
      totalApks: Math.max(0, (prev.totalApks || 0) - 1),
    }));
    if (selectedApk?.id === apkId) {
      setIsDetailOpen(false);
      setSelectedApk(null);
    }
    setDownloadToast({
      show: true,
      title: lang === 'bn' ? 'এপিকে ফাইলটি ডিলিট করা হয়েছে' : 'APK Package Deleted',
    });
    setTimeout(() => {
      setDownloadToast(null);
    }, 3000);
  };

  const isDark = theme === 'dark';

  // Hot APKs list (e.g., top 4 or verified/popular apps)
  const hotApks = apks.slice(0, 5);

  return (
    <div className={`min-h-screen font-sans flex flex-col antialiased pb-20 transition-colors duration-200 ${
      isDark
        ? 'bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-slate-950'
        : 'bg-slate-50 text-slate-900 selection:bg-emerald-500 selection:text-white'
    }`}>
      {/* Toast Notification */}
      {downloadToast?.show && (
        <div className="fixed bottom-20 right-4 z-50 bg-emerald-500 text-slate-950 font-bold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce border-2 border-emerald-300 text-xs">
          <CheckCircle2 className="w-5 h-5 fill-slate-950 text-emerald-300" />
          <div>
            <p className="font-extrabold">{t.downloading}</p>
            <p className="font-medium opacity-90">{downloadToast.title}</p>
          </div>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        lang={lang}
        setLang={setLang}
        theme={theme}
        setTheme={setTheme}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        onOpenUpload={handleTriggerUpload}
        onOpenInstallGuide={() => setIsInstallGuideOpen(true)}
        serverSpeedMbps={stats.serverSpeedMbps}
        isAdmin={isAdmin}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 space-y-6">
        {/* Top HOT Apps Horizontal Carousel Section (Matches Screenshot Top Section) */}
        {!searchQuery && selectedCategory === 'All' && hotApks.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-rose-500/10 text-rose-500">
                <Flame className="w-4 h-4 fill-rose-500" />
              </span>
              <h2 className={`text-sm sm:text-base font-black uppercase tracking-wider ${
                isDark ? 'text-slate-100' : 'text-slate-900'
              }`}>
                {t.hotUpdates}
              </h2>
            </div>

            {/* Horizontal Scroll Row */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar -mx-4 px-4">
              {hotApks.map((apk) => (
                <ApkCard
                  key={`hot-${apk.id}`}
                  apk={apk}
                  lang={lang}
                  theme={theme}
                  isHot={true}
                  onSelect={(a) => {
                    setSelectedApk(a);
                    setIsDetailOpen(true);
                  }}
                  onQuickDownload={handleQuickDownload}
                  onDeleteApk={isAdmin ? handleDeleteApk : undefined}
                />
              ))}
            </div>
          </section>
        )}

        {/* Latest Updates Section Header (Matches Screenshot) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-2 border-b pb-2 border-slate-800/40">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-emerald-500/10 text-emerald-500">
                <Layers className="w-4 h-4" />
              </span>
              <h2 className={`text-sm sm:text-base font-black uppercase tracking-wider ${
                isDark ? 'text-slate-100' : 'text-slate-900'
              }`}>
                {t.latestUpdates}
              </h2>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-700'
              }`}>
                {apks.length}
              </span>
            </div>

            {/* Sort options */}
            <div className="flex items-center gap-1 text-[11px]">
              <div className={`flex p-0.5 rounded-xl border ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-300'
              }`}>
                <button
                  onClick={() => setSortOption('downloads')}
                  className={`px-2.5 py-1 rounded-lg transition font-bold cursor-pointer ${
                    sortOption === 'downloads'
                      ? 'bg-emerald-500 text-slate-950'
                      : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600'
                  }`}
                >
                  {lang === 'bn' ? 'জনপ্রিয়' : 'Hot'}
                </button>
                <button
                  onClick={() => setSortOption('newest')}
                  className={`px-2.5 py-1 rounded-lg transition font-bold cursor-pointer ${
                    sortOption === 'newest'
                      ? 'bg-emerald-500 text-slate-950'
                      : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600'
                  }`}
                >
                  {lang === 'bn' ? 'নতুন' : 'New'}
                </button>
              </div>
            </div>
          </div>

          {/* APK Catalog Grid (3-column responsive grid as shown in screenshot) */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className={`border rounded-3xl p-4 space-y-3 animate-pulse flex flex-col items-center ${
                    isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                  }`}
                >
                  <div className={`w-20 h-20 rounded-2xl ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}></div>
                  <div className={`h-4 rounded w-3/4 ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}></div>
                  <div className={`h-3 rounded w-1/2 ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}></div>
                  <div className={`h-8 w-full rounded-xl ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}></div>
                </div>
              ))}
            </div>
          ) : apks.length === 0 ? (
            <div className={`text-center py-12 border rounded-3xl space-y-3 ${
              isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
            }`}>
              <SearchX className={`w-10 h-10 mx-auto ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
              <h3 className={`text-base font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{t.noApksFound}</h3>
              <p className={`text-xs max-w-sm mx-auto ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                {lang === 'bn'
                  ? 'আপনার সার্চ অনুযায়ী কোনো ফাইল পাওয়া যায়নি। আপনি নিজেই প্রথম এপিকেটি আপলোড করতে পারেন!'
                  : 'No files matched your query. Be the first to upload an APK file!'}
              </p>
              <button
                onClick={handleTriggerUpload}
                className="mt-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-slate-950" />
                <span>{t.uploadApk}</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 min-[340px]:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3">
              {apks.map((apk) => (
                <ApkCard
                  key={apk.id}
                  apk={apk}
                  lang={lang}
                  theme={theme}
                  onSelect={(a) => {
                    setSelectedApk(a);
                    setIsDetailOpen(true);
                  }}
                  onQuickDownload={handleQuickDownload}
                  onDeleteApk={isAdmin ? handleDeleteApk : undefined}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Floating Bottom Navigation Bar (Matches Screenshot Dock) */}
      <BottomNav
        activeTab={selectedCategory}
        setActiveTab={(tab) => {
          if (tab === 'home') setSelectedCategory('All');
          else setSelectedCategory(tab);
        }}
        lang={lang}
        theme={theme}
        isInstallGuideOpen={isInstallGuideOpen}
        onOpenInstallGuide={() => setIsInstallGuideOpen(true)}
        onOpenTelegram={() => window.open('https://t.me', '_blank')}
      />

      {/* APK Detail Modal */}
      <ApkDetailModal
        apk={selectedApk}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedApk(null);
        }}
        lang={lang}
        theme={theme}
        onDownloadStarted={handleDownloadStarted}
        onOpenInstallGuide={() => setIsInstallGuideOpen(true)}
        onDeleteApk={isAdmin ? handleDeleteApk : undefined}
      />

      {/* APK Upload Modal */}
      <UploadApkModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        lang={lang}
        theme={theme}
        onUploadSuccess={handleUploadSuccess}
      />

      {/* How to Install Guide Modal */}
      <InstallGuideModal
        isOpen={isInstallGuideOpen}
        onClose={() => setIsInstallGuideOpen(false)}
        lang={lang}
        theme={theme}
      />

      {/* Admin Panel Modal */}
      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        isAdmin={isAdmin}
        onLogin={handleAdminLogin}
        onLogout={handleAdminLogout}
        onChangePassword={handleChangeAdminPassword}
        onOpenUpload={() => {
          setIsAdminModalOpen(false);
          setIsUploadOpen(true);
        }}
        apks={apks}
        onDeleteApk={handleDeleteApk}
        lang={lang}
        theme={theme}
      />

      {/* Footer */}
      <StatsFooter
        lang={lang}
        setLang={setLang}
        theme={theme}
        totalApks={stats.totalApks || apks.length}
        totalDownloads={stats.totalDownloads}
        onOpenUpload={handleTriggerUpload}
      />
    </div>
  );
}
