<template>
  <div class="container-fluid h-100">
    <div class="row h-100">
      <Sidebar />
      <div class="col-md-10 p-4">
        <Header />
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h1>Quản lý danh mục</h1>
          <div class="actions">
            <a-button type="primary" @click="showModal">+ Thêm danh mục mới</a-button>
          </div>
        </div>

        <!-- Pagination -->
        <nav aria-label="Page navigation" class="mt-3">
          <ul class="pagination d-flex align-items-center">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <a class="page-link" href="#" aria-label="Previous" @click.prevent="changePage(currentPage - 1)">
                <span aria-hidden="true">&laquo;</span>
              </a>
            </li>
            <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: page === currentPage }">
              <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <a class="page-link" href="#" aria-label="Next" @click.prevent="changePage(currentPage + 1)">
                <span aria-hidden="true">&raquo;</span>
              </a>
            </li>
            <div class="ml-2">
              <select class="custom-select" v-model.number="itemsPerPage" @change="updatePageSize">
                <option :value="5">5 items/page</option>
                <option :value="10">10 items/page</option>
                <option :value="20">20 items/page</option>
                <option :value="50">50 items/page</option>
              </select>
            </div>
            <div class="ml-2">
              <input
                id="goto-page"
                type="number"
                class="form-control"
                min="1"
                :max="totalPages"
                placeholder="Go to page"
                v-model.number="gotoPage"
                @keyup.enter="goToPage"
              />
            </div>
          </ul>
        </nav>

        <!-- Table -->
        <div class="table-responsive">
          <table class="table table-bordered">
            <thead class="thead-light sticky-header">
              <tr>
                <th>STT</th>
                <th>
                  <div class="search-container">
                    Tên danh mục
                    <i class="bi bi-search" @click="toggleSearch('directory_name')"></i>
                    <div v-if="searchField === 'directory_name'" class="search-box">
                      <input
                        type="text"
                        placeholder="Nhập tên danh mục"
                        v-model="searchQueries.directory_name"
                        @input="filterDocuments"
                        class="input-search"
                      />
                    </div>
                  </div>
                </th>
                <th>
                  <div class="search-container">
                    Ghi chú
                    <i class="bi bi-search" @click="toggleSearch('note')"></i>
                    <div v-if="searchField === 'note'" class="search-box">
                      <input
                        type="text"
                        placeholder="Nhập ghi chú"
                        v-model="searchQueries.note"
                        @input="filterDocuments"
                        class="input-search"
                      />
                    </div>
                  </div>
                </th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in paginatedDocuments" :key="item.id">
                <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                <td>
                  <input v-if="isEditing(item)" v-model="item.directory_name" class="form-control" />
                  <span v-else>{{ item.directory_name }}</span>
                </td>
                <td>
                  <input v-if="isEditing(item)" v-model="item.note" class="form-control" />
                  <span v-else>{{ item.note }}</span>
                </td>
                <td>
                  <a class="dropdown-item" v-if="isEditing(item)" @click="saveDocument">
                    <i class="bi bi-save"></i> <span class="save">Lưu</span>
                  </a>
                  <a class="dropdown-item" v-else @click="openEditModal(item)">
                    <i class="bi bi-pencil-square"></i> <span class="update">Sửa</span>
                  </a>
                  <a class="dropdown-item" v-if="isEditing(item)" @click="cancelEdit">
                    <i class="bi bi-x-circle"></i> <span class="cancel">Hủy</span>
                  </a>
                  <a class="dropdown-item text-danger" @click="deleteDocument(item)">
                    <i class="bi bi-trash3"></i> <span class="del">Xóa</span>
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <a-modal title="Thay đổi thông tin" v-model:open="isModalOpen" @ok="handleOk" @cancel="handleCancel">
      <a-form layout="vertical">
        <a-form-item label="Họ và tên:">
          <a-input v-model="editUser.name" />
        </a-form-item>
        <a-form-item label="Mã số thuế:">
          <a-input v-model="editUser.taxcode" />
        </a-form-item>
        <a-form-item label="Công ty:">
          <a-input v-model="editUser.company" />
        </a-form-item>
        <a-form-item label="Tên tài khoản:">
          <a-input v-model="editUser.username" />
        </a-form-item>
        <a-form-item label="Số điện thoại:">
          <a-input v-model="editUser.phone" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import Sidebar from '../layout/Sidebar.vue';
import Header from '../layout/Header.vue';
import axios from 'axios';

export default {
  components: {
    Sidebar,
    Header,
  },
  data() {
    return {
      documents: [],
      searchField: '',
      searchQueries: {
        directory_name: '',
        note: '',
      },
      currentPage: 1,
      itemsPerPage: 5,
      gotoPage: 1,
      sortKey: '',
      sortOrder: 'asc',
      editingDocument: null,
      originalDocument: null,
      isModalOpen: false,
      editUser: {
        name: '',
        taxcode: '',
        company: '',
        username: '',
        phone: '',
      },
    };
  },
  created() {
    this.fetchData();
  },
  computed: {
    filteredDocuments() {
      return this.documents.filter((document) => {
        const matchesDirectoryName = document.directory_name
          .toLowerCase()
          .includes(this.searchQueries.directory_name.toLowerCase());
        const matchesNote = document.note.toLowerCase().includes(this.searchQueries.note.toLowerCase());
        return matchesDirectoryName && matchesNote;
      });
    },
    paginatedDocuments() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.sortedDocuments.slice(start, start + this.itemsPerPage);
    },
    totalPages() {
      return Math.ceil(this.filteredDocuments.length / this.itemsPerPage);
    },
    sortedDocuments() {
      if (!this.sortKey) return this.filteredDocuments;
      return [...this.filteredDocuments].sort((a, b) => {
        const comparison = a[this.sortKey].localeCompare(b[this.sortKey]);
        return this.sortOrder === 'asc' ? comparison : -comparison;
      });
    },
  },
  methods: {
    deleteDocument(document) {
      if (confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
        this.documents = this.documents.filter((item) => item.id !== document.id);
        localStorage.setItem('documents', JSON.stringify(this.documents));
      }
    },
    openEditModal(item) {
      this.originalDocument = { ...item };
      this.editingDocument = item;
    },
    saveDocument() {
      const index = this.documents.findIndex((doc) => doc.id === this.editingDocument.id);
      if (index !== -1) {
        const updatedDocument = { ...this.editingDocument };
        this.documents.splice(index, 1, updatedDocument);
        localStorage.setItem('documents', JSON.stringify(this.documents));
        this.editingDocument = null;
      }
    },
    cancelEdit() {
      if (this.editingDocument) {
        Object.assign(this.editingDocument, this.originalDocument);
        this.editingDocument = null;
        this.originalDocument = null;
      }
    },
    isEditing(item) {
      return this.editingDocument && this.editingDocument.id === item.id;
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    updatePageSize() {
      this.currentPage = 1;
    },
    goToPage() {
      if (this.gotoPage >= 1 && this.gotoPage <= this.totalPages) {
        this.currentPage = this.gotoPage;
      }
    },
    toggleSearch(field) {
      this.searchField = this.searchField === field ? '' : field;
    },
    filterDocuments() {
      this.currentPage = 1;
    },
    fetchData() {
      // Fetch or load data (placeholder for axios or API call)
      this.documents = JSON.parse(localStorage.getItem('documents')) || [];
    },
    showModal() {
      this.isModalOpen = true;
    },
    handleOk() {
      this.isModalOpen = false;
    },
    handleCancel() {
      this.isModalOpen = false;
    },
  },
};
</script>

<style scoped>
@import '@/assets/MasterPage.css';

.bi {
  cursor: pointer;
}

.del,
.update,
.save,
.cancel {
  margin-left: 5px;
}

.input-search {
  width: 100%;
}

.search-container {
  display: flex;
  align-items: center;
}

.search-box {
  position: absolute;
  background: white;
  border: 1px solid #ccc;
  padding: 5px;
  z-index: 1000;
  width: 200px;
}

.table-responsive {
  max-height: 60vh;
  overflow-y: auto;
}

.sticky-header th {
  position: sticky;
  top: 0;
  background: #f8f9fa;
}

.pagination {
  align-items: center;
}
</style>