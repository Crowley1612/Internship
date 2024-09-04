<template>
  <div class="signUpForm container-fluid d-flex justify-content-center align-items-center min-vh-100">
    <VForm @submit.prevent="submitForm" class="w-100">
      <div class="login card shadow-sm p-4">
        <img src="@/assets/download.png" alt="" class="img">
        <h1 class="center card-title">Đăng ký tài khoản</h1>
        <div class="card-body">
          <div class="form-group mb-3">
            <Field name="username" rules="required" v-slot="{ field, meta }">
              <label for="username"><span class="required">*</span> Họ và tên</label>
              <input type="text" v-bind="field" placeholder="Nhập họ và tên"
                :class="['form-control', { 'is-invalid': meta.touched && meta.invalid }]"
                @input="handleInput(field, meta)" />
              <span v-if="meta.touched || meta.invalid" class="invalid-feedback">{{ meta.errors[0] }}</span>
            </Field>
          </div>
          <div class="form-group mb-3">
            <Field name="email" rules="required|email" v-slot="{ field, meta }">
              <label for="email"><span class="required">*</span> Email</label>
              <input type="text" v-bind="field" placeholder="Nhập email"
                :class="['form-control', { 'is-invalid': meta.touched && meta.invalid }]"
                @input="handleInput(field, meta)" />
              <span v-if="meta.touched || meta.invalid" class="invalid-feedback">{{ meta.errors[0] }}</span>
            </Field>
          </div>
          <div class="form-group mb-3">
            <Field name="tel" rules="required|min:10" v-slot="{ field, meta }">
              <label for="tel"><span class="required">*</span> Số điện thoại</label>
              <input type="tel" v-bind="field" placeholder="Nhập số điện thoại"
                :class="['form-control', { 'is-invalid': meta.touched && meta.invalid }]"
                @input="handleInput(field, meta)" />
              <span v-if="meta.touched || meta.invalid" class="invalid-feedback">{{ meta.errors[0] }}</span>
            </Field>
          </div>
          <div class="form-group mb-3">
            <Field name="org" v-slot="{ field }">
              <label for="org">Tên tổ chức</label>
              <input type="text" v-bind="field" placeholder="Nhập tên tổ chức" class="form-control" />
            </Field>
          </div>
          <div class="form-group mb-3">
            <Field name="tax" v-slot="{ field }">
              <label for="tax">Mã số thuế</label>
              <input type="text" v-bind="field" placeholder="Nhập mã số thuế" class="form-control" />
            </Field>
          </div>
          <button type="submit" class="btn btn-primary w-100">Gửi yêu cầu đăng ký</button>
          <p class="center-bottom mt-3">
            Bạn đã có tài khoản?
            <router-link to="/Dang-nhap" class="text-primary">Đăng nhập</router-link>
          </p>
        </div>
      </div>
    </VForm>
  </div>
</template>

<script>
import { useForm, Field, Form as VForm } from 'vee-validate';
import * as yup from 'yup';
import axios from 'axios';

export default {
  name: 'Signup',
  components: {
    VForm,
    Field
  },
  setup() {
    const { validate } = useForm({
      validationSchema: yup.object({
        username: yup.string().required('Họ và tên là bắt buộc.'),
        email: yup.string().email('Email không hợp lệ.').required('Email là bắt buộc.'),
        tel: yup.string()
          .matches(/^[0-9]+$/, 'Số điện thoại chỉ được chứa chữ số.')
          .min(10, 'Số điện thoại phải có ít nhất 10 chữ số.')
          .required('Số điện thoại là bắt buộc.'),
      })
    });

    const handleInput = (field, meta) => {
      if (field.value.trim().length != 0) {
        meta.valid = true;
        meta.touched = false;
        field.resetValidation();
      }
    };

    const submitForm = async () => {
      const isValid = await validate();
      if (!isValid) {
        alert('Vui lòng nhập đủ thông tin bắt buộc.');
        return;
      }

      const userData = {
        username: username.value,
        email: email.value,
        tel: tel.value,
        org: org.value,
        tax: tax.value
      };

      axios
        .post('your_api_endpoint', userData)
        .then(response => {
          alert('Đăng ký thành công!');
          console.log(response.data);
        })
        .catch(error => {
          console.error(error);
        });
    };

    return {
      submitForm,
      handleInput
    };
  }
};
</script>

<style scoped>
@import '@/assets/Signup.css';
</style>
