<template>
  <div class="background">
    <div class="modal-box">
      <div class="logo">

      </div>
      <h2>Gửi yêu cầu đăng ký thành công</h2>
      <p>
        Xác nhận yêu cầu đăng ký đã được gửi về <strong>{{ email }}</strong>.
        Kiểm tra hòm thư và ấn vào Kích hoạt để hoàn tất quá trình đăng ký.
      </p>
      <button @click="handleOk">Đã hiểu</button>
    </div>
  </div>
</template>

<script setup>
import {reactive} from 'vue';
import { defineRule} from 'vee-validate';
import axios from 'axios'; // Import axios if not already imported
import { useRouter } from 'vue-router';

const router = useRouter();

const formState = reactive({
  username: '',
  password: '',
  remember: true,
});

const signIn = async () => {
  const soapRequest = `
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
                   xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
                   xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
      <soap:Body>
        <Dangnhap xmlns="http://tempuri.org/">
          <Tendn>${formState.username}</Tendn>
          <matkhau>${formState.password}</matkhau>
        </Dangnhap>
      </soap:Body>
    </soap:Envelope>`;

  try {
    const response = await axios.post(
      'https://apiedoc.nacencomm.vn/apiEdoc.asmx',
      soapRequest,
      {
        headers: {
          'Content-Type': 'text/xml',
          'SOAPAction': 'http://tempuri.org/Dangnhap',
        },
      }
    );

    if (response.data) {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(response.data, "text/xml");
      const result = parseInt(xmlDoc.getElementsByTagName("DangnhapResult")[0].textContent, 10);

      switch (result) {
        case 1:
          console.log('Đăng nhập thành công');
          router.push('/Trang-chu');
          break;
        case 0:
          console.error('Tài khoản không tồn tại');
          break;
        case -1:
          console.error('Lỗi hệ thống');
          break;
        case -2:
          console.error('Tài khoản chưa được kích hoạt');
          break;
        case -3:
          console.error('Tài khoản đã bị khóa');
          break;
        case -4:
          console.error('Sai thông tin đăng nhập quá 5 lần. Tài khoản đã bị khóa');
          break;
        case -5:
          console.error('Sai thông tin đăng nhập');
          break;
        default:
          console.error('Lỗi không xác định');
      }
    }
  } catch (error) {
    console.error('Login failed:', error);
  }
};

defineRule('required', (value) => {
  if (!value) {
    return 'Hãy nhập thông tin này';
  }
  return true;
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

OnMounted(() => {
  signIn();
});
</script>


<style scoped>
.background {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: url('https://ca2sp.nacencomm.vn/assets/bg-8d54c696.png') no-repeat center center;
  background-size: cover;
}

.modal-box {
  background-color: #ffffff;
  padding: 30px 20px;
  width: 400px;
  text-align: center;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  color: #333333;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  width: auto;
  height: auto;
}

.logo img {
  width: 60px;
  height: auto;
}

h2 {
  font-size: 22px;
  margin: 15px 0;
  color: #333333;
}

p {
  font-size: 16px;
  color: #555555;
}

button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #3b82f6;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #2563eb;
}
</style>
