tailwind.config = {
  content: ["./**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#FF6200', dark: '#E55A00' },
        gray: {
          50: '#F9FAFB', 100: '#F3F4F6', 200: '#E5E7EB', 300: '#D1D5DB',
          400: '#9CA3AF', 500: '#6B7280', 600: '#4B5563', 700: '#374151',
          800: '#1F2937', 900: '#111827'
        }
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(255, 98, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
      }
    }
  }
}
