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
          src="../assets/d.png"
          alt="" class="img">
        <h1 class="text-center">Đăng nhập</h1>
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
                <button class="btn btn-outline-secondary" type="button" @click="togglePasswordVisibility">
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
            <a class="ms-3" href="#"><i class="bi bi-file-earmark-text"></i>Hướng dẫn sử dụng</a>
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
  width: 24px; /* Slightly larger icon */
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
