<template>
  <div
    class="signUpForm container-fluid d-flex justify-content-center align-items-center min-vh-100"
  >
    <VForm @submit="submitForm" class="w-100">
      <div class="login card shadow-sm p-4">
        <img src="@/assets/download.png" alt="" class="img" />
        <h1 class="center card-title">Đăng ký tài khoản</h1>
        <div class="card-body">
          <div class="form-group mb-3">
            <Field name="username" v-slot="{ field, meta }">
              <label for="username"
                ><span class="required">*</span> Họ và tên</label
              >
              <input
                v-bind="field"
                type="text"
                placeholder="Nhập họ và tên"
                :class="[
                  'form-control',
                  { 'is-invalid': meta.touched && meta.invalid },
                ]"
                @input="(e) => handleInput('username', e.target.value)"
              />
              <span
                v-if="meta.touched && meta.invalid"
                class="invalid-feedback"
              >
                {{ meta.errors[0] }}
              </span>
            </Field>
          </div>

          <div class="form-group mb-3">
            <Field name="email" v-slot="{ field, meta }">
              <label for="email"><span class="required">*</span> Email</label>
              <input
                v-bind="field"
                type="text"
                placeholder="Nhập email"
                :class="[
                  'form-control',
                  { 'is-invalid': meta.touched && meta.invalid },
                ]"
                @input="(e) => handleInput('email', e.target.value)"
              />
              <span
                v-if="meta.touched && meta.invalid"
                class="invalid-feedback"
              >
                {{ meta.errors[0] }}
              </span>
            </Field>
          </div>

          <div class="form-group mb-3">
            <Field name="tel" v-slot="{ field, meta }">
              <label for="tel"
                ><span class="required">*</span> Số điện thoại</label
              >
              <input
                v-bind="field"
                type="tel"
                placeholder="Nhập số điện thoại"
                :class="[
                  'form-control',
                  { 'is-invalid': meta.touched && meta.invalid },
                ]"
                @input="(e) => handleInput('tel', e.target.value)"
              />
              <span
                v-if="meta.touched && meta.invalid"
                class="invalid-feedback"
              >
                {{ meta.errors[0] }}
              </span>
            </Field>
          </div>

          <div class="form-group mb-3">
            <Field name="org" v-slot="{ field }">
              <label for="org">Tên tổ chức</label>
              <input
                v-bind="field"
                type="text"
                placeholder="Nhập tên tổ chức"
                class="form-control"
                @input="(e) => handleInput('org', e.target.value)"
              />
            </Field>
          </div>

          <div class="form-group mb-3">
            <Field name="tax" v-slot="{ field }">
              <label for="tax">Mã số thuế</label>
              <input
                v-bind="field"
                type="text"
                placeholder="Nhập mã số thuế"
                class="form-control"
                @input="(e) => handleInput('tax', e.target.value)"
              />
            </Field>
          </div>

          <button type="submit" class="btn btn-primary w-100">
            Gửi yêu cầu đăng ký
          </button>
          <p class="center-bottom mt-3">
            Bạn đã có tài khoản?
            <router-link to="/Dang-nhap" class="text-primary"
              >Đăng nhập</router-link
            >
          </p>
        </div>
      </div>
    </VForm>
  </div>
</template>

<script>
import { useForm, Field, Form as VForm } from "vee-validate";
import * as yup from "yup";
import axios from "axios";

export default {
  name: "Signup",
  components: {
    VForm,
    Field,
  },
  setup() {
    const { values, validate, setFieldValue } = useForm({
      initialValues: {
        username: "",
        email: "",
        tel: "",
        org: "",
        tax: "",
      },
      validationSchema: yup.object({
        username: yup.string().required("Họ và tên là bắt buộc."),
        email: yup
          .string()
          .email("Email không hợp lệ.")
          .required("Email là bắt buộc."),
        tel: yup
          .string()
          .matches(/^[0-9]+$/, "Số điện thoại chỉ được chứa chữ số.")
          .min(10, "Số điện thoại phải có ít nhất 10 chữ số.")
          .required("Số điện thoại là bắt buộc."),
        org: yup.string(),
        tax: yup.string(),
      }),
    });

    // Handle input changes and set field values
    const handleInput = (fieldName, value) => {
      setFieldValue(fieldName, value);
      console.log(`${fieldName}: ${value}`); // Log the field name and value
    };

    const submitForm = async () => {
      const isValid = await validate();
      if (!isValid) {
        alert("Vui lòng nhập đủ thông tin bắt buộc.");
        return;
      }

      const userData = {
        id: Date.now(),
        username: values.username,
        email: values.email,
        tel: values.tel,
        org: values.org,
        tax: values.tax,
      };

      console.log("User data to be submitted:", userData); // Log data before submission

      try {
        const response = await axios.post(
          "http://localhost:3003/users",
          userData
        );
        console.log("Response from server:", response.data);
        alert("Đăng ký thành công!");
      } catch (error) {
        console.error(
          "Error during registration:",
          error.response ? error.response.data : error
        );
      }
    };

    return {
      submitForm,
      handleInput, // Use handleInput for updating field values
      values, // Ensure that values are returned to the template for v-model binding
    };
  },
};
</script>

<style scoped>
@import "@/assets/Signup.css";
</style>
