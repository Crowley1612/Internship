<template>
    <div class="container-fluid h-100">
      <div class="row h-100">
        <Sidebar />
        <div class="col-md-10 p-4">
          <Header />
          <NavBar />
          <h4 class="header">Các tệp đã tải lên ({{ pdfFiles.length }})</h4>
          <div class="file-name">
            <ul>
              <li v-for="file in pdfFiles" :key="file.name" class="file-item">
                <span class="file-info">{{ file.name }} ({{ file.size }} KB)</span>
                <button class="btn delete-btn" @click="confirmDelete(file)">
                  <i class="bi bi-trash-fill"></i>
                </button>
              </li>
            </ul>
          </div>
  
          <!-- Uploaded Files Info -->
          <div v-if="uploadedFiles.length" class="mt-4">
            <ul>
              <li v-for="file in uploadedFiles" :key="file.name">
                {{ file.name }} - {{ formatFileSize(file.size) }}
              </li>
            </ul>
          </div>
  
          <!-- Category Selection -->
          <div class="mb-3">
            <label for="category" class="form-label">
              <span class="required">*</span> Chọn danh mục tài liệu
            </label>
            <div class="d-flex align-items-center">
              <select v-model="selectedCategory" class="form-select me-2" required>
                <option v-for="category in categories" :key="category" :value="category">
                  {{ category }}
                </option>
                <option value="new">Thêm danh mục mới...</option>
              </select>
              <button class="btn btn-primary" @click="addCategory">Thêm mới</button>
            </div>
            <div v-if="selectedCategory === 'new'" class="mt-2">
              <input v-model="newCategory" type="text" class="form-control" placeholder="Tên danh mục mới" required />
            </div>
          </div>
  
          <!-- Folder Selection -->
          <div class="mb-3">
            <label for="folder" class="form-label">
              <span class="required">*</span> Chọn thư mục lưu trữ
            </label>
            <div class="custom-select-wrapper">
              <select v-model="selectedFolder" class="form-select" required>
                <option v-for="folder in folders" :key="folder" :value="folder">
                  {{ folder }}
                </option>
                <option value="new">+ Thêm thư mục</option>
              </select>
            </div>
            <div v-if="selectedFolder === 'new'" class="new-folder-input mt-2">
              <input v-model="newFolder" @input="formatFolderName" type="text" class="form-control"
                placeholder="Nhập tên thư mục" required />
              <button class="btn btn-primary mt-2" @click="addFolder">Thêm thư mục</button>
            </div>
          </div>
  
          <!-- Footer with Navigation Buttons -->
          <div class="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
            <button class="btn btn-secondary me-md-2" type="button" @click="handleBack">Quay lại</button>
            <button class="btn btn-primary" type="button" @click="handleNext">Tiếp tục</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, reactive, onMounted } from 'vue';
  import NavBar from '../Processing.vue'; // Update the path as needed
  import Sidebar from '../layout/Sidebar.vue';
  import Header from '../layout/Header.vue';
  
  export default {
    name: 'EditFile',
    components: {
      Header,
      Sidebar,
      NavBar,
    },
    setup() {
      const uploadedFiles = reactive([]);
      const pdfFiles = ref([]);
      const categories = ref([]);
      const selectedCategory = ref('');
      const newCategory = ref('');
      const folders = ref([]);
      const selectedFolder = ref('');
      const newFolder = ref('');
  
      onMounted(() => {
        const files = localStorage.getItem('pdfFiles');
        if (files) {
          pdfFiles.value = JSON.parse(files);
        }
      });
  
      const formatFileSize = (size) => {
        const units = ['B', 'KB', 'MB', 'GB'];
        let index = 0;
        while (size >= 1024 && index < units.length - 1) {
          size /= 1024;
          index++;
        }
        return `${size.toFixed(1)} ${units[index]}`;
      };
  
      const confirmDelete = (file) => {
        if (confirm(`Bạn có chắc chắn muốn xóa file ${file.name}?`)) {
          deleteFile(file);
        }
      };
  
      const deleteFile = (file) => {
        pdfFiles.value = pdfFiles.value.filter((f) => f !== file);
        localStorage.setItem('pdfFiles', JSON.stringify(pdfFiles.value));
      };
  
      const formatFolderName = () => {
        newFolder.value = newFolder.value
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/\s+/g, '');
      };
  
      const addFolder = () => {
        if (newFolder.value) {
          folders.value.push(newFolder.value);
          selectedFolder.value = newFolder.value;
          newFolder.value = '';
        }
      };
  
      const addCategory = () => {
        if (newCategory.value) {
          categories.value.push(newCategory.value);
          selectedCategory.value = newCategory.value;
          newCategory.value = '';
        }
      };
  
      const validateForm = () => {
        if (!selectedCategory.value) {
          alert('Vui lòng chọn danh mục tài liệu.');
          return false;
        }
        if (!selectedFolder.value) {
          alert('Vui lòng chọn thư mục lưu trữ.');
          return false;
        }
        return true;
      };
  
      const handleNext = () => {
        if (validateForm()) {
          // Navigate to the next step
          window.location.href = '/Them-nguoi';
        }
      };
  
      const handleBack = () => {
        // Navigate to the previous step
        window.location.href = '/Upload-File';
      };
  
      return {
        uploadedFiles,
        pdfFiles,
        categories,
        selectedCategory,
        newCategory,
        folders,
        selectedFolder,
        newFolder,
        formatFileSize,
        confirmDelete,
        deleteFile,
        formatFolderName,
        addFolder,
        addCategory,
        validateForm,
        handleNext,
        handleBack,
      };
    },
  };
  </script>
  
  <style scoped>
  @import '@/assets/EditFile.css';
  </style>
  