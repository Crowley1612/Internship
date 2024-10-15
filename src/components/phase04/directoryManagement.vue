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
              <input id="goto-page" type="number" class="form-control" min="1" :max="totalPages"
                placeholder="Go to page" v-model.number="gotoPage" @keyup.enter="goToPage" />
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
                      <input type="text" placeholder="Nhập tên danh mục" v-model="searchQueries.directory_name"
                        @input="filterDocuments" class="input-search" />
                    </div>
                  </div>
                </th>
                <th>
                  <div class="search-container">
                    Ghi chú
                    <i class="bi bi-search" @click="toggleSearch('note')"></i>
                    <div v-if="searchField === 'note'" class="search-box">
                      <input type="text" placeholder="Nhập ghi chú" v-model="searchQueries.note"
                        @input="filterDocuments" class="input-search" />
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
    <a-modal title="Thêm mới danh mục" v-model:open="isModalOpen" @ok="handleOk" @cancel="handleCancel">
      <a-form layout="vertical">
        <a-form-item label="Tên danh mục:">
          <a-input v-model="newDirectory.name" />
        </a-form-item>
        <a-form-item label="Ghi chú:">
          <a-input v-model="newDirectory.note" />
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
      editingDocument: null,
      originalDocument: null,
      isModalOpen: false,
      newDirectory: {
        directory_name: '',
        note: ''
      },
    };
  },
  created() {
    this.fetchData();
  },
  computed: {
    filteredDocuments() {
      return this.documents.filter((document) => {
        const directoryName = document.directory_name?.toLowerCase() || '';
        const searchDirectoryName = this.searchQueries.directory_name?.toLowerCase() || '';
        const note = document.note?.toLowerCase() || '';
        const searchNote = this.searchQueries.note?.toLowerCase() || '';

        return directoryName.includes(searchDirectoryName) && note.includes(searchNote);
      });
    },
    paginatedDocuments() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredDocuments.slice(start, start + this.itemsPerPage);
    },
    totalPages() {
      return Math.ceil(this.filteredDocuments.length / this.itemsPerPage);
    },
  },
  methods: {
    async fetchData() {
      try {
        const response = await axios.get("http://localhost:3001/directory");
        this.documents = response.data;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },

    async deleteDocument(document) {
      if (confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
        try {
          await axios.delete(`http://localhost:3001/directory/${document.id}`);
          this.updateDocuments(this.documents.filter((item) => item.id !== document.id));
          console.log('Document deleted successfully');
        } catch (error) {
          console.error('Error deleting document:', error);
        }
      }
    },

    openEditModal(item) {
      this.originalDocument = { ...item };
      this.editingDocument = item;
    },

    async saveDocument() {
      const index = this.documents.findIndex((doc) => doc.id === this.editingDocument.id);
      if (index !== -1) {
        try {
          const updatedDocument = { ...this.editingDocument };
          await axios.put(`http://localhost:3001/directory/${updatedDocument.id}`, updatedDocument);
          this.updateDocuments([
            ...this.documents.slice(0, index),
            updatedDocument,
            ...this.documents.slice(index + 1),
          ]);
          this.editingDocument = null;
          console.log('Document updated successfully');
        } catch (error) {
          console.error('Error updating document:', error);
        }
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

    showModal() {
      this.resetNewDirectory();
      this.isModalOpen = true;
    },

    handleCancel() {
      this.isModalOpen = false;
      this.resetNewDirectory();
    },

    // generateNewId() {
    //   // Implement your ID generation logic here
    //   return Math.random().toString(36).substr(2, 9);
    // },
    resetNewDirectory() {
      this.newDirectory = {
        directory_name: '',
        note: ''
      };
    },
    updateDocuments(newDocuments) {
      this.documents = newDocuments;
    },
    async handleOk() {
      const newDoc = {
        id: this.generateNewId(),
        directory_name: this.newDirectory.directory_name,
        note: this.newDirectory.note,
      };

      try {
        const response = await axios.post('http://localhost:3001/directory', newDoc);
        console.log('Directory created:', response.data);

        this.updateDocuments([...this.documents, response.data]);
        this.isModalOpen = false;
        this.resetNewDirectory();
      } catch (error) {
        console.error('Error creating directory:', error);
      }
    },

    toggleSearch(field) {
      this.searchField = this.searchField === field ? '' : field;
    },

    filterDocuments() {
      this.currentPage = 1;
    },

    updateDocuments(documents) {
      this.documents = documents;
      localStorage.setItem('documents', JSON.stringify(this.documents));
    },

    generateNewId() {
      // Generate new ID by finding the max ID and incrementing it
      return this.documents.length > 0 ? Math.max(...this.documents.map(doc => doc.id)) + 1 : 1;
    },

    resetNewDirectory() {
      this.newDirectory = {
        directory_name: '',
        note: ''
      };
    }
  }
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