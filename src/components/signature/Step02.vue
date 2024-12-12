<template>
  <div class="container-fluid h-100">
    <div class="row h-100">
      <Sidebar />
      <main class="col-md-10 p-4">
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
                    placeholder="Tìm kiếm theo tên hoặc email" id="contactSearchInput"
                    aria-label="Tìm kiếm theo tên hoặc email" />
                </div>
                <ul class="list-group">
                  <li v-for="contact in filteredContacts" :key="contact.email"
                    class="list-group-item list-group-item-action d-flex align-items-center"
                    @click="selectContact(contact)" role="button" aria-label="Chọn {{ contact.name }}">
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
        <section class="mb-5">
          <h3 class="mb-4">Thêm người ký</h3>
          <div v-for="(signer, index) in signers" :key="index" class="card mb-3">
            <div class="card-header d-flex justify-content-between align-items-center">
              <span class="fw-bold">Người ký {{ index + 1 }}</span>
              <button class="btn btn-danger btn-sm" @click="confirmRemoveSigner(index, 'signer')"
                aria-label="Xóa người ký {{ index + 1 }}">
                🗑️
              </button>
            </div>
            <div class="card-body">
              <div class="row g-3 align-items-center">
                <div class="col-auto">
                  <label for="signer-name-{{ index }}" class="col-form-label">Họ và tên</label>
                </div>
                <div class="col-auto">
                  <input type="text" v-model="signer.name" :id="'signer-name-' + index" class="form-control"
                    :class="{ 'is-invalid': signerErrors[index]?.name }" placeholder="Nhập họ và tên"
                    aria-label="Họ và tên" />
                </div>
                <div class="col-auto">
                  <label for="signer-email-{{ index }}" class="col-form-label">
                    Email <span class="text-danger">*</span>
                  </label>
                </div>
                <div class="col-auto">
                  <input type="email" v-model="signer.email" :id="'signer-email-' + index" class="form-control"
                    :class="{ 'is-invalid': signerErrors[index]?.email }" placeholder="Nhập email" required
                    aria-label="Email" />
                </div>
                <div class="col-auto">
                  <div v-if="signerErrors[index]?.email" class="invalid-feedback">
                    {{ signerErrors[index].email }}
                  </div>
                </div>
                <div class="col-auto">
                  <label class="col-form-label">Hình thức ký</label>
                </div>
                <div class="col-auto">
                  <select v-model="signer.method" class="form-select" aria-label="Hình thức ký">
                    <option>Ký số</option>
                    <option>Phê duyệt ký điện tử</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-3">
            <button class="btn btn-primary me-2" @click="addEntry('signer')">
              + Thêm người ký
            </button>
            <button class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#contactModal"
              @click="setEntryType('signer')" aria-label="Chọn người ký từ danh bạ">
              Chọn từ danh bạ
            </button>
          </div>
        </section>

        <!-- Add Recipients Section -->
        <section class="mb-5">
          <h3 class="mb-4">Thêm người nhận bản sao</h3>
          <div v-for="(recipient, index) in recipients" :key="index" class="card mb-3">
            <div class="card-header d-flex justify-content-between align-items-center">
              <span class="fw-bold">Người nhận {{ index + 1 }}</span>
              <button class="btn btn-danger btn-sm" @click="confirmRemoveSigner(index, 'recipient')"
                aria-label="Xóa người nhận {{ index + 1 }}">
                🗑️
              </button>
            </div>
            <div class="card-body">
              <div class="row g-3 align-items-center">
                <div class="col-auto">
                  <label for="recipient-name-{{ index }}" class="col-form-label">Họ và tên</label>
                </div>
                <div class="col-auto">
                  <input type="text" v-model="recipient.name" :id="'recipient-name-' + index" class="form-control"
                    :class="{ 'is-invalid': recipientErrors[index]?.name }" placeholder="Nhập họ và tên"
                    aria-label="Họ và tên" />
                </div>
                <div class="col-auto">
                  <label for="recipient-email-{{ index }}" class="col-form-label">
                    Email <span class="text-danger">*</span>
                  </label>
                </div>
                <div class="col-auto">
                  <input type="email" v-model="recipient.email" :id="'recipient-email-' + index" class="form-control"
                    :class="{ 'is-invalid': recipientErrors[index]?.email }" placeholder="Nhập email" required
                    aria-label="Email" />
                </div>
                <div class="col-auto">
                  <div v-if="recipientErrors[index]?.email" class="invalid-feedback">
                    {{ recipientErrors[index].email }}
                  </div>
                </div>
                <div class="col-auto">
                  <label class="col-form-label">Hình thức nhận</label>
                </div>
                <div class="col-auto">
                  <select v-model="recipient.method" class="form-select" disabled aria-label="Hình thức nhận">
                    <option>Nhận bản sao</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-3">
            <button class="btn btn-primary me-2" @click="addEntry('recipient')">
              + Thêm người nhận bản sao
            </button>
            <button class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#contactModal"
              @click="setEntryType('recipient')" aria-label="Chọn người nhận từ danh bạ">
              Chọn từ danh bạ
            </button>
          </div>
        </section>

        <!-- Navigation Buttons -->
        <div class="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
          <button class="btn btn-secondary me-md-2" type="button" @click="handleBack">
            Quay lại
          </button>
          <button class="btn btn-primary" type="button" @click="handleNext">
            Tiếp tục
          </button>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted, nextTick } from 'vue';
import axios from 'axios';
import Sidebar from '../layout/Sidebar.vue';
import Header from '../layout/Header.vue';
import Navbar from '../layout/Processing.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

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
const showErrors = ref(false);

const filteredContacts = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return contacts.value.filter(contact =>
    contact.name.toLowerCase().includes(query) || contact.email.toLowerCase().includes(query)
  );
});

onMounted(() => {
  loadContacts();
  loadSavedData();
});

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
  }, 5000);
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
  // validateForm();
};

// Confirm before removing a signer or recipient
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

// Select contact for signer or recipient
const selectContact = (contact) => {
  const targetList = entryType.value === 'signer' ? signers : recipients;
  const errorsList = entryType.value === 'signer' ? signerErrors : recipientErrors;

  const emptyEntry = targetList.value.find(entry => !entry.name && !entry.email);
  if (emptyEntry) {
    emptyEntry.name = contact.name;
    emptyEntry.email = contact.email;
  } else {
    targetList.value.push({ name: contact.name, email: contact.email, method: entryType.value === 'signer' ? 'Ký số' : 'Nhận bản sao' });
    errorsList.value.push({});
  }
  closeModal(); // Close modal after selecting contact
};

const setEntryType = (type) => {
  entryType.value = type;
};

// Form validation for required email and format
const validateForm = () => {
  const validateEntries = (entries, errors) => {

    let isValid = true;
     entries.forEach((entry, index) => {
      if (!entry.email) {
        errors[index].email = 'Email là bắt buộc.'; 
        isValid = false;
      } else if (!isValidEmail(entry.email)) {
        errors[index].email = 'Sai định dạng email.';
        isValid = false;
      } else {
        errors[index].email = '';
      }
    });
    return isValid;
  };

  const signersValid = validateEntries(signers.value, signerErrors.value);
  const recipientsValid = validateEntries(recipients.value, recipientErrors.value);

  return signersValid && recipientsValid;
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Navigation methods
const handleBack = () => {
  router.push('/Chinh-sua-van-ban');
};

const handleNext = () => {
  showErrors.value = true; // Show errors if any
  const isValid = validateForm();

  if (isValid) {
    const data = {
      signers: signers.value,
      recipients: recipients.value,
    };

    localStorage.setItem('signersRecipientsData', JSON.stringify(data));
    router.push('/Thiet-lap-vung-ky');
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

.invalid-feedback {
  display: block;
  margin-top: 0.25rem;
}
</style>