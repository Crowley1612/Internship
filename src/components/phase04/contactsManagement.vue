<template>
  <div class="container-fluid h-100">
    <div class="row h-100">
      <Sidebar />
      <div class="col-md-10 p-4">
        <Header />
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h1>Quản lý danh bạ</h1>
          <div class="actions">
            <a-button type="primary" @click="showModal">+ Thêm mới danh bạ</a-button>
          </div>
        </div>
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
            <div class="ml-2 flex-container">
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
                <!-- Email tài khoản column -->
                <th>
                  <div class="search-container">
                    Email tài khoản
                    <i class="bi bi-search" @click="toggleSearch('email')"></i>
                    <div v-if="searchField === 'email'" class="search-box">
                      <input type="text" placeholder="Nhập email" v-model="searchQueries.email" @input="filterDocuments"
                        class="input-search" />
                    </div>
                  </div>
                </th>

                <!-- Tên khách hàng column -->
                <th>
                  <div class="search-container">
                    Tên khách hàng
                    <i class="bi bi-search" @click="toggleSearch('name')"></i>
                    <div v-if="searchField === 'name'" class="search-box">
                      <input type="text" placeholder="Nhập tên khách hàng" v-model="searchQueries.name"
                        @input="filterDocuments" class="input-search" />
                    </div>
                  </div>
                </th>

                <!-- Số điện thoại column -->
                <th>
                  <div class="search-container">
                    Số điện thoại
                    <i class="bi bi-search" @click="toggleSearch('phone_number')"></i>
                    <div v-if="searchField === 'phone_number'" class="search-box">
                      <input type="text" placeholder="Nhập số điện thoại" v-model="searchQueries.phone_number"
                        @input="filterDocuments" class="input-search" />
                    </div>
                  </div>
                </th>

                <!-- Mã số thuế column -->
                <th>
                  <div class="search-container">
                    Mã số thuế
                    <i class="bi bi-search" @click="toggleSearch('tax_code')"></i>
                    <div v-if="searchField === 'tax_code'" class="search-box">
                      <input type="text" placeholder="Nhập mã số thuế" v-model="searchQueries.tax_code"
                        @input="filterDocuments" class="input-search" />
                    </div>
                  </div>
                </th>

                <!-- Tên tổ chức column -->
                <th>
                  <div class="search-container">
                    Tên tổ chức
                    <i class="bi bi-search" @click="toggleSearch('organization_name')"></i>
                    <div v-if="searchField === 'organization_name'" class="search-box">
                      <input type="text" placeholder="Nhập tên tổ chức" v-model="searchQueries.organization_name"
                        @input="filterDocuments" class="input-search" />
                    </div>
                  </div>
                </th>

                <!-- Thao tác column (Actions) -->
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in paginatedDocuments" :key="index">
                <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>

                <!-- Email input hoặc text -->
                <td v-if="isEditing(item)">
                  <input v-model="item.email" class="form-control" />
                </td>
                <td v-else>{{ item.email }}</td>

                <!-- Tên khách hàng input hoặc text -->
                <td v-if="isEditing(item)">
                  <input v-model="item.name" class="form-control" />
                </td>
                <td v-else>{{ item.name }}</td>

                <!-- Số điện thoại input hoặc text -->
                <td v-if="isEditing(item)">
                  <input v-model="item.phone_number" class="form-control" />
                </td>
                <td v-else>{{ item.phone_number }}</td>

                <!-- Mã số thuế input hoặc text -->
                <td v-if="isEditing(item)">
                  <input v-model="item.tax_code" class="form-control" />
                </td>
                <td v-else>{{ item.tax_code }}</td>

                <!-- Tên tổ chức input hoặc text -->
                <td v-if="isEditing(item)">
                  <input v-model="item.organization_name" class="form-control" />
                </td>
                <td v-else>{{ item.organization_name }}</td>

                <!-- Thao tác "Sửa" hoặc "Lưu" -->
                <td>
                  <a class="dropdown-item" v-if="isEditing(item)" @click="saveDocument(item)">
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
    <a-modal title="Thêm mới danh bạ" v-model:open="isModalOpen" @ok="handleOk" @cancel="handleCancel">
      <a-form layout="vertical" ref="contactForm">
        <a-form-item label="Email:" :rules="[{ required: true, message: 'Vui lòng nhập email' }]">
          <a-input v-model="newContact.email" />
        </a-form-item>
        <a-form-item label="Họ và tên:" :rules="[{ required: true, message: 'Vui lòng nhập họ và tên' }]">
          <a-input v-model="newContact.name" />
        </a-form-item>
        <a-form-item label="Mã số thuế:" :rules="[{ required: true, message: 'Vui lòng nhập mã số thuế' }]">
          <a-input v-model="newContact.tax_code" />
        </a-form-item>
        <a-form-item label="Công ty:" :rules="[{ required: true, message: 'Vui lòng nhập tên công ty' }]">
          <a-input v-model="newContact.organization_name" />
        </a-form-item>
        <a-form-item label="Số điện thoại:" :rules="[{ required: true, message: 'Vui lòng nhập số điện thoại' }]">
          <a-input v-model="newContact.phone_number" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import axios from "axios";
import Sidebar from "../layout/Sidebar.vue";
import Header from "../layout/Header.vue";
import { is } from "@vee-validate/rules";
import { h } from "vue";

export default {
  components: {
    Header,
    Sidebar,
  },
  data() {
    return {
      documents: [],
      searchField: "",
      searchQueries: {
        email: "",
        name: "",
        phone_number: "",
        tax_code: "",
        organization_name: "",
      },
      newContact: {
        email: "",
        name: "",
        phone_number: "",
        tax_code: "",
        organization_name: "",
      },
      currentPage: 1,
      itemsPerPage: 10,
      isModalOpen: false,
      gotoPage: 1,
      sortKey: "",
      sortOrder: "asc",
      editingDocument: null, // Document currently being edited
      originalDocument: null, // Original state of the document before editing
    };
  },
  created() {
    this.fetchData();
  },
  computed: {
    filteredDocuments() {
      return this.documents.filter((document) => {
        const matchesEmail = document.email
          .toLowerCase()
          .includes(this.searchQueries.email.toLowerCase());
        const matchesName = document.name
          .toLowerCase()
          .includes(this.searchQueries.name.toLowerCase());
        const matchesPhone = document.phone_number
          .toLowerCase()
          .includes(this.searchQueries.phone_number.toLowerCase());
        const matchesTaxCode = document.tax_code
          .toLowerCase()
          .includes(this.searchQueries.tax_code.toLowerCase());
        const matchesOrganization = document.organization_name
          .toLowerCase()
          .includes(this.searchQueries.organization_name.toLowerCase());
        return (
          matchesEmail &&
          matchesName &&
          matchesPhone &&
          matchesTaxCode &&
          matchesOrganization
        );
      });
    },
    totalPages() {
      return Math.ceil(this.filteredDocuments.length / this.itemsPerPage);
    },
    paginatedDocuments() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.sortedDocuments.slice(start, end);
    },
    sortedDocuments() {
      if (!this.sortKey) return this.filteredDocuments;

      return this.filteredDocuments.sort((a, b) => {
        const comparison = a[this.sortKey] > b[this.sortKey] ? 1 : -1;
        return this.sortOrder === "asc" ? comparison : -comparison;
      });
    },
  },
  methods: {
    deleteDocument(document) {
      console.log("Attempting to delete document:", document);

      // Ensure the document has a valid ID
      if (!document.id) {
        console.error("Invalid document ID. Cannot delete.", document);
        alert("Invalid document ID. Cannot delete.");
        return; // Exit the method early
      }

      if (confirm("Bạn có chắc chắn muốn xóa liên hệ này?")) {
        axios
          .delete(`http://localhost:3000/contacts/${document.id}`)
          .then(() => {
            // Update the local documents array to reflect deletion
            this.documents = this.documents.filter(
              (item) => item.id !== document.id
            );
            alert("Xóa thành công!");
          })
          .catch((error) => {
            console.error("Error deleting document:", error); // Log error
            alert("Có lỗi xảy ra khi xóa."); // Error feedback
          });
      }
    },

    saveDocument(item) {
      axios
        .put(`http://localhost:3000/contacts/${item.id}`, item) // Gửi yêu cầu PUT
        .then((response) => {
          const index = this.documents.findIndex((doc) => doc.id === item.id);
          if (index !== -1) {
            this.documents.splice(index, 1, response.data); // Cập nhật tài liệu trong mảng cục bộ
            alert("Cập nhật thành công!"); // Thông báo thành công
          }
        })
        .catch((error) => {
          console.error("Error updating document:", error);
          alert("Có lỗi xảy ra khi cập nhật."); // Thông báo lỗi
        });
    },

    openEditModal(item) {
      this.originalDocument = { ...item }; // Clone the original document for possible rollback
      this.editingDocument = item; // Set the document to be edited
    },

    changePage(page) {
      if (page < 1 || page > this.totalPages) return;
      this.currentPage = page;
    },
    updatePageSize() {
      this.currentPage = 1;
    },
    fetchData() {
      axios
        .get("http://localhost:3000/contacts")
        .then((response) => {
          this.documents = response.data;
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    },
    goToPage() {
      this.changePage(this.gotoPage);
    },
    filterDocuments() {
      this.currentPage = 1;
    },
    toggleSearch(field) {
      this.searchField = this.searchField === field ? "" : field;
    },
    setSortKey(key) {
      this.sortOrder =
        this.sortKey === key && this.sortOrder === "asc" ? "desc" : "asc";
      this.sortKey = key;
    },
    cancelEdit() {
      if (this.editingDocument && this.originalDocument) {
        const index = this.documents.findIndex(
          (doc) => doc.id === this.editingDocument.id
        );
        if (index !== -1) {
          this.documents.splice(index, 1, this.originalDocument);
        }
      }

      this.editingDocument = null;
      this.originalDocument = null;
    },
    isEditing(document) {
      return this.editingDocument === document;
    },
    handleOk() {
      const index = this.documents.findIndex(
        (doc) => doc.id === this.editingDocument.id
      );
      if (index !== -1) {
        this.documents.splice(index, 1, this.editingDocument);
      }

      this.editingDocument = null;
      this.originalDocument = null;
      this.isModalOpen = false;
    },
    handleCancel() {
      this.editingDocument = null;
      this.originalDocument = null;
      this.isModalOpen = false;
    },
    showModal() {
      this.isModalOpen = true;
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
  cursor: pointer;
}
</style>