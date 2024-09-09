<template>
    <div class="container-fluid h-100">
        <div class="row h-100">
            <!-- Sidebar -->
            <Sidebar />

            <!-- Main content area -->
            <div class="col-md-10 p-4">
                <!-- Header -->
                <Header />

                <!-- Title -->
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h1>Cài đặt</h1>
                </div>

                <!-- Tabs and Content -->
                <div class="card shadow-sm p-4">
                    <a-tabs>
                        <a-tab-pane key="1" tab="Cài đặt tài khoản">
                            <div class="profile-info-container">
                                <div class="profile-header">
                                    <div class="profile-picture">
                                        <span>👤</span>
                                    </div>
                                    <div class="profile-name">Đỗ Thị Thu Hằng 1</div>
                                    <div class="verification"><i class="bi bi-check-lg"></i>Đã xác minh</div>
                                </div>

                                <div class="info-section">
                                    <div class="header">
                                        <h2>Thông tin cơ bản</h2>
                                        <a href="#" class="edit-button"><i class="bi bi-pencil-square"></i> Thay đổi
                                            thông tin</a>
                                    </div>
                                    <div class="info">
                                        <div><strong>Họ và tên:</strong> Đỗ Thị Thu Hằng 1</div>
                                    </div>
                                    <div class="info">
                                        <div><strong>Mã số thuế:</strong> 0103930279</div>
                                        <div><strong>Công ty:</strong> Nacenncomm SCT</div>
                                    </div>
                                </div>

                                <div class="info-section">
                                    <div class="header">
                                        <h2>Thông tin tài khoản</h2>
                                    </div>
                                    <div class="info">
                                        <div><strong>Tên tài khoản:</strong> hangdtt@cavvn.vn</div>
                                        <div class="email"><strong>Email:</strong> hangdtt@cavvn.vn <span>✔️</span>
                                        </div>
                                    </div>
                                    <div class="info">
                                        <div><strong>Số điện thoại:</strong> 0902432283</div>
                                    </div>
                                </div>
                            </div>
                        </a-tab-pane>

                        <a-tab-pane key="2" tab="Phương thức ký">
                            <div class="container">
                                <div class="header">
                                    <h2>Thông tin chữ ký số</h2>
                                </div>
                                <div class="info">
                                    <div>
                                        <label>Email:</label>
                                        <input type="text" value="hangdtt@cavvn.vn" readonly>
                                    </div>
                                    <div>
                                        <label>Mã đăng ký:</label>
                                        <input type="text" value="400196" readonly>
                                    </div>
                                </div>
                                <div class="info">
                                    <div>
                                        <label>Ngày hết hạn CTS:</label>
                                        <input type="text" value="08-07-2025 09:37:46" readonly>
                                    </div>
                                    <div>
                                        <label>Serial number:</label>
                                        <input type="text" value="5402BC5ACCE669C202300000007A3" readonly>
                                    </div>
                                </div>
                                <div class="long-info">
                                    <label>Thông tin chứng thư số:</label>
                                    <textarea readonly>
C=VN, ST=Hà Nội, L=TDP Văn Trì 4, Minh Khai, Bắc Từ Liêm, Hà Nội, 0.9.2342.19200300.100.1=CCCCD:001191009538, O=Đỗ Thị Thu Hằng, E=hangdtt@cavvn.vn, CN=Đỗ Thị Thu Hằng
            </textarea>
                                </div>
                            </div>
                            <div class="container">
                                <h2>Cài đặt phương thức</h2>
                                <div class="section">
                                    <label>Chọn phương thức ký:</label>
                                    <div class="radio-group">
                                        <label>
                                            <input type="radio" name="signingMethod" value="usb" checked>
                                            Ký bằng USB Token
                                        </label>
                                        <label>
                                            <input type="radio" name="signingMethod" value="remote">
                                            Ký bằng Remote Signing
                                        </label>
                                    </div>
                                    <label>Mã đăng ký:</label>
                                    <input type="text" value="400196" readonly>
                                    <button class="update-button">Cập nhật</button>
                                </div>
                                <div class="section">
                                    <h2>Cài đặt hiển thị</h2>
                                    <div class="radio-group">
                                        <label>
                                            <input type="radio" name="displayMethod" value="displaySignature" checked>
                                            Hiển thị chữ ký số
                                        </label>
                                        <label>
                                            <input type="radio" name="displayMethod" value="displayImage">
                                            Hiển thị ảnh
                                        </label>
                                        <label>
                                            <input type="radio" name="displayMethod" value="displayBoth">
                                            Hiển thị ảnh và chữ ký số
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </a-tab-pane>
                        <a-tab-pane key="3" tab="Đổi mật khẩu">
                            <div class="change-password-container">
                                <h2>Thay đổi mật khẩu</h2>
                                <p>Mật khẩu yêu cầu có tối thiểu 6 ký tự bao gồm số, chữ cái thường, chữ cái in hoa, ký
                                    tự đặc biệt.</p>

                                <a-form :model="passwordForm" :rules="rules" layout="vertical" @submit="handleSubmit">
                                    <a-form-item label="Mật khẩu cũ" name="oldPassword" required>
                                        <a-input-password v-model="passwordForm.oldPassword"
                                            placeholder="Nhập mật khẩu cũ" />
                                    </a-form-item>

                                    <a-form-item label="Mật khẩu mới" name="newPassword" required>
                                        <a-input-password v-model="passwordForm.newPassword"
                                            placeholder="Nhập mật khẩu mới" />
                                    </a-form-item>

                                    <a-form-item label="Xác nhận mật khẩu mới" name="confirmPassword" required>
                                        <a-input-password v-model="passwordForm.confirmPassword"
                                            placeholder="Nhập lại mật khẩu mới" />
                                    </a-form-item>

                                    <a-form-item>
                                        <a-button class="cancel-button" @click="handleCancel">Hủy</a-button>
                                        <a-button type="primary" html-type="submit" :loading="loading">Xác
                                            nhận</a-button>
                                    </a-form-item>
                                </a-form>
                                <div v-if="feedbackMessage" class="feedback-message">{{ feedbackMessage }}</div>
                            </div>
                        </a-tab-pane>
                    </a-tabs>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Sidebar from '../layout/Sidebar.vue';
import Header from '../layout/Header.vue';

export default {
    components: {
        Sidebar,
        Header,
    },
    data() {
        return {
            passwordForm: {
                oldPassword: '',
                newPassword: '',
                confirmPassword: '',
            },
            rules: {
                oldPassword: [{ required: true, message: 'Vui lòng nhập mật khẩu cũ' }],
                newPassword: [{ required: true, message: 'Vui lòng nhập mật khẩu mới' }],
                confirmPassword: [
                    { required: true, message: 'Vui lòng nhập lại mật khẩu mới' },
                    { validator: this.validatePasswordConfirmation },
                ],
            },
            loading: false,
            feedbackMessage: '',
        };
    },
    methods: {
        async handleSubmit() {
            this.loading = true;
            this.feedbackMessage = '';
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));
                this.feedbackMessage = 'Mật khẩu đã được thay đổi thành công.';
            } catch (error) {
                this.feedbackMessage = 'Có lỗi xảy ra. Vui lòng thử lại.';
            } finally {
                this.loading = false;
            }
        },
        handleCancel() {
            this.passwordForm.oldPassword = '';
            this.passwordForm.newPassword = '';
            this.passwordForm.confirmPassword = '';
            this.feedbackMessage = '';
        },
        validatePasswordConfirmation(rule, value) {
            if (value !== this.passwordForm.newPassword) {
                return Promise.reject('Mật khẩu xác nhận không khớp');
            }
            return Promise.resolve();
        },
    },
};
</script>
<style scoped>
@import '@/assets/MasterPage.css';
@import '@/assets/Setting.css';
</style>
