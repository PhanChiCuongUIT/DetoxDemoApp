module.exports = {
  root: true,
  extends: ['@react-native', 'prettier'], // Thêm 'prettier' để vô hiệu hóa các quy tắc xung đột
  env: {
    jest: true, // This tells ESLint about Jest global variables like describe, it, expect
  },
  globals: {
    device: 'readonly', // Add Detox-specific globals
    element: 'readonly',
    by: 'readonly',
    waitFor: 'readonly',
  },
};
