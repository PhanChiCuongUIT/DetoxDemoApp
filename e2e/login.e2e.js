/**
 * @fileoverview End-to-End test for the Login functionality.
 */

// File này mô tả các kịch bản test cho luồng đăng nhập của ứng dụng.
describe('Login Flow', () => {
  // Hàm `beforeAll` sẽ được chạy MỘT LẦN DUY NHẤT trước khi TẤT CẢ các kịch bản test
  // trong file này bắt đầu. Lệnh `device.launchApp()` sẽ cài đặt (nếu cần) và
  // khởi chạy ứng dụng, thiết lập kết nối ban đầu cho Detox. Đây là bước bắt buộc.
  beforeAll(async () => {
    await device.launchApp();
  });

  // Hàm `beforeEach` sẽ được chạy trước MỖI kịch bản test (`it` block) bên dưới.
  // Việc tải lại ứng dụng (`reloadReactNative`) đảm bảo mỗi test case bắt đầu
  // từ một trạng thái "sạch", không bị ảnh hưởng bởi kết quả của test case trước đó.
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  /**
   * KỊCH BẢN 1: ĐĂNG NHẬP THÀNH CÔNG
   * Mô tả: Kịch bản này kiểm tra "luồng hạnh phúc" (happy path), nơi người dùng
   * nhập đúng thông tin đăng nhập và điều hướng thành công.
   */
  it('should show home screen after successful login', async () => {
    // 1. Chờ và xác nhận ô nhập email hiển thị trên màn hình.
    //    `element(by.id('email-input'))` tìm kiếm component có `testID` là 'email-input'.
    await expect(element(by.id('email-input'))).toBeVisible();

    // 2. Nhập email hợp lệ vào ô input.
    await element(by.id('email-input')).typeText('test@detox.com');

    // 3. Chờ và xác nhận ô nhập mật khẩu hiển thị.
    await expect(element(by.id('password-input'))).toBeVisible();

    // 4. Nhập mật khẩu hợp lệ.
    await element(by.id('password-input')).typeText('password123');

    // 5. Tìm nút đăng nhập và thực hiện hành động 'tap' (nhấn).
    await element(by.id('login-button')).tap();

    // 6. Sau khi nhấn, kỳ vọng màn hình chính (`home-screen`) sẽ xuất hiện.
    //    Detox sẽ tự động đợi một khoảng thời gian mặc định cho element này xuất hiện.
    await expect(element(by.id('home-screen'))).toBeVisible();

    // 7. Kiểm tra xem thông điệp chào mừng có đúng nội dung "Login Successful!" hay không.
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
    // 1. Nhập một email không hợp lệ.
    await element(by.id('email-input')).typeText('wrong@email.com');

    // 2. Nhập một mật khẩu không hợp lệ.
    await element(by.id('password-input')).typeText('wrongpassword');

    // 3. Nhấn nút đăng nhập.
    await element(by.id('login-button')).tap();

    // 4. Kỳ vọng rằng một component chứa thông báo lỗi (`error-message`) sẽ được hiển thị.
    await expect(element(by.id('error-message'))).toBeVisible();

    // 5. (Kiểm tra thêm) Đồng thời, đảm bảo rằng màn hình chính KHÔNG xuất hiện.
    //    Điều này xác nhận ứng dụng không điều hướng sai luồng.
    await expect(element(by.id('home-screen'))).not.toBeVisible();
  });
});
