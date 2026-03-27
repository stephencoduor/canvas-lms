const pptxgen = require('pptxgenjs');
const fs = require('fs');

const pptx = new pptxgen();
pptx.layout = 'LAYOUT_WIDE'; // 13.33 x 7.5
pptx.author = 'ReDefiners Development Team';
pptx.company = 'ReDefiners World Languages';
pptx.subject = 'Security & Performance Technical Overview';

const PRIMARY = '163B32';
const PRIMARY_LIGHT = '1E4D42';
const ACCENT = '2DB88A';
const ORANGE = 'FF6B35';
const DARK = '0F2922';
const WHITE = 'FFFFFF';
const LIGHT_BG = 'F0F7F4';
const GRAY = '666666';
const LIGHT_GRAY = 'E8E8E8';

// ═══════════════════════════════════════
// SLIDE 1: Title
// ═══════════════════════════════════════
let slide = pptx.addSlide();
slide.background = { fill: DARK };
// Accent bar at top
slide.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 13.33, h: 0.08, fill: { color: ACCENT } });
// Left accent stripe
slide.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 0.15, h: 7.5, fill: { color: ACCENT } });
// Title
slide.addText('ReDefiners Canvas LMS', { x: 1.0, y: 2.0, w: 11, h: 1.2, fontSize: 44, bold: true, color: WHITE, fontFace: 'Arial' });
slide.addText('Technical Overview', { x: 1.0, y: 3.2, w: 11, h: 0.8, fontSize: 32, color: ACCENT, fontFace: 'Arial' });
// Divider
slide.addShape(pptx.shapes.RECTANGLE, { x: 1.0, y: 4.2, w: 3, h: 0.04, fill: { color: ORANGE } });
slide.addText('Security, Performance & Architecture | March 2026', { x: 1.0, y: 4.5, w: 11, h: 0.5, fontSize: 16, color: GRAY, fontFace: 'Arial' });
// Bottom bar
slide.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 7.0, w: 13.33, h: 0.5, fill: { color: PRIMARY } });
slide.addText('https://fineract.us', { x: 1.0, y: 7.05, w: 5, h: 0.4, fontSize: 12, color: ACCENT, fontFace: 'Arial' });

// ═══════════════════════════════════════
// SLIDE 2: Project Overview
// ═══════════════════════════════════════
slide = pptx.addSlide();
slide.background = { fill: WHITE };
slide.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 13.33, h: 0.08, fill: { color: ACCENT } });
slide.addText('Project Overview', { x: 0.8, y: 0.4, w: 11, h: 0.7, fontSize: 32, bold: true, color: PRIMARY, fontFace: 'Arial' });

// Stats row - big numbers
const stats = [
  { num: '155+', label: 'Routes', color: PRIMARY },
  { num: '110', label: 'Pages', color: ACCENT },
  { num: '3', label: 'Themes', color: ORANGE },
  { num: '5', label: 'Login Variants', color: PRIMARY_LIGHT },
];
stats.forEach((s, i) => {
  const x = 0.8 + i * 3.1;
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x, y: 1.5, w: 2.8, h: 1.6, fill: { color: LIGHT_BG }, rectRadius: 0.1 });
  slide.addText(s.num, { x, y: 1.6, w: 2.8, h: 0.8, fontSize: 36, bold: true, color: s.color, align: 'center', fontFace: 'Arial' });
  slide.addText(s.label, { x, y: 2.4, w: 2.8, h: 0.5, fontSize: 14, color: GRAY, align: 'center', fontFace: 'Arial' });
});

// Bullet points
const overview = [
  'Custom React SPA frontend replacing default Canvas UI',
  'Deployed at https://fineract.us on Hostinger VPS (8GB RAM, 2 vCPU)',
  'Docker Compose architecture: web, jobs, postgres, redis, nginx',
  'GitHub Actions CI/CD with auto-deploy on push',
  'SSL/TLS via Let\'s Encrypt with auto-renewal',
];
overview.forEach((text, i) => {
  slide.addShape(pptx.shapes.OVAL, { x: 1.0, y: 3.6 + i * 0.65, w: 0.12, h: 0.12, fill: { color: ACCENT } });
  slide.addText(text, { x: 1.3, y: 3.45 + i * 0.65, w: 11, h: 0.5, fontSize: 15, color: '333333', fontFace: 'Arial' });
});

// ═══════════════════════════════════════
// SLIDE 3: Architecture
// ═══════════════════════════════════════
slide = pptx.addSlide();
slide.background = { fill: DARK };
slide.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 13.33, h: 0.08, fill: { color: ACCENT } });
slide.addText('System Architecture', { x: 0.8, y: 0.4, w: 11, h: 0.7, fontSize: 32, bold: true, color: WHITE, fontFace: 'Arial' });

// Architecture boxes
const boxes = [
  { x: 0.5, y: 1.8, w: 2.3, h: 1.3, label: 'User Browser', sub: 'React SPA', color: PRIMARY_LIGHT },
  { x: 3.5, y: 1.8, w: 2.3, h: 1.3, label: 'Nginx', sub: 'SSL + Reverse Proxy', color: PRIMARY },
  { x: 6.5, y: 1.2, w: 2.3, h: 1.3, label: 'React SPA', sub: '155+ routes at /', color: ACCENT },
  { x: 6.5, y: 2.8, w: 2.3, h: 1.3, label: 'Canvas API', sub: 'Rails 8 at /api/', color: ORANGE },
  { x: 9.5, y: 1.8, w: 1.5, h: 1.3, label: 'PostgreSQL', sub: 'Database', color: '3B82F6' },
  { x: 11.3, y: 1.8, w: 1.5, h: 1.3, label: 'Redis', sub: 'Cache', color: 'EF4444' },
];
boxes.forEach(b => {
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: b.x, y: b.y, w: b.w, h: b.h, fill: { color: b.color }, rectRadius: 0.1 });
  slide.addText(b.label, { x: b.x, y: b.y + 0.2, w: b.w, h: 0.5, fontSize: 14, bold: true, color: WHITE, align: 'center', fontFace: 'Arial' });
  slide.addText(b.sub, { x: b.x, y: b.y + 0.65, w: b.w, h: 0.4, fontSize: 11, color: 'CCCCCC', align: 'center', fontFace: 'Arial' });
});

// Arrows
slide.addShape(pptx.shapes.LINE, { x: 2.8, y: 2.45, w: 0.7, h: 0, line: { color: ACCENT, width: 2, dashType: 'solid', endArrowType: 'triangle' } });
slide.addShape(pptx.shapes.LINE, { x: 5.8, y: 1.85, w: 0.7, h: 0, line: { color: ACCENT, width: 2, endArrowType: 'triangle' } });
slide.addShape(pptx.shapes.LINE, { x: 5.8, y: 3.45, w: 0.7, h: 0, line: { color: ORANGE, width: 2, endArrowType: 'triangle' } });
slide.addShape(pptx.shapes.LINE, { x: 8.8, y: 2.45, w: 0.7, h: 0, line: { color: '3B82F6', width: 2, endArrowType: 'triangle' } });

// CI/CD box at bottom
slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 3.5, y: 5.0, w: 6.3, h: 1.2, fill: { color: PRIMARY }, rectRadius: 0.1 });
slide.addText('GitHub Actions CI/CD Pipeline', { x: 3.5, y: 5.1, w: 6.3, h: 0.5, fontSize: 16, bold: true, color: WHITE, align: 'center', fontFace: 'Arial' });
slide.addText('Push to main  >  Build (Vite)  >  SCP to Server  >  Nginx Reload', { x: 3.5, y: 5.6, w: 6.3, h: 0.4, fontSize: 12, color: ACCENT, align: 'center', fontFace: 'Arial' });

// ═══════════════════════════════════════
// SLIDE 4: Security
// ═══════════════════════════════════════
slide = pptx.addSlide();
slide.background = { fill: WHITE };
slide.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 13.33, h: 0.08, fill: { color: ACCENT } });
slide.addText('Security Improvements', { x: 0.8, y: 0.4, w: 11, h: 0.7, fontSize: 32, bold: true, color: PRIMARY, fontFace: 'Arial' });

const secItems = [
  { icon: 'LOCK', title: 'Authentication', desc: 'Cookie-based sessions, AuthContext, ProtectedRoute, CSRF tokens' },
  { icon: 'SHIELD', title: 'XSS Prevention', desc: 'DOMPurify sanitization, React JSX escaping, CSP headers' },
  { icon: 'CLOUD', title: 'Network Security', desc: 'SSL/TLS, HSTS, X-Frame-Options, Nginx reverse proxy' },
  { icon: 'SERVER', title: 'Infrastructure', desc: 'UFW firewall, Docker isolation, SSH key auth, resource limits' },
  { icon: 'DATABASE', title: 'Data Protection', desc: 'Input validation, env vars for secrets, no sensitive URL params' },
];
secItems.forEach((item, i) => {
  const y = 1.4 + i * 1.1;
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.8, y, w: 11.7, h: 0.9, fill: { color: i % 2 === 0 ? LIGHT_BG : WHITE }, rectRadius: 0.08 });
  slide.addShape(pptx.shapes.OVAL, { x: 1.0, y: y + 0.15, w: 0.6, h: 0.6, fill: { color: PRIMARY } });
  slide.addText(item.title, { x: 1.9, y: y + 0.05, w: 10, h: 0.4, fontSize: 16, bold: true, color: PRIMARY, fontFace: 'Arial' });
  slide.addText(item.desc, { x: 1.9, y: y + 0.45, w: 10, h: 0.35, fontSize: 13, color: GRAY, fontFace: 'Arial' });
});

// ═══════════════════════════════════════
// SLIDE 5: Performance Results
// ═══════════════════════════════════════
slide = pptx.addSlide();
slide.background = { fill: WHITE };
slide.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 13.33, h: 0.08, fill: { color: ACCENT } });
slide.addText('Performance Results', { x: 0.8, y: 0.4, w: 11, h: 0.7, fontSize: 32, bold: true, color: PRIMARY, fontFace: 'Arial' });
slide.addText('Measured with Puppeteer + Chrome DevTools Protocol', { x: 0.8, y: 1.0, w: 11, h: 0.4, fontSize: 13, italic: true, color: GRAY, fontFace: 'Arial' });

const perfData = [
  ['Metric', 'Average', 'Grade', 'Target'],
  ['TTFB', '176ms', 'GOOD', '< 200ms'],
  ['FCP', '567ms', 'GOOD', '< 1800ms'],
  ['CLS', '0.000', 'GOOD', '< 0.1'],
  ['DOM Interactive', '210ms', 'GOOD', '< 500ms'],
  ['Full Page Load', '1687ms', 'GOOD', '< 3000ms'],
  ['JS Heap', '21.3MB', 'OK', '< 50MB'],
];
const tableRows = perfData.map((row, i) => {
  const isHeader = i === 0;
  return row.map((cell, j) => ({
    text: cell,
    options: {
      fontSize: isHeader ? 13 : 14,
      bold: isHeader || j === 0,
      color: isHeader ? WHITE : (j === 2 ? (cell === 'GOOD' ? '2E7D32' : 'E65100') : '333333'),
      fill: { color: isHeader ? PRIMARY : (i % 2 === 0 ? LIGHT_BG : WHITE) },
      align: j === 0 ? 'left' : 'center',
      fontFace: 'Arial',
      margin: [5, 8, 5, 8],
    },
  }));
});
slide.addTable(tableRows, { x: 1.5, y: 1.6, w: 10.3, colW: [2.8, 2.0, 2.5, 3.0], border: { pt: 0.5, color: LIGHT_GRAY } });

// ═══════════════════════════════════════
// SLIDE 6: Bundle Optimization
// ═══════════════════════════════════════
slide = pptx.addSlide();
slide.background = { fill: DARK };
slide.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 13.33, h: 0.08, fill: { color: ACCENT } });
slide.addText('Bundle Optimization', { x: 0.8, y: 0.4, w: 11, h: 0.7, fontSize: 32, bold: true, color: WHITE, fontFace: 'Arial' });

const bundleStats = [
  { num: '155+', label: 'Lazy Chunks', desc: 'Each route loads only its own code' },
  { num: '341KB', label: 'Main Bundle', desc: 'Down from ~2MB monolithic' },
  { num: '30d', label: 'Cache TTL', desc: 'Immutable static assets' },
  { num: 'GZIP', label: 'Compression', desc: 'Nginx compresses all text' },
];
bundleStats.forEach((s, i) => {
  const x = 0.5 + i * 3.2;
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x, y: 1.5, w: 2.9, h: 2.2, fill: { color: PRIMARY }, rectRadius: 0.1 });
  slide.addText(s.num, { x, y: 1.7, w: 2.9, h: 0.8, fontSize: 32, bold: true, color: ACCENT, align: 'center', fontFace: 'Arial' });
  slide.addText(s.label, { x, y: 2.4, w: 2.9, h: 0.4, fontSize: 15, bold: true, color: WHITE, align: 'center', fontFace: 'Arial' });
  slide.addText(s.desc, { x, y: 2.85, w: 2.9, h: 0.5, fontSize: 12, color: 'AAAAAA', align: 'center', fontFace: 'Arial' });
});

const optimizations = [
  'Vendor chunk separation (React, Router, TanStack Query)',
  'Tree shaking for Lucide icons (individual imports)',
  'DOMPurify in separate 22KB chunk (loaded on demand)',
  'TanStack Query caching with staleTime=60s',
];
optimizations.forEach((text, i) => {
  slide.addShape(pptx.shapes.OVAL, { x: 1.0, y: 4.3 + i * 0.6, w: 0.1, h: 0.1, fill: { color: ACCENT } });
  slide.addText(text, { x: 1.3, y: 4.15 + i * 0.6, w: 11, h: 0.45, fontSize: 14, color: 'CCCCCC', fontFace: 'Arial' });
});

// ═══════════════════════════════════════
// SLIDE 7: Theme System
// ═══════════════════════════════════════
slide = pptx.addSlide();
slide.background = { fill: WHITE };
slide.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 13.33, h: 0.08, fill: { color: ACCENT } });
slide.addText('Theme System', { x: 0.8, y: 0.4, w: 11, h: 0.7, fontSize: 32, bold: true, color: PRIMARY, fontFace: 'Arial' });

const themes = [
  { name: 'Modern Dark Accent', sidebar: DARK, accent: ORANGE, desc: 'Default theme with dark teal sidebar and orange accents' },
  { name: 'Teal Classic', sidebar: PRIMARY_LIGHT, accent: ACCENT, desc: 'Professional teal with green accent colors' },
  { name: 'Midnight Blue', sidebar: '1a1a2e', accent: '4FC3F7', desc: 'Dark navy with cool blue highlights' },
];
themes.forEach((t, i) => {
  const x = 0.5 + i * 4.2;
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x, y: 1.5, w: 3.9, h: 2.5, fill: { color: LIGHT_BG }, rectRadius: 0.1 });
  // Color swatch
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: x + 0.3, y: 1.7, w: 1.5, h: 0.8, fill: { color: t.sidebar }, rectRadius: 0.05 });
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: x + 2.0, y: 1.7, w: 1.5, h: 0.8, fill: { color: t.accent }, rectRadius: 0.05 });
  slide.addText('Sidebar', { x: x + 0.3, y: 1.75, w: 1.5, h: 0.7, fontSize: 10, color: WHITE, align: 'center', fontFace: 'Arial' });
  slide.addText('Accent', { x: x + 2.0, y: 1.75, w: 1.5, h: 0.7, fontSize: 10, color: WHITE, align: 'center', fontFace: 'Arial' });
  slide.addText(t.name, { x: x + 0.2, y: 2.7, w: 3.5, h: 0.4, fontSize: 15, bold: true, color: PRIMARY, fontFace: 'Arial' });
  slide.addText(t.desc, { x: x + 0.2, y: 3.1, w: 3.5, h: 0.6, fontSize: 11, color: GRAY, fontFace: 'Arial' });
});

slide.addText('Features:', { x: 0.8, y: 4.4, w: 11, h: 0.4, fontSize: 14, bold: true, color: PRIMARY, fontFace: 'Arial' });
['Runtime switching via CSS custom properties', '5 login page variants (Classic, Aurora, Glass, Minimal, Landscape)', 'Theme persisted in localStorage', 'ThemeContext provides state to all components'].forEach((t, i) => {
  slide.addShape(pptx.shapes.OVAL, { x: 1.0, y: 5.0 + i * 0.55, w: 0.1, h: 0.1, fill: { color: ACCENT } });
  slide.addText(t, { x: 1.3, y: 4.85 + i * 0.55, w: 11, h: 0.45, fontSize: 13, color: '333333', fontFace: 'Arial' });
});

// ═══════════════════════════════════════
// SLIDE 8: Testing
// ═══════════════════════════════════════
slide = pptx.addSlide();
slide.background = { fill: WHITE };
slide.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 13.33, h: 0.08, fill: { color: ACCENT } });
slide.addText('Testing & Verification', { x: 0.8, y: 0.4, w: 11, h: 0.7, fontSize: 32, bold: true, color: PRIMARY, fontFace: 'Arial' });

// Pipeline steps
slide.addText('Mandatory 5-Step Pipeline', { x: 0.8, y: 1.3, w: 11, h: 0.4, fontSize: 16, bold: true, color: PRIMARY, fontFace: 'Arial' });
const steps = ['BUILD', 'DEPLOY', 'VERIFY', 'STORE', 'COMMIT'];
steps.forEach((s, i) => {
  const x = 0.8 + i * 2.5;
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x, y: 1.9, w: 2.0, h: 0.7, fill: { color: PRIMARY }, rectRadius: 0.05 });
  slide.addText(s, { x, y: 1.95, w: 2.0, h: 0.6, fontSize: 14, bold: true, color: WHITE, align: 'center', fontFace: 'Arial' });
  if (i < 4) {
    slide.addShape(pptx.shapes.LINE, { x: x + 2.0, y: 2.25, w: 0.5, h: 0, line: { color: ACCENT, width: 2, endArrowType: 'triangle' } });
  }
});

// Stats
const testStats = [
  { num: '132+', label: 'Screenshots Verified' },
  { num: '23', label: 'CRUD Operations Tested' },
  { num: '10', label: 'DevTools Audits' },
  { num: '3', label: 'Persona Types Tested' },
];
testStats.forEach((s, i) => {
  const x = 0.5 + i * 3.2;
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x, y: 3.2, w: 2.9, h: 1.4, fill: { color: LIGHT_BG }, rectRadius: 0.1 });
  slide.addText(s.num, { x, y: 3.3, w: 2.9, h: 0.7, fontSize: 28, bold: true, color: PRIMARY, align: 'center', fontFace: 'Arial' });
  slide.addText(s.label, { x, y: 4.0, w: 2.9, h: 0.4, fontSize: 12, color: GRAY, align: 'center', fontFace: 'Arial' });
});

// Testing types
['Chrome DevTools Protocol performance audit (TTFB, FCP, CLS, heap)', 'Network waterfall analysis and failed request monitoring', 'CRUD tested for Admin, Teacher, Student personas', 'Console error monitoring across all 155+ routes'].forEach((t, i) => {
  slide.addShape(pptx.shapes.OVAL, { x: 1.0, y: 5.1 + i * 0.55, w: 0.1, h: 0.1, fill: { color: ACCENT } });
  slide.addText(t, { x: 1.3, y: 4.95 + i * 0.55, w: 11, h: 0.45, fontSize: 13, color: '333333', fontFace: 'Arial' });
});

// ═══════════════════════════════════════
// SLIDE 9: Tech Stack
// ═══════════════════════════════════════
slide = pptx.addSlide();
slide.background = { fill: DARK };
slide.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 13.33, h: 0.08, fill: { color: ACCENT } });
slide.addText('Technology Stack', { x: 0.8, y: 0.4, w: 11, h: 0.7, fontSize: 32, bold: true, color: WHITE, fontFace: 'Arial' });

// Frontend column
slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.5, y: 1.3, w: 5.9, h: 5.5, fill: { color: PRIMARY }, rectRadius: 0.1 });
slide.addText('Frontend', { x: 0.5, y: 1.4, w: 5.9, h: 0.5, fontSize: 20, bold: true, color: ACCENT, align: 'center', fontFace: 'Arial' });
const frontend = ['React 19 + TypeScript', 'Vite (build + HMR)', 'Tailwind CSS', 'shadcn/ui Components', 'React Router v7', 'TanStack Query v5', 'DOMPurify', 'TinyMCE Editor', 'Lucide React Icons'];
frontend.forEach((t, i) => {
  slide.addShape(pptx.shapes.OVAL, { x: 1.0, y: 2.1 + i * 0.5, w: 0.08, h: 0.08, fill: { color: ACCENT } });
  slide.addText(t, { x: 1.3, y: 1.97 + i * 0.5, w: 4.8, h: 0.4, fontSize: 14, color: 'CCCCCC', fontFace: 'Arial' });
});

// Backend column
slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 6.9, y: 1.3, w: 5.9, h: 5.5, fill: { color: PRIMARY }, rectRadius: 0.1 });
slide.addText('Backend & Infrastructure', { x: 6.9, y: 1.4, w: 5.9, h: 0.5, fontSize: 20, bold: true, color: ORANGE, align: 'center', fontFace: 'Arial' });
const backend = ['Canvas LMS (Rails 8)', 'PostgreSQL 14', 'Redis 7', 'Nginx (SSL + Proxy)', 'Docker Compose', 'Certbot (Let\'s Encrypt)', 'GitHub Actions CI/CD', 'Hostinger VPS', 'UFW Firewall'];
backend.forEach((t, i) => {
  slide.addShape(pptx.shapes.OVAL, { x: 7.4, y: 2.1 + i * 0.5, w: 0.08, h: 0.08, fill: { color: ORANGE } });
  slide.addText(t, { x: 7.7, y: 1.97 + i * 0.5, w: 4.8, h: 0.4, fontSize: 14, color: 'CCCCCC', fontFace: 'Arial' });
});

// ═══════════════════════════════════════
// SLIDE 10: Data Summary
// ═══════════════════════════════════════
slide = pptx.addSlide();
slide.background = { fill: WHITE };
slide.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 13.33, h: 0.08, fill: { color: ACCENT } });
slide.addText('Seeded Data Summary', { x: 0.8, y: 0.4, w: 11, h: 0.7, fontSize: 32, bold: true, color: PRIMARY, fontFace: 'Arial' });

const dataItems = [
  { num: '34', label: 'Users', detail: '5 teachers, 24 students, 5 admin', color: PRIMARY },
  { num: '11', label: 'Courses', detail: 'Spanish, Biology, English, CS, Math +6 more', color: ACCENT },
  { num: '86', label: 'Assignments', detail: 'Essays, labs, presentations, quizzes', color: ORANGE },
  { num: '30', label: 'Quizzes', detail: '3 per course: midterm, vocab, final', color: '3B82F6' },
  { num: '1,014', label: 'Submissions', detail: 'Graded with realistic scores', color: '8B5CF6' },
  { num: '33', label: 'Discussions', detail: 'Threaded with student replies', color: 'EF4444' },
  { num: '20', label: 'Rubrics', detail: 'Essay + presentation rubrics', color: 'F59E0B' },
  { num: '52', label: 'Wiki Pages', detail: 'Course content and guides', color: '14B8A6' },
];
dataItems.forEach((d, i) => {
  const col = i % 4;
  const row = Math.floor(i / 4);
  const x = 0.5 + col * 3.2;
  const y = 1.4 + row * 2.8;
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x, y, w: 2.9, h: 2.4, fill: { color: LIGHT_BG }, rectRadius: 0.1 });
  slide.addText(d.num, { x, y: y + 0.3, w: 2.9, h: 0.8, fontSize: 36, bold: true, color: d.color, align: 'center', fontFace: 'Arial' });
  slide.addText(d.label, { x, y: y + 1.1, w: 2.9, h: 0.4, fontSize: 16, bold: true, color: PRIMARY, align: 'center', fontFace: 'Arial' });
  slide.addText(d.detail, { x: x + 0.2, y: y + 1.5, w: 2.5, h: 0.6, fontSize: 11, color: GRAY, align: 'center', fontFace: 'Arial' });
});

// ═══════════════════════════════════════
// SLIDE 11: Recommendations
// ═══════════════════════════════════════
slide = pptx.addSlide();
slide.background = { fill: WHITE };
slide.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 13.33, h: 0.08, fill: { color: ACCENT } });
slide.addText('Recommendations', { x: 0.8, y: 0.4, w: 11, h: 0.7, fontSize: 32, bold: true, color: PRIMARY, fontFace: 'Arial' });

const recs = [
  { title: 'CDN (CloudFlare)', desc: 'Static asset delivery + DDoS protection', priority: 'High' },
  { title: 'WebSocket Notifications', desc: 'Real-time alerts for messages and grades', priority: 'High' },
  { title: 'PWA + Service Worker', desc: 'Offline access and app-like experience', priority: 'Medium' },
  { title: 'E2E Tests (Playwright)', desc: 'Automated regression testing', priority: 'High' },
  { title: 'Sentry Error Monitoring', desc: 'Production error tracking and alerting', priority: 'Medium' },
  { title: 'i18n (Multi-language)', desc: 'Support for Spanish, French, and more', priority: 'Low' },
];
recs.forEach((r, i) => {
  const y = 1.3 + i * 0.95;
  const prColor = r.priority === 'High' ? 'E53935' : r.priority === 'Medium' ? 'FB8C00' : '43A047';
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.8, y, w: 11.7, h: 0.8, fill: { color: i % 2 === 0 ? LIGHT_BG : WHITE }, rectRadius: 0.06 });
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 1.0, y: y + 0.2, w: 0.5, h: 0.4, fill: { color: prColor }, rectRadius: 0.05 });
  slide.addText(r.priority, { x: 1.0, y: y + 0.2, w: 0.5, h: 0.4, fontSize: 8, bold: true, color: WHITE, align: 'center', fontFace: 'Arial' });
  slide.addText(r.title, { x: 1.7, y: y + 0.05, w: 10, h: 0.35, fontSize: 15, bold: true, color: PRIMARY, fontFace: 'Arial' });
  slide.addText(r.desc, { x: 1.7, y: y + 0.4, w: 10, h: 0.3, fontSize: 12, color: GRAY, fontFace: 'Arial' });
});

// ═══════════════════════════════════════
// SLIDE 12: Thank You
// ═══════════════════════════════════════
slide = pptx.addSlide();
slide.background = { fill: DARK };
slide.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 13.33, h: 0.08, fill: { color: ACCENT } });
slide.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 0.15, h: 7.5, fill: { color: ACCENT } });

slide.addText('Thank You', { x: 1.0, y: 2.2, w: 11, h: 1.2, fontSize: 48, bold: true, color: WHITE, fontFace: 'Arial' });
slide.addShape(pptx.shapes.RECTANGLE, { x: 1.0, y: 3.5, w: 3, h: 0.04, fill: { color: ORANGE } });

slide.addText('ReDefiners World Languages', { x: 1.0, y: 4.0, w: 11, h: 0.5, fontSize: 18, color: ACCENT, fontFace: 'Arial' });
slide.addText('https://fineract.us', { x: 1.0, y: 4.6, w: 11, h: 0.4, fontSize: 15, color: 'AAAAAA', fontFace: 'Arial' });
slide.addText('GitHub: stephencoduor/redefiners', { x: 1.0, y: 5.1, w: 11, h: 0.4, fontSize: 15, color: 'AAAAAA', fontFace: 'Arial' });

slide.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 7.0, w: 13.33, h: 0.5, fill: { color: PRIMARY } });
slide.addText('Built with React + Canvas LMS + Tailwind CSS + shadcn/ui', { x: 1.0, y: 7.05, w: 11, h: 0.4, fontSize: 11, color: ACCENT, fontFace: 'Arial' });

// Save
pptx.writeFile({ fileName: 'docs/REDEFINERS_TECHNICAL_OVERVIEW.pptx' })
  .then(() => console.log('Created: docs/REDEFINERS_TECHNICAL_OVERVIEW.pptx'))
  .catch(err => console.error(err));
