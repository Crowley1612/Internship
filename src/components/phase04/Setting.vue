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
                        <!-- Account setting -->
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
                        <!-- Phương thức ký -->
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
                        <!-- Đổi mật khẩu -->
                        <a-tab-pane key="3" tab="Đổi mật khẩu">
                            <div class="change-password-container">
                                <h2>Thay đổi mật khẩu</h2>
                                <p>Mật khẩu cần có tối thiểu 6 ký tự, bao gồm số, chữ cái thường, chữ in hoa, ký tự đặc
                                    biệt.</p>
                                <div class="form-change-pass">
                                    <a-form ref="formRef" name="custom-validation" :model="formState" :rules="rules"
                                        v-bind="layout" @finish="handleFinish" @validate="handleValidate"
                                        @finishFailed="handleFinishFailed">
                                        <!-- Old Password Field -->
                                        <label style="margin-right: 20px;">Nhập mật khẩu cũ:</label>
                                        <a-form-item has-feedback name="oldPass" style="margin-right: 20px;">
                                            <a-input v-model:value="formState.oldPass"
                                                type="password" autocomplete="off" />
                                        </a-form-item>

                                        <!-- Password Field -->
                                        <label style="margin-right: 20px;">Mật khẩu mới:</label>
                                        <a-form-item has-feedback name="pass">
                                            <a-input v-model:value="formState.pass"
                                                type="password" autocomplete="off" />
                                        </a-form-item>

                                        <!-- Confirm Password Field -->
                                        <label style="margin-right: 20px;">Xác nhận mật khẩu:</label>
                                        <a-form-item has-feedback name="checkPass">
                                            <a-input v-model:value="formState.checkPass"
                                                type="password" autocomplete="off" />
                                        </a-form-item>

                                        <!-- Submit and Reset Button -->
                                        <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
                                            <a-button style="margin-left: 0px;" @click="resetForm">Huỷ</a-button>
                                            <a-button style="margin-left: 10px;" type="primary" html-type="submit">Xác
                                                nhận</a-button>
                                        </a-form-item>
                                    </a-form>
                                </div>
                            </div>
                        </a-tab-pane>
                    </a-tabs>
                </div>
            </div>
        </div>
        <a-modal title="Thay đổi thông tin" v-model:open="isModalOpen" @ok="handleOk" @cancel="handleCancelModal">
            <a-form layout="vertical">
                <a-form-item label="Họ và tên:">
                    <a-input v-model="editUser.name" @change="(e) => {
                        editUser.name = e.target.value;
                    }
                        " />
                </a-form-item>
                <a-form-item label="Mã số thuế:">
                    <a-input v-model="editUser.taxcode" @change="(e) => {
                        editUser.taxcode = e.target.value;
                    }
                        " />
                </a-form-item>
                <a-form-item label="Công ty:">
                    <a-input v-model="editUser.company" @change="(e) => {
                        editUser.company = e.target.value;
                    }
                        " />
                </a-form-item>
                <a-form-item label="Tên tài khoản:">
                    <a-input v-model="editUser.username" @change="(e) => {
                        editUser.username = e.target.value;
                    }
                        " />
                </a-form-item>
                <a-form-item label="Số điện thoại:">
                    <a-input v-model="editUser.phone" @change="(e) => {
                        editUser.phone = e.target.value;
                    }
                        " />
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import axios from 'axios';
import Sidebar from '../layout/Sidebar.vue';
import Header from '../layout/Header.vue';

// Reactive states for settings and user
const settings = reactive({
    signingMethod: 'usb',
    registrationCode: '400196',
    displayMethod: 'displaySignature'
});

const user = reactive({
  email: '',
  username: '',
  name: '',
  phone: '',
  taxcode: '',
  company: ''
});

const formState = reactive({
    oldPass: '',
    pass: '',
    checkPass: ''
});
const loadUserInfo = async () => {
  try {
    const response = await axios.get('http://localhost:3003/users');
    const userData = response.data[0]; // Assuming you want the first user in the array

    // Populate the user reactive object with the fetched data
    user.email = userData.email;
    user.username = userData.username;
    user.name = userData.name;
    user.phone = userData.tel;
    user.taxcode = userData.tax;
    user.company = userData.org;
  } catch (error) {
    console.error('Error loading user information:', error);
  }
};
// Define ref for the form
const formRef = ref(null);

// Custom validation for Old Password
const validateOldPass = async (_rule, value) => {
    if (!value) return Promise.reject('Please input the old password');
    return Promise.resolve();
};

// Custom validation for Password complexity
const validatePasswordComplexity = (_rule, value) => {
    const minLength = 6;
    const hasNumber = /[0-9]/;
    const hasLowercase = /[a-z]/;
    const hasUppercase = /[A-Z]/;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;

    if (!value) return Promise.reject('Please input the password');
    if (value.length < minLength) return Promise.reject(`Password must be at least ${minLength} characters long`);
    if (!hasNumber.test(value)) return Promise.reject('Password must contain at least one number');
    if (!hasLowercase.test(value)) return Promise.reject('Password must contain at least one lowercase letter');
    if (!hasUppercase.test(value)) return Promise.reject('Password must contain at least one uppercase letter');
    if (!hasSpecialChar.test(value)) return Promise.reject('Password must contain at least one special character');

    return Promise.resolve();
};

// Custom validation for Confirm Password field
const validateConfirmPassword = async (_rule, value) => {
    if (!value) return Promise.reject('Please input the password again');
    if (value !== formState.pass) return Promise.reject("Passwords don't match");
    return Promise.resolve();
};

// Form validation rules
const rules = {
    oldPass: [{ required: true, validator: validateOldPass, trigger: 'change' }],
    pass: [
        { required: true, validator: validatePasswordComplexity, trigger: 'change' }
    ],
    checkPass: [{ validator: validateConfirmPassword, trigger: 'change' }],
};

// Form layout configuration
const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 14 }
};

// Form submission handling
const handleFinish = values => {
    console.log('Form submitted successfully:', values);
};

const handleFinishFailed = errors => {
    console.log('Form submission failed:', errors);
};

// Reset form fields
const resetForm = () => {
    if (formRef.value) {
        formRef.value.resetFields();
    }
};

// Log form validation events
const handleValidate = (...args) => {
    console.log('Validation triggered:', args);
};

const loading = ref(false);
const isModalOpen = ref(false);
const editUser = reactive({ ...user });

function updateRegistrationCode() {
    alert('Mã đăng ký đã được cập nhật: ' + settings.registrationCode);
}

function showModal() {
    Object.assign(editUser, user);
    isModalOpen.value = true;
}

async function handleOk() {
    console.log(editUser); // Check if the updated values are correct
    loading.value = true;
    try {
        // Simulate API call
        Object.assign(user, editUser);
        console.log('Updated user:', user);
        isModalOpen.value = false;
    } catch (error) {
        console.error(error);
    } finally {
        loading.value = false;
    }
}

function handleCancelModal() {
    isModalOpen.value = false;
}
onMounted(() => {
    loadUserInfo();
});
</script>


<style scoped>
@import '@/assets/MasterPage.css';
@import '@/assets/Setting.css';

.feedback-message {
    color: red;
    margin-top: 10px;
}
</style>