/** @type {Detox.DetoxConfig} */
module.exports = {
  // Cấu trúc test runner mới, thay thế cho "testRunner" và "runnerConfig" đã cũ
  testRunner: {
    $0: 'jest',
    args: {
      config: 'e2e/jest.config.js',
      _: ['e2e'],
    },
  },
  apps: {
    'android.debug': {
      type: 'android.apk',
      binaryPath: 'android/app/build/outputs/apk/debug/app-debug.apk',
      // SỬA LỖI: Bỏ "./" trước gradlew để tương thích với Windows.
      build:
        'cd android && gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug && cd ..',
    },
  },
  devices: {
    emulator: {
      type: 'android.emulator',
      device: {
        // QUAN TRỌNG: Tên này PHẢI KHỚP CHÍNH XÁC với tên máy ảo trong
        // Android Studio > Virtual Device Manager.
        avdName: 'Pixel_5', // <-- SỬA LỖI: Thay khoảng trắng bằng dấu gạch dưới
      },
    },
  },
  configurations: {
    'android.emu.debug': {
      device: 'emulator',
      app: 'android.debug',
    },
  },
};