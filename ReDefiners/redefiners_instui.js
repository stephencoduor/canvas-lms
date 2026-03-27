/*
 * ReDefiners Theme — JavaScript Overrides for Canvas LMS
 * Upload via Theme Editor > JavaScript file field
 *
 * This file extends CANVAS_ACTIVE_BRAND_VARIABLES with InstUI theme
 * overrides to restyle React components rendered by Instructure UI.
 *
 * The variables set here are merged into the InstUI canvas theme
 * via ui/shared/instui-bindings/index.ts (line 85):
 *   { ...canvasBaseTheme, ...brandVariables_, ...transitionOverride }
 */

(function () {
  'use strict';

  // Merge ReDefiners InstUI overrides into the brand variables object
  var brandVars = window.CANVAS_ACTIVE_BRAND_VARIABLES || {};

  // ── Color Overrides ──
  // These map to @instructure/ui-themes canvas theme keys
  brandVars['ic-brand-primary'] = '#2DB88A';
  brandVars['ic-brand-font-color-dark'] = '#1B1B1B';
  brandVars['ic-link-color'] = '#3B82F6';
  brandVars['ic-brand-button--primary-bgd'] = '#163B32';
  brandVars['ic-brand-button--primary-text'] = '#FFFFFF';
  brandVars['ic-brand-button--secondary-bgd'] = '#FF6B35';
  brandVars['ic-brand-button--secondary-text'] = '#FFFFFF';
  brandVars['ic-brand-global-nav-bgd'] = '#0F2922';

  window.CANVAS_ACTIVE_BRAND_VARIABLES = brandVars;

  // ── Load Google Fonts ──
  // Ensures Inter and Poppins are available even if CSS @import is blocked
  if (!document.querySelector('link[href*="fonts.googleapis.com/css2?family=Inter"]')) {
    var fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href =
      'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Poppins:wght@600;700;800&display=swap';
    document.head.appendChild(fontLink);
  }
})();
