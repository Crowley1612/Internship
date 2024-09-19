<template>
    <div class="container-fluid h-100">
      <div class="row h-100">
        <Sidebar />
        <div class="col-md-10 p-4">
          <Header />
          <Navbar />
          <div class="content-container mt-5">
            <div class="row">
              <h1 class="page-title">Email gửi người nhận</h1>
              <div class="panel-container">
                <!-- Left Panel: Email Form -->
                <div class="left-panel card shadow-sm p-4">
                  <div class="section">
                    <label class="section-title" for="email-title">* Tiêu đề Email</label>
                    <input class="input-field" type="text" id="email-title" v-model="file.name">
                  </div>
                  <div class="section">
                    <label class="section-title" for="email-content">Nội dung Email</label>
                    <textarea class="input-field" id="email-content" rows="4" placeholder="Nhập nội dung Email"></textarea>
                  </div>
                </div>
  
                <!-- Right Panel: Info Cards -->
                <div class="right-panel card shadow-sm p-4">
                  <div class="section">
                    <div class="section-title">Thông tin chung</div>
                    <p><strong>Người gửi:</strong> {{ sender }}</p>
                    <p><strong>Tài liệu:</strong> {{ file.name }}</p>
                  </div>
                  <div class="section">
                    <div class="section-title">Người nhận</div>
                    <div class="recipient" v-for="(recipient, index) in recipients" :key="index">
                      <p><strong>{{ index + 1 }}. {{ recipient.name }}</strong></p>
                      <p>{{ recipient.email }}</p>
                      <p><em>Trình tự kí:</em> {{ recipient.signOrder }}</p>
                    </div>
                  </div>
                </div>
              </div>
  
              <!-- Action Buttons -->
              <div class="button-container">
                <button class="btn btn-secondary" @click="goBack">Quay lại</button>
                <button class="btn btn-primary" @click="confirmAndSend">Xác nhận và gửi</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import Navbar from '../layout/Processing.vue';
  import Sidebar from '../layout/Sidebar.vue';
  import Header from '../layout/Header.vue';
  
  const router = useRouter();
  
  const file = ref({ name: 'a.pdf' });
  const senderName = ref('Người gửi không xác định');
  
  const loadSenderName = () => {
    const savedData = localStorage.getItem('formData');
    if (savedData) {
      const data = JSON.parse(savedData);
      senderName.value = (data.signers && data.signers.length > 0) ? data.signers[0].name : 'Người gửi không xác định';
    }
  };
  
  onMounted(() => {
    loadSenderName();
  });
  
  const goBack = () => {
    router.back();
  };
  
  const confirmAndSend = () => {
    alert('Xác nhận và gửi thành công!');
    router.push('/Trang-chu');
  };
  
  const sender = computed(() => senderName.value);
  
  const recipients = ref([
    { name: 'Hằng', email: 'hangdtt.smile@gmail.com', signOrder: 1 },
    { name: 'Đỗ Thị Thu Hằng', email: 'hangdtt@cavn.vn', signOrder: 2 }
  ]);
  </script>
  
  <style scoped>
  body {
    font-family: 'Poppins', sans-serif;
    background-color: #f9f9f9;
  }
  
  .page-title {
    font-size: 2rem;
    font-weight: 600;
    margin-bottom: 30px;
  }
  
  .panel-container {
    display: flex;
    justify-content: space-between;
    gap: 2%;
  }
  
  .left-panel,
  .right-panel {
    width: 48%;
  }
  
  .left-panel {
    background-color: #fff;
    border-radius: 10px;
  }
  
  .right-panel {
    background-color: #fff;
    border-radius: 10px;
  }
  
  .section {
    margin-bottom: 20px;
  }
  
  .section-title {
    font-weight: 600;
    margin-bottom: 10px;
  }
  
  .input-field {
    width: 100%;
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 1rem;
    background-color: #f7f7f7;
  }
  
  textarea.input-field {
    resize: none;
  }
  
  .recipient {
    background-color: #f5f5f5;
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 10px;
    border: 1px solid #eee;
  }
  
  .recipient p {
    margin: 0;
  }
  
  .button-container {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
  
  .btn {
    padding: 12px 20px;
    font-size: 1rem;
    border-radius: 8px;
    transition: background-color 0.3s;
  }
  
  .btn-primary {
    background-color: #007bff;
    color: white;
    border: none;
  }
  
  .btn-primary:hover {
    background-color: #0056b3;
  }
  
  .btn-secondary {
    background-color: #6c757d;
    color: white;
    border: none;
  }
  
  .btn-secondary:hover {
    background-color: #5a6268;
  }
  
  .card {
    border: none;
  }
  </style>
  