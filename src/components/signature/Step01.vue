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
              <option value="" disabled selected>Chọn danh mục</option>
              <option v-for="category in categories" :key="category.id" :value="category.directory_name">
                {{ category.directory_name }}
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
              <option value="" disabled selected>Chọn thư mục</option>
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

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios'; 
import Sidebar from '../layout/Sidebar.vue';
import Header from '../layout/Header.vue';
import NavBar from '../layout/Processing.vue';
// Constants for file size units
const FILE_SIZE_UNITS = ['B', 'KB', 'MB', 'GB'];

// Reactive states and refs
const uploadedFiles = reactive([]); 
const pdfFiles = ref([]); // Stores uploaded PDF files
const categories = ref([]); // Stores available categories
const selectedCategory = ref(''); // Holds the selected category
const newCategory = ref(''); // For adding new categories
const folders = ref([]); // Stores folder options
const selectedFolder = ref(''); // Holds the selected folder
const newFolder = ref(''); // For adding new folders

const router = useRouter(); // Vue router

// Helper function to format file sizes
const formatFileSize = (size) => {
  let index = 0;
  while (size >= 1024 && index < FILE_SIZE_UNITS.length - 1) {
    size /= 1024;
    index++;
  }
  return `${size.toFixed(1)} ${FILE_SIZE_UNITS[index]}`;
};

// Confirmation for file deletion
const confirmDelete = (file) => {
  if (confirm(`Bạn có chắc chắn muốn xóa file ${file.name}?`)) {
    pdfFiles.value = pdfFiles.value.filter((f) => f !== file);
    localStorage.setItem('pdfFiles', JSON.stringify(pdfFiles.value));
  }
};

// Format folder name by removing accents and spaces
const formatFolderName = () => {
  newFolder.value = newFolder.value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/\s+/g, ''); // Remove spaces
};

// Add a new folder to the folder list
const addFolder = () => {
  if (newFolder.value) {
    folders.value.push(newFolder.value);
    selectedFolder.value = newFolder.value;
    newFolder.value = ''; // Reset folder input
  } else {
    alert('Vui lòng nhập tên thư mục.');
  }
};

// Add a new category to the category list
const addCategory = () => {
  if (newCategory.value) {
    categories.value.push({ id: Date.now(), directory_name: newCategory.value });
    selectedCategory.value = newCategory.value;
    newCategory.value = ''; // Reset category input
  } else {
    alert('Vui lòng nhập tên danh mục.');
  }
};

// Form validation for category and folder selection
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

// Handle 'Next' button click
const handleNext = () => {
  if (validateForm()) {
    router.push('/Them-nguoi');
  }
};

// Handle 'Back' button click
const handleBack = () => {
  router.push('/Upload-File');
};

// Fetch categories from the server
const fetchCategories = async () => {
  try {
    const response = await axios.get("http://localhost:3001/directory");
    categories.value = response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
};

// Lifecycle hook for fetching files and categories
onMounted(() => {
  const files = localStorage.getItem('pdfFiles');
  if (files) {
    pdfFiles.value = JSON.parse(files);
  }
  fetchCategories();
});
</script>

<style scoped>
@import '@/assets/EditFile.css';
</style>