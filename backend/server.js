const express = require('express');
const cors = require('cors');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

// Vietnamese slug helper
function toSlug(str) {
  if (!str) return '';
  const map = {
    'à':'a','á':'a','ạ':'a','ả':'a','ã':'a','â':'a','ầ':'a','ấ':'a','ậ':'a','ẩ':'a','ẫ':'a',
    'ă':'a','ằ':'a','ắ':'a','ặ':'a','ẳ':'a','ẵ':'a','è':'e','é':'e','ẹ':'e','ẻ':'e','ẽ':'e',
    'ê':'e','ề':'e','ế':'e','ệ':'e','ể':'e','ễ':'e','ì':'i','í':'i','ị':'i','ỉ':'i','ĩ':'i',
    'ò':'o','ó':'o','ọ':'o','ỏ':'o','õ':'o','ô':'o','ồ':'o','ố':'o','ộ':'o','ổ':'o','ỗ':'o',
    'ơ':'o','ờ':'o','ớ':'o','ợ':'o','ở':'o','ỡ':'o','ù':'u','ú':'u','ụ':'u','ủ':'u','ũ':'u',
    'ư':'u','ừ':'u','ứ':'u','ự':'u','ử':'u','ữ':'u','ỳ':'y','ý':'y','ỵ':'y','ỷ':'y','ỹ':'y',
    'đ':'d','Đ':'d'
  };
  return str.toLowerCase()
    .split('').map(c => map[c] || c).join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ============================================================
// DATA HELPERS - Read/Write JSON files safely
// ============================================================
const DATA_DIR = path.join(__dirname, 'data');

function readData(filename) {
  const filePath = path.join(DATA_DIR, filename);
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${filename}:`, err.message);
    return filename === 'settings.json' ? {} : [];
  }
}

function writeData(filename, data) {
  const filePath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

// ============================================================
// MULTER - File upload config
// ============================================================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${uuidv4().slice(0, 8)}${ext}`;
    cb(null, name);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp|svg/;
    const extname = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowed.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// ============================================================
// AUTH MIDDLEWARE
// ============================================================
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized - No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized - Invalid token' });
  }
}

// ============================================================
// ADMIN ACCOUNT SETUP
// ============================================================
const ADMIN_FILE = path.join(DATA_DIR, 'admin.json');

function ensureAdminAccount() {
  if (!fs.existsSync(ADMIN_FILE)) {
    const username = process.env.ADMIN_USERNAME || 'admin';
    const password = process.env.ADMIN_PASSWORD || 'admin123';
    const hashed = bcrypt.hashSync(password, 10);
    const adminData = { username, password: hashed };
    fs.writeFileSync(ADMIN_FILE, JSON.stringify(adminData, null, 2), 'utf8');
    console.log(`✅ Admin account created: ${username}`);
  }
}

ensureAdminAccount();

// ============================================================
// AUTH ROUTES
// ============================================================
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const admin = JSON.parse(fs.readFileSync(ADMIN_FILE, 'utf8'));
    if (username !== admin.username) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const isMatch = bcrypt.compareSync(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ username: admin.username, role: 'admin' }, process.env.JWT_SECRET, {
      expiresIn: '24h'
    });
    res.json({ token, username: admin.username });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/auth/verify', authMiddleware, (req, res) => {
  res.json({ valid: true, user: req.user });
});

// ============================================================
// CATEGORIES ROUTES
// ============================================================

// GET all categories (public)
app.get('/api/categories', (req, res) => {
  const categories = readData('categories.json');
  const { type } = req.query;
  if (type) {
    return res.json(categories.filter(c => c.type === type));
  }
  res.json(categories);
});

// POST create category (admin)
app.post('/api/categories', authMiddleware, (req, res) => {
  try {
    const categories = readData('categories.json');
    const { name, type, description } = req.body;
    if (!name || !type) {
      return res.status(400).json({ error: 'Name and type are required' });
    }
    const newCat = {
      id: `cat-${uuidv4().slice(0, 8)}`,
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]+/g, '-').replace(/^-|-$/g, ''),
      type,
      description: description || '',
      createdAt: new Date().toISOString()
    };
    categories.push(newCat);
    writeData('categories.json', categories);
    res.status(201).json(newCat);
  } catch (err) {
    console.error('Create category error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT update category (admin)
app.put('/api/categories/:id', authMiddleware, (req, res) => {
  try {
    const categories = readData('categories.json');
    const idx = categories.findIndex(c => c.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Category not found' });

    const { name, type, description } = req.body;
    if (name !== undefined) {
      categories[idx].name = name;
      categories[idx].slug = name.toLowerCase().replace(/[^a-z0-9àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]+/g, '-').replace(/^-|-$/g, '');
    }
    if (type !== undefined) categories[idx].type = type;
    if (description !== undefined) categories[idx].description = description;

    writeData('categories.json', categories);
    res.json(categories[idx]);
  } catch (err) {
    console.error('Update category error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE category (admin)
app.delete('/api/categories/:id', authMiddleware, (req, res) => {
  try {
    let categories = readData('categories.json');
    if (!categories.find(c => c.id === req.params.id)) {
      return res.status(404).json({ error: 'Category not found' });
    }
    categories = categories.filter(c => c.id !== req.params.id);
    writeData('categories.json', categories);
    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================================
// PRODUCTS ROUTES
// ============================================================

// GET all products (public)
app.get('/api/products', (req, res) => {
  const products = readData('products.json');
  res.json(products);
});

// GET featured products (public)
app.get('/api/products/featured', (req, res) => {
  const products = readData('products.json');
  const featured = products.filter(p => p.featured);
  res.json(featured);
});

// GET single product by slug (public)
app.get('/api/products/:slug', (req, res) => {
  const products = readData('products.json');
  const product = products.find(p => p.slug === req.params.slug || p.id === req.params.slug);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

// POST create product (admin)
app.post('/api/products', authMiddleware, upload.single('image'), (req, res) => {
  try {
    const products = readData('products.json');
    const { name, slug, category, shortDesc, description, specs, usage, packaging, storage: storageInfo, featured,
      highlights, uses, targets, ingredients, sensorySpecs, qualitySpecs, usageNote, weight, shelfLife, shippingStandard, qualityCommitment
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Tên sản phẩm không được để trống' });
    }

    const newProduct = {
      id: `prod-${uuidv4().slice(0, 8)}`,
      name: name.trim(),
      slug: slug || toSlug(name),
      category: category || 'Chưa phân loại',
      shortDesc: shortDesc || '',
      description: description || '',
      specs: specs ? (typeof specs === 'string' ? JSON.parse(specs) : specs) : {},
      usage: usage || '',
      packaging: packaging || '',
      storage: storageInfo || '',
      image: req.file ? `/uploads/${req.file.filename}` : '',
      featured: featured === 'true' || featured === true,
      highlights: highlights ? (typeof highlights === 'string' ? JSON.parse(highlights) : highlights) : [],
      uses: uses ? (typeof uses === 'string' ? JSON.parse(uses) : uses) : [],
      targets: targets ? (typeof targets === 'string' ? JSON.parse(targets) : targets) : [],
      ingredients: ingredients || '',
      sensorySpecs: sensorySpecs ? (typeof sensorySpecs === 'string' ? JSON.parse(sensorySpecs) : sensorySpecs) : [],
      qualitySpecs: qualitySpecs ? (typeof qualitySpecs === 'string' ? JSON.parse(qualitySpecs) : qualitySpecs) : [],
      usageNote: usageNote || '',
      weight: weight || '',
      shelfLife: shelfLife || '',
      shippingStandard: shippingStandard || '',
      qualityCommitment: qualityCommitment || '',
      createdAt: new Date().toISOString()
    };

    products.push(newProduct);
    writeData('products.json', products);
    res.status(201).json(newProduct);
  } catch (err) {
    console.error('Create product error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT update product (admin)
app.put('/api/products/:id', authMiddleware, upload.single('image'), (req, res) => {
  try {
    const products = readData('products.json');
    const idx = products.findIndex(p => p.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Product not found' });
    const { name, slug, category, shortDesc, description, specs, usage, packaging, storage: storageInfo, featured,
      highlights, uses, targets, ingredients, sensorySpecs, qualitySpecs, usageNote, weight, shelfLife, shippingStandard, qualityCommitment
    } = req.body;

    if (name !== undefined) products[idx].name = name;
    if (slug !== undefined) products[idx].slug = slug;
    if (category !== undefined) products[idx].category = category;
    if (shortDesc !== undefined) products[idx].shortDesc = shortDesc;
    if (description !== undefined) products[idx].description = description;
    if (specs !== undefined) products[idx].specs = typeof specs === 'string' ? JSON.parse(specs) : specs;
    if (usage !== undefined) products[idx].usage = usage;
    if (packaging !== undefined) products[idx].packaging = packaging;
    if (storageInfo !== undefined) products[idx].storage = storageInfo;
    if (featured !== undefined) products[idx].featured = featured === 'true' || featured === true;
    
    if (highlights !== undefined) products[idx].highlights = typeof highlights === 'string' ? JSON.parse(highlights) : highlights;
    if (uses !== undefined) products[idx].uses = typeof uses === 'string' ? JSON.parse(uses) : uses;
    if (targets !== undefined) products[idx].targets = typeof targets === 'string' ? JSON.parse(targets) : targets;
    if (ingredients !== undefined) products[idx].ingredients = ingredients;
    if (sensorySpecs !== undefined) products[idx].sensorySpecs = typeof sensorySpecs === 'string' ? JSON.parse(sensorySpecs) : sensorySpecs;
    if (qualitySpecs !== undefined) products[idx].qualitySpecs = typeof qualitySpecs === 'string' ? JSON.parse(qualitySpecs) : qualitySpecs;
    if (usageNote !== undefined) products[idx].usageNote = usageNote;
    if (weight !== undefined) products[idx].weight = weight;
    if (shelfLife !== undefined) products[idx].shelfLife = shelfLife;
    if (shippingStandard !== undefined) products[idx].shippingStandard = shippingStandard;
    if (qualityCommitment !== undefined) products[idx].qualityCommitment = qualityCommitment;

    if (req.file) {
      // Delete old image if exists
      if (products[idx].image) {
        const oldPath = path.join(__dirname, products[idx].image);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      products[idx].image = `/uploads/${req.file.filename}`;
    }

    writeData('products.json', products);
    res.json(products[idx]);
  } catch (err) {
    console.error('Update product error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE product (admin)
app.delete('/api/products/:id', authMiddleware, (req, res) => {
  try {
    let products = readData('products.json');
    const product = products.find(p => p.id === req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    // Delete image file
    if (product.image) {
      const imgPath = path.join(__dirname, product.image);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    products = products.filter(p => p.id !== req.params.id);
    writeData('products.json', products);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================================
// NEWS ROUTES
// ============================================================

// GET all news (public)
app.get('/api/news', (req, res) => {
  const news = readData('news.json');
  // Sort by newest first
  news.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(news);
});

// GET single news by slug (public)
app.get('/api/news/:slug', (req, res) => {
  const news = readData('news.json');
  const article = news.find(n => n.slug === req.params.slug || n.id === req.params.slug);
  if (!article) return res.status(404).json({ error: 'Article not found' });
  res.json(article);
});

// POST create news (admin)
app.post('/api/news', authMiddleware, upload.single('image'), (req, res) => {
  try {
    const news = readData('news.json');
    const { title, slug, category, summary, content } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Tiêu đề không được để trống' });
    }

    const newArticle = {
      id: `news-${uuidv4().slice(0, 8)}`,
      title: title.trim(),
      slug: slug || toSlug(title),
      category: category || 'Tin doanh nghiệp',
      summary: summary || '',
      content: content || '',
      image: req.file ? `/uploads/${req.file.filename}` : '',
      createdAt: new Date().toISOString()
    };

    news.push(newArticle);
    writeData('news.json', news);
    res.status(201).json(newArticle);
  } catch (err) {
    console.error('Create news error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT update news (admin)
app.put('/api/news/:id', authMiddleware, upload.single('image'), (req, res) => {
  try {
    const news = readData('news.json');
    const idx = news.findIndex(n => n.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Article not found' });

    const { title, slug, category, summary, content } = req.body;

    if (title !== undefined) news[idx].title = title;
    if (slug !== undefined) news[idx].slug = slug;
    if (category !== undefined) news[idx].category = category;
    if (summary !== undefined) news[idx].summary = summary;
    if (content !== undefined) news[idx].content = content;
    if (req.file) {
      if (news[idx].image) {
        const oldPath = path.join(__dirname, news[idx].image);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      news[idx].image = `/uploads/${req.file.filename}`;
    }

    writeData('news.json', news);
    res.json(news[idx]);
  } catch (err) {
    console.error('Update news error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE news (admin)
app.delete('/api/news/:id', authMiddleware, (req, res) => {
  try {
    let news = readData('news.json');
    const article = news.find(n => n.id === req.params.id);
    if (!article) return res.status(404).json({ error: 'Article not found' });

    if (article.image) {
      const imgPath = path.join(__dirname, article.image);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    news = news.filter(n => n.id !== req.params.id);
    writeData('news.json', news);
    res.json({ message: 'Article deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================================
// GALLERY ROUTES
// ============================================================

// GET gallery (public)
app.get('/api/gallery', (req, res) => {
  try {
    const gallery = readData('gallery.json');
    res.json(gallery);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST add gallery image (admin)
app.post('/api/gallery', authMiddleware, upload.single('image'), (req, res) => {
  try {
    const { title } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Tiêu đề ảnh không được để trống' });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'Vui lòng chọn ảnh để tải lên' });
    }

    const gallery = readData('gallery.json');
    const newImage = {
      id: `img-${Date.now()}`,
      title: title.trim(),
      image: `/uploads/${req.file.filename}`,
      createdAt: new Date().toISOString()
    };

    gallery.unshift(newImage);
    writeData('gallery.json', gallery);
    res.json(newImage);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE gallery image (admin)
app.delete('/api/gallery/:id', authMiddleware, (req, res) => {
  try {
    let gallery = readData('gallery.json');
    const imageItem = gallery.find(g => g.id === req.params.id);
    if (!imageItem) return res.status(404).json({ error: 'Image not found' });

    if (imageItem.image) {
      const imgPath = path.join(__dirname, imageItem.image);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    gallery = gallery.filter(g => g.id !== req.params.id);
    writeData('gallery.json', gallery);
    res.json({ message: 'Image deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================================
// SETTINGS ROUTES
// ============================================================

// GET settings (public)
app.get('/api/settings', (req, res) => {
  const settings = readData('settings.json');
  res.json(settings);
});

// PUT update settings (admin)
app.put('/api/settings', authMiddleware, (req, res) => {
  try {
    const currentSettings = readData('settings.json');
    const updatedSettings = { ...currentSettings, ...req.body };
    writeData('settings.json', updatedSettings);
    res.json(updatedSettings);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================================
// CONTACTS ROUTES
// ============================================================

// POST submit contact (public)
app.post('/api/contacts', (req, res) => {
  try {
    const contacts = readData('contacts.json');
    const { name, email, phone, company, subject, message } = req.body;

    if (!name || !phone || !message) {
      return res.status(400).json({ error: 'Name, phone and message are required' });
    }

    const newContact = {
      id: `contact-${uuidv4().slice(0, 8)}`,
      name,
      email: email || '',
      phone,
      company: company || '',
      subject: subject || '',
      message,
      status: 'new',
      createdAt: new Date().toISOString()
    };

    contacts.push(newContact);
    writeData('contacts.json', contacts);
    res.status(201).json({ message: 'Contact submitted successfully', id: newContact.id });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET all contacts (admin)
app.get('/api/contacts', authMiddleware, (req, res) => {
  const contacts = readData('contacts.json');
  contacts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(contacts);
});

// PUT update contact status (admin)
app.put('/api/contacts/:id', authMiddleware, (req, res) => {
  try {
    const contacts = readData('contacts.json');
    const idx = contacts.findIndex(c => c.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Contact not found' });

    if (req.body.status) contacts[idx].status = req.body.status;

    writeData('contacts.json', contacts);
    res.json(contacts[idx]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE contact (admin)
app.delete('/api/contacts/:id', authMiddleware, (req, res) => {
  try {
    let contacts = readData('contacts.json');
    contacts = contacts.filter(c => c.id !== req.params.id);
    writeData('contacts.json', contacts);
    res.json({ message: 'Contact deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================================
// UPLOAD IMAGE ROUTE (general purpose)
// ============================================================
app.post('/api/upload', authMiddleware, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  res.json({ url: `/uploads/${req.file.filename}` });
});

// ============================================================
// DASHBOARD STATS (admin)
// ============================================================
app.get('/api/dashboard', authMiddleware, (req, res) => {
  const products = readData('products.json');
  const news = readData('news.json');
  const contacts = readData('contacts.json');
  const categories = readData('categories.json');
  const newContacts = contacts.filter(c => c.status === 'new');

  res.json({
    totalProducts: products.length,
    totalNews: news.length,
    totalContacts: contacts.length,
    totalCategories: categories.length,
    newContacts: newContacts.length
  });
});

// ============================================================
// START SERVER
// ============================================================
app.listen(PORT, () => {
  console.log(`🚀 Dong Tam Feed API Server running on http://localhost:${PORT}`);
  console.log(`📁 Data directory: ${DATA_DIR}`);
  console.log(`📸 Uploads directory: ${path.join(__dirname, 'uploads')}`);
});
