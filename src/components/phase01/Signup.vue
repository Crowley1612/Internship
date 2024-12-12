<template>
  <div class="signUpForm container-fluid d-flex justify-content-center align-items-center min-vh-100">
    <VForm @submit="submitForm" class="w-100">
      <div class="login card shadow-sm p-4">
        <img src="C:/Users/Shinei/Desktop/Vuejs/ca2-platform/src/assets/download.png" alt="" class="img">
        <h1 class="center card-title">Đăng ký tài khoản</h1>
        <div class="card-body">
          <div class="form-group mb-3">
            <Field name="username" rules="required" v-slot="{ field, meta }">
              <label for="username"><span class="required">*</span> Họ và tên</label>
              <input type="text" v-bind="field" placeholder="Nhập họ và tên"
                :class="['form-control', { 'is-invalid': meta.touched && meta.invalid }]" />
              <span v-if="meta.touched && meta.invalid" class="invalid-feedback">{{ meta.errors[0] }}</span>
            </Field>
          </div>
          <div class="form-group mb-3">
            <Field name="email" rules="required|email" v-slot="{ field, meta }">
              <label for="email"><span class="required">*</span> Email</label>
              <input type="text" v-bind="field" placeholder="Nhập email"
                :class="['form-control', { 'is-invalid': meta.touched && meta.invalid }]" />
              <span v-if="meta.touched && meta.invalid" class="invalid-feedback">{{ meta.errors[0] }}</span>
            </Field>
          </div>
          <div class="form-group mb-3">
            <Field name="tel" rules="required|min:10" v-slot="{ field, meta }">
              <label for="tel"><span class="required">*</span> Số điện thoại</label>
              <input type="tel" v-bind="field" placeholder="Nhập số điện thoại"
                :class="['form-control', { 'is-invalid': meta.touched && meta.invalid }]" />
              <span v-if="meta.touched && meta.invalid" class="invalid-feedback">{{ meta.errors[0] }}</span>
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
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

export default {
  name: 'Signup',
  components: {
    VForm,
    Field,
  },
  setup() {
    const router = useRouter();
    const store = useStore();
    const { validate, values } = useForm({
      validationSchema: yup.object({
        username: yup.string().required('Họ và tên là bắt buộc.'),
        email: yup.string().email('Email không hợp lệ.').required('Email là bắt buộc.'),
        tel: yup.string().min(10, 'Số điện thoại phải có ít nhất 10 chữ số.').required('Số điện thoại là bắt buộc.'),
      })
    });

    const createSoapEnvelope = (method, parameters) => {
      return `
        <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
          <soap12:Body>
            <${method} xmlns="http://tempuri.org/">
              ${parameters}
            </${method}>
          </soap12:Body>
        </soap12:Envelope>`;
    };

    const parseXmlResponse = (xmlString, tagName) => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, "text/xml");
      return xmlDoc.getElementsByTagName(tagName)[0]?.childNodes[0]?.nodeValue || null;
    };

    const activateAccount = async (email) => {
      try {
        const response = await axios.post(
          'https://apiedoc.nacencomm.vn/apiEdoc.asmx?op=Kichhoattaikhoan',
          createSoapEnvelope('Kichhoattaikhoan', `<Taikhoan>${email}</Taikhoan>`),
          { headers: { 'Content-Type': 'application/soap+xml' } }
        );
        return parseXmlResponse(response.data, "KichhoattaikhoanResult");
      } catch (error) {
        console.error('Activation error:', error);
        return null;
      }
    };

    const handleResponse = async (response, email) => {
      const result = parseXmlResponse(response, "DangkyResult");
      if (result == 1) {
        const activationResult = await activateAccount(email);
        if (activationResult == 1) {
          store.dispatch('updateEmail', email);
          alert('Đăng ký thành công! Vui lòng kiểm tra email để kích hoạt tài khoản.');
          router.push('/Xac-nhan-email');
        } else {
          alert('Kích hoạt không thành công. Vui lòng thử lại.');
        }
      } else {
        alert('Đăng ký không thành công. Vui lòng thử lại.');
      }
    };

    const submitForm = async (values1) => {
      const parameters = `
        <TTDangky>
          <Email>${values1.email}</Email>
          <Hoten>${values1.username}</Hoten>
          <Sodienthoai>${values1.tel}</Sodienthoai>
          <Masothue>${values1.tax || ""}</Masothue>
          <Tentochuc>${values1.org || ""}</Tentochuc>
        </TTDangky>`;
      try {
        const response = await axios.post(
          'https://apiedoc.nacencomm.vn/apiEdoc.asmx',
          createSoapEnvelope('Dangky', parameters),
          { headers: { 'Content-Type': 'application/soap+xml' } }
        );
        await handleResponse(response.data, values1.email);
      } catch (error) {
        console.error('Registration error:', error);
      }
    };

    return {
      submitForm,
    };
  },
};
</script>

<style scoped>
@import "@/assets/Signup.css";
</style>