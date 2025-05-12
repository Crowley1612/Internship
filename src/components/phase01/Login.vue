<template>
  <div class="wrapper">
    <div class="image-container">
      <img src="https://ca2sp.nacencomm.vn/assets/bg-8d54c696.png" alt="Background Image" class="background-image" />
      <div class="text-overlay">
        
        <p>Ký ngay trên thiết bị di động, không cần USB Token. Giúp bạn làm việc từ xa<br>tại một nơi duy nhất</p>
      </div>
    </div>
    <div class="inner">
      <div class="login-box container bg-light p-4 rounded shadow-sm">
  
        <h1 class="text-center"><b>Đăng nhập</b></h1>
        <a-form :model="formState" name="normal_login" class="login-form" @finish="onFinish"
          @finishFailed="onFinishFailed">
          <div class="form-group">
            <a-form-item label="Tài khoản(Email):" name="username" :rules="[
              { required: true, message: 'Hãy nhập email người dùng!' },
              { type: 'email', message: 'Email không hợp lệ!' }
            ]">
              <a-input v-model:value="formState.username">
                <template #prefix>
                  <UserOutlined class="site-form-item-icon" />
                </template>
              </a-input>
            </a-form-item>

            <a-form-item label="Mật khẩu:" name="password" :rules="[{ required: true, message: 'Hãy nhập mật khẩu!' }]">
              <a-input-password v-model:value="formState.password">
                <template #prefix>
                  <LockOutlined class="site-form-item-icon" />
                </template>
              </a-input-password>
            </a-form-item>
          </div>
          <button type="submit" class="btn btn-primary w-100 mt-3">
            Đăng nhập
          </button>
          <div class="mt-3 text-center">
            <router-link to="/Quen-mat-khau">Quên mật khẩu?</router-link>
          </div>
          <div class="or mt-3 text-center">HOẶC</div>
          <button class="btn btn-outline-dark w-100 mt-3" @click="loginWithGoogle">
            <i class="me-2">
              <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="15" height="15" viewBox="0 0 48 48">
                <path fill="#fbc02d"
                  d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z">
                </path>
                <path fill="#e53935"
                  d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z">
                </path>
                <path fill="#4caf50"
                  d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z">
                </path>
                <path fill="#1565c0"
                  d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z">
                </path>
              </svg>
            </i>
            Đăng nhập bằng Google
          </button>
          <p class="mt-3 text-center">Bạn chưa có tài khoản?
            <router-link to="/Dang-ky">Đăng ký tại đây!</router-link>
          </p>
          <div class="mt-3 text-center opacity">
            <a href="#"><i class="bi bi-cloud-download"></i>Tools ký USB tokens</a>
            <a class="ms-3" href="#">Hướng dẫn sử dụng</a>
          </div>
        </a-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue';
import {defineRule} from 'vee-validate';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
import { useStore } from 'vuex';
const router = useRouter();
const store = useStore();

const formState = reactive({
  username: '',
  password: '',
  remember: true,
});

// Convert XML to JSON function
const convertXmlToJson = (xmlData) => {
  const options = {
    attributeNamePrefix: "",
    ignoreAttributes: false,
  };

  const parser = new XMLParser();
  return parser.parse(xmlData, options);
}


const Signin = async (params) => {
  const { username, password } = params;
  try {
    const soapRequest = `
      <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
        <soap12:Body>
          <Dangnhap xmlns="http://tempuri.org/">
            <Email>${username}</Email>
            <Matkhau>${password}</Matkhau>
          </Dangnhap>
        </soap12:Body>
      </soap12:Envelope>`;

    const response = await axios({
      baseURL: `https://apiedoc.nacencomm.vn/apiEdoc.asmx`,
      method: "post",
      headers: {
        "Content-Type": "application/soap+xml;charset=UTF-8",
      },
      data: soapRequest,
    });

    const dataJson = convertXmlToJson(response.data);
    const DocumentElement =
      dataJson["soap:Envelope"]["soap:Body"]["DangnhapResponse"]["DangnhapResult"];
    console.log(DocumentElement);
    return DocumentElement;
  } catch (error) {
    console.error(error);
    return "0";
  }
};

const onFinish = async () => {
  try {
    const result = await Signin({
      username: formState.username,
      password: formState.password,
    });

    if (result === 1) {
      console.log("Login successful:", result);
      store.commit('setUsername', formState.username);
      store.commit('setPassword', formState.password);
      router.push({ path: '/Trang-chu'});
    } else {
      console.error("Login failed:", result);
      switch (result) {
        case 0:
          errorMessage.value = "Tài khoản không tồn tại.";
          break;
        case -1:
          errorMessage.value = "Lỗi hệ thống.";
          break;
        case -2:
          errorMessage.value = "Tài khoản chưa được kích hoạt.";
          break;
        case -3:
          errorMessage.value = "Tài khoản đã bị khóa.";
          break;
        case -4:
          errorMessage.value = "Sai thông tin đăng nhập quá 5 lần. Tài khoản đã bị khóa.";
          break;
        case -5:
          errorMessage.value = "Sai thông tin đăng nhập.";
          break;
        default:
          errorMessage.value = "Đăng nhập thất bại. Vui lòng thử lại.";
      }
      isErrorDialogVisible.value = true;
    }
  } catch (error) {
    console.error("An error occurred during login:", error);
  }
};

const onFinishFailed = (errorInfo) => {
  console.log('Failed:', errorInfo);
};

// Define custom validation rules
defineRule('required', (value) => {
  return value ? true : 'Hãy nhập thông tin này';
});

defineRule('email', (value) => {
  if (!value) {
    return 'Vui lòng điền email';
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return 'Email không xác định';
  }
  return true;
});

// Google login function
const loginWithGoogle = () => {
  const auth2 = window.gapi.auth2.getAuthInstance();
  auth2.signIn().then(googleUser => {
    const profile = googleUser.getBasicProfile();
    console.log('ID:', profile.getId());
    console.log('Name:', profile.getName());
    console.log('Image URL:', profile.getImageUrl());
    console.log('Email:', profile.getEmail());
    // Send the token to the server for further processing if needed
  }).catch(error => {
    console.error('Google Sign-In error:', error);
  });
};

onMounted(() => {
  const script = document.createElement('script');
  script.src = 'https://apis.google.com/js/platform.js';
  script.onload = () => {
    window.gapi.load('auth2', () => {
      window.gapi.auth2.init({
        client_id: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
      });
    });
  };
  document.head.appendChild(script);
});
</script>


<style scoped>
#components-form-demo-normal-login .login-form {
  max-width: 300px;
}

#components-form-demo-normal-login .login-form-forgot {
  float: right;
}

#components-form-demo-normal-login .login-form-button {
  width: 100%;
}

.wrapper {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f2f5;
}

.inner {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 20px;
}

.image-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.background-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(70%);
}

.text-overlay {
  position: absolute;
  top: 50%;
  left: 30%;
  transform: translate(-50%, -50%);
  text-align: left;
  color: #ffffff;
  padding: 20px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  max-width: 80%;
}

.login-box {
  background-color: #ffffff;
  padding: 40px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  width: 400px;
  max-width: 90%;
  height: auto;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  margin: 20px;
}

.logo {
  width: 150px;
  height: auto;
}

.password-toggle {
  cursor: pointer;
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
}

.password-toggle img {
  height: auto;
}

.or {
  color: #606770;
  margin: 20px 0;
  text-align: center;
}

.img {
  margin: 0 auto;
  display: block;
}

a i {
  margin-right: 8px;
}

.btn-toggle {
  background-color: transparent;
  border-color: blue;
}

@media (max-width: 768px) {
  .text-overlay {
    font-size: 14px;
    padding: 15px;
  }

  .login-box {
    width: 100%;
    padding: 30px;
  }
}
</style>