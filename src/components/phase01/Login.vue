<template>
  <div class="wrapper">
    <div class="image-container">
      <img src="https://ca2sp.nacencomm.vn/assets/bg-8d54c696.png" alt="Background Image" class="background-image" />
      <div class="text-overlay">
        <h1>Trải nghiệm ký số trên di động<br>với Ca2 Remote Signing</h1>
        <p>Ký ngay trên thiết bị di động, không cần USB Token. Giúp bạn làm việc từ xa<br>tại một nơi duy nhất</p>
      </div>
    </div>
    <div class="inner">
      <div class="login-box container bg-light p-4 rounded shadow-sm">
        <img
          src="data:image/png;base64,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"
          alt="" class="img">
        <h1 class="text-center">Chào mừng bạn trở lại!</h1>
        <Form @submit="handleSubmit" v-slot="{ errors }">
          <div class="form-group">
            <label for="email" class="form-label">Tài khoản (E-mail)</label>
            <Field name="email" type="email" :rules="emailRules" v-slot="{ field, meta }">
              <input v-bind="field" id="email" placeholder="nguyenvanan@acb.vn" class="form-control"
                @input="handleInput('email', meta)" @blur="handleBlur('email', meta)" />
              <span class="text-danger" v-if="showErrors.email">{{ meta.errors[0] }}</span>
            </Field>
          </div>
          <div class="form-group mt-3">
            <label for="password" class="form-label">Mật Khẩu</label>
            <Field name="password" :rules="passwordRules" v-slot="{ field, meta }">
              <div class="input-group">
                <input v-bind="field" :type="passwordFieldType" id="password" placeholder="•••••••" class="form-control"
                  @input="handleInput('password', meta)" @blur="handleBlur('password', meta)" />
                <button class="btn-toggle" type="button" @click="togglePasswordVisibility">
                  <img
                    :src="passwordFieldType === 'password' ? 'https://www.svgrepo.com/show/532465/eye-slash.svg' : 'https://www.svgrepo.com/show/532493/eye.svg'"
                    alt="Toggle Password Visibility" style="width: 20px;">
                </button>
              </div>
              <span class="text-danger" v-if="showErrors.password">{{ meta.errors[0] }}</span>
            </Field>
          </div>
          <router-link class="nav-link text-white" to="/Trang-chu" exact-active-class="active-link">
            <button type="submit" class="btn btn-primary w-100 mt-3">
              Đăng nhập
            </button>
          </router-link>
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
        </Form>
      </div>
    </div>
  </div>
</template>

<script>
import { Field, Form, defineRule } from 'vee-validate';
import { required, email } from '@vee-validate/rules';

defineRule('required', (value) => {
  if (!value) {
    return 'Vui lòng điền thông tin';
  }
  return true;
});

defineRule('email', (value) => {
  if (!value) {
    return 'Vui lòng điền thông tin';
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return 'Email không xác định';
  }
  return true;
});

export default {
  name: 'Login',
  components: {
    Field,
    Form,
  },
  data() {
    return {
      form: {
        email: '',
        password: '',
      },
      passwordFieldType: 'password',
      emailRules: 'required|email',
      passwordRules: 'required',
      showErrors: {
        email: false,
        password: false,
      },
    };
  },
  methods: {
    handleInput(field, meta) {
      this.showErrors[field] = meta.errors.length > 0 && !meta.value;
      meta.touched = true;
      this.$refs.form.validateField(field);
    },
    handleBlur(field, meta) {
      this.showErrors[field] = meta.errors.length > 0;
    },
    handleSubmit() {
      this.$refs.form.validate().then(success => {
        if (success) {
          console.log('Form submitted', this.form);
        } else {
          console.log('Validation failed');
        }
      });
    },
    togglePasswordVisibility() {
      this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
    },
    loginWithGoogle() {
      console.log('Login with Google');
    }
  },
};
</script>

<style scoped>
.wrapper {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f2f5; /* Softer background color */
}

.inner {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 20px; /* Adds spacing between elements */
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
  background: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3); /* Add shadow for depth */
  max-width: 80%; /* Prevents text from stretching too wide */
}

.login-box {
  background-color: #F5F5F5;
  padding: 40px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1); /* Slightly stronger shadow */
  width: 400px; /* Fixed width for better alignment */
  max-width: 90%; /* Ensure responsiveness */
  height: auto;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 10px; /* Rounded corners */
  margin: 20px;
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
  margin-right: 8px; /* Adjust the spacing as needed */
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
