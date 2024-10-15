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

<script>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios'; // Make sure to import axios
import Processing from '../layout/Processing.vue';
import Sidebar from '../layout/Sidebar.vue';
import Header from '../layout/Header.vue';

const FILE_SIZE_UNITS = ['B', 'KB', 'MB', 'GB'];

export default {
  name: 'EditFile',
  components: {
    Header,
    Sidebar,
    NavBar: Processing,
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
    const router = useRouter();

    const formatFileSize = (size) => {
      let index = 0;
      while (size >= 1024 && index < FILE_SIZE_UNITS.length - 1) {
        size /= 1024;
        index++;
      }
      return `${size.toFixed(1)} ${FILE_SIZE_UNITS[index]}`;
    };

    const confirmDelete = (file) => {
      if (confirm(`Bạn có chắc chắn muốn xóa file ${file.name}?`)) {
        pdfFiles.value = pdfFiles.value.filter((f) => f !== file);
        localStorage.setItem('pdfFiles', JSON.stringify(pdfFiles.value));
      }
    };

    const formatFolderName = () => {
      newFolder.value = newFolder.value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '');
    };

    const addFolder = () => {
      if (newFolder.value) {
        folders.value.push(newFolder.value);
        selectedFolder.value = newFolder.value;
        newFolder.value = '';
      } else {
        alert('Vui lòng nhập tên thư mục.');
      }
    };

    const addCategory = () => {
      if (newCategory.value) {
        categories.value.push({ id: Date.now(), directory_name: newCategory.value });
        selectedCategory.value = newCategory.value;
        newCategory.value = '';
      } else {
        alert('Vui lòng nhập tên danh mục.');
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
        router.push('/Them-nguoi');
      }
    };

    const handleBack = () => {
      router.push('/Upload-File');
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:3001/directory");
        categories.value = response.data; // Correctly assigning fetched data to categories
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    onMounted(() => {
      const files = localStorage.getItem('pdfFiles');
      if (files) {
        pdfFiles.value = JSON.parse(files);
      }
      fetchCategories();
    });

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
.container-fluid {
  padding: 0;
  height: 100vh;
}

.row {
  height: 100%;
}

.col-md-10 {
  background-color: #f8f9fa;
  overflow-y: auto;
}

.header {
  font-weight: 600;
  margin-bottom: 20px;
}

.file-name ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  border-bottom: 1px solid #dee2e6;
}

.file-info {
  font-size: 16px;
  color: #495057;
}

.delete-btn {
  background-color: transparent;
  border: none;
  color: #dc3545;
  cursor: pointer;
  width: 100px;
  margin-bottom: 0px;
}

.delete-btn:hover {
  color: #ff5c5c;
}

.required {
  color: #dc3545;
  margin-right: 4px;
}

.form-select {
  width: auto;
  flex-grow: 1;
}

.custom-select-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}

.new-folder-input input {
  margin-bottom: 8px;
}

.new-folder-input button {
  width: 100%;
}

.d-grid {
  padding-bottom: 20px;
}

.btn-secondary {
  background-color: #6c757d;
  border-color: #6c757d;
}

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
  margin-bottom: 0px;
  height: fit-content;
}

.btn-primary:hover,
.btn-secondary:hover {
  opacity: 0.85;
}

.mt-4 {
  margin-top: 1.5rem !important;
}

.me-md-2 {
  margin-right: 0.5rem !important;
}
</style>