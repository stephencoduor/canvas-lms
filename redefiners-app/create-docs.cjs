const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, LevelFormat, HeadingLevel,
  BorderStyle, WidthType, ShadingType, PageNumber, PageBreak,
  TableOfContents, TabStopType, TabStopPosition,
} = require('docx');

const border = { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' };
const borders = { top: border, bottom: border, left: border, right: border };
const cellMargins = { top: 80, bottom: 80, left: 120, right: 120 };

function headerCell(text, width) {
  return new TableCell({
    borders, width: { size: width, type: WidthType.DXA },
    shading: { fill: '163B32', type: ShadingType.CLEAR },
    margins: cellMargins,
    children: [new Paragraph({ children: [new TextRun({ text, bold: true, font: 'Arial', size: 20, color: 'FFFFFF' })] })],
  });
}

function cell(text, width) {
  return new TableCell({
    borders, width: { size: width, type: WidthType.DXA },
    margins: cellMargins,
    children: [new Paragraph({ children: [new TextRun({ text, font: 'Arial', size: 20 })] })],
  });
}

function gradeCell(text, width) {
  const isGood = text.includes('GOOD') || text.includes('OK');
  const isWarn = text.includes('WARN');
  return new TableCell({
    borders, width: { size: width, type: WidthType.DXA },
    shading: { fill: isGood ? 'E8F5E9' : isWarn ? 'FFF3E0' : 'FFFFFF', type: ShadingType.CLEAR },
    margins: cellMargins,
    children: [new Paragraph({ children: [new TextRun({ text, font: 'Arial', size: 20, bold: true, color: isGood ? '2E7D32' : isWarn ? 'E65100' : '000000' })] })],
  });
}

function h1(text) { return new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 360, after: 200 }, children: [new TextRun({ text, bold: true, font: 'Arial', size: 32, color: '163B32' })] }); }
function h2(text) { return new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 280, after: 160 }, children: [new TextRun({ text, bold: true, font: 'Arial', size: 28, color: '1E4D42' })] }); }
function h3(text) { return new Paragraph({ heading: HeadingLevel.HEADING_3, spacing: { before: 200, after: 120 }, children: [new TextRun({ text, bold: true, font: 'Arial', size: 24, color: '2A6355' })] }); }
function p(text) { return new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text, font: 'Arial', size: 22 })] }); }
function bold(text) { return new TextRun({ text, font: 'Arial', size: 22, bold: true }); }

const doc = new Document({
  styles: {
    default: { document: { run: { font: 'Arial', size: 22 } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 32, bold: true, font: 'Arial', color: '163B32' }, paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 28, bold: true, font: 'Arial', color: '1E4D42' }, paragraph: { spacing: { before: 280, after: 160 }, outlineLevel: 1 } },
      { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 24, bold: true, font: 'Arial', color: '2A6355' }, paragraph: { spacing: { before: 200, after: 120 }, outlineLevel: 2 } },
    ],
  },
  numbering: {
    config: [
      { reference: 'bullets', levels: [{ level: 0, format: LevelFormat.BULLET, text: '\u2022', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ],
  },
  sections: [
    // ═══ TITLE PAGE ═══
    {
      properties: {
        page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } },
      },
      children: [
        new Paragraph({ spacing: { before: 4000 } }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [new TextRun({ text: 'ReDefiners Canvas LMS', font: 'Arial', size: 52, bold: true, color: '163B32' })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 400 }, children: [new TextRun({ text: 'Security & Performance Improvements Report', font: 'Arial', size: 32, color: '2A6355' })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: '163B32', space: 1 } }, children: [] }),
        new Paragraph({ spacing: { before: 400 } }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Technical Documentation', font: 'Arial', size: 24, color: '666666' })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'March 2026', font: 'Arial', size: 24, color: '666666' })] }),
        new Paragraph({ spacing: { before: 2000 } }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Prepared by: Development Team', font: 'Arial', size: 20, color: '999999' })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'https://fineract.us', font: 'Arial', size: 20, color: '999999' })] }),
      ],
    },
    // ═══ TOC ═══
    {
      properties: {
        page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } },
      },
      headers: { default: new Header({ children: [new Paragraph({ tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }], children: [new TextRun({ text: 'ReDefiners Canvas LMS', font: 'Arial', size: 18, color: '999999', italics: true }), new TextRun({ text: '\tSecurity & Performance Report', font: 'Arial', size: 18, color: '999999', italics: true })] })] }) },
      footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Page ', font: 'Arial', size: 18, color: '999999' }), new TextRun({ children: [PageNumber.CURRENT], font: 'Arial', size: 18, color: '999999' })] })] }) },
      children: [
        h1('Table of Contents'),
        new TableOfContents('Table of Contents', { hyperlink: true, headingStyleRange: '1-3' }),
        new Paragraph({ children: [new PageBreak()] }),

        // ═══ 1. EXECUTIVE SUMMARY ═══
        h1('1. Executive Summary'),
        p('ReDefiners is a custom React Single Page Application (SPA) frontend built for Instructure Canvas LMS, deployed and serving at https://fineract.us. The platform provides a modern, responsive learning management interface for ReDefiners World Languages, a nonprofit organization focused on language education.'),
        p('This report documents all security hardening measures and performance optimizations implemented during the development and deployment of the ReDefiners Canvas LMS custom frontend.'),
        new Paragraph({ spacing: { after: 200 } }),
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [3120, 6240],
          rows: [
            new TableRow({ children: [headerCell('Metric', 3120), headerCell('Value', 6240)] }),
            new TableRow({ children: [cell('Total Routes', 3120), cell('155+ SPA routes', 6240)] }),
            new TableRow({ children: [cell('React Page Components', 3120), cell('110 unique pages', 6240)] }),
            new TableRow({ children: [cell('Theme Variants', 3120), cell('3 (Modern Dark, Teal Classic, Midnight Blue)', 6240)] }),
            new TableRow({ children: [cell('Login Variants', 3120), cell('5 (Classic, Aurora, Glassmorphism, Minimal, Landscape)', 6240)] }),
            new TableRow({ children: [cell('Server', 3120), cell('Hostinger VPS (8GB RAM, 2 vCPU, 96GB SSD)', 6240)] }),
            new TableRow({ children: [cell('Architecture', 3120), cell('Docker Compose (5 services: web, jobs, postgres, redis, nginx)', 6240)] }),
            new TableRow({ children: [cell('CI/CD', 3120), cell('GitHub Actions (auto-build + deploy on push)', 6240)] }),
            new TableRow({ children: [cell('SSL', 3120), cell('Let\'s Encrypt with auto-renewal via Certbot', 6240)] }),
          ],
        }),

        new Paragraph({ children: [new PageBreak()] }),

        // ═══ 2. SECURITY ═══
        h1('2. Security Improvements'),
        p('The following security measures have been implemented to protect the platform, user data, and infrastructure from common web application vulnerabilities.'),

        h2('2.1 Authentication & Session Management'),
        new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: [new TextRun({ text: 'Canvas session cookie-based authentication with HttpOnly, Secure, and SameSite=Strict flags', font: 'Arial', size: 22 })] }),
        new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: [new TextRun({ text: 'AuthContext with automatic session validation on app load via /api/v1/users/self/profile', font: 'Arial', size: 22 })] }),
        new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: [new TextRun({ text: 'ProtectedRoute component redirects unauthenticated users to /login', font: 'Arial', size: 22 })] }),
        new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: [new TextRun({ text: 'Automatic cleanup of auth state on logout (sessionStorage cleared)', font: 'Arial', size: 22 })] }),
        new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: [new TextRun({ text: 'CSRF protection via Canvas authenticity tokens on all state-changing requests', font: 'Arial', size: 22 })] }),

        h2('2.2 API Security'),
        new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: [new TextRun({ text: 'All API calls proxied through Nginx reverse proxy (backend never directly exposed)', font: 'Arial', size: 22 })] }),
        new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: [new TextRun({ text: 'Request validation and comprehensive error handling in canvasApi.ts service layer', font: 'Arial', size: 22 })] }),
        new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: [new TextRun({ text: 'Automatic retry with exponential backoff for transient 5xx failures', font: 'Arial', size: 22 })] }),
        new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: [new TextRun({ text: 'API rate limiting configured in Canvas backend settings', font: 'Arial', size: 22 })] }),

        h2('2.3 XSS Prevention'),
        new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: [new TextRun({ text: 'DOMPurify sanitization on ALL user-generated HTML content before rendering', font: 'Arial', size: 22 })] }),
        new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: [new TextRun({ text: 'React JSX auto-escaping for all text content (prevents script injection)', font: 'Arial', size: 22 })] }),
        new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: [new TextRun({ text: 'Content Security Policy headers configured in Nginx', font: 'Arial', size: 22 })] }),
        new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: [new TextRun({ text: 'TinyMCE rich text editor configured with restricted paste and upload settings', font: 'Arial', size: 22 })] }),

        h2('2.4 Network Security'),
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [4680, 4680],
          rows: [
            new TableRow({ children: [headerCell('Security Header', 4680), headerCell('Configuration', 4680)] }),
            new TableRow({ children: [cell('SSL/TLS', 4680), cell('Let\'s Encrypt certificates with auto-renewal', 4680)] }),
            new TableRow({ children: [cell('HSTS', 4680), cell('max-age=31536000; includeSubDomains', 4680)] }),
            new TableRow({ children: [cell('X-Frame-Options', 4680), cell('SAMEORIGIN (prevents clickjacking)', 4680)] }),
            new TableRow({ children: [cell('X-Content-Type-Options', 4680), cell('nosniff', 4680)] }),
            new TableRow({ children: [cell('X-XSS-Protection', 4680), cell('1; mode=block', 4680)] }),
            new TableRow({ children: [cell('Reverse Proxy', 4680), cell('Nginx hides backend topology', 4680)] }),
          ],
        }),

        h2('2.5 Infrastructure Security'),
        new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: [new TextRun({ text: 'UFW firewall on VPS with only ports 22, 80, and 443 open', font: 'Arial', size: 22 })] }),
        new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: [new TextRun({ text: 'Hostinger external firewall with IP whitelisting for SSH access', font: 'Arial', size: 22 })] }),
        new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: [new TextRun({ text: 'Docker containers with memory resource limits (web: 3GB, jobs: 2GB, postgres: 1GB, redis: 512MB)', font: 'Arial', size: 22 })] }),
        new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: [new TextRun({ text: 'PostgreSQL and Redis accessible only on internal Docker network (not exposed externally)', font: 'Arial', size: 22 })] }),
        new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: [new TextRun({ text: 'SSH key-based authentication only (password authentication disabled)', font: 'Arial', size: 22 })] }),

        h2('2.6 Data Protection'),
        new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: [new TextRun({ text: 'Input validation on all form submissions (client-side and server-side)', font: 'Arial', size: 22 })] }),
        new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: [new TextRun({ text: 'Environment variables for all secrets (never hardcoded in source code)', font: 'Arial', size: 22 })] }),
        new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: [new TextRun({ text: 'Database credentials stored in .env.production (excluded from git)', font: 'Arial', size: 22 })] }),
        new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: [new TextRun({ text: 'No sensitive data transmitted in URL parameters', font: 'Arial', size: 22 })] }),

        new Paragraph({ children: [new PageBreak()] }),

        // ═══ 3. PERFORMANCE ═══
        h1('3. Performance Optimizations'),
        p('Performance was measured using Puppeteer with Chrome DevTools Protocol, capturing Core Web Vitals, network metrics, DOM complexity, and JavaScript heap usage across 10 key pages.'),

        h2('3.1 Core Web Vitals Summary'),
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [2340, 2340, 2340, 2340],
          rows: [
            new TableRow({ children: [headerCell('Metric', 2340), headerCell('Average', 2340), headerCell('Grade', 2340), headerCell('Target', 2340)] }),
            new TableRow({ children: [cell('TTFB', 2340), cell('176ms', 2340), gradeCell('GOOD', 2340), cell('< 200ms', 2340)] }),
            new TableRow({ children: [cell('FCP', 2340), cell('567ms', 2340), gradeCell('GOOD', 2340), cell('< 1800ms', 2340)] }),
            new TableRow({ children: [cell('CLS', 2340), cell('0.000', 2340), gradeCell('GOOD', 2340), cell('< 0.1', 2340)] }),
            new TableRow({ children: [cell('DOM Interactive', 2340), cell('210ms', 2340), gradeCell('GOOD', 2340), cell('< 500ms', 2340)] }),
            new TableRow({ children: [cell('Full Page Load', 2340), cell('1687ms', 2340), gradeCell('GOOD', 2340), cell('< 3000ms', 2340)] }),
            new TableRow({ children: [cell('JS Heap', 2340), cell('21.3MB', 2340), gradeCell('OK', 2340), cell('< 50MB', 2340)] }),
          ],
        }),

        h2('3.2 Per-Page Performance'),
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [1872, 1248, 1248, 1248, 1248, 1248, 1248],
          rows: [
            new TableRow({ children: [headerCell('Page', 1872), headerCell('TTFB', 1248), headerCell('FCP', 1248), headerCell('Load', 1248), headerCell('Reqs', 1248), headerCell('DOM', 1248), headerCell('Heap', 1248)] }),
            new TableRow({ children: [cell('Login', 1872), cell('1ms', 1248), cell('812ms', 1248), cell('1728ms', 1248), cell('70', 1248), cell('577', 1248), cell('21.9MB', 1248)] }),
            new TableRow({ children: [cell('Dashboard', 1872), cell('197ms', 1248), cell('532ms', 1248), cell('2004ms', 1248), cell('71', 1248), cell('577', 1248), cell('22.0MB', 1248)] }),
            new TableRow({ children: [cell('Courses', 1872), cell('194ms', 1248), cell('532ms', 1248), cell('2009ms', 1248), cell('70', 1248), cell('471', 1248), cell('23.3MB', 1248)] }),
            new TableRow({ children: [cell('Course Home', 1872), cell('196ms', 1248), cell('532ms', 1248), cell('1416ms', 1248), cell('63', 1248), cell('306', 1248), cell('16.1MB', 1248)] }),
            new TableRow({ children: [cell('Assignments', 1872), cell('197ms', 1248), cell('508ms', 1248), cell('1224ms', 1248), cell('62', 1248), cell('246', 1248), cell('19.8MB', 1248)] }),
            new TableRow({ children: [cell('Inbox', 1872), cell('196ms', 1248), cell('664ms', 1248), cell('1659ms', 1248), cell('62', 1248), cell('428', 1248), cell('17.6MB', 1248)] }),
            new TableRow({ children: [cell('Calendar', 1872), cell('196ms', 1248), cell('528ms', 1248), cell('1381ms', 1248), cell('59', 1248), cell('502', 1248), cell('20.1MB', 1248)] }),
            new TableRow({ children: [cell('Admin', 1872), cell('194ms', 1248), cell('536ms', 1248), cell('2003ms', 1248), cell('67', 1248), cell('557', 1248), cell('22.5MB', 1248)] }),
            new TableRow({ children: [cell('Profile', 1872), cell('196ms', 1248), cell('520ms', 1248), cell('1499ms', 1248), cell('60', 1248), cell('459', 1248), cell('23.9MB', 1248)] }),
            new TableRow({ children: [cell('Gradebook', 1872), cell('194ms', 1248), cell('508ms', 1248), cell('1943ms', 1248), cell('61', 1248), cell('249', 1248), cell('26.1MB', 1248)] }),
          ],
        }),

        h2('3.3 Bundle Optimization'),
        new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: [new TextRun({ text: 'Vite code splitting: 155+ lazy-loaded route chunks (each page loads only its own code)', font: 'Arial', size: 22 })] }),
        new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: [new TextRun({ text: 'Main bundle: 341KB (estimated 2MB+ if monolithic)', font: 'Arial', size: 22 })] }),
        new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: [new TextRun({ text: 'Vendor chunk separation for React, React Router, TanStack Query', font: 'Arial', size: 22 })] }),
        new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: [new TextRun({ text: 'DOMPurify extracted to separate 22KB chunk (loaded only when needed)', font: 'Arial', size: 22 })] }),
        new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: [new TextRun({ text: 'Tree shaking for Lucide icons (only used icons included in bundle)', font: 'Arial', size: 22 })] }),

        h2('3.4 Caching Strategy'),
        new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: [new TextRun({ text: 'Static assets: 30-day browser cache with immutable flag', font: 'Arial', size: 22 })] }),
        new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: [new TextRun({ text: 'API responses: TanStack Query with staleTime=60s and background refetching', font: 'Arial', size: 22 })] }),
        new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: [new TextRun({ text: 'Nginx gzip compression enabled for text, JavaScript, and CSS', font: 'Arial', size: 22 })] }),

        h2('3.5 React Optimizations'),
        new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: [new TextRun({ text: 'useMemo for expensive computations (18 instances across components)', font: 'Arial', size: 22 })] }),
        new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: [new TextRun({ text: 'useCallback for event handlers (11 instances)', font: 'Arial', size: 22 })] }),
        new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: [new TextRun({ text: 'Lazy loading for all 155 routes via React.lazy()', font: 'Arial', size: 22 })] }),
        new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: [new TextRun({ text: 'Skeleton loading states for all async data fetching', font: 'Arial', size: 22 })] }),
        new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: [new TextRun({ text: 'Error boundaries for graceful failure handling', font: 'Arial', size: 22 })] }),

        new Paragraph({ children: [new PageBreak()] }),

        // ═══ 4. ARCHITECTURE ═══
        h1('4. Architecture'),

        h2('4.1 Frontend Stack'),
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [3120, 6240],
          rows: [
            new TableRow({ children: [headerCell('Technology', 3120), headerCell('Purpose', 6240)] }),
            new TableRow({ children: [cell('React 19 + TypeScript', 3120), cell('UI framework with type safety', 6240)] }),
            new TableRow({ children: [cell('Vite', 3120), cell('Build tool with HMR and code splitting', 6240)] }),
            new TableRow({ children: [cell('Tailwind CSS', 3120), cell('Utility-first CSS framework', 6240)] }),
            new TableRow({ children: [cell('shadcn/ui', 3120), cell('Accessible component library', 6240)] }),
            new TableRow({ children: [cell('React Router v7', 3120), cell('SPA client-side routing', 6240)] }),
            new TableRow({ children: [cell('TanStack Query v5', 3120), cell('Data fetching, caching, synchronization', 6240)] }),
            new TableRow({ children: [cell('DOMPurify', 3120), cell('HTML sanitization for XSS prevention', 6240)] }),
            new TableRow({ children: [cell('TinyMCE', 3120), cell('Rich text editor for content creation', 6240)] }),
            new TableRow({ children: [cell('Lucide React', 3120), cell('Icon library (tree-shakeable)', 6240)] }),
          ],
        }),

        h2('4.2 Theme System'),
        p('The platform supports 3 built-in themes that can be switched at runtime via CSS custom properties. Themes are persisted in localStorage and provided to all components through a React Context.'),
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [3120, 3120, 3120],
          rows: [
            new TableRow({ children: [headerCell('Theme', 3120), headerCell('Sidebar', 3120), headerCell('Accent', 3120)] }),
            new TableRow({ children: [cell('Modern Dark Accent', 3120), cell('Dark teal (#0F2922)', 3120), cell('Orange (#FF6B35)', 3120)] }),
            new TableRow({ children: [cell('Teal Classic', 3120), cell('Medium teal (#1E4D42)', 3120), cell('Green (#2DB88A)', 3120)] }),
            new TableRow({ children: [cell('Midnight Blue', 3120), cell('Dark navy (#1a1a2e)', 3120), cell('Blue (#4FC3F7)', 3120)] }),
          ],
        }),

        new Paragraph({ children: [new PageBreak()] }),

        // ═══ 5. TESTING ═══
        h1('5. Testing & Verification'),

        h2('5.1 Verification Pipeline'),
        p('Every deployment follows a mandatory 5-step verification pipeline:'),
        new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: [new TextRun({ text: 'BUILD: npm run build (must pass clean, zero errors)', font: 'Arial', size: 22 })] }),
        new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: [new TextRun({ text: 'DEPLOY: SCP dist/* to server + nginx reload', font: 'Arial', size: 22 })] }),
        new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: [new TextRun({ text: 'VERIFY: Screenshot EVERY new page (mandatory, no exceptions)', font: 'Arial', size: 22 })] }),
        new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: [new TextRun({ text: 'STORE: Save to react-screenshots/{batch-name}/ subdirectory', font: 'Arial', size: 22 })] }),
        new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: [new TextRun({ text: 'COMMIT: Include screenshots in the git commit', font: 'Arial', size: 22 })] }),

        h2('5.2 Screenshot Coverage'),
        p('Total verified screenshots: 132+ across all batches and phases.'),
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [4680, 2340, 2340],
          rows: [
            new TableRow({ children: [headerCell('Directory', 4680), headerCell('Screenshots', 2340), headerCell('Status', 2340)] }),
            new TableRow({ children: [cell('batch-1/ (Core Shell)', 4680), cell('3', 2340), gradeCell('GOOD', 2340)] }),
            new TableRow({ children: [cell('batch-2/ (Course Content)', 4680), cell('11', 2340), gradeCell('GOOD', 2340)] }),
            new TableRow({ children: [cell('batch-3/ (Communication)', 4680), cell('7', 2340), gradeCell('GOOD', 2340)] }),
            new TableRow({ children: [cell('batch-4/ (Admin & Settings)', 4680), cell('13', 2340), gradeCell('GOOD', 2340)] }),
            new TableRow({ children: [cell('priority-1/ (Editors & Tools)', 4680), cell('5', 2340), gradeCell('GOOD', 2340)] }),
            new TableRow({ children: [cell('fix-404-pages/', 4680), cell('30', 2340), gradeCell('GOOD', 2340)] }),
            new TableRow({ children: [cell('performance-audit/', 4680), cell('10', 2340), gradeCell('GOOD', 2340)] }),
            new TableRow({ children: [cell('devtools-audit/', 4680), cell('10', 2340), gradeCell('GOOD', 2340)] }),
            new TableRow({ children: [cell('security-fixes/', 4680), cell('10', 2340), gradeCell('GOOD', 2340)] }),
            new TableRow({ children: [cell('theme-system/', 4680), cell('8', 2340), gradeCell('GOOD', 2340)] }),
            new TableRow({ children: [cell('login-variants/', 4680), cell('7', 2340), gradeCell('GOOD', 2340)] }),
            new TableRow({ children: [cell('data-seeding/', 4680), cell('15', 2340), gradeCell('GOOD', 2340)] }),
          ],
        }),

        h2('5.3 CRUD Testing'),
        p('Full CRUD (Create, Read, Update, Delete) operations were tested for each user persona:'),
        new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: [new TextRun({ text: 'Admin: Course creation, user management, announcements, calendar events, settings', font: 'Arial', size: 22 })] }),
        new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: [new TextRun({ text: 'Teacher: Assignments, discussions, wiki pages, rubrics, modules, quizzes', font: 'Arial', size: 22 })] }),
        new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: [new TextRun({ text: 'Student: Discussion replies, messages, profile updates, quiz submissions', font: 'Arial', size: 22 })] }),

        new Paragraph({ children: [new PageBreak()] }),

        // ═══ 6. RECOMMENDATIONS ═══
        h1('6. Recommendations'),
        p('The following improvements are recommended for future development phases:'),

        h2('6.1 Security Enhancements'),
        new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: [new TextRun({ text: 'Add rate limiting middleware on the Nginx API proxy layer', font: 'Arial', size: 22 })] }),
        new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: [new TextRun({ text: 'Implement Content Security Policy (CSP) with nonce-based script loading', font: 'Arial', size: 22 })] }),
        new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: [new TextRun({ text: 'Add Sentry for production error monitoring and alerting', font: 'Arial', size: 22 })] }),
        new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: [new TextRun({ text: 'Implement two-factor authentication (2FA) for admin accounts', font: 'Arial', size: 22 })] }),

        h2('6.2 Performance Enhancements'),
        new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: [new TextRun({ text: 'Add CDN (CloudFlare) for static asset delivery and DDoS protection', font: 'Arial', size: 22 })] }),
        new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: [new TextRun({ text: 'Implement service worker for offline PWA support', font: 'Arial', size: 22 })] }),
        new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: [new TextRun({ text: 'Add WebSocket support for real-time notifications', font: 'Arial', size: 22 })] }),
        new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: [new TextRun({ text: 'Implement E2E tests with Playwright for regression testing', font: 'Arial', size: 22 })] }),

        h2('6.3 Feature Enhancements'),
        new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: [new TextRun({ text: 'Internationalization (i18n) support for multiple languages', font: 'Arial', size: 22 })] }),
        new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: [new TextRun({ text: 'Mobile app wrapper (React Native or Capacitor)', font: 'Arial', size: 22 })] }),
        new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: [new TextRun({ text: 'Advanced analytics dashboard with charts (Chart.js or Recharts)', font: 'Arial', size: 22 })] }),
        new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: [new TextRun({ text: 'AI-powered features (study assistant, content recommendations)', font: 'Arial', size: 22 })] }),
      ],
    },
  ],
});

Packer.toBuffer(doc).then(buffer => {
  fs.mkdirSync('docs', { recursive: true });
  fs.writeFileSync('docs/SECURITY_AND_PERFORMANCE_REPORT.docx', buffer);
  console.log('Created: docs/SECURITY_AND_PERFORMANCE_REPORT.docx (' + Math.round(buffer.length / 1024) + 'KB)');
});
