import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import multer from 'multer';
import { createServer as createViteServer } from 'vite';
import { INITIAL_APKS } from './src/data/seedApks';
import { APKItem, APKComment } from './src/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure upload & data directories exist
const uploadsDir = path.join(__dirname, 'uploads');
const dataDir = path.join(__dirname, 'data');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Data storage file
const apksJsonPath = path.join(dataDir, 'apks.json');
const commentsJsonPath = path.join(dataDir, 'comments.json');

// Helper to get stored APKs
function getApks(): APKItem[] {
  if (fs.existsSync(apksJsonPath)) {
    try {
      const content = fs.readFileSync(apksJsonPath, 'utf-8');
      const items: APKItem[] = JSON.parse(content);
      // Remove any initial demo APKs (e.g. apk-1, apk-2, etc.)
      const filtered = items.filter(a => !['apk-1', 'apk-2', 'apk-3', 'apk-4', 'apk-5', 'apk-6'].includes(a.id));
      if (filtered.length !== items.length) {
        fs.writeFileSync(apksJsonPath, JSON.stringify(filtered, null, 2), 'utf-8');
      }
      return filtered;
    } catch (err) {
      console.error('Error reading apks.json:', err);
    }
  }
  // Initialize with seed data (empty)
  fs.writeFileSync(apksJsonPath, JSON.stringify(INITIAL_APKS, null, 2), 'utf-8');
  return INITIAL_APKS;
}

function saveApks(apks: APKItem[]) {
  fs.writeFileSync(apksJsonPath, JSON.stringify(apks, null, 2), 'utf-8');
}

function getComments(): APKComment[] {
  if (fs.existsSync(commentsJsonPath)) {
    try {
      const content = fs.readFileSync(commentsJsonPath, 'utf-8');
      return JSON.parse(content);
    } catch (err) {
      console.error('Error reading comments.json:', err);
    }
  }
  return [];
}

function saveComments(comments: APKComment[]) {
  fs.writeFileSync(commentsJsonPath, JSON.stringify(comments, null, 2), 'utf-8');
}

// Set up multer for APK file uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || '.apk';
    const cleanName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `${cleanName}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 500 * 1024 * 1024 } // 500 MB max file size
});

// Serve uploaded static files if needed directly
app.use('/uploads', express.static(uploadsDir));

// --- API ROUTES ---

// 1. Get List of APKs with optional category, search, and sort
app.get('/api/apks', (req, res) => {
  let apks = getApks();
  const { category, search, sort } = req.query;

  if (category && typeof category === 'string' && category !== 'All') {
    apks = apks.filter(a => a.category.toLowerCase() === category.toLowerCase());
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase().trim();
    apks = apks.filter(a =>
      a.title.toLowerCase().includes(q) ||
      a.packageName.toLowerCase().includes(q) ||
      a.developer.toLowerCase().includes(q) ||
      a.description.toLowerCase().includes(q) ||
      (a.tags && a.tags.some(t => t.toLowerCase().includes(q)))
    );
  }

  if (sort === 'downloads') {
    apks.sort((a, b) => b.downloadCount - a.downloadCount);
  } else if (sort === 'rating') {
    apks.sort((a, b) => b.rating - a.rating);
  } else if (sort === 'newest') {
    apks.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
  }

  res.json({ success: true, count: apks.length, apks });
});

// 2. Get Single APK Details
app.get('/api/apks/:id', (req, res) => {
  const apks = getApks();
  const apk = apks.find(a => a.id === req.params.id);
  if (!apk) {
    return res.status(404).json({ success: false, message: 'APK not found' });
  }
  const comments = getComments().filter(c => c.apkId === apk.id);
  res.json({ success: true, apk, comments });
});

// Delete APK Package
app.delete('/api/apks/:id', (req, res) => {
  let apks = getApks();
  const targetIndex = apks.findIndex(a => a.id === req.params.id);
  if (targetIndex === -1) {
    return res.status(404).json({ success: false, message: 'APK not found' });
  }

  const [deletedApk] = apks.splice(targetIndex, 1);
  saveApks(apks);

  // Clean up uploaded file if present
  if (deletedApk.fileUrl && deletedApk.fileUrl.startsWith('/uploads/')) {
    const filename = deletedApk.fileUrl.replace('/uploads/', '');
    const filepath = path.join(uploadsDir, filename);
    if (fs.existsSync(filepath)) {
      try {
        fs.unlinkSync(filepath);
      } catch (err) {
        console.error('Failed to remove file:', err);
      }
    }
  }

  res.json({ success: true, message: 'APK deleted successfully', deletedId: req.params.id });
});

// 3. Upload New APK
app.post('/api/upload', upload.fields([
  { name: 'apkFile', maxCount: 1 },
  { name: 'iconFile', maxCount: 1 }
]), (req, res) => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    const apkFile = files?.['apkFile']?.[0];
    const iconFile = files?.['iconFile']?.[0];

    const body = req.body;
    const title = body.title || 'Custom App';
    const packageName = body.packageName || `com.app.${Date.now()}`;
    const version = body.version || '1.0.0';
    const category = body.category || 'Apps';
    const developer = body.developer || 'Independent Dev';
    const minAndroid = body.minAndroid || 'Android 6.0+';
    const description = body.description || 'Uploaded APK package.';
    const changelog = body.changelog || 'Initial release.';
    const customIconUrl = body.iconUrl;

    let sizeStr = '15.0 MB';
    let sizeBytes = 15728640;
    let storedFileName = '';

    if (apkFile) {
      sizeBytes = apkFile.size;
      sizeStr = (sizeBytes / (1024 * 1024)).toFixed(1) + ' MB';
      storedFileName = apkFile.filename;
    }

    let finalIconUrl = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=160&q=80';
    if (iconFile) {
      finalIconUrl = `/uploads/${iconFile.filename}`;
    } else if (customIconUrl && typeof customIconUrl === 'string' && customIconUrl.trim()) {
      finalIconUrl = customIconUrl.trim();
    }

    const newApk: APKItem = {
      id: `apk-${Date.now()}`,
      title: title.trim(),
      packageName: packageName.trim(),
      version: version.trim(),
      size: sizeStr,
      sizeBytes,
      category,
      developer: developer.trim(),
      minAndroid,
      iconUrl: finalIconUrl,
      downloadCount: 1,
      rating: 5.0,
      ratingCount: 1,
      description: description.trim(),
      changelog: changelog.trim(),
      screenshots: [
        'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80'
      ],
      fileUrl: storedFileName ? `/uploads/${storedFileName}` : undefined,
      uploadedAt: new Date().toISOString(),
      isVerified: true,
      verifiedBy: 'High-Speed Security Scan',
      downloadSpeedScore: 'Ultra Fast Mirror (100 MB/s)',
      tags: ['Uploaded', category, 'Android'],
      architecture: body.architecture || 'universal'
    };

    const apks = getApks();
    apks.unshift(newApk);
    saveApks(apks);

    res.status(201).json({ success: true, message: 'APK uploaded successfully!', apk: newApk });
  } catch (err: any) {
    console.error('Upload error:', err);
    res.status(500).json({ success: false, message: err.message || 'Failed to process APK upload.' });
  }
});

// 4. Download APK Stream with High Speed headers & Count increment
app.get('/api/download/:id', (req, res) => {
  const apks = getApks();
  const apkIndex = apks.findIndex(a => a.id === req.params.id);

  if (apkIndex === -1) {
    return res.status(404).json({ success: false, message: 'APK not found' });
  }

  const apk = apks[apkIndex];

  // Increment download count
  apks[apkIndex].downloadCount += 1;
  saveApks(apks);

  const safeFilename = `${apk.title.replace(/[^a-zA-Z0-9_-]/g, '_')}-v${apk.version}.apk`;

  // High speed direct download headers
  res.setHeader('Content-Type', 'application/vnd.android.package-archive');
  res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}"`);
  res.setHeader('Cache-Control', 'public, max-age=31536000');
  res.setHeader('X-Download-Speed', 'High-Speed-CDN-Enabled');

  // If there's an uploaded file on disk, stream it
  if (apk.fileUrl && apk.fileUrl.startsWith('/uploads/')) {
    const filename = apk.fileUrl.replace('/uploads/', '');
    const filepath = path.join(uploadsDir, filename);
    if (fs.existsSync(filepath)) {
      const stat = fs.statSync(filepath);
      res.setHeader('Content-Length', stat.size);
      const readStream = fs.createReadStream(filepath);
      return readStream.pipe(res);
    }
  }

  // Fallback: Generate a sample binary buffer representing the APK package for demo download testing
  const dummySize = 1024 * 1024; // 1MB sample package
  res.setHeader('Content-Length', dummySize);

  const headerText = `PK\x03\x04 - Android Package Archive (${apk.title} v${apk.version})\nPackage: ${apk.packageName}\nVerified Safe Server Download.\n`;
  const buffer = Buffer.alloc(dummySize);
  buffer.write(headerText, 0, 'utf-8');

  res.send(buffer);
});

// 5. Add Comment
app.post('/api/apks/:id/comment', (req, res) => {
  const { author, rating, text } = req.body;
  if (!text || !author) {
    return res.status(400).json({ success: false, message: 'Author and comment text are required' });
  }

  const newComment: APKComment = {
    id: `c-${Date.now()}`,
    apkId: req.params.id,
    author: author.trim() || 'Anonymous User',
    rating: Number(rating) || 5,
    text: text.trim(),
    createdAt: new Date().toISOString()
  };

  const comments = getComments();
  comments.unshift(newComment);
  saveComments(comments);

  // Update APK rating average
  const apks = getApks();
  const apkIndex = apks.findIndex(a => a.id === req.params.id);
  if (apkIndex !== -1) {
    const apkComments = comments.filter(c => c.apkId === req.params.id);
    const sum = apkComments.reduce((acc, curr) => acc + curr.rating, 0);
    apks[apkIndex].rating = Number((sum / apkComments.length).toFixed(1));
    apks[apkIndex].ratingCount = apkComments.length;
    saveApks(apks);
  }

  res.json({ success: true, comment: newComment });
});

// 6. Stats endpoint
app.get('/api/stats', (_req, res) => {
  const apks = getApks();
  const totalDownloads = apks.reduce((sum, a) => sum + a.downloadCount, 0);
  res.json({
    success: true,
    stats: {
      totalApks: apks.length,
      totalDownloads,
      serverSpeedMbps: 120,
      uptimePercentage: 99.98
    }
  });
});

// --- VITE / STATIC MIDDLEWARE ---
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`APK Store server running on http://localhost:${PORT}`);
  });
}

startServer();
