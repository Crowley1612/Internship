<template>
  <div class="container-fluid h-100">
    <div class="row h-100">
      <!-- Sidebar Component -->
      <Sidebar />
      <div class="col-md-10 p-4">
        <!-- Header Component -->
        <Header />
        <!-- Navbar Component -->
        <Navbar />
        <div class="container mt-5">
          <div class="row">
            <!-- Left Column (Email Form) -->
            <div class="col-md-8">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Email gửi người nhận</h5>
                        <form>
                            <div class="mb-3">
                                <label for="emailSubject" class="form-label">Tiêu đề Email</label>
                                <input type="text" class="form-control" id="emailSubject" value="a.pdf">
                            </div>
                            <div class="mb-3">
                                <label for="emailContent" class="form-label">Nội dung Email</label>
                                <textarea class="form-control" id="emailContent" rows="3"></textarea>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <!-- Right Section -->
            <div class="col-md-4">
                <!-- General Info -->
                <div class="card mb-4">
                    <div class="card-body">
                        <h5 class="card-title">Thông tin chung</h5>
                        <p><strong>Người gửi:</strong> Đỗ Thị Thu Hằng 1</p>
                        <p><strong>Tài liệu:</strong></p>
                        <ul class="list-group">
                            <li class="list-group-item"><i class="bi bi-file-earmark-text"></i> a.pdf</li>
                        </ul>
                    </div>
                </div>

                <!-- Recipients Info -->
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Người nhận</h5>
                        <ul class="list-group">
                            <li class="list-group-item">
                                <p class="mb-0">1. Hằng</p>
                                <small>hangtt.smile@gmail.com</small>
                                <p class="mb-0">Trình tự ký: 1</p>
                            </li>
                            <li class="list-group-item">
                                <p class="mb-0">2. Đỗ Thị Thu Hằng</p>
                                <small>hangtt@cavn.vn</small>
                                <p class="mb-0">Trình tự ký: 2</p>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
          </div>
          <!-- Buttons -->
          <div class="d-flex mt-4">
            <button class="btn btn-secondary" @click="goBack">Quay lại</button>
            <button class="btn btn-primary" @click="confirmAndSend">Xác nhận và gửi</button>
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

const file = ref({ name: 'a.pdf' }); // Initialize the file object
const senderName = ref('Người gửi không xác định'); // Default value

// Load sender name from local storage
const loadSenderName = () => {
  const savedData = localStorage.getItem('formData');
  if (savedData) {
    const data = JSON.parse(savedData);
    senderName.value = (data.signers && data.signers.length > 0) ? data.signers[0].name : 'Người gửi không xác định';
  } else {
    senderName.value = 'Người gửi không xác định';
  }
};

onMounted(() => {
  loadSenderName();
});

const goBack = () => {
  router.back(); // Navigate back to the previous page
};

const confirmAndSend = () => {
  alert('Xác nhận và gửi thành công!');
  router.push('/Trang-chu'); // Navigate to another page
};

// Use a computed property for the sender's name
const sender = computed(() => senderName.value);
</script>

<style scoped>
@import '@/assets/MasterPage.css';
/* Apply red border to the right column cards */
.red-border {
  border: 1px solid #d9534f;
  border-radius: 4px;
}

.card-title {
  margin-bottom: 15px;
}

.card {
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

/* Recipient list styling */
.recipient-item {
  border: 1px solid #d9534f;
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 10px;
}

.btn {
  border-radius: 5px;
  height: fit-content;
}
</style>