<template>
    <div class="container-fluid h-100">
        <div class="row h-100">
            <Sidebar />
            <div class="col-md-10 p-4">
                <Header />
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h1>Cài đặt</h1>
                </div>
                <div class="card shadow-sm p-4">
                    <a-tabs>
                        <a-tab-pane key="1" tab="Cài đặt tài khoản">
                            <div class="profile-info-container">
                                <div class="profile-header">
                                    <div class="profile-picture"><span>👤</span></div>
                                    <div class="profile-name">{{ user.name }}</div>
                                    <div class="verification">
                                        <i class="bi bi-check-lg"></i> Đã xác minh
                                    </div>
                                </div>

                                <div class="info-section">
                                    <div class="header">
                                        <h2>Thông tin cơ bản</h2>
                                        <a-button type="primary" @click="showModal">
                                            <i class="bi bi-pencil-square"></i> Thay đổi thông tin
                                        </a-button>
                                    </div>
                                    <div class="info">
                                        <div><strong>Họ và tên:</strong> {{ user.name }}</div>
                                    </div>
                                    <div class="info">
                                        <div><strong>Mã số thuế:</strong> {{ user.taxcode }}</div>
                                        <div><strong>Công ty:</strong> {{ user.company }}</div>
                                    </div>
                                </div>

                                <div class="info-section">
                                    <div class="header">
                                        <h2>Thông tin tài khoản</h2>
                                    </div>
                                    <div class="info">
                                        <div><strong>Tên tài khoản:</strong> {{ user.username }}</div>
                                        <div class="email">
                                            <strong>Email:</strong> {{ user.email }} <span>✔️</span>
                                        </div>
                                    </div>
                                    <div class="info">
                                        <div><strong>Số điện thoại:</strong> {{ user.phone }}</div>
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
                                        <span>{{ user.email }}</span>
                                    </div>
                                    <div>
                                        <label>Mã đăng ký:</label>
                                        <span>{{ settings.registrationCode }}</span>
                                    </div>
                                </div>
                                <div class="info">
                                    <div>
                                        <label>Ngày hết hạn CTS:</label>
                                        <span>08-07-2025 09:37:46</span>
                                    </div>
                                    <div>
                                        <label>Serial number:</label>
                                        <span>5402BC5ACCE669C202300000007A3</span>
                                    </div>
                                </div>
                                <div class="long-info">
                                    <label>Thông tin chứng thư số:</label>
                                    <textarea readonly>
C=VN, ST=Hà Nội, L=TDP Văn Trì 4, Minh Khai, Bắc Từ Liêm, Hà Nội,
0.9.2342.19200300.100.1=CCCCD:001191009538, O=Đỗ Thị Thu Hằng, E={{ user.email }}, CN=Đỗ Thị Thu Hằng
                                    </textarea>
                                </div>
                            </div>
                            <div class="container">
                                <h2>Cài đặt phương thức</h2>
                                <div class="section">
                                    <label>Chọn phương thức ký:</label>
                                    <div class="radio-group">
                                        <label>
                                            <input type="radio" name="signingMethod" value="usb"
                                                v-model="settings.signingMethod" />
                                            Ký bằng USB Token
                                        </label>
                                        <label>
                                            <input type="radio" name="signingMethod" value="remote"
                                                v-model="settings.signingMethod" />
                                            Ký bằng Remote Signing
                                        </label>
                                    </div>
                                    <label>Mã đăng ký:</label>
                                    <input type="text" v-model="settings.registrationCode" />
                                    <button class="update-button" @click="updateRegistrationCode">Cập nhật</button>
                                </div>
                                <div class="section">
                                    <h2>Cài đặt hiển thị</h2>
                                    <div class="radio-group">
                                        <label>
                                            <input type="radio" name="displayMethod" value="displaySignature"
                                                v-model="settings.displayMethod" />
                                            Hiển thị chữ ký số
                                        </label>
                                        <label>
                                            <input type="radio" name="displayMethod" value="displayImage"
                                                v-model="settings.displayMethod" />
                                            Hiển thị ảnh
                                        </label>
                                        <label>
                                            <input type="radio" name="displayMethod" value="displayBoth"
                                                v-model="settings.displayMethod" />
                                            Hiển thị ảnh và chữ ký số
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </a-tab-pane>

                        <a-tab-pane key="3" tab="Đổi mật khẩu">
                            <div class="change-password-container">
                                <h2>Thay đổi mật khẩu</h2>
                                <p>Mật khẩu cần có tối thiểu 6 ký tự, bao gồm số, chữ cái thường, chữ in hoa, ký tự đặc
                                    biệt.</p>
                                <a-form :model="passwordForm" :rules="rules" layout="vertical"
                                    @submit.prevent="handleSubmit">
                                    <a-form-item label="Mật khẩu cũ" name="oldPassword" required>
                                        <a-input-password v-model="passwordForm.oldPassword"
                                            placeholder="Nhập mật khẩu cũ" @input="clearFeedback" />
                                    </a-form-item>
                                    <a-form-item label="Mật khẩu mới" name="newPassword" required>
                                        <a-input-password v-model="passwordForm.newPassword"
                                            placeholder="Nhập mật khẩu mới" @input="clearFeedback" />
                                    </a-form-item>
                                    <a-form-item label="Xác nhận mật khẩu mới" name="confirmPassword" required>
                                        <a-input-password v-model="passwordForm.confirmPassword"
                                            placeholder="Xác nhận mật khẩu mới" @input="clearFeedback" />
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
        <a-modal title="Thay đổi thông tin" v-model:open="isModalOpen" @ok="handleOk" @cancel="handleCancelModal">
            <a-form layout="vertical">
                <a-form-item label="Họ và tên">
                    <a-input v-model="editUser.name" @change="(e) => {
                        editUser.name = e.target.value;
                    }
                        " />
                </a-form-item>
                <a-form-item label="Mã số thuế">
                    <a-input v-model="editUser.taxcode" @change="(e) => {
                        editUser.taxcode = e.target.value;
                    }
                        " />
                </a-form-item>
                <a-form-item label="Công ty">
                    <a-input v-model="editUser.company" @change="(e) => {
                        editUser.company = e.target.value;
                    }
                        " />
                </a-form-item>
                <a-form-item label="Tên tài khoản">
                    <a-input v-model="editUser.username" @change="(e) => {
                        editUser.username = e.target.value;
                    }
                        " />
                </a-form-item>
                <a-form-item label="Số điện thoại">
                    <a-input v-model="editUser.phone" @change="(e) => {
                        editUser.phone = e.target.value;
                    }
                        " />
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>

<script>
import Sidebar from '../layout/Sidebar.vue';
import Header from '../layout/Header.vue';

export default {
    components: { Sidebar, Header },
    data() {
        return {
            settings: {
                signingMethod: 'usb',
                registrationCode: '400196',
                displayMethod: 'displaySignature'
            },
            user: {
                email: 'user@example.com',
                username: 'user@example.com',
                name: 'Nguyen Van A',
                phone: '0123456789',
                taxcode: '1234567890',
                company: 'Công ty TNHH ABC',
            },
            passwordForm: {
                oldPassword: '',
                newPassword: '',
                confirmPassword: '',
            },
            rules: {
                oldPassword: [{ required: true, message: 'Mật khẩu cũ không được để trống' }],
                newPassword: [
                    { required: true, message: 'Mật khẩu mới không được để trống' },
                    { min: 6, message: 'Mật khẩu mới phải có tối thiểu 6 ký tự' }
                ],
                confirmPassword: [
                    { required: true, message: 'Xác nhận mật khẩu mới không được để trống' },
                    {
                        validator: (rule, value) => {
                            return new Promise((resolve, reject) => {
                                if (value !== this.passwordForm.newPassword) {
                                    reject('Mật khẩu xác nhận không khớp');
                                } else {
                                    resolve();
                                }
                            });
                        }
                    }
                ]
            },
            loading: false,
            feedbackMessage: '',
            isModalOpen: false,
            editUser: { ...this.user }, // Initialize editUser
        };
    },
    methods: {
        updateRegistrationCode() {
            // Logic to update the registration code
            alert('Mã đăng ký đã được cập nhật: ' + this.settings.registrationCode);
        },
        handleSubmit() {
            this.feedbackMessage = '';

            if (!this.passwordForm.oldPassword || !this.passwordForm.newPassword || !this.passwordForm.confirmPassword) {
                this.feedbackMessage = 'Không được để trống thông tin';
                return;
            }

            if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
                this.feedbackMessage = 'Mật khẩu mới và xác nhận mật khẩu không khớp';
                return;
            }

            this.loading = true;
            setTimeout(() => {
                // Simulate an API call
                this.loading = false;
                this.feedbackMessage = 'Mật khẩu đã được thay đổi thành công';
                this.passwordForm.oldPassword = '';
                this.passwordForm.newPassword = '';
                this.passwordForm.confirmPassword = '';
            }, 1000);
        },
        handleCancel() {
            this.passwordForm.oldPassword = '';
            this.passwordForm.newPassword = '';
            this.passwordForm.confirmPassword = '';
            this.feedbackMessage = '';
        },
        clearFeedback() {
            this.feedbackMessage = '';
        },
        showModal() {
            this.editUser = { ...this.user };
            this.isModalOpen = true;
        },
        async handleOk() {
            console.log(this.editUser); // Check if the updated values are correct
            this.loading = true;
            try {
                // Simulate API call
                this.user = { ...this.editUser };
                console.log('Updated user:', this.user);
                this.isModalOpen = false;
            } catch (error) {
                console.error(error);
            } finally {
                this.loading = false;
            }
        },
        handleCancelModal() {
            this.isModalOpen = false;
        },
    },
};
</script>

<style scoped>
@import '@/assets/MasterPage.css';
@import '@/assets/Setting.css';

.feedback-message {
    color: red;
    margin-top: 10px;
}
</style>