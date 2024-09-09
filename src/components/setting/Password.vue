<template>
    <div class="change-password-container">
      <h2>Thay đổi mật khẩu</h2>
      <p>
        Mật khẩu yêu cầu có tối thiểu 6 ký tự bao gồm số, chữ cái thường, chữ cái in hoa,
        ký tự đặc biệt.
      </p>
  
      <!-- Password Form -->
      <a-form
        :model="passwordForm"
        :rules="rules"
        layout="vertical"
        @submit="handleSubmit"
      >
        <!-- Old Password Field -->
        <a-form-item
          label="Mật khẩu cũ"
          name="oldPassword"
          required
        >
          <a-input-password
            v-model="passwordForm.oldPassword"
            placeholder="Nhập mật khẩu cũ"
          />
        </a-form-item>
  
        <!-- New Password Field -->
        <a-form-item
          label="Mật khẩu mới"
          name="newPassword"
          required
        >
          <a-input-password
            v-model="passwordForm.newPassword"
            placeholder="Nhập mật khẩu mới"
          />
        </a-form-item>
  
        <!-- Confirm New Password Field -->
        <a-form-item
          label="Xác nhận mật khẩu mới"
          name="confirmPassword"
          required
        >
          <a-input-password
            v-model="passwordForm.confirmPassword"
            placeholder="Nhập lại mật khẩu mới"
          />
        </a-form-item>
  
        <!-- Action Buttons -->
        <a-form-item>
          <a-button class="cancel-button" @click="handleCancel">Hủy</a-button>
          <a-button type="primary" html-type="submit">Xác nhận</a-button>
        </a-form-item>
      </a-form>
    </div>
  </template>
  
  <script>
  export default {
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
    },
  };
  </script>
  
  <style scoped>
  .change-password-container {
    max-width: 600px;
    margin: 0 auto;
  }
  
  h2 {
    font-size: 1.5rem;
    font-weight: bold;
  }
  
  p {
    margin-bottom: 1.5rem;
    color: #888;
  }
  
  .cancel-button {
    margin-right: 1rem;
  }
  </style>
  