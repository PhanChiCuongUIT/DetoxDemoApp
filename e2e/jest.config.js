// e2e/jest.config.js
module.exports = {
  // Jest sẽ chạy các bài test một cách tuần tự (không song song),
  // đây là yêu cầu bắt buộc đối với các bài test E2E.
  maxWorkers: 1,

  // Các hook setup và teardown tiêu chuẩn của Detox.
  globalSetup: 'detox/runners/jest/globalSetup',
  globalTeardown: 'detox/runners/jest/globalTeardown',

  // Môi trường test tùy chỉnh của Detox.
  testEnvironment: 'detox/runners/jest/testEnvironment',

  // Sử dụng jest-circus làm test runner.
  testRunner: 'jest-circus/runner',

  // Thời gian chờ tối đa (timeout) cho mỗi kịch bản test, tính bằng mili giây.
  testTimeout: 120000,

  // **ĐÂY LÀ PHẦN SỬA LỖI QUAN TRỌNG NHẤT**
  // Biểu thức chính quy (regex) để tìm các file test.
  // Lệnh này bảo Jest tìm các file có đuôi là `.e2e.js`.
  testRegex: '\\.e2e\\.js$',

  // Reporter tùy chỉnh của Detox để hiển thị kết quả.
  reporters: ['detox/runners/jest/reporter'],

  // Hiển thị output chi tiết hơn trong quá trình chạy test.
  verbose: true,
};
