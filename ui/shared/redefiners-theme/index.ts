/*
 * Copyright (C) 2025 - present Instructure, Inc.
 *
 * This file is part of Canvas.
 *
 * Canvas is free software: you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License as published by the Free
 * Software Foundation, version 3 of the License.
 *
 * Canvas is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License along
 * with this program. If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * ReDefiners Theme Override Module
 *
 * Provides InstUI theme overrides for the ReDefiners design system.
 * Follows the same pattern as the K-5 theme (ui/shared/k5/react/k5-theme.ts).
 *
 * Design tokens: Inter/Poppins typography, rounded borders (8-16px),
 * teal/green palette (#0F2922, #163B32, #2DB88A).
 */

// ---------------------------------------------------------------------------
// Design tokens
// ---------------------------------------------------------------------------

const REDEFINERS_FONT_FAMILY =
  'Inter, Poppins, LatoWeb, "Lato Extended", Lato, "Helvetica Neue", Helvetica, Arial, sans-serif'

const REDEFINERS_HEADING_FONT =
  'Poppins, Inter, "Helvetica Neue", Helvetica, Arial, sans-serif'

// Color palette
const colors = {
  primary900: '#0F2922',
  primary800: '#163B32',
  primary700: '#1E4D42',
  primary600: '#2A6355',
  primary400: '#4A8B7A',
  primary200: '#7CB5A4',
  accentGreen: '#2DB88A',
  accentGreenDark: '#249E76',
  accentGreenLight: '#34D49E',
  accentOrange: '#FF6B35',
  accentOrangeDark: '#E55A28',
  pageBg: '#D4EFE6',
  cardBg: '#FFFFFF',
  border: '#E5E7EB',
  borderFocus: '#2DB88A',
  textPrimary: '#1B1B1B',
  textSecondary: '#6B7280',
  textOnDark: '#FFFFFF',
  link: '#3B82F6',
  linkHover: '#2563EB',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  success: '#2DB88A',
  successLight: '#D1FAE5',
  info: '#3B82F6',
  infoLight: '#DBEAFE',
  shadowSm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  shadowMd: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  shadowLg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
} as const

// Spacing scale
const spacing = {
  xxxSmall: '0.125rem',
  xxSmall: '0.25rem',
  xSmall: '0.5rem',
  small: '0.75rem',
  medium: '1rem',
  large: '1.5rem',
  xLarge: '2rem',
  xxLarge: '2.5rem',
  xxxLarge: '3rem',
} as const

// ---------------------------------------------------------------------------
// Theme-level overrides
// ---------------------------------------------------------------------------

export function getRedefinersThemeOverrides() {
  let fontFamily = REDEFINERS_FONT_FAMILY
  if (typeof ENV !== 'undefined' && ENV.use_dyslexic_font) {
    fontFamily = `OpenDyslexic, ${fontFamily}`
  }

  return {
    typography: {
      fontFamily,
      fontFamilyMonospace:
        'Monaco, Menlo, Consolas, "Courier New", monospace',
      fontSizeXSmall: '0.6875rem',
      fontSizeSmall: '0.8125rem',
      fontSizeMedium: '0.9375rem',
      fontSizeLarge: '1.125rem',
      fontSizeXLarge: '1.3125rem',
      fontSizeXXLarge: '1.625rem',
      fontWeightLight: 300,
      fontWeightNormal: 400,
      fontWeightBold: 600,
      lineHeight: 1.6,
      lineHeightCondensed: 1.35,
    },
    colors: {
      brand: colors.accentGreen,
      link: colors.link,
      electric: colors.accentGreen,
      shamrock: colors.accentGreen,
      barney: colors.primary700,
      crimson: colors.error,
      fire: colors.accentOrange,
      licorice: colors.textPrimary,
      oxford: colors.textSecondary,
      ash: colors.border,
      tiara: colors.border,
      porcelain: colors.pageBg,
      white: colors.cardBg,
      backgroundLightest: colors.cardBg,
      backgroundLight: colors.pageBg,
      backgroundMedium: colors.border,
      backgroundDark: colors.primary700,
      backgroundDarkest: colors.primary900,
      backgroundBrand: colors.accentGreen,
      backgroundAlert: colors.errorLight,
      backgroundInfo: colors.infoLight,
      backgroundSuccess: colors.successLight,
      backgroundWarning: colors.warningLight,
      textDarkest: colors.textPrimary,
      textDark: colors.textSecondary,
      textLight: colors.primary200,
      textLightest: colors.textOnDark,
      textBrand: colors.accentGreen,
      textLink: colors.link,
      textAlert: colors.error,
      textInfo: colors.info,
      textSuccess: colors.success,
      textWarning: colors.warning,
      borderLight: colors.border,
      borderMedium: colors.border,
      borderDark: colors.primary400,
      borderBrand: colors.accentGreen,
      borderAlert: colors.error,
      borderInfo: colors.info,
      borderSuccess: colors.success,
      borderWarning: colors.warning,
    },
    borders: {
      radiusSmall: '8px',
      radiusMedium: '12px',
      radiusLarge: '16px',
      style: 'solid',
      widthSmall: '1px',
      widthMedium: '2px',
    },
    spacing: {
      xxxSmall: spacing.xxxSmall,
      xxSmall: spacing.xxSmall,
      xSmall: spacing.xSmall,
      small: spacing.small,
      medium: spacing.medium,
      large: spacing.large,
      xLarge: spacing.xLarge,
      xxLarge: spacing.xxLarge,
    },
    shadows: {
      depth1: colors.shadowSm,
      depth2: colors.shadowMd,
      depth3: colors.shadowLg,
    },
    transitions: {
      duration: '0.2s',
      timing: 'ease',
    },
  }
}

// ---------------------------------------------------------------------------
// Component-level overrides
// ---------------------------------------------------------------------------

export function getRedefinersComponentOverrides() {
  return {
    // -- Heading ---------------------------------------------------------------
    Heading: {
      h1FontFamily: REDEFINERS_HEADING_FONT,
      h2FontFamily: REDEFINERS_HEADING_FONT,
      h3FontFamily: REDEFINERS_HEADING_FONT,
      h4FontFamily: REDEFINERS_HEADING_FONT,
      h5FontFamily: REDEFINERS_HEADING_FONT,
      h1FontWeight: '700',
      h2FontWeight: '600',
      h3FontWeight: '600',
      h4FontWeight: '600',
      h5FontWeight: '600',
      h1FontSize: '1.75rem',
      h2FontSize: '1.375rem',
      h3FontSize: '1.125rem',
      h4FontSize: '1rem',
      h5FontSize: '0.875rem',
      primaryColor: colors.textPrimary,
      secondaryColor: colors.textSecondary,
      brandColor: colors.accentGreen,
      primaryInverseColor: colors.textOnDark,
    },

    // -- Text ------------------------------------------------------------------
    Text: {
      fontFamily: REDEFINERS_FONT_FAMILY,
      primaryColor: colors.textPrimary,
      secondaryColor: colors.textSecondary,
      brandColor: colors.accentGreen,
      warningColor: colors.warning,
      dangerColor: colors.error,
      successColor: colors.success,
      primaryInverseColor: colors.textOnDark,
      fontSize: '0.9375rem',
      fontSizeSmall: '0.8125rem',
      fontSizeMedium: '0.9375rem',
      fontSizeLarge: '1.125rem',
      fontSizeXLarge: '1.3125rem',
      lineHeight: '1.6',
    },

    // -- BaseButton ------------------------------------------------------------
    BaseButton: {
      borderRadius: '9999px',
      fontFamily: REDEFINERS_FONT_FAMILY,
      fontWeight: '600',
      borderWidth: '2px',
      focusOutlineColor: colors.accentGreen,
      focusOutlineWidth: '2px',
      focusOutlineOffset: '2px',
      smallHeight: '2rem',
      smallFontSize: '0.8125rem',
      smallPaddingHorizontal: spacing.medium,
      mediumHeight: '2.5rem',
      mediumFontSize: '0.9375rem',
      mediumPaddingHorizontal: spacing.large,
      largeHeight: '3rem',
      largeFontSize: '1rem',
      largePaddingHorizontal: spacing.xLarge,
      transform: 'scale(1)',
      hoverTransform: 'scale(1.02)',
      activeTransform: 'scale(0.98)',
      transition: 'all 0.2s ease',
      primaryBackground: colors.accentGreen,
      primaryBorderColor: colors.accentGreen,
      primaryColor: colors.textOnDark,
      primaryHoverBackground: colors.accentGreenDark,
      primaryActiveBackground: colors.accentGreenDark,
      primaryActiveColor: colors.textOnDark,
      secondaryBackground: 'transparent',
      secondaryBorderColor: colors.accentGreen,
      secondaryColor: colors.accentGreen,
      secondaryHoverBackground: colors.successLight,
      successBackground: colors.accentGreen,
      successBorderColor: colors.accentGreen,
      successColor: colors.textOnDark,
      successHoverBackground: colors.accentGreenDark,
      dangerBackground: colors.error,
      dangerBorderColor: colors.error,
      dangerColor: colors.textOnDark,
      dangerHoverBackground: '#DC2626',
      ghostColor: colors.textPrimary,
      ghostBorderColor: 'transparent',
      ghostBackground: 'transparent',
      ghostHoverBackground: colors.pageBg,
    },

    // -- TextInput --------------------------------------------------------------
    TextInput: {
      borderRadius: '8px',
      borderWidth: '1px',
      borderColor: colors.border,
      focusBorderColor: colors.accentGreen,
      focusOutlineColor: colors.accentGreen,
      focusOutlineWidth: '2px',
      background: colors.cardBg,
      color: colors.textPrimary,
      fontFamily: REDEFINERS_FONT_FAMILY,
      fontSize: '0.9375rem',
      padding: `${spacing.xSmall} ${spacing.small}`,
      height: '2.5rem',
      labelColor: colors.textPrimary,
      labelFontWeight: '500',
      placeholderColor: colors.textSecondary,
    },

    // -- NumberInput -------------------------------------------------------------
    NumberInput: {
      borderRadius: '8px',
      borderWidth: '1px',
      borderColor: colors.border,
      focusBorderColor: colors.accentGreen,
      focusOutlineColor: colors.accentGreen,
      focusOutlineWidth: '2px',
      background: colors.cardBg,
      color: colors.textPrimary,
      fontFamily: REDEFINERS_FONT_FAMILY,
      fontSize: '0.9375rem',
      arrowsColor: colors.textSecondary,
    },

    // -- DateInput ---------------------------------------------------------------
    DateInput: {
      borderRadius: '8px',
      borderWidth: '1px',
      borderColor: colors.border,
      focusBorderColor: colors.accentGreen,
      focusOutlineColor: colors.accentGreen,
      background: colors.cardBg,
      color: colors.textPrimary,
      fontFamily: REDEFINERS_FONT_FAMILY,
      fontSize: '0.9375rem',
      selectedBackground: colors.accentGreen,
      selectedColor: colors.textOnDark,
      todayBackground: colors.successLight,
    },

    // -- Select -----------------------------------------------------------------
    Select: {
      borderRadius: '8px',
      borderWidth: '1px',
      borderColor: colors.border,
      focusBorderColor: colors.accentGreen,
      focusOutlineColor: colors.accentGreen,
      focusOutlineWidth: '2px',
      background: colors.cardBg,
      color: colors.textPrimary,
      fontFamily: REDEFINERS_FONT_FAMILY,
      fontSize: '0.9375rem',
      highlightedBackground: colors.pageBg,
      selectedBackground: colors.successLight,
      selectedColor: colors.primary900,
    },

    // -- TextArea ----------------------------------------------------------------
    TextArea: {
      borderRadius: '8px',
      borderWidth: '1px',
      borderColor: colors.border,
      focusBorderColor: colors.accentGreen,
      focusOutlineColor: colors.accentGreen,
      focusOutlineWidth: '2px',
      background: colors.cardBg,
      color: colors.textPrimary,
      fontFamily: REDEFINERS_FONT_FAMILY,
      fontSize: '0.9375rem',
      padding: spacing.small,
    },

    // -- FormFieldLabel ----------------------------------------------------------
    FormFieldLabel: {
      color: colors.textPrimary,
      fontFamily: REDEFINERS_FONT_FAMILY,
      fontWeight: '600',
      fontSize: '0.8125rem',
    },

    // -- Checkbox ----------------------------------------------------------------
    Checkbox: {
      borderRadius: '4px',
      borderColor: colors.border,
      borderWidth: '2px',
      checkedBackground: colors.accentGreen,
      checkedBorderColor: colors.accentGreen,
      checkedIconColor: colors.textOnDark,
      focusBorderColor: colors.accentGreen,
      focusOutlineColor: colors.accentGreen,
      hoverBorderColor: colors.primary400,
      labelColor: colors.textPrimary,
      labelFontFamily: REDEFINERS_FONT_FAMILY,
      labelFontSize: '0.9375rem',
    },

    // -- RadioInput --------------------------------------------------------------
    RadioInput: {
      borderColor: colors.border,
      borderWidth: '2px',
      checkedBackground: colors.accentGreen,
      checkedBorderColor: colors.accentGreen,
      checkedIconColor: colors.textOnDark,
      focusBorderColor: colors.accentGreen,
      focusOutlineColor: colors.accentGreen,
      hoverBorderColor: colors.primary400,
      labelColor: colors.textPrimary,
      labelFontFamily: REDEFINERS_FONT_FAMILY,
      labelFontSize: '0.9375rem',
    },

    // -- Alert -------------------------------------------------------------------
    Alert: {
      borderRadius: '12px',
      fontFamily: REDEFINERS_FONT_FAMILY,
      closeButtonColor: colors.textSecondary,
      closeButtonHoverColor: colors.textPrimary,
      infoBorderColor: colors.info,
      infoBackground: colors.infoLight,
      infoIconBackground: colors.info,
      infoColor: colors.textPrimary,
      successBorderColor: colors.success,
      successBackground: colors.successLight,
      successIconBackground: colors.success,
      successColor: colors.textPrimary,
      warningBorderColor: colors.warning,
      warningBackground: colors.warningLight,
      warningIconBackground: colors.warning,
      warningColor: colors.textPrimary,
      errorBorderColor: colors.error,
      errorBackground: colors.errorLight,
      errorIconBackground: colors.error,
      errorColor: colors.textPrimary,
      boxShadow: colors.shadowSm,
    },

    // -- Badge -------------------------------------------------------------------
    Badge: {
      fontFamily: REDEFINERS_FONT_FAMILY,
      fontWeight: '600',
      fontSize: '0.75rem',
      color: colors.textOnDark,
      colorDanger: colors.error,
      colorSuccess: colors.success,
      colorPrimary: colors.accentOrange,
      background: colors.accentOrange,
      borderRadius: '9999px',
      padding: `${spacing.xxSmall} ${spacing.xSmall}`,
      boxShadow: colors.shadowSm,
      notificationFontSize: '0.625rem',
      notificationCountBackgroundColor: colors.accentOrange,
      notificationCountColor: colors.textOnDark,
    },

    // -- Billboard ---------------------------------------------------------------
    Billboard: {
      borderRadius: '16px',
      fontFamily: REDEFINERS_FONT_FAMILY,
      backgroundColor: colors.cardBg,
      iconColor: colors.accentGreen,
      messageColor: colors.textSecondary,
      clickableActiveBorderColor: colors.accentGreen,
      clickableHoverBorderColor: colors.primary400,
      headingFontFamily: REDEFINERS_HEADING_FONT,
      headingFontWeight: '600',
      messageFontSize: '0.9375rem',
      padding: spacing.xLarge,
    },

    // -- Breadcrumb --------------------------------------------------------------
    Breadcrumb: {
      fontFamily: REDEFINERS_FONT_FAMILY,
      fontSize: '0.8125rem',
      fontWeight: '400',
      color: colors.textSecondary,
      separatorColor: colors.textSecondary,
      linkColor: colors.primary600,
      linkHoverColor: colors.primary400,
    },

    // -- Card (InstUI uses "View" as a base, but Card-specific overrides) --------
    Card: {
      borderRadius: '16px',
      borderWidth: '1px',
      borderColor: colors.border,
      background: colors.cardBg,
      boxShadow: colors.shadowSm,
      hoverBorderColor: colors.primary400,
      hoverBoxShadow: colors.shadowMd,
      fontFamily: REDEFINERS_FONT_FAMILY,
      padding: spacing.large,
      transition: 'all 0.2s ease',
    },

    // -- View (base component) ---------------------------------------------------
    View: {
      fontFamily: REDEFINERS_FONT_FAMILY,
      color: colors.textPrimary,
      borderColorPrimary: colors.border,
      borderColorSecondary: colors.border,
      borderColorSuccess: colors.accentGreen,
      borderColorBrand: colors.accentGreen,
      borderColorAlert: colors.error,
      borderColorWarning: colors.warning,
      borderColorInfo: colors.info,
      backgroundPrimary: colors.cardBg,
      backgroundSecondary: colors.pageBg,
      backgroundPrimaryInverse: colors.primary900,
      backgroundBrand: colors.accentGreen,
      backgroundAlert: colors.errorLight,
      backgroundInfo: colors.infoLight,
      backgroundSuccess: colors.successLight,
      backgroundWarning: colors.warningLight,
      focusOutlineColor: colors.accentGreen,
      focusOutlineWidth: '2px',
      focusOutlineOffset: '2px',
    },

    // -- Link --------------------------------------------------------------------
    Link: {
      fontFamily: REDEFINERS_FONT_FAMILY,
      color: colors.link,
      hoverColor: colors.linkHover,
      focusOutlineColor: colors.accentGreen,
      fontWeight: '500',
      textDecoration: 'none',
      hoverTextDecoration: 'underline',
      colorInverse: colors.primary200,
    },

    // -- Menu (Dropdown menus) ---------------------------------------------------
    Menu: {
      borderRadius: '12px',
      borderColor: colors.border,
      background: colors.cardBg,
      boxShadow: colors.shadowLg,
      fontFamily: REDEFINERS_FONT_FAMILY,
      fontSize: '0.9375rem',
      padding: spacing.xxSmall,
      itemBackground: 'transparent',
      itemHoverBackground: colors.pageBg,
      itemActiveBackground: colors.successLight,
      itemColor: colors.textPrimary,
      itemFontWeight: '400',
      itemPadding: `${spacing.xSmall} ${spacing.small}`,
      itemBorderRadius: '8px',
      labelColor: colors.textSecondary,
      labelFontSize: '0.75rem',
      labelFontWeight: '600',
      labelTextTransform: 'uppercase',
      separatorColor: colors.border,
    },

    // -- Navigation (sidebar / top nav) ------------------------------------------
    Navigation: {
      fontFamily: REDEFINERS_FONT_FAMILY,
      backgroundColor: colors.primary800,
      backgroundGradient: `linear-gradient(180deg, ${colors.primary900} 0%, ${colors.primary800} 100%)`,
      color: colors.textOnDark,
      hoverColor: colors.textOnDark,
      selectedColor: colors.textOnDark,
      selectedBackground: colors.accentGreen,
      selectedBorderColor: colors.accentGreen,
      selectedFontWeight: '600',
      itemPadding: `${spacing.small} ${spacing.medium}`,
      itemBorderRadius: '8px',
      itemHoverBackground: colors.primary700,
      itemActiveBackground: colors.accentGreen,
      itemColor: colors.primary200,
      itemActiveColor: colors.textOnDark,
      itemFontSize: '0.875rem',
      iconColor: colors.primary200,
      iconActiveColor: colors.textOnDark,
      badgeBackground: colors.accentOrange,
      badgeColor: colors.textOnDark,
      linkColor: colors.primary200,
      linkHoverColor: colors.textOnDark,
      linkActiveColor: colors.accentGreen,
      borderColor: colors.primary700,
    },

    // -- Tabs --------------------------------------------------------------------
    Tabs: {
      fontFamily: REDEFINERS_FONT_FAMILY,
      defaultColor: colors.textSecondary,
      defaultSelectedColor: colors.accentGreen,
      defaultSelectedBorderColor: colors.accentGreen,
      defaultHoverColor: colors.textPrimary,
      defaultBackground: 'transparent',
      defaultSelectedBackground: 'transparent',
      defaultHoverBackground: 'transparent',
      defaultBorderColor: 'transparent',
      defaultHoverBorderColor: colors.border,
      tabFontWeight: '500',
      tabSelectedFontWeight: '600',
      tabFontSize: '0.9375rem',
      tabPadding: `${spacing.xSmall} ${spacing.medium}`,
      tabBorderWidth: '3px',
      scrollOverlayColor: colors.cardBg,
      focusOutlineColor: colors.accentGreen,
    },

    // -- Table -------------------------------------------------------------------
    Table: {
      borderRadius: '12px',
      fontFamily: REDEFINERS_FONT_FAMILY,
      fontSize: '0.875rem',
      headerBackground: colors.pageBg,
      headerBorderColor: colors.border,
      headerColor: colors.textPrimary,
      headerFontWeight: '600',
      headerFontSize: '0.75rem',
      headerTextTransform: 'uppercase',
      headerLetterSpacing: '0.05em',
      bodyBackground: colors.cardBg,
      bodyColor: colors.textPrimary,
      bodyBorderColor: colors.border,
      stripedBackground: '#F9FAFB',
      hoverBackground: colors.pageBg,
      selectedBackground: colors.successLight,
      cellPadding: `${spacing.small} ${spacing.medium}`,
      borderWidth: '1px',
      borderColor: colors.border,
    },

    // -- Tag ---------------------------------------------------------------------
    Tag: {
      borderRadius: '9999px',
      fontFamily: REDEFINERS_FONT_FAMILY,
      fontSize: '0.75rem',
      fontWeight: '500',
      padding: `${spacing.xxSmall} ${spacing.small}`,
      defaultBackground: colors.pageBg,
      defaultBorderColor: colors.border,
      defaultColor: colors.textPrimary,
      inlineBackground: colors.successLight,
      inlineBorderColor: colors.accentGreen,
      inlineColor: colors.primary900,
    },

    // -- Pill (tag-like rounded element) ----------------------------------------
    Pill: {
      borderRadius: '9999px',
      fontFamily: REDEFINERS_FONT_FAMILY,
      fontWeight: '500',
      fontSize: '0.75rem',
      background: colors.pageBg,
      color: colors.primary900,
      borderColor: colors.border,
      padding: `${spacing.xxSmall} ${spacing.small}`,
      primaryBackground: colors.accentGreen,
      primaryColor: colors.textOnDark,
      dangerBackground: colors.errorLight,
      dangerColor: colors.error,
      successBackground: colors.successLight,
      successColor: colors.primary900,
      warningBackground: colors.warningLight,
      warningColor: colors.textPrimary,
      infoBackground: colors.infoLight,
      infoColor: colors.info,
    },

    // -- Tooltip -----------------------------------------------------------------
    Tooltip: {
      borderRadius: '8px',
      fontFamily: REDEFINERS_FONT_FAMILY,
      fontSize: '0.8125rem',
      fontWeight: '400',
      background: colors.primary900,
      color: colors.textOnDark,
      padding: `${spacing.xxSmall} ${spacing.xSmall}`,
      boxShadow: colors.shadowMd,
      maxWidth: '16rem',
    },

    // -- Dialog / Modal ----------------------------------------------------------
    Modal: {
      borderRadius: '20px',
      background: colors.cardBg,
      boxShadow: colors.shadowLg,
      fontFamily: REDEFINERS_FONT_FAMILY,
      headerBackground: colors.cardBg,
      headerBorderColor: colors.border,
      headerFontFamily: REDEFINERS_HEADING_FONT,
      headerFontWeight: '600',
      headerPadding: `${spacing.large} ${spacing.xLarge}`,
      bodyPadding: spacing.xLarge,
      footerBackground: colors.cardBg,
      footerBorderColor: colors.border,
      footerPadding: `${spacing.medium} ${spacing.xLarge}`,
      closeButtonColor: colors.textSecondary,
      closeButtonHoverColor: colors.textPrimary,
    },

    // -- Tray (slide-out panel) --------------------------------------------------
    Tray: {
      borderRadius: '20px 0 0 20px',
      background: colors.cardBg,
      boxShadow: colors.shadowLg,
      fontFamily: REDEFINERS_FONT_FAMILY,
      contentPadding: spacing.xLarge,
      headerBorderColor: colors.border,
      zIndex: 9999,
    },

    // -- DrawerLayout ------------------------------------------------------------
    DrawerLayout: {
      fontFamily: REDEFINERS_FONT_FAMILY,
      background: colors.pageBg,
      borderColor: colors.border,
      contentBackground: colors.pageBg,
      trayBackground: colors.cardBg,
      trayBorderColor: colors.border,
      trayBoxShadow: colors.shadowMd,
    },

    // -- ProgressBar -------------------------------------------------------------
    ProgressBar: {
      borderRadius: '9999px',
      fontFamily: REDEFINERS_FONT_FAMILY,
      fontSize: '0.75rem',
      fontWeight: '600',
      trackBackground: colors.border,
      trackBorderRadius: '9999px',
      barBackground: colors.accentGreen,
      barBackgroundGradient: `linear-gradient(90deg, ${colors.primary400} 0%, ${colors.accentGreen} 100%)`,
      barBorderRadius: '9999px',
      height: '0.5rem',
      valueColor: colors.textOnDark,
      successBarBackground: colors.accentGreen,
      dangerBarBackground: colors.error,
      warningBarBackground: colors.warning,
      infoBarBackground: colors.info,
    },

    // -- Spinner -----------------------------------------------------------------
    Spinner: {
      color: colors.accentGreen,
      trackColor: colors.border,
      inverseColor: colors.textOnDark,
      inverseTrackColor: 'rgba(255, 255, 255, 0.25)',
      smallSize: '1.5rem',
      mediumSize: '2.5rem',
      largeSize: '3.5rem',
      borderWidth: '0.1875rem',
    },

    // -- Avatar ------------------------------------------------------------------
    Avatar: {
      borderRadius: '9999px',
      fontFamily: REDEFINERS_HEADING_FONT,
      fontWeight: '600',
      background: colors.accentGreen,
      color: colors.textOnDark,
      borderColor: colors.accentGreen,
      borderWidth: '2px',
      boxShadow: `0 0 0 2px ${colors.accentGreen}`,
    },

    // -- Pagination --------------------------------------------------------------
    Pagination: {
      fontFamily: REDEFINERS_FONT_FAMILY,
      fontSize: '0.875rem',
      fontWeight: '500',
      buttonBorderRadius: '8px',
      buttonBackground: 'transparent',
      buttonColor: colors.textPrimary,
      buttonBorderColor: colors.border,
      buttonHoverBackground: colors.pageBg,
      buttonActiveBackground: colors.accentGreen,
      buttonActiveColor: colors.textOnDark,
      buttonActiveBorderColor: colors.accentGreen,
      buttonPadding: `${spacing.xxSmall} ${spacing.xSmall}`,
      arrowColor: colors.textSecondary,
      arrowHoverColor: colors.textPrimary,
      arrowDisabledColor: colors.border,
    },

    // -- Rating ------------------------------------------------------------------
    Rating: {
      fontFamily: REDEFINERS_FONT_FAMILY,
      iconColor: colors.accentOrange,
      iconEmptyColor: colors.border,
      iconFilledColor: colors.accentOrange,
      labelColor: colors.textSecondary,
      labelFontSize: '0.8125rem',
    },

    // -- ToggleDetails -----------------------------------------------------------
    ToggleDetails: {
      fontFamily: REDEFINERS_FONT_FAMILY,
      fontSize: '0.9375rem',
      fontWeight: '400',
      iconColor: colors.textSecondary,
      iconHoverColor: colors.textPrimary,
      iconMargin: spacing.xSmall,
      textColor: colors.textPrimary,
      borderRadius: '8px',
      borderColor: colors.border,
      focusOutlineColor: colors.accentGreen,
      filledBackground: colors.pageBg,
      filledBorderColor: colors.border,
      filledBorderRadius: '12px',
      filledPadding: spacing.medium,
    },

    // -- FileDrop ----------------------------------------------------------------
    FileDrop: {
      borderRadius: '12px',
      borderColor: colors.border,
      borderWidth: '2px',
      borderStyle: 'dashed',
      background: colors.cardBg,
      hoverBackground: colors.pageBg,
      hoverBorderColor: colors.accentGreen,
      acceptedBackground: colors.successLight,
      acceptedBorderColor: colors.accentGreen,
      rejectedBackground: colors.errorLight,
      rejectedBorderColor: colors.error,
      fontFamily: REDEFINERS_FONT_FAMILY,
      labelColor: colors.textSecondary,
      labelFontSize: '0.9375rem',
      labelFontWeight: '500',
      padding: spacing.xLarge,
    },

    // -- Flex (layout utility) ---------------------------------------------------
    Flex: {
      fontFamily: REDEFINERS_FONT_FAMILY,
      gap: spacing.medium,
    },
  }
}
