import DOMPurify from 'dompurify';

/**
 * Sanitize HTML content from Canvas API to prevent XSS attacks.
 * Allows safe HTML tags (formatting, links, images, tables) while
 * stripping scripts, event handlers, and dangerous attributes.
 */
export function sanitizeHtml(dirty: string | undefined | null): string {
  if (!dirty) return '';

  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      // Text formatting
      'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'sub', 'sup',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'blockquote', 'pre', 'code', 'kbd',
      // Lists
      'ul', 'ol', 'li', 'dl', 'dt', 'dd',
      // Links & media
      'a', 'img', 'video', 'audio', 'source', 'iframe',
      // Tables
      'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption', 'colgroup', 'col',
      // Layout
      'div', 'span', 'hr', 'figure', 'figcaption',
      // Canvas-specific
      'math', 'annotation', 'semantics', 'mrow', 'mi', 'mn', 'mo', 'msup', 'msub', 'mfrac',
    ],
    ALLOWED_ATTR: [
      'href', 'src', 'alt', 'title', 'class', 'id', 'style',
      'width', 'height', 'target', 'rel', 'colspan', 'rowspan',
      'data-api-endpoint', 'data-api-returntype', // Canvas data attrs
      'controls', 'autoplay', 'muted', 'loop', 'poster', // Media attrs
      'allow', 'allowfullscreen', 'frameborder', 'sandbox', // Iframe attrs
    ],
    ALLOW_DATA_ATTR: false,
    ADD_ATTR: ['target'], // Allow target on links
    FORBID_TAGS: ['script', 'style', 'form', 'input', 'textarea', 'select', 'button'],
    FORBID_ATTR: ['onerror', 'onclick', 'onload', 'onmouseover', 'onfocus', 'onblur'],
  });
}

/**
 * Sanitize and return as props for dangerouslySetInnerHTML
 */
export function safeHtml(dirty: string | undefined | null): { __html: string } {
  return { __html: sanitizeHtml(dirty) };
}
