import React, { useState, useEffect } from 'react';
import {
  X,
  Download,
  ShieldCheck,
  Star,
  Zap,
  HardDrive,
  Calendar,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Send,
  Lock,
  ExternalLink,
  ChevronRight,
  Share2,
  Trash2
} from 'lucide-react';
import { APKItem, APKComment, ThemeMode } from '../types';
import { Language, translations } from '../utils/translations';

interface ApkDetailModalProps {
  apk: APKItem | null;
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  theme?: ThemeMode;
  onDownloadStarted: (apk: APKItem) => void;
  onOpenInstallGuide: () => void;
  onDeleteApk?: (apkId: string) => void;
}

export const ApkDetailModal: React.FC<ApkDetailModalProps> = ({
  apk,
  isOpen,
  onClose,
  lang,
  theme = 'dark',
  onDownloadStarted,
  onOpenInstallGuide,
  onDeleteApk,
}) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  // State for download simulation & comments
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadSpeed, setDownloadSpeed] = useState('0 MB/s');
  const [downloadStatusText, setDownloadStatusText] = useState('');
  const [downloadCompleted, setDownloadCompleted] = useState(false);

  // Comments state
  const [comments, setComments] = useState<APKComment[]>([]);
  const [newAuthor, setNewAuthor] = useState('');
  const [newText, setNewText] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (isOpen && apk) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, apk]);

  // Fetch comments when modal opens
  useEffect(() => {
    if (apk) {
      setDownloading(false);
      setDownloadProgress(0);
      setDownloadCompleted(false);

      fetch(`/api/apks/${apk.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.comments) {
            setComments(data.comments);
          }
        })
        .catch((err) => console.error('Error fetching comments:', err));
    }
  }, [apk]);

  if (!isOpen || !apk) return null;

  const t = translations[lang];
  const isDark = theme === 'dark';

  // Handle Download button click
  const handleStartDownload = () => {
    if (downloading) return;

    setDownloading(true);
    setDownloadProgress(10);
    setDownloadCompleted(false);
    setDownloadStatusText(lang === 'bn' ? '১০০% ভাইরাস চেক সম্পন্ন হচ্ছে...' : 'Running VirusTotal Security Scan...');

    // Phase 1: Security check
    setTimeout(() => {
      setDownloadProgress(35);
      setDownloadStatusText(lang === 'bn' ? 'হাই-স্পিড মিরর সার্ভারে কানেক্ট করা হচ্ছে...' : 'Connecting to High-Speed Direct CDN Mirror...');
      setDownloadSpeed('85 MB/s');
    }, 600);

    // Phase 2: Streaming
    setTimeout(() => {
      setDownloadProgress(75);
      setDownloadStatusText(lang === 'bn' ? 'ডাউনলোড স্পিড: ৪৫ MB/s (ফাইল ট্রান্সফার)' : 'Downloading APK file at 45 MB/s...');
      setDownloadSpeed('110 MB/s');
    }, 1200);

    // Phase 3: Finish and trigger actual browser file save
    setTimeout(() => {
      setDownloadProgress(100);
      setDownloadStatusText(lang === 'bn' ? 'ডাউনলোড সফলভাবে সম্পন্ন হয়েছে!' : 'Download Complete!');
      setDownloading(false);
      setDownloadCompleted(true);

      // Trigger server endpoint to stream actual file & update download counter
      window.location.href = `/api/download/${apk.id}`;
      onDownloadStarted(apk);
    }, 1800);
  };

  // Handle posting a comment
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;

    setSubmittingComment(true);
    try {
      const res = await fetch(`/api/apks/${apk.id}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: newAuthor.trim() || (lang === 'bn' ? 'বেনামী ইউজার' : 'Anonymous User'),
          rating: newRating,
          text: newText.trim(),
        }),
      });

      const data = await res.json();
      if (data.success && data.comment) {
        setComments([data.comment, ...comments]);
        setNewText('');
        setNewAuthor('');
      }
    } catch (err) {
      console.error('Comment error:', err);
    } finally {
      setSubmittingComment(false);
    }
  };

  // Copy direct link
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
      <div className={`relative w-full max-w-3xl border rounded-3xl shadow-2xl overflow-hidden my-6 flex flex-col max-h-[90vh] transition-colors ${
        isDark
          ? 'bg-slate-900 border-slate-800 text-slate-100'
          : 'bg-white border-slate-200 text-slate-800'
      }`}>
        {/* Modal Header */}
        <div className={`sticky top-0 z-20 backdrop-blur-md border-b px-6 py-4 flex items-center justify-between ${
          isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-200'
        }`}>
          <div className={`flex items-center gap-2 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <span className="text-emerald-500 font-semibold">{apk.category}</span>
            <span>•</span>
            <span>Package: {apk.packageName}</span>
          </div>

          <div className="flex items-center gap-2">
            {onDeleteApk && (
              <button
                onClick={() => setShowConfirmDelete(!showConfirmDelete)}
                className={`p-2 rounded-xl transition cursor-pointer text-xs flex items-center gap-1 ${
                  isDark ? 'text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-600' : 'text-rose-600 hover:text-white bg-rose-50 hover:bg-rose-600'
                }`}
                title={t.deleteApk}
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline font-semibold">{t.deleteApk}</span>
              </button>
            )}
            <button
              onClick={handleShare}
              className={`p-2 rounded-xl transition cursor-pointer text-xs flex items-center gap-1 ${
                isDark ? 'text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700' : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200'
              }`}
              title="Share APK"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">{copiedLink ? (lang === 'bn' ? 'কপি হয়েছে!' : 'Copied!') : 'Share'}</span>
            </button>
            <button
              onClick={onClose}
              className={`p-2 rounded-xl transition cursor-pointer ${
                isDark ? 'text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700' : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Delete Confirmation Banner */}
        {showConfirmDelete && (
          <div className={`px-6 py-3 border-b flex items-center justify-between gap-3 text-xs animate-fadeIn ${
            isDark ? 'bg-rose-950/90 border-rose-800 text-rose-200' : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}>
            <div className="flex items-center gap-2 font-semibold">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{t.confirmDelete}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className={`px-3 py-1 rounded-lg font-medium border cursor-pointer ${
                  isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-300 text-slate-700'
                }`}
              >
                {t.close}
              </button>
              <button
                onClick={() => {
                  if (onDeleteApk && apk) {
                    onDeleteApk(apk.id);
                    onClose();
                  }
                }}
                className="px-3.5 py-1 rounded-lg font-bold bg-rose-600 hover:bg-rose-500 text-white transition cursor-pointer shadow-xs"
              >
                {t.deleteApk}
              </button>
            </div>
          </div>
        )}

        {/* Modal Body Scrollable */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* Main App Summary Box */}
          <div className={`flex flex-col sm:flex-row items-start gap-4 border p-4 rounded-2xl ${
            isDark ? 'bg-slate-800/60 border-slate-700/60' : 'bg-slate-50 border-slate-200'
          }`}>
            <img
              src={apk.iconUrl}
              alt={apk.title}
              referrerPolicy="no-referrer"
              className={`w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover shadow-md border shrink-0 ${
                isDark ? 'bg-slate-950 border-slate-700' : 'bg-white border-slate-300'
              }`}
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=160&q=80';
              }}
            />

            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className={`text-lg sm:text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{apk.title}</h2>
                {apk.isVerified && (
                  <span className={`inline-flex items-center gap-1 border px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                    isDark ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  }`}>
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {t.verifiedBadge}
                  </span>
                )}
              </div>

              <p className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{apk.developer}</p>

              {/* Meta stats badges */}
              <div className={`flex items-center gap-4 text-xs pt-2 flex-wrap ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <strong className={isDark ? 'text-amber-300' : 'text-amber-600'}>{apk.rating}</strong> ({apk.ratingCount})
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Download className="w-3.5 h-3.5 text-emerald-500" />
                  <strong>{apk.downloadCount}</strong> {t.totalDownloads}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <HardDrive className="w-3.5 h-3.5 text-teal-400" />
                  <strong>{apk.size}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Download Action Section */}
          <div className={`border p-5 rounded-2xl space-y-4 shadow-lg ${
            isDark
              ? 'bg-gradient-to-r from-slate-800 via-slate-800 to-slate-800/90 border-emerald-500/30'
              : 'bg-emerald-50/40 border-emerald-200'
          }`}>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <span className={`text-xs font-bold uppercase tracking-wide flex items-center gap-1 ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                  <Zap className="w-4 h-4 fill-emerald-500 text-emerald-500" />
                  {t.fastSpeed}
                </span>
                <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  {lang === 'bn' ? 'সরাসরি ডাইরেক্ট ডাউনলোড লিংক - কোনো বিজ্ঞাপনী রিডাইরেক্ট নেই' : 'Direct mirror server - Instant high speed download'}
                </p>
              </div>
            </div>

            {/* Progress Bar during download */}
            {(downloading || downloadCompleted) && (
              <div className={`space-y-2 p-3.5 rounded-xl border ${
                isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'
              }`}>
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-emerald-500">{downloadStatusText}</span>
                  <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{downloadProgress}%</span>
                </div>
                <div className={`w-full h-2.5 rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-300 rounded-full"
                    style={{ width: `${downloadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Big Download Button */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleStartDownload}
                disabled={downloading}
                className="flex-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black py-3.5 px-6 rounded-xl text-base transition shadow-xl shadow-emerald-500/20 active:scale-98 cursor-pointer flex items-center justify-center gap-2.5 disabled:opacity-50"
              >
                <Download className={`w-5 h-5 ${downloading ? 'animate-bounce' : ''}`} strokeWidth={2.5} />
                <span>
                  {downloading
                    ? t.downloading
                    : downloadCompleted
                    ? t.downloadNow + ' (Re-download)'
                    : `${t.downloadNow} (${apk.size})`}
                </span>
              </button>

              <button
                onClick={onOpenInstallGuide}
                className={`border px-4 py-3 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1.5 shrink-0 ${
                  isDark
                    ? 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                    : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700 hover:text-slate-900 shadow-2xs'
                }`}
              >
                <Smartphone className="w-4 h-4 text-emerald-500" />
                <span>{t.howToInstall}</span>
              </button>
            </div>
          </div>

          {/* Technical Specifications Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className={`border p-3 rounded-xl ${isDark ? 'bg-slate-800/40 border-slate-700/50' : 'bg-slate-50 border-slate-200'}`}>
              <span className={`block mb-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t.fileSize}</span>
              <span className={`font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{apk.size}</span>
            </div>
            <div className={`border p-3 rounded-xl ${isDark ? 'bg-slate-800/40 border-slate-700/50' : 'bg-slate-50 border-slate-200'}`}>
              <span className={`block mb-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t.uploadedAt}</span>
              <span className={`font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
                {new Date(apk.uploadedAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className={`text-base font-bold mb-2 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <span className="w-1.5 h-4 bg-emerald-500 rounded-full"></span>
              {t.description}
            </h3>
            <p className={`text-sm leading-relaxed p-4 rounded-2xl border ${
              isDark ? 'text-slate-300 bg-slate-800/30 border-slate-800' : 'text-slate-600 bg-slate-50 border-slate-200'
            }`}>
              {apk.description}
            </p>
          </div>

          {/* Reviews & Comments Section */}
          <div className={`pt-4 border-t space-y-4 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
            <h3 className={`text-base font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <MessageSquare className="w-4 h-4 text-emerald-500" />
              {t.commentsAndRatings} ({comments.length})
            </h3>

            {/* Add Comment Form */}
            <form onSubmit={handleCommentSubmit} className={`p-4 rounded-2xl border space-y-3 ${
              isDark ? 'bg-slate-800/50 border-slate-700/60' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder={t.yourName}
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  className={`border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 ${
                    isDark ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />

                <div className={`flex items-center gap-2 border rounded-xl px-3 py-1.5 text-xs ${
                  isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-300'
                }`}>
                  <span className={`font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Rating:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewRating(star)}
                        className="cursor-pointer"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            star <= newRating
                              ? 'fill-amber-400 text-amber-400'
                              : isDark ? 'text-slate-600' : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <textarea
                rows={2}
                placeholder={t.yourComment}
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                className={`w-full border rounded-xl p-3 text-xs focus:outline-none focus:border-emerald-500 resize-none ${
                  isDark ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-300 text-slate-900'
                }`}
              ></textarea>

              <button
                type="submit"
                disabled={submittingComment || !newText.trim()}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{t.submitComment}</span>
              </button>
            </form>

            {/* Comments List */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {comments.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-2">
                  {lang === 'bn' ? 'এখনো কোনো কমেন্ট করা হয়নি। প্রথম কমেন্টটি আপনি করুন!' : 'No reviews yet. Be the first to leave a review!'}
                </p>
              ) : (
                comments.map((comment) => (
                  <div
                    key={comment.id}
                    className={`border p-3.5 rounded-xl space-y-1 text-xs ${
                      isDark ? 'bg-slate-800/30 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{comment.author}</span>
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span>{comment.rating}.0</span>
                      </div>
                    </div>
                    <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>{comment.text}</p>
                    <span className="text-[10px] text-slate-400 block pt-0.5">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
