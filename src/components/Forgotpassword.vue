<template>
  <div class="vue-template">
    <form>
      <h1>Quên mật khẩu</h1>
      <p class="description">Nhập địa chỉ email của bạn để nhận hướng dẫn khôi phục mật khẩu</p>
      <div class="form-group">
        <label>Địa chỉ email</label>
        <input type="email" class="form-control form-control-lg" placeholder="Nhập địa chỉ email" />
      </div>
      <button type="submit" class="btn btn-primary btn-lg btn-block">Tạo lại mật khẩu</button>
    </form>
    <div class="goback">
      <router-link to="/Dang-nhap" class="btn btn-secondary btn-lg btn-block mt-3">Quay lại trang đăng
        nhập</router-link>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  }
}
</script>

<style scoped>
.vue-template {
  max-width: 500px;
  margin: 50px auto;
  padding: 30px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  font-family: 'Arial', sans-serif;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

.description {
  text-align: center;
  color: #777;
  margin-bottom: 30px;
  font-size: 16px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 10px;
  color: #555;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 15px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.3s, box-shadow 0.3s;
}

input:focus {
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

.btn {
  padding: 15px;
  font-size: 18px;
  transition: background-color 0.3s, border-color 0.3s;
}

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
  color: #fff;
}

.btn-primary:hover {
  background-color: #0056b3;
  border-color: #004085;
}

.btn-secondary {
  background-color: #6c757d;
  border-color: #6c757d;
  color: #fff;
}

.btn-secondary:hover {
  background-color: #5a6268;
  border-color: #545b62;
}

.btn-block {
  width: 100%;
  margin-top: 10px;
}

.mt-3 {
  margin-top: 15px;
}

.goback {
  text-align: center;
  margin-top: 40px;
}
</style>