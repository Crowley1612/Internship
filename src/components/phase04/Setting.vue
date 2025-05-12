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
C=VN, ST=Hồ Chí Minh, L= Bình Tân, Hồ Chí Minh,
0.9.2342.19200300.100.1=CCCCD:001191009538, O=A Nguyễn Hoàng Phúc, E={{ user.email }}, CN=A Nguyễn Hoàng Phúc
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
                                    <a-form ref="formRef" name="custom-validation" :model="formState" 
                                    :rules="rules"
                                        v-bind="layout" @finish="onFinish">
                                        <label style="margin-right: 20px;">Nhập mật khẩu cũ:</label>
                                        <a-form-item name="oldPass" style="margin-right: 20px;">
                                            <a-input v-model:value="formState.oldPass" type="showPassword"
                                                autocomplete="off" />
                                        </a-form-item>

                                        <label style="margin-right: 20px;">Mật khẩu mới:</label>
                                        <a-form-item  name="pass">
                                            <a-input v-model:value="formState.pass" type="showPassword"
                                                autocomplete="off" />
                                        </a-form-item>

                                        <label style="margin-right: 20px;">Xác nhận mật khẩu:</label>
                                        <a-form-item has-feedback name="checkPass">
                                            <a-input v-model:value="formState.checkPass" type="showPassword"
                                                autocomplete="off" />
                                        </a-form-item>

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
import { XMLParser } from 'fast-xml-parser';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const router = useRouter();
const store = useStore();

// Reactive states
const settings = reactive({
    signingMethod: 'usb',
    registrationCode: '400196',
    displayMethod: 'displaySignature',
});

const user = reactive({
    email: '',
    username: '',
    name: '',
    phone: '',
    taxcode: '',
    company: '',
});

const formState = reactive({
    oldPass: '',
    pass: '',
    checkPass: '',
});

// Convert XML to JSON
const convertXmlToJson = (xmlData) => {
    const parser = new XMLParser({
        ignoreAttributes: false,
    });
    return parser.parse(xmlData);
};

// Load user information
const loadUserInfo = async () => {
    const username = store.state.username; // Get username from store
    console.log('Loading user information:', username);
    try {
        const soapRequest = `
        <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
            <soap:Body>
            <Laythongtintaikhoan xmlns="http://tempuri.org/">
                <Email>${username}</Email>
            </Laythongtintaikhoan>
            </soap:Body>
        </soap:Envelope>`;

        const response = await axios({
            baseURL: `https://apiedoc.nacencomm.vn/apiEdoc.asmx`,
            method: "post",
            headers: {
                "Content-Type": "text/xml",
            },
            data: soapRequest,
        });

        const dataJson = convertXmlToJson(response.data);
        const userInfo =
            dataJson?.['soap:Envelope']?.['soap:Body']?.['LaythongtintaikhoanResponse']
            ?.['LaythongtintaikhoanResult'];
        console.log('User information:', userInfo);
        if (userInfo) {
            user.email = userInfo.Email || '';
            user.username = userInfo.Email || '';
            user.name = userInfo.Hoten || '';
            user.phone = userInfo.Sodienthoai || '';
            user.taxcode = userInfo.Masothue || '';
            user.company = userInfo.Tentochuc || '';
            console.log('User information loaded:', user);
        } else {
            console.warn('No user information found in response.');
        }
    } catch (error) {
        console.error('Error loading user information:', error);
    }
};

// Reset password
const resetPassword = async (params) => {
    const userEmail = store.state.username;
    const { oldPassword, newPassword } = params;
    try {
        const soapRequest = `
        <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
            <soap:Body>
            <Doimatkhau xmlns="http://tempuri.org/">
                <Email>${userEmail}</Email>
                <Matkhaucu>${oldPassword}</Matkhaucu>
                <Matkhaumoi>${newPassword}</Matkhaumoi>
            </Doimatkhau>
            </soap:Body>
        </soap:Envelope>`;

        const response = await axios({
            baseURL: `https://apiedoc.nacencomm.vn/apiEdoc.asmx`,
            method: "post",
            headers: {
                "Content-Type": "text/xml",
                "SOAPAction": "http://tempuri.org/Doimatkhau"
            },
            data: soapRequest,
        });

        const dataJson = convertXmlToJson(response.data);
        const result =
            dataJson?.['soap:Envelope']?.['soap:Body']?.['DoimatkhauResponse']
            ?.['DoimatkhauResult'];

        console.log('Password reset result:', result);
        return result;
    } catch (error) {
        console.error('Error resetting password:', error);
        return '0';
    }
};

const rules = {
    oldPass: [
        {
            required: true,
            validator: async (_rule, value) => {
                if (!value) throw new Error('Please input the old password');
            },
            trigger: 'change',
        },
    ],
    pass: [
        {
            required: true,
            validator: (_rule, value) => {
                const minLength = 6;
                const hasNumber = /[0-9]/;
                const hasLowercase = /[a-z]/;
                const hasUppercase = /[A-Z]/;
                const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;

                if (!value) throw new Error('Please input the password');
                if (value.length < minLength)
                    throw new Error(`Password must be at least ${minLength} characters long`);
                if (!hasNumber.test(value))
                    throw new Error('Password must contain at least one number');
                if (!hasLowercase.test(value))
                    throw new Error('Password must contain at least one lowercase letter');
                if (!hasUppercase.test(value))
                    throw new Error('Password must contain at least one uppercase letter');
                if (!hasSpecialChar.test(value))
                    throw new Error('Password must contain at least one special character');
                return Promise.resolve();
            },
            trigger: 'change',
        },
    ],
    checkPass: [
        {
            validator: (_rule, value) => {
                if (!value) throw new Error('Please input the password again');
                if (value !== formState.pass)
                    throw new Error("Passwords don't match");

                return Promise.resolve();
            },
            trigger: 'change',
        },
    ],
};

const formRef = ref(null);
const onFinish = async () => {
    try {

        const result = await resetPassword({
            userEmail: user.email,
            oldPassword: formState.oldPass,
            newPassword: formState.pass,
        });

        if (result === 1) {
            console.log('Password reset successful');

        } else {
            console.error('Password reset failed');
        }
    } catch (error) {
        console.error('Error during form submission:', error);
    }
};

const onFinishFailed = (errorInfo) => {
    console.error('Form validation failed:', errorInfo);
};

// Modal actions
const isModalOpen = ref(false);
const editUser = reactive({ ...user });
const loading = ref(false);

const showModal = () => {
    Object.assign(editUser, user);
    isModalOpen.value = true;
};

const handleOk = async () => {
    loading.value = true;
    try {
        Object.assign(user, editUser);
        console.log('Updated user:', user);
        isModalOpen.value = false;
    } catch (error) {
        console.error('Error updating user:', error);
    } finally {
        loading.value = false;
    }
};
const resetForm = () => {
    formState.oldPass = '';
    formState.pass = '';
    formState.checkPass = '';
};

const handleCancelModal = () => {
    isModalOpen.value = false;
};

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