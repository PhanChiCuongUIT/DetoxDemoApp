# Hướng Dẫn Toàn Tập: React Native & Detox E2E Testing (Phiên Bản Sửa Lỗi 2024 - SDK 33)

Chào bạn, đây là phiên bản **React Native** của ứng dụng demo, được thiết kế để bạn có thể thực hiện End-to-End (E2E) testing với **Detox**.

Bản hướng dẫn này đã được **cập nhật và sửa lỗi** để đảm bảo hoạt động trơn tru với **Android SDK 33 (Tiramisu)**, một phiên bản ổn định và tương thích cao. Nó sẽ dẫn dắt bạn đi qua **tất cả các bước cần thiết**, từ việc cài đặt môi trường trên một máy tính mới, cho đến khi chạy và gỡ lỗi (debug) các bài test một cách chuyên nghiệp.

---

## ✅ Bước 0: Cài Đặt Môi Trường Phát Triển (Từ Đầu)

Đây là bước quan trọng nhất. Hãy thực hiện cẩn thận để tránh các lỗi không đáng có. Hướng dẫn này tập trung vào môi trường **Windows** và **macOS**.

### 0.1. Cài đặt Package Manager
-   **Windows**: Cài đặt **Chocolatey**. Mở **PowerShell với quyền Administrator** và chạy lệnh:
    ```powershell
    Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
    ```
-   **macOS**: Cài đặt **Homebrew**. Mở **Terminal** và chạy lệnh:
    ```bash
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    ```

### 0.2. Cài đặt Node.js và JDK
Chúng ta sẽ dùng package manager vừa cài để cài đặt Node.js (khuyến khích LTS) và JDK 17.
```bash
# Trên Windows (dùng PowerShell Admin)
choco install -y nodejs-lts openjdk17

# Trên macOS (dùng Terminal)
brew install node
brew install openjdk@17
```
**Kiểm tra:** Đóng và mở lại terminal/PowerShell, sau đó chạy `node -v` và `java -version`. Bạn sẽ thấy phiên bản của Node và OpenJDK 17.

### 0.3. Cài đặt Android Studio và Android SDK (Phiên bản 33)
1.  Truy cập [trang chủ Android Studio](https://developer.android.com/studio) và tải bản cài đặt phù hợp.
2.  Tiến hành cài đặt. Trong màn hình `Installation Type`, chọn **Custom**.
3.  Trong màn hình `SDK Components Setup`, đảm bảo bạn đã tick chọn các mục sau:
    *   `Android SDK`
    *   `Android SDK Platform`
    *   `Performance (Intel HAXM)` (trên máy Intel) hoặc `Android Emulator Hypervisor Driver` (trên máy AMD)
    *   `Android Virtual Device`
4.  Hoàn tất cài đặt. Sau khi mở Android Studio, vào `More Actions... > SDK Manager`.
5.  Trong tab `SDK Platforms`, chọn **Android 13.0 (Tiramisu)** - API Level **33**.
6.  Chuyển qua tab `SDK Tools`, tick vào `Show Package Details` ở góc dưới bên phải. Mở rộng mục `Android SDK Build-Tools`, và chọn phiên bản `33.0.0`.
7.  Nhấn `Apply` để Android Studio tải và cài đặt các gói đã chọn.

### 0.4. Cấu hình Biến Môi Trường (Quan Trọng!)
1.  **Tìm đường dẫn Android SDK**: Trong Android Studio, vào `SDK Manager`, bạn sẽ thấy đường dẫn `Android SDK Location` ở trên cùng. Hãy sao chép đường dẫn này.
    *   Thường là `C:\Users\YOUR_USERNAME\AppData\Local\Android\Sdk` trên Windows.
    *   Thường là `/Users/YOUR_USERNAME/Library/Android/sdk` trên macOS.

2.  **Thiết lập biến môi trường:**
    -   **Windows**: Mở `Edit the system environment variables` -> `Environment Variables...`. Trong `System variables`, tạo biến `ANDROID_HOME` với giá trị là đường dẫn SDK. Sau đó sửa biến `Path`, thêm `%ANDROID_HOME%\platform-tools` và `%ANDROID_HOME%\emulator`.
    -   **macOS**: Mở file `~/.zshrc` (hoặc `~/.bash_profile`) và thêm:
      ```bash
      export ANDROID_HOME=$HOME/Library/Android/sdk
      export PATH=$PATH:$ANDROID_HOME/platform-tools
      export PATH=$PATH:$ANDROID_HOME/emulator
      ```
      Lưu file và chạy `source ~/.zshrc` để áp dụng.

### 0.5. Tạo Máy Ảo Android (AVD) với API 33
1.  Trong Android Studio, vào `More Actions... > Virtual Device Manager`.
2.  Nhấn `Create device`. Chọn một thiết bị Pixel (ví dụ `Pixel 6`).
3.  Chọn System Image là **Tiramisu (API 33)**.
4.  Trong màn hình cuối, bạn có thể đổi **AVD Name** (ví dụ: `Pixel_6_API_33`). **Hãy ghi nhớ tên này!**
5.  Nhấn `Finish`.

---

## 🚀 Bước 1: Khởi Tạo và Tích Hợp Code

1.  **Tạo dự án React Native mới:**
    ```bash
    npx react-native init DetoxDemoApp --version 0.74.3
    cd DetoxDemoApp
    ```

2.  **Cập nhật `package.json`:**
    Thay thế toàn bộ nội dung file `package.json` bằng nội dung sau, rồi chạy `npm install`.
    ```json
    {
      "name": "DetoxDemoApp",
      "version": "0.0.1",
      "private": true,
      "scripts": {
        "android": "react-native run-android",
        "ios": "react-native run-ios",
        "lint": "eslint .",
        "start": "react-native start",
        "test": "jest"
      },
      "dependencies": {
        "react": "18.2.0",
        "react-native": "0.74.3",
        "react-native-svg": "15.3.0"
      },
      "devDependencies": {
        "@babel/core": "^7.20.0",
        "@babel/preset-env": "^7.20.0",
        "@babel/runtime": "^7.20.0",
        "@react-native/babel-preset": "0.74.85",
        "@react-native/eslint-config": "0.74.85",
        "@react-native/metro-config": "0.74.85",
        "@react-native/typescript-config": "0.74.85",
        "@types/react": "^18.2.6",
        "@types/react-test-renderer": "^18.0.0",
        "babel-jest": "^29.6.3",
        "detox": "^20.20.2",
        "eslint": "^8.19.0",
        "jest": "^29.7.0",
        "prettier": "2.8.8",
        "react-test-renderer": "18.2.0",
        "typescript": "5.0.4"
      },
      "engines": {
        "node": ">=18"
      }
    }
    ```

3.  **Tạo các file source code:**
    Xóa file `App.tsx` và `index.js` mặc định. Sau đó tạo các file và thư mục sau với nội dung tương ứng:
    -   `index.tsx`
    -   `App.tsx`
    -   `components/LoginScreen.tsx`
    -   `components/HomeScreen.tsx`
    -   `components/icons.tsx`
    
    *Nội dung chi tiết của các file này nằm ở phần Phụ Lục cuối README.*

---

## 🧪 Bước 2: Cấu Hình Môi Trường Test

### 2.1. Cài đặt Detox CLI và Khởi tạo
```bash
npm install -g detox-cli
detox init -r jest
```

### 2.2. Cập nhật các file cấu hình
Hãy tạo hoặc thay thế nội dung các file sau đây một cách chính xác.

#### File: `.detoxrc.js` (Cấu hình Detox)
**Xóa file `.detoxrc.json` cũ.** Tạo file mới `.detoxrc.js` và dán nội dung này vào. **Lưu ý:** Sửa `avdName` cho khớp với tên máy ảo của bạn.
```javascript
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
      build:
        'cd android && gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug && cd ..',
    },
  },
  devices: {
    emulator: {
      type: 'android.emulator',
      device: {
        // QUAN TRỌNG: Tên này PHẢI KHỚP CHÍNH XÁC với tên máy ảo của bạn!
        avdName: 'Pixel_6_API_33', 
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

#### File: `e2e/jest.config.js` (Cấu hình Jest)
```javascript
module.exports = {
  maxWorkers: 1,
  globalSetup: 'detox/runners/jest/globalSetup',
  globalTeardown: 'detox/runners/jest/globalTeardown',
  testEnvironment: 'detox/runners/jest/testEnvironment',
  testRunner: 'jest-circus/runner',
  testTimeout: 120000,
  testRegex: '\\.e2e\\.js$',
  reporters: ['detox/runners/jest/reporter'],
  verbose: true,
};
```

#### File: `.eslintrc.js` (Cấu hình ESLint)
```javascript
module.exports = {
  root: true,
  extends: ['@react-native', 'prettier'],
  env: {
    jest: true,
  },
  globals: {
    device: 'readonly',
    element: 'readonly',
    by: 'readonly',
    waitFor: 'readonly',
  },
};
```

---

## ⚙️ Bước 3: Sửa Lỗi Build Detox (Cấu Hình Gradle Chuẩn)

Đây là phần quan trọng nhất để đảm bảo build thành công. Hãy cập nhật các file Gradle sau một cách cẩn thận.

### 3.1. Cập nhật `android/build.gradle` (File Gốc - Dùng SDK 33)
File này định nghĩa các biến chung cho toàn bộ dự án Android.
```groovy
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
}
```

### 3.2. Cập nhật `android/settings.gradle` (Trái Tim Của Giải Pháp)
File này quản lý các kho chứa thư viện (repositories) một cách tập trung, giải quyết xung đột.
```groovy
// File: android/settings.gradle
rootProject.name = 'DetoxDemoApp'

dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.PREFER_SETTINGS)
    repositories {
        google()
        mavenCentral()
        // Kho lưu trữ Maven cục bộ của Detox - Mấu chốt để build thành công.
        maven {
            url "$rootDir/../node_modules/detox/android/detox"
        }
    }
}

apply from: file("../node_modules/@react-native-community/cli-platform-android/native_modules.gradle"); applyNativeModulesSettingsGradle(settings)
include ':app'
includeBuild('../node_modules/@react-native/gradle-plugin')
```

### 3.3. Cập nhật `android/app/build.gradle` (Cấp Module App)
Thêm các dependencies cần thiết cho Detox.
```groovy
// File: android/app/build.gradle
apply plugin: "com.android.application"
apply plugin: "com.facebook.react"
apply plugin: "org.jetbrains.kotlin.android"

android {
    namespace "com.detoxdemoapp"
    ndkVersion rootProject.ext.ndkVersion
    compileSdkVersion rootProject.ext.compileSdkVersion

    defaultConfig {
        applicationId "com.detoxdemoapp"
        minSdkVersion rootProject.ext.minSdkVersion
        targetSdkVersion rootProject.ext.targetSdkVersion
        versionCode 1
        versionName "1.0"
        // Cấu hình test instrumentation runner cho Detox
        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
    }
    signingConfigs {
        debug {
            storeFile file('debug.keystore')
            storePassword 'android'
            keyAlias 'androiddebugkey'
            keyPassword 'android'
        }
    }
    buildTypes {
        debug {
            signingConfig signingConfigs.debug
        }
        release {
            signingConfig signingConfigs.debug
            minifyEnabled false
            proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
        }
    }
}

dependencies {
    implementation "com.facebook.react:react-android"
    
    if (hermesEnabled.toBoolean()) {
        implementation("com.facebook.react:hermes-android")
    } else {
        implementation jscFlavor
    }

    // Dependencies cần thiết cho Detox để chạy test.
    def detoxVersion = "20.20.2" // Đảm bảo khớp với phiên bản trong package.json
    androidTestImplementation("com.wix:detox:$detoxVersion")
    androidTestImplementation 'androidx.test:runner:1.5.2'
    androidTestImplementation 'androidx.test:rules:1.5.0'
    androidTestImplementation 'androidx.test.ext:junit:1.1.5'
    
    implementation 'androidx.swiperefreshlayout:swiperefreshlayout:1.1.0'
}

apply from: file("../../node_modules/@react-native-community/cli-platform-android/native_modules.gradle"); applyNativeModulesAppBuildGradle(project)
```

### 3.4. Tạo file Test Runner `DetoxTest.java`
**BẮT BUỘC:** Bạn phải tạo cây thư mục và file này.
1.  Chạy lệnh sau trong terminal tại thư mục gốc dự án:
    -   **Windows (PowerShell):** `mkdir -p android\app\src\androidTest\java\com\detoxdemoapp`
    -   **macOS/Linux:** `mkdir -p android/app/src/androidTest/java/com/detoxdemoapp`
2.  Tạo file `DetoxTest.java` bên trong thư mục vừa tạo với nội dung:
    ```java
    // File: android/app/src/androidTest/java/com/detoxdemoapp/DetoxTest.java
    package com.detoxdemoapp;

    import androidx.test.ext.junit.runners.AndroidJUnit4;
    import androidx.test.rule.ActivityTestRule;
    import com.wix.detox.Detox;
    import com.wix.detox.config.DetoxConfig;
    import org.junit.Rule;
    import org.junit.Test;
    import org.junit.runner.RunWith;

    @RunWith(AndroidJUnit4.class)
    public class DetoxTest {
        @Rule
        public ActivityTestRule<MainActivity> mActivityRule = new ActivityTestRule<>(MainActivity.class, false, false);

        @Test
        public void runDetoxTests() {
            DetoxConfig detoxConfig = new DetoxConfig();
            detoxConfig.idlePolicyConfig.masterTimeoutSec = 90;
            detoxConfig.idlePolicyConfig.idleResourceTimeoutSec = 60;
            detoxConfig.rnContextLoadTimeoutSec = (BuildConfig.DEBUG ? 180 : 60);

            Detox.runTests(mActivityRule, detoxConfig);
        }
    }
    ```

---

## ✍️ Bước 4: Viết Kịch Bản Test

Xóa file `e2e/starter.test.js` (nếu có) và tạo file `e2e/login.e2e.js` với nội dung sau:
```javascript
// File: e2e/login.e2e.js
describe('Login Flow', () => {
  beforeAll(async () => {
    await device.launchApp({newInstance: true});
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
    await expect(element(by.id('welcome-message'))).toHaveText('Login Successful!');
  });

  it('should show an error message for failed login', async () => {
    await element(by.id('email-input')).typeText('wrong@email.com');
    await element(by.id('password-input')).typeText('wrongpassword');
    await element(by.id('login-button')).tap();

    await expect(element(by.id('error-message'))).toBeVisible();
    await expect(element(by.id('home-screen'))).not.toBeVisible();
  });

  it('should logout successfully', async () => {
    // Login first
    await element(by.id('email-input')).typeText('test@detox.com');
    await element(by.id('password-input')).typeText('password123');
    await element(by.id('login-button')).tap();

    // Verify home screen is visible
    await expect(element(by.id('home-screen'))).toBeVisible();

    // Tap logout button
    await element(by.id('logout-button')).tap();

    // Verify login screen is visible again
    await expect(element(by.id('login-screen'))).toBeVisible();
  });
});
```

---

## 🏃 Bước 5: Chạy Test

1.  **Dọn dẹp cache (Quan trọng!):** Trước khi build lần đầu, hãy chạy lệnh này:
    ```bash
    cd android && gradlew clean && cd ..
    ```

2.  **Mở Terminal 1: Khởi động Metro Bundler**
    ```bash
    npx react-native start --reset-cache
    ```
    **>>> GIỮ NGUYÊN TERMINAL NÀY CHẠY! <<<**

3.  **Mở Terminal 2: Build và Chạy Test**
    Đảm bảo máy ảo của bạn đã được khởi động.
    ```bash
    # 1. Build ứng dụng cho Detox (lần này sẽ thành công)
    detox build -c android.emu.debug

    # 2. Chạy test
    detox test -c android.emu.debug
    ```
    Detox sẽ cài đặt, khởi chạy ứng dụng, và tự động thực hiện các kịch bản bạn đã viết. Chúc bạn thành công!

---

## 💡 Bước 6: Gỡ Lỗi (Debug) Test trong VS Code (Nâng Cao)

Bạn có thể đặt `debugger` trong code test của mình (`e2e/*.e2e.js`) và sử dụng trình gỡ lỗi của VS Code để kiểm tra từng bước.

1.  Trong VS Code, đi đến tab `Run and Debug` (biểu tượng con bọ).
2.  Nhấn vào `create a launch.json file` và chọn `Node.js`.
3.  Thay thế nội dung file `launch.json` bằng đoạn sau:

    ```json
    {
      "version": "0.2.0",
      "configurations": [
        {
          "type": "node",
          "request": "launch",
          "name": "Debug Detox Tests",
          "program": "${workspaceFolder}/node_modules/.bin/jest",
          "args": ["--config", "e2e/jest.config.js", "--runInBand", "${file}"],
          "console": "integratedTerminal",
          "internalConsoleOptions": "neverOpen",
          "windows": {
            "program": "${workspaceFolder}/node_modules/jest/bin/jest"
          }
        }
      ]
    }
    ```

4.  Mở file `e2e/login.e2e.js`, đặt một breakpoint (dấu chấm đỏ) ở dòng bạn muốn dừng lại.
5.  Nhấn `F5` hoặc nút Play màu xanh lá để bắt đầu debug. Quá trình test sẽ dừng lại ở breakpoint của bạn.
  **Cách debug:**
    *   Mở file test (ví dụ `e2e/login.e2e.js`).
    *   Đặt một breakpoint (điểm dừng) bằng cách click vào lề trái của trình soạn thảo code.
    *   Chạy lệnh test với cờ `--inspect-brk` trong terminal:
        ```bash
        detox test -c android.emu.debug --inspect-brk
        ```
    *   Terminal sẽ dừng lại với thông báo "Debugger listening...".
    *   Chuyển qua tab "Run and Debug" (biểu tượng play với con bọ) trong VS Code.
    *   Chọn "Attach to Detox Test" từ menu dropdown và nhấn F5 (hoặc nút Play màu xanh).
    *   Debugger sẽ kết nối, và quá trình thực thi test sẽ dừng lại ở breakpoint của bạn, cho phép bạn kiểm tra các biến và gỡ lỗi.

Chúc bạn thành công!

---

## 📚 Phụ Lục: Nội Dung Các File Source Code

### File: `index.tsx`
```typescript
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
```

### File: `App.tsx`
```typescript
import React, { useState, useCallback } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import LoginScreen from './components/LoginScreen';
import HomeScreen from './components/HomeScreen';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: '#111827', // bg-gray-900
    flex: 1,
  };

  const handleLoginSuccess = useCallback(() => {
    setIsLoggedIn(true);
  }, []);

  const handleLogout = useCallback(() => {
    setIsLoggedIn(false);
  }, []);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      {isLoggedIn ? (
        <HomeScreen onLogout={handleLogout} />
      ) : (
        <LoginScreen onLoginSuccess={handleLoginSuccess} />
      )}
    </SafeAreaView>
  );
};

export default App;
```

### File: `components/LoginScreen.tsx`
```typescript
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { UserIcon, LockIcon, LoginIcon } from './icons';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);
    await new Promise(resolve => setTimeout(resolve, 1500));
    if (email === 'test@detox.com' && password === 'password123') {
      onLoginSuccess();
    } else {
      setError('Invalid email or password. Please try again.');
    }
    setIsLoading(false);
  };

  return (
    <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.containerWrapper}
    >
        <View style={styles.container} testID="login-screen">
            <View style={styles.header}>
                <Text style={styles.title}>Detox E2E Demo</Text>
                <Text style={styles.subtitle}>Enter credentials to proceed</Text>
            </View>

            <View style={styles.form}>
                <View style={styles.inputContainer}>
                    <UserIcon style={styles.inputIcon} color="#9CA3AF" />
                    <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Email (test@detox.com)"
                        placeholderTextColor="#6B7280"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        testID="email-input"
                    />
                </View>
                <View style={styles.inputContainer}>
                    <LockIcon style={styles.inputIcon} color="#9CA3AF" />
                    <TextInput
                        style={styles.input}
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Password (password123)"
                        placeholderTextColor="#6B7280"
                        secureTextEntry
                        testID="password-input"
                    />
                </View>
            </View>

            {error && (
                <View style={styles.errorContainer} testID="error-message">
                <Text style={styles.errorText}>{error}</Text>
                </View>
            )}

            <TouchableOpacity
                onPress={handleLogin}
                disabled={isLoading}
                style={[styles.button, isLoading && styles.buttonDisabled]}
                testID="login-button"
            >
                {isLoading ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                    <>
                    <LoginIcon style={{ marginRight: 8 }} color="#FFFFFF" />
                    <Text style={styles.buttonText}>Login</Text>
                    </>
                )}
            </TouchableOpacity>
        </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
    containerWrapper: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#111827', padding: 16, },
    container: { width: '100%', maxWidth: 400, backgroundColor: '#1F2937', padding: 32, borderRadius: 16, },
    header: { alignItems: 'center', marginBottom: 24, },
    title: { fontSize: 28, fontWeight: 'bold', color: '#22D3EE', },
    subtitle: { color: '#9CA3AF', marginTop: 8, },
    form: { marginBottom: 16, },
    inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#374151', borderWidth: 1, borderColor: '#4B5563', borderRadius: 8, marginBottom: 16, height: 50, },
    inputIcon: { marginLeft: 12, },
    input: { flex: 1, color: '#FFFFFF', paddingHorizontal: 12, fontSize: 16, },
    errorContainer: { backgroundColor: 'rgba(190, 38, 38, 0.5)', borderColor: '#BE2626', borderWidth: 1, padding: 12, borderRadius: 8, marginBottom: 16, },
    errorText: { color: '#F87171', textAlign: 'center', },
    button: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0891B2', paddingVertical: 14, borderRadius: 8, },
    buttonDisabled: { backgroundColor: '#0E7490', },
    buttonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16, },
});

export default LoginScreen;
```

### File: `components/HomeScreen.tsx`
```typescript
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CheckCircleIcon, LogoutIcon } from './icons';

interface HomeScreenProps {
  onLogout: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onLogout }) => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.container} testID="home-screen">
        <CheckCircleIcon width={64} height={64} color="#34D399" />
        <View style={styles.textContainer}>
          <Text style={styles.title} testID="welcome-message">
            Login Successful!
          </Text>
          <Text style={styles.subtitle}>Welcome to the Home Screen.</Text>
        </View>
        <Text style={styles.description}>
          This screen confirms that the E2E login test has passed and navigation was successful.
        </Text>
        <TouchableOpacity
          onPress={onLogout}
          style={styles.button}
          testID="logout-button"
        >
          <LogoutIcon style={{ marginRight: 8 }} color="#FFFFFF" />
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#111827', padding: 16, },
  container: { width: '100%', maxWidth: 400, backgroundColor: '#1F2937', padding: 32, borderRadius: 16, alignItems: 'center', },
  textContainer: { alignItems: 'center', marginVertical: 24, },
  title: { fontSize: 28, fontWeight: 'bold', color: '#34D399', },
  subtitle: { color: '#D1D5DB', marginTop: 8, fontSize: 16, },
  description: { color: '#9CA3AF', fontSize: 14, textAlign: 'center', marginBottom: 24, },
  button: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#4B5563', paddingVertical: 14, borderRadius: 8, width: '100%', },
  buttonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16, },
});

export default HomeScreen;
```

### File: `components/icons.tsx`
```typescript
import React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

const defaultProps = { width: 20, height: 20, strokeWidth: 1.5, color: "currentColor" };

export const UserIcon: React.FC<SvgProps> = (props) => (
  <Svg fill="none" viewBox="0 0 24 24" stroke={props.color || defaultProps.color} strokeWidth={defaultProps.strokeWidth} {...defaultProps} {...props}>
    <Path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </Svg>
);

export const LockIcon: React.FC<SvgProps> = (props) => (
  <Svg fill="none" viewBox="0 0 24 24" stroke={props.color || defaultProps.color} strokeWidth={defaultProps.strokeWidth} {...defaultProps} {...props}>
    <Path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
  </Svg>
);

export const LoginIcon: React.FC<SvgProps> = (props) => (
  <Svg fill="none" viewBox="0 0 24 24" stroke={props.color || defaultProps.color} strokeWidth={defaultProps.strokeWidth} {...defaultProps} {...props}>
    <Path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
  </Svg>
);

export const LogoutIcon: React.FC<SvgProps> = (props) => (
  <Svg fill="none" viewBox="0 0 24 24" stroke={props.color || defaultProps.color} strokeWidth={defaultProps.strokeWidth} {...defaultProps} {...props}>
    <Path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m-3 0l-3 3m0 0l-3-3m-3 3H9" />
  </Svg>
);

export const CheckCircleIcon: React.FC<SvgProps> = (props) => (
  <Svg fill="none" viewBox="0 0 24 24" stroke={props.color || defaultProps.color} strokeWidth={defaultProps.strokeWidth} {...defaultProps} {...props}>
    <Path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </Svg>
);


