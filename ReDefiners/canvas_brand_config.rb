# frozen_string_literal: true

# =============================================================================
# Canvas LMS BrandConfig Seed Script — ReDefiners Theme
# =============================================================================
#
# This script creates a comprehensive BrandConfig with ALL brandable variables
# defined in Canvas's brandable_variables.json schema, themed for ReDefiners'
# "Dark Accent" teal/green palette.
#
# =============================================================================
# HOW TO RUN THIS SEED SCRIPT
# =============================================================================
#
#   Option 1 — Rails runner (recommended for one-off setup):
#     bundle exec rails runner ReDefiners/canvas_brand_config.rb
#
#   Option 2 — Rails console (interactive, useful for debugging):
#     bundle exec rails console
#     load 'ReDefiners/canvas_brand_config.rb'
#
#   Option 3 — As part of db:seed (add to db/seeds.rb):
#     load Rails.root.join('ReDefiners/canvas_brand_config.rb')
#
# =============================================================================
# ENVIRONMENT-SPECIFIC NOTES
# =============================================================================
#
#   DEVELOPMENT:
#     - After running this script, regenerate brand assets:
#         bundle exec rake brand_configs:generate_and_upload_all
#     - In dev, assets are served locally from public/dist/brandable_css
#     - Changes appear after a page refresh (no deploy needed)
#     - You can also use the Theme Editor UI at:
#         http://localhost:3000/accounts/1/brand_configs
#
#   PRODUCTION:
#     - Brand assets must be compiled and uploaded to your CDN / S3 bucket:
#         RAILS_ENV=production bundle exec rake brand_configs:generate_and_upload_all
#     - If using Docker, run inside the web container:
#         docker exec -it canvas_web bundle exec rails runner ReDefiners/canvas_brand_config.rb
#         docker exec -it canvas_web bundle exec rake brand_configs:generate_and_upload_all
#     - Ensure config/dynamic_settings.yml has the correct S3/CDN settings
#     - After generation, restart the web processes to pick up the new config
#     - Clear the browser cache or use cache-busting query strings
#
#   CI/CD:
#     - Include this script in your deployment pipeline after db:migrate
#     - The rake task brand_configs:generate_and_upload_all should run as a
#       post-deploy step
#
# =============================================================================
# REDEFINERS COLOR PALETTE REFERENCE
# =============================================================================
#
#   Primary (Teal/Green):
#     primary-900: #0F2922  (deepest — nav background, login background)
#     primary-800: #163B32  (dark — buttons, logo background)
#     primary-700: #1E5245  (medium-dark)
#     primary-500: #2DB88A  (accent green — primary brand color)
#     primary-300: #5ECFAA  (lighter accent)
#     primary-200: #7CB5A4  (muted — icon fills, footer links)
#     primary-100: #B8DDD0  (very light)
#
#   Neutrals:
#     neutral-900: #1B1B1B  (text-primary / font-color-dark)
#     neutral-700: #404040  (text-primary lightened 15%)
#     neutral-500: #6B7280  (text-secondary / font-color-dark lightened 30%)
#     neutral-200: #E5E7EB  (borders)
#     neutral-100: #F3F4F6  (background tints)
#     white:       #FFFFFF
#
#   Accent:
#     blue-500:   #3B82F6   (links)
#     orange-500: #FF6B35   (badges, notifications, CTAs)
#
# =============================================================================

# ---------------------------------------------------------------------------
# GROUP 1: GLOBAL BRANDING (group_key: "global_branding")
# ---------------------------------------------------------------------------
# These variables control the overall brand appearance across all of Canvas.
# They affect headings, body text, links, and primary/secondary action buttons.
# ---------------------------------------------------------------------------

redefiners_variables = {

  # -- ic-brand-primary --
  # The single most important brand color. Used as the default value for many
  # other variables (buttons, active states, tile color, etc.). This is the
  # "hero" color that represents your institution.
  # Type: color
  # Schema default: "#2DB88A" (this is already ReDefiners green)
  'ic-brand-primary' => '#2DB88A',

  # -- ic-brand-font-color-dark --
  # The primary text color used for headings, body copy, and most readable
  # text throughout Canvas. Should have strong contrast against white/light
  # backgrounds (WCAG AA minimum 4.5:1 ratio recommended).
  # Type: color
  # Schema default: "#163B32"
  'ic-brand-font-color-dark' => '#1B1B1B',

  # -- ic-brand-font-color-dark-lightened-15 --
  # A slightly lighter variant of the dark font color. Used for secondary
  # text elements like subtitles, timestamps, and de-emphasized labels.
  # This variable is not in the schema but is used in Canvas SCSS via a
  # lighten() function. We set it explicitly for consistency.
  # Note: Canvas may compute this automatically from ic-brand-font-color-dark.
  # Including it here ensures the exact shade we want if the variable is
  # accepted by BrandConfig.
  'ic-brand-font-color-dark-lightened-15' => '#404040',

  # -- ic-brand-font-color-dark-lightened-30 --
  # An even lighter variant of the dark font color. Used for placeholder text,
  # disabled states, and tertiary information. Provides visual hierarchy.
  # Same note as above — Canvas may compute this automatically.
  'ic-brand-font-color-dark-lightened-30' => '#6B7280',

  # -- ic-link-color --
  # Color for hyperlinks throughout Canvas (inline text links, breadcrumbs,
  # navigation links). Should be clearly distinguishable from body text and
  # meet WCAG contrast requirements against white backgrounds.
  # Type: color
  # Schema default: "#3B82F6"
  'ic-link-color' => '#3B82F6',

  # -- ic-link-decoration --
  # CSS text-decoration for links. Common values: "none", "underline".
  # "none" gives a cleaner look; "underline" improves accessibility for
  # users who cannot distinguish colors.
  # Note: This variable may not be in the schema but is referenced in SCSS.
  'ic-link-decoration' => 'none',

  # -- ic-brand-button--primary-bgd --
  # Background color for primary action buttons (Save, Submit, Continue).
  # These are the most prominent call-to-action buttons in the UI.
  # Should convey authority and importance — we use the dark teal.
  # Type: color
  # Schema default: "$ic-brand-primary" (inherits from brand-primary)
  'ic-brand-button--primary-bgd' => '#163B32',

  # -- ic-brand-button--primary-bgd-darkened-5 --
  # A slightly darker shade of the primary button background, used for
  # hover and active states. Provides visual feedback on interaction.
  # Canvas may compute this via darken() in SCSS; setting explicitly
  # ensures consistency.
  'ic-brand-button--primary-bgd-darkened-5' => '#0F2922',

  # -- ic-brand-button--primary-text --
  # Text color on primary buttons. Must contrast well against the primary
  # button background color (ic-brand-button--primary-bgd).
  # Type: color
  # Schema default: "#ffffff"
  'ic-brand-button--primary-text' => '#FFFFFF',

  # -- ic-brand-button--secondary-bgd --
  # Background color for secondary action buttons (Cancel, Add, Edit).
  # These are less prominent than primary buttons but still important.
  # We use the accent green for a cohesive but distinct look.
  # Type: color
  # Schema default: "#FF6B35" (orange in schema)
  'ic-brand-button--secondary-bgd' => '#2DB88A',

  # -- ic-brand-button--secondary-bgd-darkened-5 --
  # Hover/active state for secondary buttons — slightly darker green.
  'ic-brand-button--secondary-bgd-darkened-5' => '#25A07A',

  # -- ic-brand-button--secondary-text --
  # Text color on secondary buttons. Must contrast against the secondary
  # button background.
  # Type: color
  # Schema default: "#ffffff"
  'ic-brand-button--secondary-text' => '#FFFFFF',

  # ---------------------------------------------------------------------------
  # GROUP 2: GLOBAL NAVIGATION (group_key: "global_navigation")
  # ---------------------------------------------------------------------------
  # These variables control the left-side global navigation bar that is
  # visible on every page in Canvas. This is the most prominent branded
  # element and includes the logo area, navigation icons, text labels,
  # notification badges, and user avatar styling.
  # ---------------------------------------------------------------------------

  # -- ic-brand-global-nav-bgd --
  # Background color for the entire global navigation sidebar. This is the
  # single largest branded surface area. We use the deepest teal (primary-900)
  # for a dark, professional look.
  # Type: color
  # Schema default: "#0F2922"
  'ic-brand-global-nav-bgd' => '#0F2922',

  # -- ic-brand-global-nav-ic-icon-svg-fill --
  # Fill color for the SVG navigation icons (Dashboard, Courses, Calendar,
  # Inbox, etc.) in their default/inactive state. Should be visible against
  # the nav background but not overly bright — muted teal works well.
  # Type: color
  # Schema default: "#ffffff"
  'ic-brand-global-nav-ic-icon-svg-fill' => '#7CB5A4',

  # -- ic-brand-global-nav-ic-icon-svg-fill--active --
  # Fill color for navigation icons when the corresponding page/section is
  # active (currently selected). Should be brighter/more prominent than the
  # default fill to clearly indicate the current location.
  # Type: color
  # Schema default: "$ic-brand-primary"
  'ic-brand-global-nav-ic-icon-svg-fill--active' => '#FFFFFF',

  # -- ic-brand-global-nav-menu-item__text-color --
  # Text color for navigation labels (the text below each icon). We use
  # semi-transparent white for a softer appearance that doesn't compete
  # with the icons.
  # Type: color
  # Schema default: "#ffffff"
  'ic-brand-global-nav-menu-item__text-color' => 'rgba(255,255,255,0.75)',

  # -- ic-brand-global-nav-menu-item__text-color--active --
  # Text color for the active/selected navigation label. Full white for
  # maximum contrast and clear indication of current section.
  # Type: color
  # Schema default: "$ic-link-color"
  'ic-brand-global-nav-menu-item__text-color--active' => '#FFFFFF',

  # -- ic-brand-global-nav-menu-item__badge-bgd --
  # Background color for notification count badges on nav items (e.g.,
  # unread inbox count). Orange draws attention without being alarming.
  # Type: color
  # Schema default: "#FF6B35"
  'ic-brand-global-nav-menu-item__badge-bgd' => '#FF6B35',

  # -- ic-brand-global-nav-menu-item__badge-bgd--active --
  # Badge background when the parent nav item is active/selected.
  # Switches to green to blend with the active state.
  # Type: color
  # Schema default: "#2DB88A"
  'ic-brand-global-nav-menu-item__badge-bgd--active' => '#2DB88A',

  # -- ic-brand-global-nav-menu-item__badge-text --
  # Text color inside notification badges (the count number). Must contrast
  # against the badge background color.
  # Type: color
  # Schema default: "#000000"
  'ic-brand-global-nav-menu-item__badge-text' => '#FFFFFF',

  # -- ic-brand-global-nav-menu-item__badge-text--active --
  # Badge text color when the parent nav item is active.
  # Type: color
  # Schema default: "#ffffff"
  'ic-brand-global-nav-menu-item__badge-text--active' => '#FFFFFF',

  # -- ic-brand-global-nav-avatar-border --
  # Border color around the user's avatar image in the navigation bar.
  # Accent green provides a subtle branded frame around the avatar.
  # Type: color
  # Schema default: "#ffffff"
  'ic-brand-global-nav-avatar-border' => '#2DB88A',

  # -- ic-brand-global-nav-logo-bgd --
  # Background color for the logo area at the top of the nav sidebar.
  # Slightly lighter than the nav background to create visual separation.
  # Type: color
  # Schema default: "#163B32"
  'ic-brand-global-nav-logo-bgd' => '#163B32',

  # -- ic-brand-header-image --
  # The logo image displayed in the nav sidebar logo area. This should be
  # a URL to your institution's logo (PNG, GIF, JPEG, or SVG).
  # Type: image
  # Accepted formats: image/png, image/gif, image/jpeg, image/svg+xml, image/svg
  # Schema default: "/images/canvas_logomark_only@2x.png"
  #
  # NOTE: Image variables should be set via the Theme Editor UI or by
  # uploading files to your Canvas file storage. The BrandConfig API
  # expects either a URL or an uploaded file reference. See the
  # "Image Upload Instructions" section below.
  #
  # Uncomment and set the path if you have uploaded the image:
  'ic-brand-header-image' => '/redefiners-theme/images/logo.PNG',

  # -- ic-brand-mobile-global-nav-logo --
  # Logo shown in the mobile app's global navigation. Should be optimized
  # for small screens (SVG recommended).
  # Type: image
  # Accepted formats: image/png, image/gif, image/jpeg, image/svg+xml, image/svg
  # Schema default: "/images/mobile-global-nav-logo.svg"
  #
  # Uncomment and set the path if you have uploaded the image:
  # 'ic-brand-mobile-global-nav-logo' => '/path/to/redefiners-mobile-logo.svg',

  # ---------------------------------------------------------------------------
  # GROUP 3: WATERMARKS AND ICONS (group_key: "watermarks")
  # ---------------------------------------------------------------------------
  # These variables control branding for favicons, mobile bookmarks,
  # Windows tiles, the right sidebar logo, and page watermarks.
  # ---------------------------------------------------------------------------

  # -- ic-brand-watermark --
  # A background watermark image displayed on the Dashboard or right sidebar.
  # Typically a faded version of your logo or a decorative pattern.
  # Type: image
  # Accepted formats: image/png, image/svg+xml, image/svg, image/gif, image/jpeg
  # Schema default: "" (empty — no watermark)
  #
  # Uncomment and set if you have a watermark image:
  # 'ic-brand-watermark' => '/path/to/redefiners-watermark.png',

  # -- ic-brand-watermark-opacity --
  # Opacity of the watermark image (0.0 = invisible, 1.0 = fully opaque).
  # A low opacity (0.05 - 0.15) creates a subtle branded background.
  # Type: percentage
  # Schema default: "1.0"
  'ic-brand-watermark-opacity' => '0.10',

  # -- ic-brand-favicon --
  # The favicon displayed in browser tabs. Should be a small .ico or .png.
  # Type: image
  # Accepted formats: image/vnd.microsoft.icon, image/x-icon, image/png, image/gif
  # Schema default: "/images/favicon.ico"
  #
  # Uncomment and set if you have a custom favicon:
  'ic-brand-favicon' => '/redefiners-theme/images/logo.PNG',

  # -- ic-brand-apple-touch-icon --
  # The icon used when users add Canvas to their iOS home screen.
  # Must be a PNG, recommended size 180x180px.
  # Type: image
  # Accepted formats: image/png
  # Schema default: "/images/apple-touch-icon.png"
  #
  # Uncomment and set if you have a custom touch icon:
  # 'ic-brand-apple-touch-icon' => '/path/to/redefiners-touch-icon.png',

  # -- ic-brand-msapplication-tile-color --
  # Background color for the Windows Start tile when Canvas is pinned.
  # We use the accent green to match the brand.
  # Type: color
  # Schema default: "$ic-brand-primary"
  'ic-brand-msapplication-tile-color' => '#2DB88A',

  # -- ic-brand-msapplication-tile-square --
  # Square tile image for Windows (270x270px recommended). Displayed when
  # Canvas is pinned to the Windows Start menu.
  # Type: image
  # Accepted formats: image/png, image/gif, image/jpeg
  # Schema default: "/images/windows-tile.png"
  #
  # Uncomment and set if you have a custom tile image:
  # 'ic-brand-msapplication-tile-square' => '/path/to/redefiners-tile-square.png',

  # -- ic-brand-msapplication-tile-wide --
  # Wide tile image for Windows (558x270px recommended).
  # Type: image
  # Accepted formats: image/png, image/gif, image/jpeg
  # Schema default: "/images/windows-tile-wide.png"
  #
  # Uncomment and set if you have a custom wide tile:
  # 'ic-brand-msapplication-tile-wide' => '/path/to/redefiners-tile-wide.png',

  # -- ic-brand-right-sidebar-logo --
  # Logo displayed in the right sidebar of the Dashboard. Provides additional
  # branding on the main landing page.
  # Type: image
  # Accepted formats: image/svg+xml, image/svg, image/png, image/gif, image/jpeg
  # Schema default: "" (empty — no sidebar logo)
  #
  # Uncomment and set if you have a sidebar logo:
  # 'ic-brand-right-sidebar-logo' => '/path/to/redefiners-sidebar-logo.svg',

  # ---------------------------------------------------------------------------
  # GROUP 4: LOGIN PAGE (group_key: "login")
  # ---------------------------------------------------------------------------
  # These variables control the appearance of the Canvas login page,
  # including the background, content card, form labels, buttons, and
  # footer links. The login page is often the first impression for users.
  # ---------------------------------------------------------------------------

  # -- ic-brand-Login-body-bgd-color --
  # Background color for the entire login page. We use the deepest teal
  # for a dramatic, branded first impression.
  # Type: color
  # Schema default: "#0F2922"
  'ic-brand-Login-body-bgd-color' => '#0F2922',

  # -- ic-brand-Login-body-bgd-image --
  # Background image for the login page (full-screen behind the login card).
  # Can be a photo, pattern, or gradient image.
  # Type: image
  # Accepted formats: image/png, image/svg+xml, image/svg, image/gif, image/jpeg
  # Schema default: "" (empty — solid color only)
  #
  # Uncomment and set if you have a login background image:
  # 'ic-brand-Login-body-bgd-image' => '/path/to/redefiners-login-bg.jpg',

  # -- ic-brand-Login-body-bgd-shadow-color --
  # Shadow/overlay color on the login page background. Applied as an overlay
  # to improve readability of the login card against the background image.
  # Using a semi-transparent version of the background color.
  # Type: color
  # Schema default: "#0A1F1A"
  'ic-brand-Login-body-bgd-shadow-color' => 'rgba(15,41,34,0.8)',

  # -- ic-brand-Login-logo --
  # Logo image displayed above the login form. This is prominently shown
  # on the login page and should be your institution's full logo.
  # Type: image
  # Accepted formats: image/png, image/gif, image/jpeg, image/svg+xml, image/svg
  # Schema default: "/images/login/canvas-logo.svg"
  #
  # Uncomment and set if you have a custom login logo:
  'ic-brand-Login-logo' => '/redefiners-theme/images/logo.PNG',

  # -- ic-brand-Login-Content-bgd-color --
  # Background color for the login card/content area that contains the
  # username and password fields.
  # Type: color
  # Schema default: "#FFFFFF"
  'ic-brand-Login-Content-bgd-color' => '#FFFFFF',

  # -- ic-brand-Login-Content-border-color --
  # Border color for the login card. Transparent removes the border for
  # a cleaner, more modern card appearance.
  # Type: color
  # Schema default: "#E5E7EB"
  'ic-brand-Login-Content-border-color' => 'transparent',

  # -- ic-brand-Login-Content-inner-bgd --
  # Background color for the inner content area within the login card.
  # Type: color
  # Schema default: "none"
  'ic-brand-Login-Content-inner-bgd' => '#FFFFFF',

  # -- ic-brand-Login-Content-inner-border --
  # Border for the inner content area. "none" removes it for a flat look.
  # Type: color
  # Schema default: "none"
  'ic-brand-Login-Content-inner-border' => 'none',

  # -- ic-brand-Login-Content-inner-body-bgd --
  # Background color for the inner body section (where the actual form
  # fields are rendered).
  # Type: color
  # Schema default: "none"
  'ic-brand-Login-Content-inner-body-bgd' => '#FFFFFF',

  # -- ic-brand-Login-Content-inner-body-border --
  # Border for the inner body section.
  # Type: color
  # Schema default: "none"
  'ic-brand-Login-Content-inner-body-border' => 'none',

  # -- ic-brand-Login-Content-label-text-color --
  # Text color for form labels ("Email" / "Password") on the login page.
  # Dark text for readability against the white card background.
  # Type: color
  # Schema default: "#163B32"
  'ic-brand-Login-Content-label-text-color' => '#1B1B1B',

  # -- ic-brand-Login-Content-password-text-color --
  # Text color for the "Forgot Password?" link on the login form.
  # Uses the link blue for consistency with the rest of the app.
  # Type: color
  # Schema default: "#ffffff"
  'ic-brand-Login-Content-password-text-color' => '#3B82F6',

  # -- ic-brand-Login-Content-button-bgd --
  # Background color for the "Log In" button on the login page.
  # Accent green makes it the clear call-to-action.
  # Note: This variable may not be in the official schema but is commonly
  # used in custom Canvas themes.
  'ic-brand-Login-Content-button-bgd' => '#2DB88A',

  # -- ic-brand-Login-Content-button-text --
  # Text color for the "Log In" button.
  'ic-brand-Login-Content-button-text' => '#FFFFFF',

  # -- ic-brand-Login-footer-link-color --
  # Color for footer links at the bottom of the login page (e.g., "Privacy
  # Policy", "Terms of Use", help links).
  # Type: color
  # Schema default: "#ffffff"
  'ic-brand-Login-footer-link-color' => '#7CB5A4',

  # -- ic-brand-Login-footer-link-color-hover --
  # Hover state for login footer links. Full white for clear feedback.
  # Type: color
  # Schema default: "#ffffff"
  'ic-brand-Login-footer-link-color-hover' => '#FFFFFF',

  # -- ic-brand-Login-instructure-logo --
  # Color tint applied to the Instructure logo in the login page footer.
  # Muted teal keeps it visible but unobtrusive.
  # Type: color
  # Schema default: "#ffffff"
  'ic-brand-Login-instructure-logo' => '#7CB5A4',

  # -- ic-brand-Login-custom-message --
  # Custom HTML/text message displayed on the login page. Can include
  # welcome text, announcements, or help instructions.
  # Type: textarea
  # Schema default: "" (empty)
  #
  # Uncomment and customize:
  # 'ic-brand-Login-custom-message' => '<p>Welcome to ReDefiners Canvas LMS</p>',

  # ---------------------------------------------------------------------------
  # GROUP 5: DISCOVERY PAGE (group_key: "discovery")
  # ---------------------------------------------------------------------------
  # The discovery page is shown to unauthenticated users browsing the
  # course catalog (if enabled).
  # ---------------------------------------------------------------------------

  # -- ic-brand-Discovery-custom-message --
  # Custom HTML/text message displayed on the discovery/catalog page.
  # Type: textarea
  # Schema default: "" (empty)
  #
  # Uncomment and customize:
  # 'ic-brand-Discovery-custom-message' => '<p>Explore courses offered by ReDefiners</p>',

  # ---------------------------------------------------------------------------
  # GROUP 6: REGISTRATION PAGE (group_key: "registration")
  # ---------------------------------------------------------------------------
  # These variables add custom messaging to the self-registration page
  # (if self-registration is enabled for your Canvas instance).
  # ---------------------------------------------------------------------------

  # -- ic-brand-Registration-custom-message --
  # Custom HTML/text displayed on the student self-registration page.
  # Type: textarea
  # Schema default: "" (empty)
  #
  # Uncomment and customize:
  # 'ic-brand-Registration-custom-message' => '<p>Create your ReDefiners learning account</p>',

  # -- ic-brand-Registration-parent-custom-message --
  # Custom HTML/text displayed on the parent/observer registration page.
  # Type: textarea
  # Schema default: "" (empty)
  #
  # Uncomment and customize:
  # 'ic-brand-Registration-parent-custom-message' => '<p>Register as a parent observer</p>',
}

# =============================================================================
# CREATE BRAND CONFIG AND APPLY TO ACCOUNTS
# =============================================================================

puts '=' * 70
puts 'ReDefiners Canvas Theme — Brand Configuration'
puts '=' * 70
puts ''

# Filter out any variables that BrandConfig does not recognize.
# BrandConfig.variables_map contains only the variables defined in
# brandable_variables.json. We strip out extras (like lightened/darkened
# variants and link-decoration) that may not be valid.
if defined?(BrandConfig) && BrandConfig.respond_to?(:variables_map)
  valid_keys = BrandConfig.variables_map.keys.map(&:to_s)
  unknown_keys = redefiners_variables.keys - valid_keys
  if unknown_keys.any?
    puts "INFO: The following variables are not in the schema and will be skipped:"
    unknown_keys.each { |k| puts "  - #{k}" }
    puts ''
    redefiners_variables = redefiners_variables.slice(*valid_keys)
  end
end

# Create (or find an existing matching) BrandConfig record.
# BrandConfig.for() looks up by MD5 hash of the variables, so running
# this script multiple times with the same values is idempotent.
brand_config = BrandConfig.for(variables: redefiners_variables)
brand_config.save! unless brand_config.persisted?

puts "BrandConfig created/found:"
puts "  MD5:        #{brand_config.md5}"
puts "  Variables:  #{redefiners_variables.size} set"
puts ''

# ---------------------------------------------------------------------------
# Apply to the root (default) account
# ---------------------------------------------------------------------------
account = Account.default
account.brand_config = brand_config
account.save!

puts "Applied to root account:"
puts "  Account:    #{account.name} (ID: #{account.id})"
puts ''

# ---------------------------------------------------------------------------
# (Optional) Apply to sub-accounts
# ---------------------------------------------------------------------------
# If you have sub-accounts that should share the same theme, uncomment
# and adjust the block below. Each sub-account can also have its own
# BrandConfig if you want per-school or per-department theming.
#
# sub_account_names = ['Elementary School', 'Middle School', 'High School']
# sub_account_names.each do |name|
#   sub = Account.where(parent_account: account).find_by(name: name)
#   if sub
#     sub.brand_config = brand_config
#     sub.save!
#     puts "  Applied to sub-account: #{sub.name} (ID: #{sub.id})"
#   else
#     puts "  WARN: Sub-account '#{name}' not found — skipping"
#   end
# end
#
# Alternatively, apply to ALL direct sub-accounts:
#
# Account.where(parent_account: account).find_each do |sub|
#   sub.brand_config = brand_config
#   sub.save!
#   puts "  Applied to sub-account: #{sub.name} (ID: #{sub.id})"
# end

# =============================================================================
# POST-SETUP INSTRUCTIONS
# =============================================================================

puts '-' * 70
puts 'NEXT STEPS'
puts '-' * 70
puts ''
puts '1. UPLOAD LOGO IMAGES'
puts '   Use the Theme Editor UI to upload branded images:'
puts "     URL: /accounts/#{account.id}/brand_configs"
puts ''
puts '   Required images (prepare these files):'
puts '     - Header logo (nav sidebar): PNG/SVG, ~40px tall'
puts '       -> Sets ic-brand-header-image'
puts '     - Mobile nav logo: SVG preferred'
puts '       -> Sets ic-brand-mobile-global-nav-logo'
puts '     - Login page logo: SVG/PNG, ~200px wide'
puts '       -> Sets ic-brand-Login-logo'
puts '     - Favicon: .ico or 32x32 PNG'
puts '       -> Sets ic-brand-favicon'
puts '     - Apple touch icon: 180x180 PNG'
puts '       -> Sets ic-brand-apple-touch-icon'
puts '     - Windows tile (square): 270x270 PNG'
puts '       -> Sets ic-brand-msapplication-tile-square'
puts '     - Windows tile (wide): 558x270 PNG'
puts '       -> Sets ic-brand-msapplication-tile-wide'
puts '     - Right sidebar logo: SVG/PNG (optional)'
puts '       -> Sets ic-brand-right-sidebar-logo'
puts '     - Watermark: PNG/SVG, subtle/faded (optional)'
puts '       -> Sets ic-brand-watermark'
puts ''
puts '   Alternatively, upload via the API:'
puts '     curl -X PUT \\    '
puts "       https://YOUR_CANVAS_DOMAIN/api/v1/accounts/#{account.id}/brand_configs \\"
puts '       -H "Authorization: Bearer YOUR_TOKEN" \\'
puts '       -F "brand_config[variables][ic-brand-header-image]=@logo.png"'
puts ''
puts '2. UPLOAD CSS OVERRIDE FILE'
puts '   The CSS override adds custom styles on top of the branded variables.'
puts '   Upload via Theme Editor or API:'
puts "     URL: /accounts/#{account.id}/brand_configs"
puts '     File: ReDefiners/redefiners_overrides.css'
puts ''
puts '   Via API:'
puts '     curl -X PUT \\'
puts "       https://YOUR_CANVAS_DOMAIN/api/v1/accounts/#{account.id}/brand_configs \\"
puts '       -H "Authorization: Bearer YOUR_TOKEN" \\'
puts '       -F "brand_config[css_overrides]=@ReDefiners/redefiners_overrides.css"'
puts ''
puts '3. UPLOAD CUSTOM JAVASCRIPT'
puts '   Custom JS can add analytics, UI enhancements, or third-party widgets.'
puts '   Upload via Theme Editor or API:'
puts "     URL: /accounts/#{account.id}/brand_configs"
puts '     File: ReDefiners/redefiners_instui.js'
puts ''
puts '   Via API:'
puts '     curl -X PUT \\'
puts "       https://YOUR_CANVAS_DOMAIN/api/v1/accounts/#{account.id}/brand_configs \\"
puts '       -H "Authorization: Bearer YOUR_TOKEN" \\'
puts '       -F "brand_config[js_overrides]=@ReDefiners/redefiners_instui.js"'
puts ''
puts '4. GENERATE AND DEPLOY BRAND ASSETS'
puts '   After all variables and files are configured, compile the assets:'
puts ''
puts '   Development:'
puts '     bundle exec rake brand_configs:generate_and_upload_all'
puts ''
puts '   Production:'
puts '     RAILS_ENV=production bundle exec rake brand_configs:generate_and_upload_all'
puts ''
puts '   Docker:'
puts '     docker exec -it canvas_web bundle exec rake brand_configs:generate_and_upload_all'
puts ''
puts '5. VERIFY THE THEME'
puts '   - Clear your browser cache (or use incognito)'
puts '   - Visit the login page to check Login styling'
puts '   - Log in and verify nav bar colors, button styles, and link colors'
puts '   - Check the Dashboard for watermark and sidebar logo'
puts '   - Test on mobile or use mobile emulation in dev tools'
puts ''
puts '=' * 70
puts 'ReDefiners theme setup complete!'
puts '=' * 70
