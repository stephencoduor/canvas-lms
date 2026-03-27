# ReDefiners Design System

> Comprehensive Design Token Reference & Component Specification
> Version: 1.0.0 | Last Updated: 2026-03-19

---

## Table of Contents

1. [Design Principles](#1-design-principles)
2. [Color System](#2-color-system)
3. [Typography](#3-typography)
4. [Spacing & Layout](#4-spacing--layout)
5. [Elevation & Shadows](#5-elevation--shadows)
6. [Border & Radius](#6-border--radius)
7. [Iconography](#7-iconography)
8. [Component Library](#8-component-library)
9. [Navigation Patterns](#9-navigation-patterns)
10. [Form Elements](#10-form-elements)
11. [Data Display](#11-data-display)
12. [Feedback & Status](#12-feedback--status)
13. [Motion & Animation](#13-motion--animation)
14. [Responsive System](#14-responsive-system)
15. [Page Templates](#15-page-templates)
16. [Accessibility Guidelines](#16-accessibility-guidelines)
17. [Asset Inventory](#17-asset-inventory)

---

## 1. Design Principles

| Principle | Description |
|---|---|
| **Clarity** | Every element serves a purpose. Content hierarchy is immediately obvious. |
| **Warmth** | Teal-based palette creates a calm, educational environment. Rounded corners soften the interface. |
| **Consistency** | Shared sidebar, top bar, and card patterns across all pages create predictability. |
| **Responsiveness** | Single-breakpoint approach ensures usability on desktop and mobile. |
| **Language-Learning Focus** | Progress visualization, streaks, and points are first-class UI citizens. |

---

## 2. Color System

### 2.1 Primary Palette

| Token | Hex | RGB | Usage | CSS Variable (recommended) |
|---|---|---|---|---|
| `primary-900` | `#00303F` | rgb(0, 48, 63) | Deepest backgrounds, send buttons, scrollbar handles | `--color-primary-900` |
| `primary-800` | `#063949` | rgb(6, 57, 73) | Sidebar background, gradient end | `--color-primary-800` |
| `primary-700` | `#0F4D61` | rgb(15, 77, 97) | Login panel, primary buttons, section headers | `--color-primary-700` |
| `primary-600` | `#1C5D71` | rgb(28, 93, 113) | Active menu gradient start | `--color-primary-600` |
| `primary-400` | `#668B91` | rgb(102, 139, 145) | Secondary text, muted icons, form borders | `--color-primary-400` |
| `primary-200` | `#8CA7AF` | rgb(140, 167, 175) | Active menu shadow | `--color-primary-200` |

### 2.2 Neutral Palette

| Token | Hex | Usage | CSS Variable |
|---|---|---|---|
| `neutral-white` | `#FFFFFF` | Card surfaces, content backgrounds | `--color-white` |
| `neutral-50` | `#F6F9FA` | Info card backgrounds | `--color-neutral-50` |
| `neutral-100` | `#F0F6F7` | Page background, table cell default | `--color-neutral-100` |
| `neutral-150` | `#EDF5F6` | Input field backgrounds, message field | `--color-neutral-150` |
| `neutral-200` | `#E9F2F4` | Light section backgrounds | `--color-neutral-200` |
| `neutral-250` | `#E0E8EA` | Info card borders | `--color-neutral-250` |
| `neutral-300` | `#CCD6D9` | Divider lines, light borders | `--color-neutral-300` |
| `neutral-400` | `#B5C2C6` | Form input borders, send icon text | `--color-neutral-400` |
| `neutral-500` | `#8CA7AF` | Placeholder text | `--color-neutral-500` |
| `neutral-shadow-light` | `#F3F3F3` | Light shadow, incoming message bg | `--color-shadow-light` |
| `neutral-shadow-med` | `#E8E5E5` | Medium shadow | `--color-shadow-med` |
| `neutral-shadow-dark` | `#CAC9C9` | Dark shadow, tooltip shadow | `--color-shadow-dark` |

### 2.3 Accent Palette

| Token | Hex | Usage | CSS Variable |
|---|---|---|---|
| `accent-cyan` | `#16D2DD` | Active assignment highlight | `--color-accent-cyan` |
| `accent-blue` | `#2989CA` | Progress bars, secondary buttons | `--color-accent-blue` |
| `accent-blue-light` | `#DFEDF7` | Progress bar track (blue) | `--color-accent-blue-light` |
| `accent-blue-cell` | `#5A99D8` | Calendar cell (blue) | `--color-accent-blue-cell` |
| `accent-purple` | `#8828CD` | Discussion active state | `--color-accent-purple` |
| `accent-purple-light` | `#A766D7` | Calendar cell (purple) | `--color-accent-purple-light` |
| `accent-purple-track` | `#EEE1F8` | Progress bar track (purple) | `--color-accent-purple-track` |
| `accent-orange` | `#F49E21` | CTA buttons, course card actions | `--color-accent-orange` |
| `accent-yellow` | `#F5BE24` | Recent chat active, secondary CTA | `--color-accent-yellow` |
| `accent-yellow-light` | `#FDF5DE` | Progress bar track (yellow) | `--color-accent-yellow-light` |
| `accent-yellow-cell` | `#EEC960` | Calendar cell (gold) | `--color-accent-yellow-cell` |
| `accent-green` | `#38AA51` | Calendar cell (green), success | `--color-accent-green` |
| `accent-teal-cell` | `#4DCAC5` | Calendar cell (sea teal) | `--color-accent-teal-cell` |
| `accent-red` | `#DA6E61` | Calendar cell (red), warning | `--color-accent-red` |
| `accent-red-bright` | `#F45252` | Alert, error states | `--color-accent-red-bright` |

### 2.4 Text Colors

| Token | Hex | Usage |
|---|---|---|
| `text-primary` | `#00303F` | Headings, primary body text |
| `text-secondary` | `#668B91` | Labels, captions, muted text |
| `text-on-dark` | `#FFFFFF` | Text on primary/dark backgrounds |
| `text-on-accent` | `#FFFFFF` | Text on accent-colored elements |
| `text-link` | `#2989CA` | Hyperlinks |
| `text-muted` | `#B5C2C6` | Disabled, placeholder text |

### 2.5 Gradients

| Token | Value | Usage |
|---|---|---|
| `gradient-menu-active` | `linear-gradient(329deg, rgba(28,93,113,1) 0%, rgba(6,57,73,1) 100%)` | Active sidebar menu item |

### 2.6 Semantic Colors

| Semantic Use | Color Token | Hex |
|---|---|---|
| Success | `accent-green` | `#38AA51` |
| Warning | `accent-orange` | `#F49E21` |
| Error / Danger | `accent-red-bright` | `#F45252` |
| Info | `accent-blue` | `#2989CA` |
| Active / Selected | `accent-cyan` | `#16D2DD` |
| In Progress | `accent-purple` | `#8828CD` |

---

## 3. Typography

### 3.1 Font Stack

```css
font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

**CDN Source**: `https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700`

Current template loads weight 300 only. Recommended: load 300, 400, 500, 600, 700 for full typographic range.

### 3.2 Type Scale

| Level | Size | Weight | Line Height | Usage |
|---|---|---|---|---|
| `display-xl` | 5rem (80px) | 300 | 1.1 | Welcome hero text |
| `heading-1` | 24px | 600 | 1.3 | Page titles |
| `heading-2` | 20px | 600 | 1.3 | Section headers |
| `heading-3` | 18px | 600 | 1.4 | Card titles, subsection headers |
| `heading-4` | 16px | 500 | 1.4 | Widget headers |
| `body-lg` | 15px | 400 | 1.5 | Primary body text |
| `body` | 14px | 300 | 1.5 | Standard body text |
| `body-sm` | 13px | 300 | 1.5 | Compact body text |
| `caption` | 12px | 300 | 1.4 | Timestamps, metadata |
| `caption-sm` | 11px | 300 | 1.4 | Labels, table headers |
| `overline` | 10px | 400 | 1.3 | Small labels |
| `micro` | 8px | 300 | 1.2 | Tiny annotations |

### 3.3 Text Styling

| Style | CSS | Usage |
|---|---|---|
| Bold emphasis | `font-weight: bold` / `700` | Button text, strong labels |
| Uppercase | `text-transform: uppercase` | Table column headers, overline labels |
| No decoration | `text-decoration: none` | All navigation links |
| Word break | `word-break: break-all` | Chat message overflow |

---

## 4. Spacing & Layout

### 4.1 Spacing Scale

| Token | Value | Usage |
|---|---|---|
| `space-0` | 0px | No spacing |
| `space-1` | 2px | Tight inline spacing |
| `space-2` | 5px | Icon-to-text gap |
| `space-3` | 8px | Small padding (info cards, message bubbles) |
| `space-4` | 10px | Standard inner padding, nav bar padding |
| `space-5` | 13px | Table border-spacing |
| `space-6` | 15px | Menu link padding, section margins |
| `space-7` | 20px | Card padding, carousel padding, standard margin |
| `space-8` | 30px | Section spacing, card margins |
| `space-9` | 40px | Logo section padding, large card padding |
| `space-10` | 50px | Main content horizontal padding |
| `space-11` | 65px | Menu link right padding |

### 4.2 Layout Grid

| Zone | Width | Position | Background |
|---|---|---|---|
| **Left Sidebar** | 228px fixed | `position: fixed; left: 0; top: 0` | `primary-800` (#063949) |
| **Main Content** | `calc(100% - 228px)` | `margin-left: 228px` | `neutral-100` (#F0F6F7) |
| **Right Sidebar** | ~300px | `position: absolute; right: 0; top: 0` | transparent |

**Main Content Inner Curve**: `border-radius: 30px 0 0 30px` — creates the signature curved left edge against the sidebar.

### 4.3 Bootstrap Grid Usage

| Layout | Columns | Context |
|---|---|---|
| Three-column | `col-lg-2 / col-lg-8 / col-lg-2` | Dashboard, class pages |
| Two-column | `col-md-3 / col-md-9` | Inbox (list + detail) |
| Full-width | `col-md-12` | Announcements, mobile |
| Content split | `col-md-8 / col-md-4` | Course detail + sidebar |

### 4.4 Z-Index Scale

| Layer | z-index | Usage |
|---|---|---|
| Base | 0 | Default content |
| Tooltip | 1 | Hover tooltips |
| Sidebar (mobile) | 999 | Mobile slide-in menu |
| Overlay | 1000+ | Modals, dialogs (future) |

---

## 5. Elevation & Shadows

| Level | Value | Usage |
|---|---|---|
| `elevation-0` | none | Flat elements |
| `elevation-1` | `1px 1px 1px 1px #f3f3f3, -1px -1px 1px 1px #f3f3f3` | Subtle lift (message field) |
| `elevation-2` | `1px 1px 7px 1px #f3f3f3, -1px -1px 7px 1px #f3f3f3` | Standard card shadow |
| `elevation-3` | `1px 1px 10px 1px #e8e5e5, -1px -1px 10px 1px #e8e5e5` | Elevated cards (profile card) |
| `elevation-4` | `1px 1px 10px 1px #d2d2d2, -1px -1px 10px 1px #d2d2d2` | High emphasis cards |
| `elevation-5` | `1px 1px 10px 1px #cac9c9, -1px -1px 10px 1px #cac9c9` | Tooltips, dropdowns |
| `elevation-menu` | `1px 1px 6px 0px #8ca7af, -1px -1px 6px 0px #8ca7af` | Active sidebar menu item |

**Pattern**: All shadows use symmetric dual-direction (top-left + bottom-right) for even, soft elevation. Colors progress from `#f3f3f3` (lightest) to `#cac9c9` (darkest).

---

## 6. Border & Radius

### 6.1 Border Styles

| Token | Value | Usage |
|---|---|---|
| `border-light` | `1px solid #CCD6D9` | Subtle dividers |
| `border-input` | `1px solid #B5C2C6` | Form input default |
| `border-input-focus` | `1px solid #668B91` | Form input focused |
| `border-card` | `1px solid #E0E8EA` | Info card borders |
| `border-field` | `1px solid #EDF5F6` | Message field border |

### 6.2 Border Radius Scale

| Token | Value | Usage |
|---|---|---|
| `radius-xs` | 3px | Text inputs, small elements |
| `radius-sm` | 6px | Info cards, tooltip content |
| `radius-md` | 10px | Calendar cells, small buttons, pills, carousel images |
| `radius-lg` | 15px | Course cards, medium components |
| `radius-xl` | 20px | Content cards, progress bars, large buttons, message bubbles |
| `radius-2xl` | 30px | Main content area curve |
| `radius-full` | 100% | Circular avatars, round buttons |

---

## 7. Iconography

### 7.1 Icon Library

**Font Awesome 7** via kit: `https://kit.fontawesome.com/7a13c96681.js`

### 7.2 Navigation Icons Used

| Icon | FA Class | Context |
|---|---|---|
| Dashboard | `fa-solid fa-th-large` | Sidebar nav |
| Courses | `fa-solid fa-book` | Sidebar nav |
| Calendar | `fa-solid fa-calendar` | Sidebar nav |
| Inbox | `fa-solid fa-envelope` | Sidebar nav |
| Announcements | `fa-solid fa-bullhorn` | Sidebar nav |
| Settings | `fa-solid fa-cog` | Sidebar bottom |
| Logout | `fa-solid fa-sign-out-alt` | Sidebar bottom |
| Search | `fa-solid fa-search` | Top bar |
| Bell | `fa-solid fa-bell` | Notifications |
| Menu | `fa-solid fa-bars` | Mobile hamburger |
| Close | `fa-solid fa-times` | Close mobile menu |
| Chevron left | `fa-solid fa-chevron-left` | Calendar navigation |
| Chevron right | `fa-solid fa-chevron-right` | Calendar navigation |
| Ellipsis | `fa-solid fa-ellipsis-h` | More options |
| Plus | `fa-solid fa-plus` | Add action |
| Paperclip | custom image | Attachment |
| Smile | custom image | Emoji |

### 7.3 Icon Sizing

| Size | Dimensions | Usage |
|---|---|---|
| Small | 14-16px | Inline with body text |
| Medium | 18-20px | Navigation items |
| Large | 24px | Action buttons |

### 7.4 Custom Image Icons

| Asset | Path | Usage |
|---|---|---|
| Attach | `Images/attach-icon.png` | Message attachment |
| Emoji | `Images/smile-icon.png` | Message emoji picker |
| Download | `Images/download.png` | Download action |
| Enter | `Images/enter.png` | Enter/submit action |
| Report | `Images/report.png` | Report action |
| Block | `Images/block.png` | Block action |
| Dots | `Images/dots.png` | More options |
| Logout | `Images/logout.png` | Logout icon |
| Syllabus | `Images/syllabus.png` | Syllabus icon |
| Work | `Images/work.png` | Work/assignment icon |

---

## 8. Component Library

### 8.1 Cards

#### Standard Card
```
Background:  #FFFFFF
Padding:     20px
Radius:      20px (radius-xl)
Shadow:      elevation-2
Margin:      20px 0 (space-7 vertical)
```

#### Profile Card
```
Background:  #FFFFFF
Padding:     40px 50px
Radius:      20px (radius-xl)
Shadow:      elevation-3
```

#### Info Card
```
Background:  #F6F9FA (neutral-50)
Padding:     8px (space-3)
Border:      1px solid #E0E8EA
Radius:      7px (radius-sm)
Margin:      0 0 10px 0
```

#### Course Carousel Card
```
Background:  #FFFFFF
Padding:     10px 20px
Radius:      15px (radius-lg)
Text-align:  center
Button-bg:   #F49E21 (accent-orange)
```

### 8.2 Progress Bars

```css
/* Container */
background: var(--track-color);     /* DFEDF7, EEE1F8, or FDF5DE */
border-radius: 20px;
height: 22px;
width: 100%;

/* Fill */
background: var(--fill-color);      /* 2989CA, 8828CD, or F5BE24 */
border-radius: 20px;
height: 22px;
-webkit-appearance: none;
```

| Progress Type | Track Color | Fill Color | Label |
|---|---|---|---|
| Language Level | `#DFEDF7` | `#2989CA` | Blue |
| Points | `#EEE1F8` | `#8828CD` | Purple |
| Class Points | `#FDF5DE` | `#F5BE24` | Yellow |

### 8.3 Avatars

| Size | Dimensions | Radius | Context |
|---|---|---|---|
| XL | 100px x 100px | 100% | Profile page hero |
| LG | 70px x 70px | 100% | Assignment cards |
| MD | 45px x 45px | 100% | Chat list items |
| SM | 35px x 35px | 100% | Discussion replies, inline mentions |
| XS | 25px x 25px | 100% | Compact lists |

### 8.4 Buttons

#### Primary Button
```
Background:  #0F4D61 (primary-700)
Color:       #FFFFFF
Border:      1px solid #0F4D61
Radius:      10px (radius-md)
Padding:     6px 10px
Font-weight: bold
Font-size:   11-13px
Cursor:      pointer
```

#### CTA / Action Button
```
Background:  #F49E21 (accent-orange)
Color:       #FFFFFF
Border:      1px solid #F49E21
Radius:      10px (radius-md)
Padding:     6px 45px
Font-weight: bold
```

#### Secondary Button
```
Background:  #FFFFFF
Color:       #00303F (primary-900)
Border:      1px solid #00303F
Radius:      10px (radius-md)
Padding:     6px 10px
```

#### Tab Button (inactive)
```
Background:  transparent
Color:       #00303F
Border:      none
Padding:     6px 10px
```

#### Tab Button (active)
```
Background:  varies by section (#0F4D61, #8828CD, #F5BE24)
Color:       #FFFFFF or #00303F
Border-radius: 10px
```

### 8.5 Message Bubbles

#### Incoming Message
```
Background:  #F3F3F3 (neutral-shadow-light)
Padding:     8px 15px
Radius:      5px 20px 20px 10px  (top-left sharp, others rounded)
Font-size:   12px
```

#### Outgoing Message
```
Background:  #FFFFFF
Padding:     5px 10px
Radius:      20px 20px 10px 10px  (bottom-left sharp)
Font-size:   13px
```

### 8.6 Tooltips

```
Background:  #FFFFFF
Color:       #000000
Width:       200px
Padding:     10px 2px
Radius:      6px (radius-sm)
Shadow:      elevation-5
Position:    absolute
Z-index:     1
Visibility:  hidden → visible on :hover
```

### 8.7 Badges / Status Pills

| Type | Background | Color | Radius |
|---|---|---|---|
| Blue event | `#5A99D8` | white | 10px |
| Purple event | `#A766D7` | white | 10px |
| Green event | `#38AA51` | white | 10px |
| Teal event | `#4DCAC5` | white | 10px |
| Red event | `#DA6E61` | white | 10px |
| Gold event | `#EEC960` | white | 10px |

---

## 9. Navigation Patterns

### 9.1 Left Sidebar (Global Nav)

```
Width:       228px
Position:    fixed, left: 0, top: 0
Height:      100vh
Background:  #063949 (primary-800)
Padding:     15px top, 40px bottom (logo section)
Overflow-y:  auto
```

#### Menu Item (default)
```
Color:       #FFFFFF
Padding:     15px 65px 15px 13px
Margin-top:  30px (first item), 0 (subsequent)
Font-size:   14px
Text-decoration: none
Display:     block
```

#### Menu Item (active)
```
Background:  linear-gradient(329deg, rgba(28,93,113,1) 0%, rgba(6,57,73,1) 100%)
Border-radius: 10px
Box-shadow:  elevation-menu
Color:       #FFFFFF
```

### 9.2 Top Bar

```
Display:     flex
Justify:     space-between
Align:       center
Padding:     10px 0
```

Contains: Search input (left), notification bell + user avatar (right).

### 9.3 Breadcrumbs (recommended addition)

Not currently implemented. Recommended for Canvas parity:
```
Font-size:   12px
Color:       #668B91
Separator:   " > " or " / "
Current:     font-weight: 500; color: #00303F
```

---

## 10. Form Elements

### 10.1 Text Input

```
Height:      40px
Border:      1px solid #B5C2C6
Border-radius: 4px (radius-xs)
Padding:     6px 10px
Font-size:   14px
Font-family: Poppins
Background:  #FFFFFF
```

**Focus state**: `border-color: #668B91`

### 10.2 Search Input

```
Height:      35px
Width:       85%
Border:      1px solid #668B91
Border-radius: 20px (radius-xl, pill shape)
Padding:     6px 15px
Background:  #FFFFFF
```

### 10.3 Message Input

```
Height:      35px
Width:       70%
Border:      1px solid #EDF5F6
Border-radius: 3px (radius-xs)
Background:  #EDF5F6
Padding:     6px
```

### 10.4 Checkbox

```
Border:      1px solid #668B91
Border-radius: 0
Accent-color: #0F4D61 (recommended)
```

### 10.5 Login Form

```
Input Width:  300px
Input Height: 40px
Input Border: 1px solid #668B91
Button Width: 300px
Button BG:    #F49E21 (accent-orange)
Button Color: white
Button Radius: 5px
```

---

## 11. Data Display

### 11.1 Tables

#### Calendar Grid Table
```
Border-collapse: separate
Border-spacing:  13px 1em
Cell Width:      80px
Cell Height:     60px
Cell BG:         #F0F6F7 (default)
Cell Radius:     10px
Cell Font:       14px, #668B91
```

#### Announcement Table
```
Background:  none (transparent rows)
Height:      60px per row
Text-align:  left (content), center (type), end (action)
First cell:  border-radius: 10px 0 0 10px
Last cell:   border-radius: 0 10px 10px 0
Hover:       background: white; box-shadow: elevation-2
```

#### Responsive Table (mobile)
```
/* Table row becomes card on mobile */
display:     block
text-align:  right
padding-left: 50%

/* td::before shows column header */
content:     attr(data-label)
position:    absolute
left:        0
font-weight: bold
text-align:  left
```

### 11.2 Lists

#### Assignment List
```
Container:   flex, justify: space-between
Margin:      0 0 15px 0
Active BG:   #16D2DD (accent-cyan)
Active Color: white
```

#### Chat List
```
Container:   flex, align: center
Avatar:      45px circle
Name:        13px bold
Preview:     11px, #668B91
Time:        10px, #668B91
```

### 11.3 Carousels

```
Container:   flex, overflow-x: auto
Max-width:   780px
Scrollbar:   display: none
Item margin: 30px right
Image radius: 10px
Padding:     20px 0
```

---

## 12. Feedback & Status

### 12.1 Progress Indicators

| Indicator | Visual | Context |
|---|---|---|
| Language Level | Blue progress bar (22px height) | Dashboard, Profile |
| Points | Purple progress bar (22px height) | Dashboard, Profile |
| Class Points | Yellow progress bar (22px height) | Dashboard |
| Streak | Text counter ("3 Day Streak!") | Dashboard welcome |

### 12.2 Empty States (recommended addition)

Not currently implemented. Recommended:
```
Icon:        64px, #CCD6D9
Heading:     18px, #668B91
Description: 14px, #B5C2C6
CTA Button:  accent-orange
```

### 12.3 Loading States (recommended addition)

Not currently implemented. Recommended:
```
Skeleton Screen:
  Background: linear-gradient(90deg, #F0F6F7 25%, #E9F2F4 50%, #F0F6F7 75%)
  Animation:  shimmer 1.5s infinite
  Radius:     matches component radius
```

---

## 13. Motion & Animation

### 13.1 Transitions

| Element | Property | Duration | Easing |
|---|---|---|---|
| Sidebar slide (mobile) | margin-left | 500ms | jQuery default (swing) |
| Accordion toggle | height | 600ms ("slow") | jQuery slideToggle |
| Calendar grid | opacity/position | 270ms | CSS default |
| Calendar highlight | background | 900ms delay | setTimeout |

### 13.2 CSS Animations

```css
/* Recommended standardized transition */
.transition-default {
    transition: all 0.2s ease-in-out;
}

.transition-slow {
    transition: all 0.5s ease-in-out;
}
```

### 13.3 Hover Effects

| Component | Hover Change |
|---|---|
| Table row | `background: white; box-shadow: elevation-2; border-color: white` |
| Nav link | `text-decoration: none` (already none; add subtle opacity) |
| Button | Background darkens 10% (recommended) |
| Card | Subtle shadow increase (recommended) |

---

## 14. Responsive System

### 14.1 Breakpoint

| Breakpoint | Value | Behavior |
|---|---|---|
| Desktop | > 890px | Three-column layout, fixed sidebar |
| Mobile | <= 890px | Single-column, drawer sidebar |

### 14.2 Responsive Utility Classes

| Class | Desktop (>890px) | Mobile (<=890px) |
|---|---|---|
| `.res-hide` | visible | `display: none !important` |
| `.res-show` | `display: none` | `display: block !important` |
| `.res-hide-flex` | visible | `display: flex !important` |
| `.res-show-flex` | `display: none` | visible |
| `.res-hide-contents` | visible | `display: contents !important` |

### 14.3 Mobile Adaptations

| Component | Desktop | Mobile |
|---|---|---|
| Left sidebar | Fixed, always visible | Off-screen, slide-in drawer |
| Main content | `margin-left: 228px` | `margin-left: 0; width: 100%` |
| Right sidebar | Fixed right column | Stacked below or hidden |
| Top bar | Search + avatar | Hamburger + avatar |
| Tables | Standard grid | Stacked cards with data-label |
| Carousels | Horizontal scroll | Horizontal scroll (unchanged) |
| Profile card | Horizontal layout | `flex-direction: column` |
| Video button | Full height | `height: 25vh` |

### 14.4 Mobile Sidebar Behavior

```javascript
// Open
$(".menu-icon").click(function(){
    $(".left-sidebar").animate({"margin-left": "0vw"}, 500);
});

// Close
$(".menu-close").click(function(){
    $(".left-sidebar").animate({"margin-left": "-100vw"}, 500);
});
```

```css
@media(max-width: 890px) {
    .left-sidebar {
        position: fixed;
        width: 100%;
        height: 100%;
        z-index: 999;
        margin-left: -100vw;
        animation: 2s;
    }
}
```

---

## 15. Page Templates

### 15.1 Standard Page Template

```
┌──────────────────────────────────────────────────┐
│ LEFT SIDEBAR (228px)  │  MAIN CONTENT            │
│                       │                          │
│ [Logo]                │  ┌─ TOP BAR ──────────┐  │
│                       │  │ Search    🔔 Avatar │  │
│ Dashboard  ●          │  └────────────────────┘  │
│ Courses               │                          │
│ Calendar              │  ┌─ PAGE CONTENT ─────┐  │
│ Inbox                 │  │                    │  │
│ Announcements         │  │  [Section Cards]   │  │
│                       │  │  [Data Tables]     │  │
│                       │  │  [Lists]           │  │
│ ─────────             │  │                    │  │
│ Settings              │  └────────────────────┘  │
│ Logout                │                          │
└──────────────────────────────────────────────────┘
```

### 15.2 Dashboard Template (three-column)

```
┌─────────┬─────────────────────┬──────────┐
│ SIDEBAR │  MAIN (col-lg-8)    │ RIGHT    │
│ (lg-2)  │                     │ (lg-2)   │
│         │  Welcome Banner     │          │
│         │  Progress Bars      │ Calendar │
│         │  Assignments        │ Widget   │
│         │  Discussions        │          │
│         │  Practice           │ Recent   │
│         │  Previous Classes   │ Chats    │
└─────────┴─────────────────────┴──────────┘
```

### 15.3 List Page Template (announcements, courses)

```
┌─────────┬───────────────────────────────┐
│ SIDEBAR │  MAIN (full width)            │
│         │                               │
│         │  Page Title                   │
│         │  ┌─ Filter/Search Bar ──────┐ │
│         │  └─────────────────────────┘ │
│         │  ┌─ Table / Card Grid ──────┐ │
│         │  │ Row 1                    │ │
│         │  │ Row 2                    │ │
│         │  │ Row 3                    │ │
│         │  └─────────────────────────┘ │
│         │  ┌─ Pagination ────────────┐ │
│         │  │ < 1 2 3 4 5 >           │ │
│         │  └─────────────────────────┘ │
└─────────┴───────────────────────────────┘
```

### 15.4 Split-Pane Template (inbox)

```
┌─────────┬──────────┬──────────────────┐
│ SIDEBAR │ LIST     │ DETAIL           │
│         │ (md-3)   │ (md-9)           │
│         │          │                  │
│         │ Msg 1 ●  │ Conversation     │
│         │ Msg 2    │ Thread           │
│         │ Msg 3    │                  │
│         │          │ [Message Input]  │
└─────────┴──────────┴──────────────────┘
```

---

## 16. Accessibility Guidelines

### 16.1 Current State

The template has partial accessibility. The following need improvement for WCAG 2.1 AA compliance:

### 16.2 Required Improvements

| Area | Current | Required |
|---|---|---|
| Color contrast | Some text combinations fail | Minimum 4.5:1 for normal text, 3:1 for large text |
| Focus indicators | None visible | Visible focus ring on all interactive elements |
| Alt text | Some images missing alt | All images need descriptive alt text |
| ARIA labels | Not used | Add to all interactive components |
| Keyboard nav | Not implemented | All functions accessible via keyboard |
| Skip navigation | Not present | Add "Skip to main content" link |
| Semantic HTML | Partial | Use `<nav>`, `<main>`, `<aside>`, `<article>` |
| Form labels | Missing `<label>` elements | Associate every input with a `<label>` |
| Heading hierarchy | Inconsistent | Ensure sequential h1 > h2 > h3 ordering |
| Screen reader text | None | Add `.sr-only` text for icon-only buttons |

### 16.3 Recommended Focus Style

```css
:focus-visible {
    outline: 2px solid #2989CA;
    outline-offset: 2px;
    border-radius: 4px;
}
```

---

## 17. Asset Inventory

### 17.1 Image Assets (Images/ directory)

| Category | Files | Format |
|---|---|---|
| Logo | logo.PNG | PNG |
| Profile/Avatars | profile.png, profile-img.png, inbox-profile.png | PNG |
| Instructors | instructor1.png, instructor2.png | PNG |
| Student avatars | image1.png - image6.png | PNG |
| Course carousel | car1.png - car4.png | PNG |
| Video thumbnails | video-btn.png, video-clip.png | PNG |
| Media gallery | media1.png - media4.png | PNG |
| UI icons | attach-icon.png, smile-icon.png, download.png, enter.png, report.png, block.png, dots.png, logout.png, syllabus.png, work.png | PNG |

### 17.2 External Dependencies

| Resource | URL | Fallback Strategy |
|---|---|---|
| Bootstrap CSS | jsdelivr CDN | Host locally |
| Bootstrap JS | jsdelivr CDN | Host locally |
| jQuery | Google CDN | Host locally |
| Font Awesome | fontawesome kit | Host locally |
| Google Fonts (Poppins) | Google CDN | Host locally with @font-face |
| Materialize JS | cdnjs CDN | Host locally |
| Popper.js | cdnjs CDN | Host locally |

**Recommendation**: For production, self-host all dependencies to eliminate external CDN failures.
