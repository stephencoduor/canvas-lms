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
  brandVars['ic-brand-button--secondary-bgd'] = '#2DB88A';
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
  // ── Dashboard Welcome Section ──
  // Injects a branded welcome banner above dashboard cards
  document.addEventListener('DOMContentLoaded', function () {
    var isDashboard =
      window.location.pathname === '/' ||
      window.location.pathname === '/dashboard' ||
      window.location.pathname.match(/^\/\?/);

    if (!isDashboard) return;

    var target =
      document.getElementById('dashboard_header_container') ||
      document.getElementById('dashboard-planner') ||
      document.querySelector('.ic-Dashboard-header') ||
      document.getElementById('dashboard');

    if (!target || document.querySelector('.redefiners-welcome')) return;

    var userName = (window.ENV && window.ENV.current_user && window.ENV.current_user.display_name) || 'Student';
    var now = new Date();
    var hour = now.getHours();
    var greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

    var welcome = document.createElement('div');
    welcome.className = 'redefiners-welcome';
    welcome.innerHTML =
      '<div>' +
        '<h2>' + greeting + ', ' + userName + '</h2>' +
        '<p>Stay focused and keep up the great work on your learning journey.</p>' +
      '</div>' +
      '<div class="streak-badge">' +
        '<i class="icon-check-plus" style="margin-right:6px"></i>Keep your streak going!' +
      '</div>';

    target.parentNode.insertBefore(welcome, target);
  });
})();
