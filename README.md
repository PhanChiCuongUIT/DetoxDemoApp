# Hướng Dẫn Cài Đặt & Fix Lỗi: Detox E2E Testing trên Windows (React Native 0.74)

Chào bạn, đây là tài liệu hướng dẫn chi tiết cách thiết lập và chạy **End-to-End (E2E) Testing** với **Detox** cho dự án React Native trên môi trường Windows.

Phiên bản này đã được **tinh chỉnh đặc biệt** để khắc phục các lỗi phổ biến về đường dẫn, phiên bản Gradle và xung đột Autolinking mà bạn thường gặp phải.

**Cấu hình thành công hiện tại:**

- **OS:** Windows 10/11
- **React Native:** 0.74.3
- **Detox:** 20.46.0 (Build từ mã nguồn)
- **Android Gradle Plugin (AGP):** 8.1.4
- **Android SDK:** Compile SDK 33, Target SDK 33
- **Java:** JDK 17

## ✅ Bước 1: Cài Đặt Môi Trường (Prerequisites)

Đảm bảo máy tính của bạn đã cài đặt đầy đủ:

- **Node.js (LTS)** & **JDK 17** (Bắt buộc cho RN 0.74+).
- **Android Studio & SDK:**
  - Cài đặt **Android SDK Platform 33 (Tiramisu)**.
  - Cài đặt **Android SDK Build-Tools 33.0.0** (hoặc mới hơn).
  - Thiết lập biến môi trường ANDROID_HOME trỏ tới thư mục SDK (thường là C:\\Users\\User\\AppData\\Local\\Android\\Sdk).
  - Thêm %ANDROID_HOME%\\platform-tools và %ANDROID_HOME%\\emulator vào biến Path.
- **Máy ảo (Emulator):**
  - Tạo một máy ảo Android API 33 (ví dụ: Pixel_5_API_33).
  - **Quan trọng:** Tên AVD trong cài đặt Detox phải khớp chính xác với tên máy ảo này.

## 🚀 Bước 2: Cấu Hình Dự Án (Phần Quan Trọng Nhất)

Để Detox hoạt động trơn tru trên Windows với phiên bản này, chúng ta cần thực hiện cấu hình **"Lai" (Hybrid)**: Tắt Autolinking tự động và Link thủ công.

### 2.1. Tắt Autolinking cho Detox

Tạo file **react-native.config.js** tại thư mục gốc dự án:

module.exports = {
  dependencies: {
    'detox': {
      platforms: {
        android: null, // tắt autolinking
      },
    },
  },
};

### 2.2. Cấu hình android/settings.gradle

Trỏ đường dẫn thủ công vào module Detox trong node_modules.

// 1. Cung cấp Plugin  
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

// Kết nối thủ công module Detox
include ':detox'
project(':detox').projectDir = new File(rootProject.projectDir, '../node_modules/detox/android/detox').getCanonicalFile()// 2. KẾT NỐI MÃ NGUỒN DETOX  
include ':detox'  
// \[QUAN TRỌNG\]: Trỏ vào thư mục con 'detox' nằm trong 'android'  
project(':detox').projectDir = new File(rootProject.projectDir, '../node_modules/detox/android/detox').getCanonicalFile()  

### 2.3. Cấu hình android/build.gradle (Project Level)

Sử dụng AGP 8.1.4 để tương thích với SDK 33 và ép Detox dùng chung phiên bản SDK.

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
        classpath("com.android.tools.build:gradle:8.1.4")  // Quan trọng: dùng 8.1.4 để hỗ trợ SDK 33
        classpath("com.facebook.react:react-native-gradle-plugin")
        classpath("org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlinVersion")
    }
}

allprojects {
    repositories {
        google()
        mavenCentral()
        maven { url 'https://www.jitpack.io' }
    }
}

// Ép tất cả subproject dùng SDK 33
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

### 2.4. Cấu hình android/app/build.gradle (App Level)

Thêm dependency Detox và chọn flavor full.

// ... (phần plugins và android config giữ nguyên)  
<br/>android {  
// ...  
defaultConfig {  
// ...  
testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"  
<br/>// --- CHỌN PHIÊN BẢN FULL ĐỂ TRÁNH LỖI AMBIGUITY ---  
missingDimensionStrategy "detox", "full"  
}  
// ...  
}  
<br/>dependencies {  
// ... (các dependency khác của React Native)  
<br/>// --- KẾT NỐI VỚI MODULE DETOX ---  
androidTestImplementation project(path: ':detox')  
<br/>androidTestImplementation 'androidx.test:runner:1.5.2'  
androidTestImplementation 'androidx.test:rules:1.5.0'  
androidTestImplementation 'androidx.test.ext:junit:1.1.5'  
}  
// ...  

### 2.5. File Test Runner DetoxTest.kt

Tạo file Kotlin tại android/app/src/androidTest/java/com/detoxdemoapp/DetoxTest.kt:

package com.detoxdemoapp  
<br/>import com.wix.detox.Detox  
import com.wix.detox.config.DetoxConfig  
import org.junit.Rule  
import org.junit.Test  
import org.junit.runner.RunWith  
import androidx.test.ext.junit.runners.AndroidJUnit4  
import androidx.test.rule.ActivityTestRule  
<br/>@RunWith(AndroidJUnit4::class)  
class DetoxTest {  
@get:Rule  
val activityRule = ActivityTestRule(MainActivity::class.java, false, false)  
<br/>@Test  
fun runDetoxTests() {  
val detoxConfig = DetoxConfig()  
detoxConfig.idlePolicyConfig.masterTimeoutSec = 90  
detoxConfig.idlePolicyConfig.idleResourceTimeoutSec = 60  
<br/>if (BuildConfig.DEBUG) {  
detoxConfig.rnContextLoadTimeoutSec = 180  
} else {  
detoxConfig.rnContextLoadTimeoutSec = 60  
}  
<br/>Detox.runTests(activityRule, detoxConfig)  
}  
}  

## 🧪 Bước 3: Cấu Hình Detox & Jest

### 3.1. File .detoxrc.js

/\*\* @type {Detox.DetoxConfig} \*/  
module.exports = {  
testRunner: {  
\$0: 'jest',  
args: {  
config: 'e2e/jest.config.js',  
\_: \['e2e'\],  
},  
},  
apps: {  
'android.debug': {  
type: 'android.apk',  
binaryPath: 'android/app/build/outputs/apk/debug/app-debug.apk',  
// Lệnh build cho Windows (không có ./)  
build: 'cd android && gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug && cd ..',  
},  
},  
devices: {  
emulator: {  
type: 'android.emulator',  
device: {  
avdName: 'Pixel_5', // Tên máy ảo của bạn  
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

### 3.2. File e2e/jest.config.js

module.exports = {  
maxWorkers: 1,  
testTimeout: 120000,  
testRegex: '\\\\.e2e\\\\.js\$', // Chỉ chạy các file .e2e.js  
reporters: \['detox/runners/jest/reporter'\],  
verbose: true,  
globalSetup: 'detox/runners/jest/globalSetup',  
globalTeardown: 'detox/runners/jest/globalTeardown',  
testEnvironment: 'detox/runners/jest/testEnvironment',  
};  

## 🏃 Bước 4: Chạy Test

### 4.1. Build Ứng Dụng

Mở Terminal, chạy lệnh sau để build sạch sẽ:

cd android  
./gradlew clean  
cd ..  
detox build -c android.emu.debug  

_(Chờ đến khi báo BUILD SUCCESSFUL)._

### 4.2. Khắc phục lỗi "Test Failed: View is not visible"

Trước khi chạy test, hãy đảm bảo:

- **Tắt Google Smart Lock:** Vào Settings của máy ảo -> Google -> Autofill -> Tắt "Autofill with Google". (Để tránh popup che màn hình).
- **Tắt bàn phím ảo:** Vào Settings -> System -> Keyboard -> Tắt "On-screen keyboard" (nếu cần).

### 4.3. Chạy Metro & Test

- Mở Terminal 1: npx react-native start --reset-cache
- Mở Terminal 2: detox test -c android.emu.debug

## 📚 Phụ Lục: Kịch Bản Test Mẫu (login.e2e.js)

File test bao gồm 4 kịch bản: Đăng nhập thành công, thất bại, đăng xuất và validate input.

describe('Login Flow', () => {  
beforeAll(async () => {  
await device.launchApp();  
});  
<br/>beforeEach(async () => {  
await device.reloadReactNative();  
});  
<br/>it('should show home screen after successful login', async () => {  
await expect(element(by.id('email-input'))).toBeVisible();  
await element(by.id('email-input')).typeText('<test@detox.com>');  
await expect(element(by.id('password-input'))).toBeVisible();  
await element(by.id('password-input')).typeText('password123');  
await element(by.id('login-button')).tap();  
await expect(element(by.id('home-screen'))).toBeVisible();  
});  
<br/>it('should show an error message for failed login', async () => {  
await element(by.id('email-input')).typeText('<wrong@email.com>');  
await element(by.id('password-input')).typeText('wrongpassword');  
await element(by.id('login-button')).tap();  
await expect(element(by.id('error-message'))).toBeVisible();  
});  
<br/>it('should logout successfully', async () => {  
await element(by.id('email-input')).typeText('<test@detox.com>');  
await element(by.id('password-input')).typeText('password123');  
await element(by.id('login-button')).tap();  
await expect(element(by.id('home-screen'))).toBeVisible();  
await element(by.id('logout-button')).tap();  
await expect(element(by.id('login-screen'))).toBeVisible();  
});  
<br/>it('should show error when inputs are empty', async () => {  
await element(by.id('login-button')).tap();  
await expect(element(by.id('error-message'))).toBeVisible();  
});  
});