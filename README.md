# Hướng Dẫn Tích Hợp Detox E2E Testing (React Native 0.74 + Windows)

<p align="center">
  <img alt="Detox" width=300 src="https://raw.githubusercontent.com/wix/Detox/master/docs/img/DetoxLogo.png"/>
</p>
<h1 align="center">
  Detox
</h1>
<p align="center">
<b>Gray box end-to-end testing và automation framework cho mobile apps.</b>
</p>
<!-- <p align="center">
<img alt="Demo" src="demo/DetoxTesting.gif"/>
</p>
<h1></h1> -->
<p align="center">
  <a href="https://www.youtube.com/watch?v=xxxx">
    ▶️ Xem video demo
  </a>
</p>

> **Trạng thái:** ✅ Đã kiểm chứng hoạt động (Tested & Verified)
> **Môi trường:** Windows 10/11
> **Phiên bản:** React Native 0.74.3 | Detox 20.46.0 | Gradle 8.1.4 | SDK 33

Dưới đây là hướng dẫn chi tiết cách thiết lập môi trường kiểm thử tự động (End-to-End Testing) với **Detox** trên Windows, khắc phục triệt để các lỗi phổ biến về đường dẫn, phiên bản AGP và xung đột Autolinking.

---

## 🛠 1. Yêu Cầu Môi Trường (Prerequisites)

Hãy đảm bảo máy tính đã cài đặt đúng các phiên bản sau để tránh lỗi tương thích:

* **Node.js:** Phiên bản LTS (v18 trở lên).
* **Java JDK:** Phiên bản **17** (Bắt buộc cho React Native 0.74+).
* **Android Studio & SDK:**
    * Android SDK Platform: **API 33 (Tiramisu)**.
    * Android SDK Build-Tools: **33.0.0**.
    * **Biến môi trường:**
        * `ANDROID_HOME`: Trỏ tới thư mục SDK (VD: `C:\Users\TenBan\AppData\Local\Android\Sdk`).
        * `Path`: Thêm `%ANDROID_HOME%\platform-tools` và `%ANDROID_HOME%\emulator`.
* **Android Emulator:**
    * Tạo máy ảo sử dụng API 33 (VD: `Pixel_5_API_33`).
    * **Quan trọng:** Tên AVD trong file cài đặt Detox (`.detoxrc.js`) phải khớp chính xác với tên máy ảo này.

---

## ⚙️ 2. Cấu Hình Dự Án (Configuration)

Sử dụng chiến lược **"Lai" (Hybrid)**: Tắt tính năng tự động (Autolinking) của React Native cho Detox và thay thế bằng cấu hình thủ công để kiểm soát đường dẫn build.

### 2.1. Cài đặt thư viện
Chạy lệnh sau tại thư mục gốc:

```bash
npm install detox@latest jest@^29.0.0 --save-dev
```

---

### 2.2 Tắt Autolinking

Tạo file react-native.config.js tại thư mục gốc dự án:

```JavaScript


// File: react-native.config.js
module.exports = {
  dependencies: {
    'detox': {
      platforms: {
        android: null, // Vô hiệu hóa autolinking để tránh lỗi trùng lặp module
      },
    },
  },
};
```
---

### 2.3 Cấu hình android/settings.gradle

Kết nối thủ công module Detox từ mã nguồn.

```Groovy


// File: android/settings.gradle

// 1. Cung cấp Plugin (Bắt buộc để Detox tự build)
pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}

rootProject.name = 'DetoxDemoApp'

apply from: file("../node_modules/@react-native-community/cli-platform-android/native_modules.gradle"); applyNativeModulesSettingsGradle(settings)

include ':app'
includeBuild('../node_modules/@react-native/gradle-plugin')

// 2. KẾT NỐI DETOX THỦ CÔNG
include ':detox'
// Trỏ vào thư mục chứa build.gradle của thư viện Detox
// LƯU Ý: Dùng getCanonicalFile() để tránh lỗi đường dẫn trên Windows
project(':detox').projectDir = new File(rootProject.projectDir, '../node_modules/detox/android/detox').getCanonicalFile()
```

---

### 2.4. Cấu hình android/build.gradle (Project Level)

Sử dụng AGP 8.1.4 để hỗ trợ SDK 33 và ép buộc Detox dùng chung phiên bản SDK với App chính.

```Groovy

// File: android/build.gradle
buildscript {
    ext {
        buildToolsVersion = "33.0.0"
        minSdkVersion = 23
        compileSdkVersion = 33 
        targetSdkVersion = 33
        ndkVersion = "25.1.8937393"
        kotlinVersion = "1.9.23"
    }
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        // Dùng bản 8.1.4 để tương thích với SDK 33
        classpath("com.android.tools.build:gradle:8.1.4")
        classpath("com.facebook.react:react-native-gradle-plugin")
        classpath("org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlinVersion")
    }
}

// Cung cấp thư viện cho toàn bộ project con
allprojects {
    repositories {
        google()
        mavenCentral()
        maven { url '[https://www.jitpack.io](https://www.jitpack.io)' }
    }
}

// --- QUAN TRỌNG: ÉP DETOX DÙNG SDK 33 ---
subprojects { project ->
    afterEvaluate {
        if ((project.plugins.hasPlugin('android') || project.plugins.hasPlugin('android-library'))) {
            android {
                compileSdkVersion rootProject.ext.compileSdkVersion
                buildToolsVersion rootProject.ext.buildToolsVersion
            }
        }
    }
}
```

---

### 2.5. Cấu hình android/app/build.gradle (App Level)

```Groovy

// File: android/app/build.gradle

android {
    // ...
    defaultConfig {
        // ...
        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
        // Chọn flavor 'full' để tránh lỗi ambiguity
        missingDimensionStrategy "detox", "full"
    }
}

dependencies {
    // ... các dependency khác ...

    // Kết nối với module Detox đã khai báo ở settings.gradle
    androidTestImplementation project(path: ':detox') 
    
    androidTestImplementation 'androidx.test:runner:1.5.2'
    androidTestImplementation 'androidx.test:rules:1.5.0'
    androidTestImplementation 'androidx.test.ext:junit:1.1.5'
}
```

---

## 📝 3. Thiết Lập Test Runner & Kịch Bản

### 3.1. File .detoxrc.js

Tạo file này ở thư mục gốc dự án.

```JavaScript


/** @type {Detox.DetoxConfig} */
module.exports = {
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
      // Lệnh build dành cho Windows (PowerShell)
      build: 'cd android && gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug && cd ..',
    },
  },
  devices: {
    emulator: {
      type: 'android.emulator',
      device: {
        avdName: 'Pixel_5', // Sửa tên này khớp với tên máy ảo trong Android Studio của bạn
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
```

---

### 3.2. Tạo Test Runner (Kotlin)

Tạo file theo đường dẫn: android/app/src/androidTest/java/com/detoxdemoapp/DetoxTest.kt

```Kotlin

package com.detoxdemoapp

import com.wix.detox.Detox
import com.wix.detox.config.DetoxConfig
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.rule.ActivityTestRule

@RunWith(AndroidJUnit4::class)
class DetoxTest {
    @get:Rule
    val activityRule = ActivityTestRule(MainActivity::class.java, false, false)

    @Test
    fun runDetoxTests() {
        val detoxConfig = DetoxConfig()
        detoxConfig.idlePolicyConfig.masterTimeoutSec = 90
        detoxConfig.idlePolicyConfig.idleResourceTimeoutSec = 60
        
        if (BuildConfig.DEBUG) {
            detoxConfig.rnContextLoadTimeoutSec = 180
        } else {
            detoxConfig.rnContextLoadTimeoutSec = 60
        }

        Detox.runTests(activityRule, detoxConfig)
    }
}
```

---

## ▶️ 4. Chạy Test

### Bước 1: Build ứng dụng

Mở Terminal (PowerShell) và chạy lệnh sau để đảm bảo mọi thứ được biên dịch sạch sẽ:

```PowerShell

cd android
./gradlew clean
cd ..
detox build -c android.emu.debug
```

(Chờ đến khi báo BUILD SUCCESSFUL).

---

### Bước 2: Chuẩn bị Máy Ảo (Fix lỗi "View not visible")

Trước khi chạy test, hãy vào máy ảo Android:
Vào Settings > Google > Autofill > Tắt Autofill with Google (để tránh popup lưu mật khẩu che khuất app).
Vào Settings > System > Keyboard > Tắt On-screen keyboard (nếu cần).

---

### Bước 3: Chạy Metro & Test

Mở một cửa sổ Terminal khác:
```PowerShell
npx react-native start --reset-cache
```

Quay lại Terminal cũ và ra lệnh test:
```PowerShell
detox test -c android.emu.debug
```

---

## 📚 Phụ Lục: Kịch Bản Test Mẫu (e2e/login.e2e.js)

```JavaScript


describe('Login Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should show home screen after successful login', async () => {
    await expect(element(by.id('email-input'))).toBeVisible();
    await element(by.id('email-input')).typeText('test@detox.com');
    await expect(element(by.id('password-input'))).toBeVisible();
    await element(by.id('password-input')).typeText('password123');
    await element(by.id('login-button')).tap();
    await expect(element(by.id('home-screen'))).toBeVisible();
  });

  it('should show an error message for failed login', async () => {
    await element(by.id('email-input')).typeText('wrong@email.com');
    await element(by.id('password-input')).typeText('wrongpassword');
    await element(by.id('login-button')).tap();
    await expect(element(by.id('error-message'))).toBeVisible();
  });
});
```