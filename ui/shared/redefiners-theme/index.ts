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

const REDEFINERS_FONT_FAMILY =
  'Inter, Poppins, LatoWeb, "Lato Extended", Lato, "Helvetica Neue", Helvetica, Arial, sans-serif'

const REDEFINERS_HEADING_FONT =
  'Poppins, Inter, "Helvetica Neue", Helvetica, Arial, sans-serif'

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
    },
    borders: {
      radiusSmall: '8px',
      radiusMedium: '12px',
      radiusLarge: '16px',
    },
  }
}

export function getRedefinersComponentOverrides() {
  return {
    Heading: {
      h1FontFamily: REDEFINERS_HEADING_FONT,
      h2FontFamily: REDEFINERS_HEADING_FONT,
      h3FontFamily: REDEFINERS_HEADING_FONT,
      h1FontWeight: '700',
      h2FontWeight: '600',
    },
    BaseButton: {
      borderRadius: '12px',
    },
    TextInput: {
      borderRadius: '8px',
    },
  }
}
