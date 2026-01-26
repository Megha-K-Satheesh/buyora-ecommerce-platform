// src/constants/ui.js

/**
 * UI Constants for E-commerce Website
 * 
 * Use these constants across your components for:
 * - Buttons
 * - Cards
 * - Spacing
 * - Gradients
 * - Icons
 * - Breakpoints
 * 
 * Makes your UI consistent and easy to maintain
 */

/* -------------------- GRADIENTS -------------------- */
export const GRADIENTS = {
  primary: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  secondary: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
  success: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
  warning: "linear-gradient(135deg, #ffd89b 0%, #f47c23 100%)",
  danger: "linear-gradient(135deg, #fc4a1a 0%, #f7b733 100%)",
  info: "linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)",
  dark: "linear-gradient(135deg, #2d3436 0%, #636e72 100%)",
  light: "linear-gradient(135deg, #f0f0f0 0%, #ffffff 100%)",
};

/* -------------------- CARD STYLES -------------------- */
export const CARD_STYLES = {
  borderRadius: '0.75rem', // Tailwind rounded-lg
  shadow: 'shadow-lg',      // Tailwind shadow
  border: 'border border-gray-200',
};

/* -------------------- BUTTON VARIANTS -------------------- */
export const BUTTON_VARIANTS = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700',
  secondary: 'bg-purple-600 text-white hover:bg-purple-700',
  success: 'bg-green-500 text-white hover:bg-green-600',
  danger: 'bg-red-500 text-white hover:bg-red-600',
  warning: 'bg-yellow-400 text-gray-800 hover:bg-yellow-500',
  info: 'bg-cyan-500 text-white hover:bg-cyan-600',
  light: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
  dark: 'bg-gray-800 text-white hover:bg-gray-900',
  outline: {
    primary: 'border border-blue-600 text-blue-600 hover:bg-blue-50',
    secondary: 'border border-purple-600 text-purple-600 hover:bg-purple-50',
    success: 'border border-green-500 text-green-500 hover:bg-green-50',
    danger: 'border border-red-500 text-red-500 hover:bg-red-50',
    warning: 'border border-yellow-400 text-yellow-400 hover:bg-yellow-50',
    info: 'border border-cyan-500 text-cyan-500 hover:bg-cyan-50',
    light: 'border border-gray-200 text-gray-800 hover:bg-gray-50',
    dark: 'border border-gray-800 text-gray-800 hover:bg-gray-700 text-white',
  },
};

/* -------------------- ICON SIZES -------------------- */
export const ICON_SIZES = {
  small: '1rem',    // 16px
  medium: '1.5rem', // 24px
  large: '2rem',    // 32px
  xlarge: '3rem',   // 48px
};

/* -------------------- SPACING -------------------- */
export const SPACING = {
  xs: '0.25rem',  // 4px
  sm: '0.5rem',   // 8px
  md: '1rem',     // 16px
  lg: '1.5rem',   // 24px
  xl: '2rem',     // 32px
  xxl: '3rem',    // 48px
};

/* -------------------- BREAKPOINTS -------------------- */
export const BREAKPOINTS = {
  xs: 0,
  sm: 640,   // Tailwind sm
  md: 768,   // Tailwind md
  lg: 1024,  // Tailwind lg
  xl: 1280,  // Tailwind xl
  xxl: 1536, // Tailwind 2xl
};

/* -------------------- TYPOGRAPHY -------------------- */
export const TYPOGRAPHY = {
  heading: 'font-bold text-gray-900',
  subheading: 'font-semibold text-gray-700',
  body: 'text-gray-600',
  small: 'text-sm text-gray-500',
};

/* -------------------- E-COMMERCE SPECIFIC -------------------- */
export const PRODUCT_CARD = {
  imageHeight: 'h-48', // Tailwind height for product images
  priceColor: 'text-green-600',
  titleColor: 'text-gray-800',
  discountBadge: 'bg-red-500 text-white text-xs px-2 py-1 rounded absolute top-2 right-2',
};

export const NAVBAR = {
  bg: 'bg-white shadow-md',
  link: 'text-gray-700 hover:text-blue-600 px-4 py-2',
};

export const FOOTER = {
  bg: 'bg-gray-100',
  text: 'text-gray-600',
  link: 'text-blue-600 hover:underline',
};
