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
                      <div>{{ contact.name }}</div>
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
                  <label class="col-form-label">Email <span class="text-danger">*</span></label>
                </div>
                <div class="col-auto">
                  <input type="email" v-model="signer.email" class="form-control"
                    :class="{ 'is-invalid': signerErrors[index]?.email }" placeholder="Nhập email" required>
                  <div v-if="showErrors && signerErrors[index].email" class="error-message">
                    Vui lòng nhập đúng định dạng email.
                  </div>
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

<script>
import axios from 'axios';
import Sidebar from '../layout/Sidebar.vue';
import Header from '../layout/Header.vue';
import Navbar from '../Processing.vue';

export default {
  name: 'AddPerson',
  components: {
    Header,
    Sidebar,
    Navbar
  },
  data() {
    return {
      signers: [
        { name: '', email: '', method: 'Ký số' },
        { name: '', email: '', method: 'Ký số' }
      ],
      recipients: [{ name: '', email: '', method: 'Nhận bản sao' }],
      signerErrors: [{}, {}],
      recipientErrors: [{}],
      contacts: [],
      searchQuery: '',
      entryType: '',
      showModal: false,
      autoCloseTimeout: null,
      showErrors: false, // Controls error visibility
    };
  },
  computed: {
    filteredContacts() {
      const query = this.searchQuery.toLowerCase();
      return this.contacts.filter(contact =>
        contact.name.toLowerCase().includes(query) || contact.email.toLowerCase().includes(query)
      );
    }
  },
  created() {
    this.loadContacts();
  },
  methods: {
    openModal() {
      this.showModal = true;
      this.autoCloseModal();
    },
    closeModal() {
      this.showModal = false;
      if (this.autoCloseTimeout) {
        clearTimeout(this.autoCloseTimeout);
      }
    },
    autoCloseModal() {
      this.autoCloseTimeout = setTimeout(() => {
        this.closeModal();
      }, 5000); // Automatically close the modal after 5 seconds
    },
    loadContacts() {
      axios.get('/src/data/contacts.json')
        .then(response => {
          this.contacts = response.data;
        })
        .catch(error => {
          console.error('Error loading contacts:', error);
        });
    },
    addEntry(type) {
      const entry = { name: '', email: '', method: type === 'signer' ? 'Ký số' : 'Nhận bản sao' };
      if (type === 'signer') {
        this.signers.push(entry);
        this.signerErrors.push({});
      } else if (type === 'recipient') {
        this.recipients.push(entry);
        this.recipientErrors.push({});
      }
      this.validateForm();
    },
    confirmRemoveSigner(index, type) {
      if (confirm('Bạn có chắc chắn muốn xóa người này không?')) {
        if (type === 'signer') {
          this.signers.splice(index, 1);
          this.signerErrors.splice(index, 1);
        } else if (type === 'recipient') {
          this.recipients.splice(index, 1);
          this.recipientErrors.splice(index, 1);
        }
      }
    },
    selectContact(contact) {
      if (this.entryType === 'signer') {
        const emptySigner = this.signers.find(signer => !signer.name && !signer.email);
        if (emptySigner) {
          emptySigner.name = contact.name;
          emptySigner.email = contact.email;
        } else {
          this.signers.push({
            name: contact.name,
            email: contact.email,
            method: 'Ký số'
          });
          this.signerErrors.push({});
        }
      } else if (this.entryType === 'recipient') {
        const emptyRecipient = this.recipients.find(recipient => !recipient.name && !recipient.email);
        if (emptyRecipient) {
          emptyRecipient.name = contact.name;
          emptyRecipient.email = contact.email;
        } else {
          this.recipients.push({
            name: contact.name,
            email: contact.email,
            method: 'Nhận bản sao'
          });
          this.recipientErrors.push({});
        }
      }
      // Đóng modal sau khi chọn người
      this.$nextTick(() => {
        const modalElement = document.getElementById('contactModal');
        if (modalElement) {
          const modal = bootstrap.Modal.getInstance(modalElement);
          if (modal) {
            modal.hide();
          }
        }
      });
    },
    setEntryType(type) {
      this.entryType = type;
    },
    validateForm() {
      const validateEntries = (entries, errors) => {
        return entries.every((entry, index) => {
          let isValid = true;
          // Removed name validation
          if (!entry.email || !this.isValidEmail(entry.email)) {
            errors[index].email = true;
            isValid = false;
          } else {
            errors[index].email = false;
          }
          return isValid;
        });
      };
      const signersValid = validateEntries(this.signers, this.signerErrors);
      const recipientsValid = validateEntries(this.recipients, this.recipientErrors);

      return signersValid && recipientsValid;
    },
    isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },
    handleBack() {
      this.$router.push('/Chinh-sua-van-ban');
    },
    handleNext() {
      this.showErrors = true; // Show errors if any
      this.validateForm();
      if (this.signers.every(signer => signer.name && signer.email)) {
        this.$router.push('/Thiet-lap-vung-ky');
      }
    }
  }
};
</script>

<style scoped>
@import '@/assets/AddPerson.css';
</style>
