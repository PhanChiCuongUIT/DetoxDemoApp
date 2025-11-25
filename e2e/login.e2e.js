/**
 * @fileoverview End-to-End test for the Login functionality.
 */

describe('Login Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  /**
   * KỊCH BẢN 1: ĐĂNG NHẬP THÀNH CÔNG
   * Mô tả: Kịch bản này kiểm tra "luồng hạnh phúc" (happy path), nơi người dùng
   * nhập đúng thông tin đăng nhập và điều hướng thành công.
   */
  it('should show home screen after successful login', async () => {
    await expect(element(by.id('email-input'))).toBeVisible();
    await element(by.id('email-input')).typeText('test@detox.com');
    await expect(element(by.id('password-input'))).toBeVisible();
    await element(by.id('password-input')).typeText('password123');
    await element(by.id('login-button')).tap();
    await expect(element(by.id('home-screen'))).toBeVisible();
    await expect(element(by.id('welcome-message'))).toHaveText(
      'Login Successful!',
    );
  });

  /**
   * KỊCH BẢN 2: ĐĂNG NHẬP THẤT BẠI
   * Mô tả: Kịch bản này kiểm tra việc ứng dụng xử lý đúng khi người dùng
   * nhập sai thông tin, cụ thể là hiển thị một thông báo lỗi.
   */
  it('should show an error message for failed login', async () => {
    await element(by.id('email-input')).typeText('wrong@email.com');
    await element(by.id('password-input')).typeText('wrongpassword');
    await element(by.id('login-button')).tap();
    await expect(element(by.id('error-message'))).toBeVisible();
    await expect(element(by.id('home-screen'))).not.toBeVisible();
  });

  /**
   * KỊCH BẢN 3: ĐĂNG XUẤT
   * Mô tả: Kiểm tra xem người dùng có thể quay lại màn hình đăng nhập
   * sau khi đã vào màn hình chính hay không.
   */
  it('should logout successfully', async () => {
    await element(by.id('email-input')).typeText('test@detox.com');
    await element(by.id('password-input')).typeText('password123');
    await element(by.id('login-button')).tap();

    await expect(element(by.id('home-screen'))).toBeVisible();

    await element(by.id('logout-button')).tap();

    await expect(element(by.id('login-screen'))).toBeVisible();
  });

  /**
   * KỊCH BẢN 4: BỎ TRỐNG THÔNG TIN
   * Mô tả: Kiểm tra khi người dùng không nhập gì mà bấm Login.
   */
  it('should show error when inputs are empty', async () => {
    await element(by.id('login-button')).tap();

    await expect(element(by.id('error-message'))).toBeVisible();

    await expect(
      element(by.text('Invalid email or password. Please try again.')),
    ).toBeVisible();
  });
});
