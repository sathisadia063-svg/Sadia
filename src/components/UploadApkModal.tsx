import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  UploadCloud,
  FileCheck,
  Smartphone,
  ShieldCheck,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { APKCategory, APKItem, ThemeMode } from '../types';
import { Language, translations } from '../utils/translations';

interface UploadApkModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  theme?: ThemeMode;
  onUploadSuccess: (newApk: APKItem) => void;
}

const CATEGORY_OPTIONS: APKCategory[] = [
  'Apps',
  'Games',
  'Tools',
  'Productivity',
  'Social',
  'Entertainment',
  'Media'
];

export const UploadApkModal: React.FC<UploadApkModalProps> = ({
  isOpen,
  onClose,
  lang,
  theme = 'dark',
  onUploadSuccess,
}) => {
  const [apkFile, setApkFile] = useState<File | null>(null);
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconUrl, setIconUrl] = useState('');

  const [title, setTitle] = useState('');
  const [packageName, setPackageName] = useState('');
  const [version, setVersion] = useState('1.0.0');
  const [category, setCategory] = useState<APKCategory>('Apps');
  const [developer, setDeveloper] = useState('');
  const [minAndroid, setMinAndroid] = useState('Android 6.0+');
  const [description, setDescription] = useState('');
  const [changelog, setChangelog] = useState('');

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const apkInputRef = useRef<HTMLInputElement>(null);
  const iconInputRef = useRef<HTMLInputElement>(null);

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

  // Handle file select
  const handleApkFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setApkFile(file);

      // Auto populate title and package if blank
      if (!title) {
        const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
        setTitle(nameWithoutExt.replace(/[-_]/g, ' '));
      }
      if (!packageName) {
        const cleanName = file.name.toLowerCase().replace(/[^a-z0-9]/g, '');
        setPackageName(`com.custom.${cleanName.slice(0, 15) || 'app'}`);
      }
    }
  };

  const handleIconFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIconFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg(lang === 'bn' ? 'অনুগ্রহ করে অ্যাপের নাম লিখুন!' : 'Please enter an app name!');
      return;
    }

    setUploading(true);
    setUploadProgress(20);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const formData = new FormData();
      if (apkFile) formData.append('apkFile', apkFile);
      if (iconFile) formData.append('iconFile', iconFile);

      formData.append('title', title.trim());
      formData.append('packageName', packageName.trim() || `com.app.${Date.now()}`);
      formData.append('version', version.trim() || '1.0.0');
      formData.append('category', category);
      formData.append('developer', developer.trim() || 'Independent Developer');
      formData.append('minAndroid', minAndroid.trim());
      formData.append('description', description.trim() || 'Custom uploaded APK file.');
      formData.append('changelog', changelog.trim());
      formData.append('iconUrl', iconUrl.trim());

      setUploadProgress(60);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      setUploadProgress(100);

      if (data.success && data.apk) {
        setSuccessMsg(t.uploadSuccess);
        onUploadSuccess(data.apk);
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setErrorMsg(data.message || 'Upload failed.');
      }
    } catch (err: any) {
      console.error('Upload submit error:', err);
      setErrorMsg(err.message || 'An error occurred during upload.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
      <div className={`relative w-full max-w-2xl border rounded-3xl shadow-2xl overflow-hidden my-6 flex flex-col transition-colors ${
        isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
      }`}>
        {/* Header */}
        <div className={`border-b px-6 py-4 flex items-center justify-between ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg border flex items-center justify-center ${
              isDark ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-600'
            }`}>
              <UploadCloud className="w-4 h-4" />
            </div>
            <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{t.uploadModalTitle}</h2>
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Drag & Drop APK File Picker */}
          <div>
            <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              1. {lang === 'bn' ? 'এপিকে (.apk) ফাইল নির্বাচন করুন' : 'Select APK File (.apk)'}
            </label>
            <div
              onClick={() => apkInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition ${
                apkFile
                  ? isDark ? 'border-emerald-500/80 bg-emerald-500/5' : 'border-emerald-500 bg-emerald-50/50'
                  : isDark
                    ? 'border-slate-700 hover:border-slate-500 bg-slate-800/40 hover:bg-slate-800/80'
                    : 'border-slate-300 hover:border-slate-400 bg-slate-50 hover:bg-slate-100'
              }`}
            >
              <input
                ref={apkInputRef}
                type="file"
                accept=".apk"
                className="hidden"
                onChange={handleApkFileSelect}
              />

              {apkFile ? (
                <div className="flex items-center justify-center gap-3 text-emerald-500 text-xs font-semibold">
                  <FileCheck className="w-6 h-6" />
                  <div className="text-left">
                    <p className={`font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{apkFile.name}</p>
                    <p className={`text-[11px] font-normal ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {(apkFile.size / (1024 * 1024)).toFixed(2)} MB • Ready for Upload
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <UploadCloud className="w-8 h-8 text-emerald-500 mx-auto opacity-80" />
                  <p className={`text-xs font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{t.dragDropApk}</p>
                  <p className={`text-[11px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    {lang === 'bn' ? 'সর্বোচ্চ সাইজ: ৫০০ MB (হাই-স্পিড সার্ভার প্রসেসিং)' : 'Max File Size: 500 MB (High Speed Server Processing)'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                {t.appTitleLabel} <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. My Custom Game"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 ${
                  isDark ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>

            <div>
              <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                {t.categoryLabel}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as APKCategory)}
                className={`w-full border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 ${
                  isDark ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              >
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                {t.packageNameLabel}
              </label>
              <input
                type="text"
                placeholder="e.g. com.developer.myapp"
                value={packageName}
                onChange={(e) => setPackageName(e.target.value)}
                className={`w-full border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 ${
                  isDark ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>

            <div>
              <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                {t.developerLabel}
              </label>
              <input
                type="text"
                placeholder="e.g. Studio X / Your Name"
                value={developer}
                onChange={(e) => setDeveloper(e.target.value)}
                className={`w-full border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 ${
                  isDark ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>
          </div>

          {/* App Icon Upload / URL */}
          <div>
            <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              {t.iconLabel}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="file"
                accept="image/*"
                ref={iconInputRef}
                onChange={handleIconFileSelect}
                className={`text-xs file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold cursor-pointer ${
                  isDark
                    ? 'text-slate-400 file:bg-slate-800 file:text-emerald-400 hover:file:bg-slate-700'
                    : 'text-slate-600 file:bg-slate-200 file:text-emerald-700 hover:file:bg-slate-300'
                }`}
              />

              <input
                type="text"
                placeholder="Or paste image URL (https://...)"
                value={iconUrl}
                onChange={(e) => setIconUrl(e.target.value)}
                className={`border rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-emerald-500 ${
                  isDark ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              {t.descriptionLabel}
            </label>
            <textarea
              rows={3}
              placeholder="Features and details about your APK app..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full border rounded-xl p-3 text-xs focus:outline-none focus:border-emerald-500 resize-none ${
                isDark ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
            ></textarea>
          </div>

          {/* Progress Bar */}
          {uploading && (
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs font-semibold text-emerald-500">
                <span>{t.uploadingFile}</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
                <div
                  className="bg-emerald-500 h-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div className={`pt-3 border-t flex items-center justify-end gap-3 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {t.close}
            </button>

            <button
              type="submit"
              disabled={uploading}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold px-5 py-2 rounded-xl text-xs transition shadow-lg shadow-emerald-500/20 active:scale-95 cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              <UploadCloud className="w-4 h-4" strokeWidth={2.5} />
              <span>{t.uploadApk}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
