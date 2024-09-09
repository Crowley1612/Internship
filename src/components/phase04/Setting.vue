<template>
    <div class="container-fluid h-100">
        <div class="row h-100">
            <!-- Sidebar -->

            <Sidebar />

            <!-- Main content area -->
            <div class="col-md-10 p-4">
                <!-- Header -->
                <Header />

                <!-- Title & Tabs -->
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h1>Cài đặt</h1>
                </div>

                <!-- Tabs and Content -->
                <div class="card shadow-sm p-4">
                    <a-tabs>
                        <!-- Other Tabs -->
                        <a-tab-pane key="1" tab="Cài đặt tài khoản">
                            <a-card class="settings-container">
                                <a-row justify="space-between" align="middle">
                                    <a-col>
                                        <a-avatar size="large" icon="user" />
                                        <span class="username">Đỗ Thị Thu Hằng 1</span>
                                    </a-col>
                                    <a-col>
                                        <a-button type="primary">Thay đổi thông tin</a-button>
                                    </a-col>
                                </a-row>
                                <div class="basic-info">
                                    <h3>Thông tin cơ bản</h3>
                                    <p><strong>Họ và tên:</strong> Đỗ Thị Thu Hằng 1</p>
                                    <p><strong>Mã số thuế:</strong> 01039302079</p>
                                    <p><strong>Công ty:</strong> Naeconmm SCT</p>
                                </div>
                                <div class="account-info">
                                    <h3>Thông tin tài khoản</h3>
                                    <p><strong>Tên tài khoản:</strong> hangdtt@cavnn.vn</p>
                                    <p><strong>Số điện thoại:</strong> 0902423283</p>
                                    <p><strong>Email:</strong> hangdtt@cavnn.vn <a-icon type="check-circle"
                                            theme="filled" style="color: green;" /></p>
                                </div>
                            </a-card>
                        </a-tab-pane>
                        <a-tab-pane key="2" tab="Phương thức ký"></a-tab-pane>

                        <!-- Change Password Tab -->
                        <a-tab-pane key="3" tab="Đổi mật khẩu">
                            <div class="change-password-container">
                                <h2>Thay đổi mật khẩu</h2>
                                <p>
                                    Mật khẩu yêu cầu có tối thiểu 6 ký tự bao gồm số, chữ cái thường, chữ cái in hoa,
                                    ký tự đặc biệt.
                                </p>

                                <!-- Password Form -->
                                <a-form :model="passwordForm" :rules="rules" layout="vertical" @submit="handleSubmit">
                                    <!-- Old Password Field -->
                                    <a-form-item label="Mật khẩu cũ" name="oldPassword" required>
                                        <a-input-password v-model="passwordForm.oldPassword"
                                            placeholder="Nhập mật khẩu cũ" />
                                    </a-form-item>

                                    <!-- New Password Field -->
                                    <a-form-item label="Mật khẩu mới" name="newPassword" required>
                                        <a-input-password v-model="passwordForm.newPassword"
                                            placeholder="Nhập mật khẩu mới" />
                                    </a-form-item>

                                    <!-- Confirm New Password Field -->
                                    <a-form-item label="Xác nhận mật khẩu mới" name="confirmPassword" required>
                                        <a-input-password v-model="passwordForm.confirmPassword"
                                            placeholder="Nhập lại mật khẩu mới" />
                                    </a-form-item>

                                    <!-- Action Buttons -->
                                    <a-form-item>
                                        <a-button class="cancel-button" @click="handleCancel">Hủy</a-button>
                                        <a-button type="primary" html-type="submit">Xác nhận</a-button>
                                    </a-form-item>
                                </a-form>
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
        };
    },
    methods: {
        handleSubmit() {
            console.log('Form submitted:', this.passwordForm);
            // Add your submission logic here
        },
        handleCancel() {
            console.log('Form cancelled');
            // Add cancel logic here (e.g., clear the form or navigate away)
        },
        validatePasswordConfirmation(rule, value) {
            if (value !== this.passwordForm.newPassword) {
                return Promise.reject('Mật khẩu xác nhận không khớp');
            }
            return Promise.resolve();
        },
        validatePassword() {
            const password = this.password;
            const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
            if (!regex.test(password)) {
                this.passwordError = 'Mật khẩu phải có tối thiểu 6 ký tự bao gồm số, chữ cái thường, chữ cái in hoa, ký tự đặc biệt.';
            } else {
                this.passwordError = '';
            }
        },
        changePassword() {
            if (this.passwordError) {
                alert('Vui lòng nhập mật khẩu hợp lệ.');
                return;
            }
            // Logic to change the password
            alert('Mật khẩu đã được thay đổi thành công.');
        },
    },
};
</script>

<style scoped>
@import '@/assets/MasterPage.css';

@import '@/assets/MasterPage.css';

.container-fluid {
    background-color: #f9f9f9;
}

.change-password-container {
    max-width: 600px;
    margin: auto;
    padding: 20px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h2 {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 20px;
}

p {
    margin-bottom: 1.5rem;
    color: #888;
}

.cancel-button {
    margin-right: 1rem;
}

.settings-container {
    max-width: 600px;
    margin: 20px auto;
    padding: 20px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.username {
    font-size: 1.5em;
    margin-left: 10px;
}

.basic-info,
.account-info {
    margin-top: 20px;
    padding: 10px 0;
    border-top: 1px solid #f0f0f0;
}

h3 {
    margin-bottom: 10px;
    font-size: 1.25rem;
    color: #333;
}

.ant-tabs {
    margin-bottom: 20px;
}

.ant-card {
    border-radius: 8px;
}

.ant-btn {
    border-radius: 4px;
}
</style>