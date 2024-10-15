<template>
  <div class="container-fluid h-100">
    <div class="row h-100">
      <Sidebar />
      <div class="col-md-10 p-4">
        <Header />
        <Navbar />

        <!-- Modal for selecting from contacts -->
        <div class="modal fade" id="contactModal" tabindex="-1" aria-labelledby="contactModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="contactModalLabel">Chọn từ danh bạ</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <div class="mb-3">
                  <input type="text" v-model="searchQuery" class="form-control"
                    placeholder="Tìm kiếm theo tên hoặc email" />
                </div>
                <ul class="list-group">
                  <li v-for="contact in filteredContacts" :key="contact.email"
                    class="list-group-item list-group-item-action d-flex align-items-center"
                    @click="selectContact(contact)">
                    <img :src="contact.avatar" alt="Avatar" class="avatar-img me-3" />
                    <div>
                      <div>{{ contact.customer_name }}</div>
                      <div class="text-muted">{{ contact.email }}</div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Add Signers Section -->
        <div class="mb-5">
          <h3 class="mb-4">Thêm người ký</h3>
          <div v-for="(signer, index) in signers" :key="index" class="card mb-3">
            <div class="card-header d-flex justify-content-between align-items-center">
              <span class="fw-bold">Người ký {{ index + 1 }}</span>
              <button class="btn btn-danger btn-sm" @click="confirmRemoveSigner(index, 'signer')">🗑️</button>
            </div>
            <div class="card-body">
              <div class="row g-3 align-items-center">
                <div class="col-auto">
                  <label class="col-form-label">Họ và tên</label>
                </div>
                <div class="col-auto">
                  <input type="text" v-model="signer.name" class="form-control"
                    :class="{ 'is-invalid': signerErrors[index]?.name }" placeholder="Nhập họ và tên">
                </div>
                <div class="col-auto">
                  <a-form-item label="Email" name="email" :rules="[
                    { required: true, message: 'Hãy nhập email người dùng!' },
                    { type: 'email', message: 'Email không hợp lệ!' }
                  ]">
                    <a-input v-model:value="formState.email">
                      <template #prefix>
                        <UserOutlined class="site-form-item-icon" />
                      </template>
                    </a-input>
                  </a-form-item>
                </div>
                <div class="col-auto">
                  <label class="col-form-label">Hình thức ký</label>
                </div>
                <div class="col-auto">
                  <select v-model="signer.method" class="form-select">
                    <option>Ký số</option>
                    <option>Phê duyệt ký điện tử</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <button class="btn btn-primary" @click="addEntry('signer')">+ Thêm người ký</button>
          <button class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#contactModal"
            @click="setEntryType('signer')">Chọn từ danh bạ</button>
        </div>

        <!-- Add Recipients Section -->
        <div class="mb-5">
          <h3 class="mb-4">Thêm người nhận bản sao</h3>
          <div v-for="(recipient, index) in recipients" :key="index" class="card mb-3">
            <div class="card-header d-flex justify-content-between align-items-center">
              <span class="fw-bold">Người nhận {{ index + 1 }}</span>
              <button class="btn btn-danger btn-sm" @click="confirmRemoveSigner(index, 'recipient')">🗑️</button>
            </div>
            <div class="card-body">
              <div class="row g-3 align-items-center">
                <div class="col-auto">
                  <label class="col-form-label">Họ và tên</label>
                </div>
                <div class="col-auto">
                  <input type="text" v-model="recipient.name" class="form-control"
                    :class="{ 'is-invalid': recipientErrors[index]?.name }" placeholder="Nhập họ và tên">
                </div>
                <div class="col-auto">
                  <label class="col-form-label">Email <span class="text-danger">*</span></label>
                </div>
                <div class="col-auto">
                  <input type="email" v-model="recipient.email" class="form-control"
                    :class="{ 'is-invalid': recipientErrors[index]?.email }" placeholder="Nhập email" required>
                  <div v-if="showErrors && recipientErrors[index].email" class="error-message">
                    Vui lòng nhập đúng định dạng email.
                  </div>
                </div>
                <div class="col-auto">
                  <label class="col-form-label">Hình thức ký</label>
                </div>
                <div class="col-auto">
                  <select v-model="recipient.method" class="form-select" disabled>
                    <option>Nhận bản sao</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <button class="btn btn-primary" @click="addEntry('recipient')">+ Thêm người nhận bản sao</button>
          <button class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#contactModal"
            @click="setEntryType('recipient')">Chọn từ danh bạ</button>
        </div>

        <!-- Navigation Buttons -->
        <div class="d-grid gap-2 d-md-flex justify-content-md-end">
          <button class="btn btn-secondary me-md-2" type="button" @click="handleBack">Quay lại</button>
          <button class="btn btn-primary" type="button" @click="handleNext">Tiếp tục</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {  reactive, ref, computed, onMounted } from 'vue';
import axios from 'axios';
import Sidebar from '../layout/Sidebar.vue';
import Header from '../layout/Header.vue';
import Navbar from '../layout/Processing.vue';

const formState = reactive({
  email: '',
});
const onFinish = values => {
  console.log('Success:', values);
};
const onFinishFailed = errorInfo => {
  console.log('Failed:', errorInfo);
};
const disabled = computed(() => {
  return !(formState.username && formState.password);
});
// Reactive properties
const signers = ref([
  { name: '', email: '', method: 'Ký số' },
  { name: '', email: '', method: 'Ký số' },
]);
const recipients = ref([{ name: '', email: '', method: 'Nhận bản sao' }]);
const signerErrors = ref([{}, {}]);
const recipientErrors = ref([{}]);
const contacts = ref([]);
const searchQuery = ref('');
const entryType = ref('');
const showModal = ref(false);
const autoCloseTimeout = ref(null);
const showErrors = ref(false); // Controls error visibility

// Computed properties
const filteredContacts = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return contacts.value.filter(contact =>
    contact.name.toLowerCase().includes(query) || contact.email.toLowerCase().includes(query)
  );
});

// Lifecycle hooks
onMounted(() => {
  loadContacts();
  loadSavedData();
});

// Methods
const openModal = () => {
  showModal.value = true;
  autoCloseModal();
  nextTick(() => {
    const searchInput = document.getElementById('contactSearchInput');
    if (searchInput) {
      searchInput.focus();
    }
  });
};

const closeModal = () => {
  showModal.value = false;
  if (autoCloseTimeout.value) {
    clearTimeout(autoCloseTimeout.value);
  }
};

const autoCloseModal = () => {
  autoCloseTimeout.value = setTimeout(() => {
    closeModal();
  }, 5000); // Automatically close the modal after 5 seconds
};

const loadContacts = async () => {
  try {
    const response = await axios.get('http://localhost:3000/contacts');
    contacts.value = response.data;
  } catch (error) {
    console.error('Error loading contacts:', error);
  }
};

const addEntry = (type) => {
  const entry = { name: '', email: '', method: type === 'signer' ? 'Ký số' : 'Nhận bản sao' };
  if (type === 'signer') {
    signers.value.push(entry);
    signerErrors.value.push({});
  } else if (type === 'recipient') {
    recipients.value.push(entry);
    recipientErrors.value.push({});
  }
  validateForm();
};

const confirmRemoveSigner = (index, type) => {
  if (confirm('Bạn có chắc chắn muốn xóa người này không?')) {
    if (type === 'signer') {
      signers.value.splice(index, 1);
      signerErrors.value.splice(index, 1);
    } else if (type === 'recipient') {
      recipients.value.splice(index, 1);
      recipientErrors.value.splice(index, 1);
    }
  }
};

const selectContact = (contact) => {
  if (entryType.value === 'signer') {
    const emptySigner = signers.value.find(signer => !signer.name && !signer.email);
    if (emptySigner) {
      emptySigner.name = contact.name;
      emptySigner.email = contact.email;
    } else {
      signers.value.push({
        name: contact.name,
        email: contact.email,
        method: 'Ký số'
      });
      signerErrors.value.push({});
    }
  } else if (entryType.value === 'recipient') {
    const emptyRecipient = recipients.value.find(recipient => !recipient.name && !recipient.email);
    if (emptyRecipient) {
      emptyRecipient.name = contact.name;
      emptyRecipient.email = contact.email;
    } else {
      recipients.value.push({
        name: contact.name,
        email: contact.email,
        method: 'Nhận bản sao'
      });
      recipientErrors.value.push({});
    }
  }
  // Đóng modal sau khi chọn người
  nextTick(() => {
    const modalElement = document.getElementById('contactModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
    }
  });
};

const setEntryType = (type) => {
  entryType.value = type;
};

const validateForm = () => {
  const validateEntries = (entries, errors) => {
    return entries.every((entry, index) => {
      let isValid = true;
      // Removed name validation
      if (!entry.email || !isValidEmail(entry.email)) {
        errors[index].email = true;
        isValid = false;
      } else {
        errors[index].email = false;
      }
      return isValid;
    });
  };
  const signersValid = validateEntries(signers.value, signerErrors.value);
  const recipientsValid = validateEntries(recipients.value, recipientErrors.value);

  return signersValid && recipientsValid;
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const handleBack = () => {
  this.$router.push('/Chinh-sua-van-ban');
};

const handleNext = () => {
  showErrors.value = true; // Show errors if any
  const isValid = validateForm();

  if (isValid && signers.value.every(signer => signer.name && signer.email)) {
    // Lưu thông tin người ký và người nhận vào localStorage
    const data = {
      signers: signers.value,
      recipients: recipients.value,
    };

    // Chuyển đổi dữ liệu thành chuỗi JSON và lưu vào localStorage
    localStorage.setItem('signersRecipientsData', JSON.stringify(data));

    // Điều hướng đến trang tiếp theo sau khi lưu
    this.$router.push('/Thiet-lap-vung-ky');
  }
};

const loadSavedData = () => {
  const savedData = localStorage.getItem('signersRecipientsData');

  if (savedData) {
    const parsedData = JSON.parse(savedData);
    console.log("Signers and Recipients Data:", parsedData);
  } else {
    console.log("No data found in localStorage.");
  }
};
</script>

<style scoped>
@import '@/assets/AddPerson.css';
</style>