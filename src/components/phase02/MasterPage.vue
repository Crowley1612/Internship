<template>
  <div class="container-fluid h-100">
    <div class="row h-100">
      <Sidebar />
      <div class="col-md-10 p-4">
        <Header />
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h1>Quản lý tài liệu</h1>
          <div class="actions">
            <button class="btn btn-primary mr-2" @click="gotoPage('BatchSignRequest')">Gửi yêu cầu ký lô</button>
            <router-link to="/Upload-file">
              <button class="btn btn-success">
                <i class="bi bi-plus"></i> Tạo mới tài liệu
              </button>
            </router-link>
          </div>
        </div>

        <div class="input-group mb-3">
          <span class="input-group-text" id="inputGroup-sizing-default">
            <i class="bi bi-search"></i>
          </span>
          <input type="text" class="form-control" placeholder="Tìm kiếm tài liệu" v-model="searchQuery"
            @input="filterDocumentsBySearchQuery">
          <select class="custom-select ml-2" v-model="selectedFilter">
            <option value="all">Tất cả tài liệu</option>
            <option value="pending">Đang chờ ký</option>
            <option value="sent">Tài liệu gửi đến</option>
            <option value="signed">Đã gửi đi</option>
            <option value="rejected">Đã từ chối</option>
            <option value="deleted">Đã xóa</option>
          </select>

          <div>
            <div class="input-group-append">
              <button class="btn btn-secondary" @click="toggleFilter"><i class="bi bi-filter-square"></i> Bộ
                lọc</button>
              <button class="btn btn-outline-secondary" @click="clearFilters"><i class="bi bi-x-square"></i> Xóa bộ
                lọc</button>
            </div>

          </div>
        </div>
        <div v-if="showFilter" class="date-filters">
          <label for="start-date">Từ ngày:</label>
          <input type="date" v-model="startDate" @change="filterDocumentsByDate" placeholder="Start Date">
          <span class="mx-2">-</span>
          <label for="end-date">Đến ngày:</label>
          <input type="date" v-model="endDate" @change="filterDocumentsByDate" placeholder="End Date">
        </div>

        <div id="app">
          <ul class="nav nav-underline">
            <li class="nav-item">
              <a class="nav-link" :class="{ 'active': selectedFilter === 'all' }" @click="selectedFilter = 'all'">Tất cả
                tài liệu</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" :class="{ 'active': selectedFilter === 'pending' }"
                @click="selectedFilter = 'pending'">Đang chờ ký</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" :class="{ 'active': selectedFilter === 'sent' }" @click="selectedFilter = 'sent'">Tài
                liệu gửi đến</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" :class="{ 'active': selectedFilter === 'signed' }"
                @click="selectedFilter = 'signed'">Đã gửi đi</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" :class="{ 'active': selectedFilter === 'rejected' }"
                @click="selectedFilter = 'rejected'">Đã từ chối</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" :class="{ 'active': selectedFilter === 'deleted' }"
                @click="selectedFilter = 'deleted'">Đã xóa</a>
            </li>
          </ul>
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
              <select class="custom-select" v-model.number="currentPage" @change="changePage(currentPage)">
                <option v-for="page in totalPages" :key="page" :value="page">{{ page }} / {{ totalPages }}</option>
              </select>
            </div>
            <div class="ml-2 flex-container">
              <input id="goto-page" type="number" class="form-control" min="1" :max="totalPages"
                placeholder="Go to page" v-model.number="gotoPage" @keyup.enter="goToPage" />
            </div>
          </ul>
        </nav>

        <div class="table-responsive">
          <table class="table table-bordered all">
            <thead class="thead-light sticky-header">
              <tr>
                <th></th>
                <th>
                  <div class="header-container">
                    Mã VB
                    <i class="bi bi-search" @click="toggleSearchInput('maVB')"></i>
                  </div>
                  <input v-if="searchField === 'maVB'" type="text" placeholder="Nhập mã văn bản"
                    v-model="searchQueries.maVB" @input="filterDocuments" class="input-search" />
                </th>
                <th>
                  <div class="header-container">
                    Tên văn bản
                    <i class="bi bi-search" @click="toggleSearchInput('tenVanBan')"></i>
                  </div>
                  <input v-if="searchField === 'tenVanBan'" type="text" placeholder="Nhập tên văn bản"
                    v-model="searchQueries.tenVanBan" @input="filterDocuments" class="search-input" />
                </th>
                <th>
                  <div class="header-container">
                    Người gửi
                    <i class="bi bi-search" @click="toggleSearchInput('nguoiGui')"></i>
                  </div>
                  <input v-if="searchField === 'nguoiGui'" type="text" placeholder="Search..."
                    v-model="searchQueries.nguoiGui" @input="filterDocuments" />
                </th>
                <th>
                  <div class="header-container">
                    Người nhận
                    <i class="bi bi-search" @click="toggleSearchInput('nguoiNhan')"></i>
                  </div>
                  <input v-if="searchField === 'nguoiNhan'" type="text" placeholder="Search..."
                    v-model="searchQueries.nguoiNhan" @input="filterDocuments" />
                </th>
                <th @click="sortColumn('thoiGianCapNhat')">
                  Thời gian cập nhật
                  <i class="fas" :class="sortIcon('thoiGianCapNhat')"></i>
                </th>
                <th>
                  <div class="header-container">
                    Trạng thái
                    <i class="bi bi-search" @click="toggleSearchInput('trangThai')"></i>
                  </div>
                  <input v-if="searchField === 'trangThai'" type="text" placeholder="Search..."
                    v-model="searchQueries.trangThai" @input="filterDocuments" />
                </th>
                <th @click="sortColumn('trinhTuKy')">
                  Trình tự ký
                  <i class="fas" :class="sortIcon('trinhTuKy')"></i>
                </th>
                <th>
                  <div class="header-container">
                    Danh mục
                    <i class="bi bi-search" @click="toggleSearchInput('danhMuc')"></i>
                  </div>
                  <input v-if="searchField === 'danhMuc'" type="text" placeholder="Search..."
                    v-model="searchQueries.danhMuc" @input="filterDocuments" />
                </th>
                <th @click="sortColumn('ghiChu')">
                  Ghi chú
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in sortedDocuments" :key="index" @mouseover="showTooltip($event, item)"
                @mouseleave="hideTooltip">
                <td>
                  <input type="checkbox" v-model="item.isChecked" class="custom-checkbox">
                </td>
                <td>{{ item.maVB }}</td>
                <td>{{ item.tenVanBan }}</td>
                <td>{{ item.nguoiGui }}</td>
                <td>{{ item.nguoiNhan }}</td>
                <td>{{ item.thoiGianCapNhat }}</td>
                <td>{{ item.trangThai }}</td>
                <td>{{ item.trinhTuKy }}</td>
                <td>{{ item.danhMuc }}</td>
                <td>{{ item.ghiChu }}</td>
                <td>
                  <div class="dropdown">
                    <button class="btn btn-secondary dropdown-toggle custom-dropdown-button" type="button"
                      data-bs-toggle="dropdown" aria-expanded="false">
                      <i class="bi bi-three-dots-vertical"></i>
                    </button>
                    <ul class="dropdown-menu">
                      <li><a class="dropdown-item" @click="downloadDocument(item)"><i
                            class="bi bi-arrow-down-circle"></i> Tải xuống</a></li>
                      <li><a class="dropdown-item" @click="verifyDocument(item)"><i class="bi bi-patch-check"></i> Xác
                          minh</a></li>
                      <li><a class="dropdown-item" @click="assignCategory(item)"><i class="bi bi-file-earmark-plus"></i>
                          Gán danh mục</a></li>
                      <li><a class="dropdown-item" @click="shareDocument(item)"><i class="bi bi-share"></i> Chia sẻ</a>
                      </li>
                      <li><a class="dropdown-item" @click="deleteDocument(item)"><i class="bi bi-trash3"></i> Xóa</a>
                      </li>
                    </ul>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="tooltip" v-if="tooltip.visible" :style="{ top: tooltip.y + 'px', left: tooltip.x + 'px' }">{{
            tooltip.content }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Sidebar from '../layout/Sidebar.vue';
import Header from '../layout/Header.vue';
export default {
  components: {
    Header,
    Sidebar,
  },
  data() {
    return {
      documents: [],
      searchQuery: '',
      selectedFilter: 'all',
      showFilter: false,
      startDate: null,
      endDate: null,
      currentPage: 1,
      itemsPerPage: 8,
      activeMenu: null,
      showSearchInput: {
        maVB: '',
        tenVanBan: false,
        nguoiGui: false,
        nguoiNhan: false,
        thoiGianCapNhat: false,
        trangThai: false,
        trinhTuKy: false,
        danhMuc: false,
        ghiChu: false
      },
      searchField: '',
      searchQueries: {
        maVB: '',
        tenVanBan: '',
        nguoiGui: '',
        nguoiNhan: '',
        thoiGianCapNhat: '',
        trangThai: '',
        trinhTuKy: '',
        danhMuc: '',
        ghiChu: ''
      },
      sortKey: '',
      sortOrder: 'asc',
      tooltip: {
        visible: false,
        content: '',
        x: 0,
        y: 0
      },
      statusClasses: {
        pending: 'text-warning',
        sent: 'text-primary',
        signed: 'text-success',
        rejected: 'text-danger',
        deleted: 'text-secondary',
      },
    };
  },
  created() {
    this.fetchData();
  },

  computed: {
    greeting() {
      const hour = new Date().getHours();
      if (hour < 12) return 'Chào buổi sáng,';
      if (hour < 18) return 'Chào buổi chiều,';
      return 'Chào buổi tối,';
    },

    filteredDocuments() {
      const filtered = this.documents.filter(document => {
        const matchesSearch = this.searchQuery
          ? (document.tenVanBan ? document.tenVanBan.toLowerCase().includes(this.searchQuery.toLowerCase()) : false)
          : true;

        const matchesMaVB = this.searchQueries.maVB
          ? (document.maVB ? document.maVB.toString().toLowerCase().includes(this.searchQueries.maVB.toLowerCase()) : false)
          : true;

        const matchesTenVanBan = this.searchQueries.tenVanBan
          ? (document.tenVanBan ? document.tenVanBan.toString().toLowerCase().includes(this.searchQueries.tenVanBan.toLowerCase()) : false)
          : true;

        const matchesNguoiGui = this.searchQueries.nguoiGui
          ? (document.nguoiGui ? document.nguoiGui.toString().toLowerCase().includes(this.searchQueries.nguoiGui.toLowerCase()) : false)
          : true;

        const matchesNguoiNhan = this.searchQueries.nguoiNhan
          ? (document.nguoiNhan ? document.nguoiNhan.toString().toLowerCase().includes(this.searchQueries.nguoiNhan.toLowerCase()) : false)
          : true;

        const matchesTrangThai = this.searchQueries.trangThai
          ? (document.trangThai ? document.trangThai.toString().toLowerCase().includes(this.searchQueries.trangThai.toLowerCase()) : false)
          : true;

        const matchesDanhMuc = this.searchQueries.danhMuc
          ? (document.danhMuc ? document.danhMuc.toString().toLowerCase().includes(this.searchQueries.danhMuc.toLowerCase()) : false)
          : true;

        const matchesDateRange = this.startDate && this.endDate
          ? (document.thoiGianCapNhat ? this.isWithinDateRange(document.thoiGianCapNhat, this.startDate, this.endDate) : false)
          : true;

        // Áp dụng các bộ lọc khác nếu cần
        return matchesSearch && matchesMaVB && matchesTenVanBan && matchesNguoiGui && matchesNguoiNhan && matchesTrangThai && matchesDanhMuc && matchesDateRange;
      });

      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return filtered.slice(start, end);
    },

    sortedDocuments() {
      const documents = this.filteredDocuments;
      if (!this.sortKey) return documents;

      return documents.slice().sort((a, b) => {
        const aValue = a[this.sortKey];
        const bValue = b[this.sortKey];

        if (aValue === bValue) return 0;

        return (aValue > bValue ? 1 : -1) * (this.sortOrder === 'asc' ? 1 : -1);
      });
    },

    totalPages() {
      const totalItems = this.documents.filter(document => {
        const matchesSearch = this.searchQuery ? document.tenVanBan.toLowerCase().includes(this.searchQuery.toLowerCase()) : true;
        const matchesFilter = this.selectedFilter === 'all' || document.trangThai === this.selectedFilter;
        return matchesSearch && matchesFilter;
      }).length;

      return Math.ceil(totalItems / this.itemsPerPage);
    }
  },

  methods: {
    fetchData() {
      axios.get('/src/data/data.json')
        .then(response => {
          this.documents = response.data;
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    },
    gotoPage(page) {
      this.$router.push({ name: page });
    },
    isWithinDateRange(dateString, startDate, endDate) {
      const date = new Date(dateString.split(' ')[0].split('-').reverse().join('-'));
      const start = new Date(startDate);
      const end = new Date(endDate);

      return date >= start && date <= end;
    },
    filterDocuments() {
      this.currentPage = 1;
    },
    toggleFilter() {
      this.showFilter = !this.showFilter;
    },
    clearFilters() {
      this.startDate = '';
      this.endDate = '';
      this.selectedFilter = 'all';
      this.searchQuery = '';
      this.filterDocuments();
    },
    changePage(page) {
      if (page < 1 || page > this.totalPages) return;
      this.currentPage = page;
    },
    goToPage() {
      if (this.gotoPage < 1 || this.gotoPage > this.totalPages) return;
      this.currentPage = this.gotoPage;
    },
    toggleMenu(index) {
      this.activeMenu = this.activeMenu === index ? null : index;
    },
    toggleSearch(field) {
      this.searchField = this.searchField === field ? '' : field;
    },
    filterDocumentsBySearchQuery() {
      this.currentPage = 1;
    },
    sortColumn(column) {
      if (this.sortKey === column) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortKey = column;
        this.sortOrder = 'asc';
      }
    },
    sortIcon(column) {
      if (this.sortKey !== column) return 'fa-sort';

      return this.sortOrder === 'asc' ? 'fa-sort-up' : 'fa-sort-down';
    },
    showTooltip(event, item) {
      const content = Object.values(item).join(' ');
      this.tooltip = {
        visible: true,
        content,
        x: event.clientX,
        y: event.clientY
      };
    },
    hideTooltip() {
      this.tooltip.visible = false;
    },
    downloadDocument(item) {
      console.log('Download:', item);
    },
    verifyDocument(item) {
      console.log('Verify:', item);
    },
    assignCategory(item) {
      console.log('Assign Category:', item);
    },
    shareDocument(item) {
      console.log('Share:', item);
    },
    deleteDocument(item) {
      console.log('Delete:', item);
    },
    filterDocumentsByDate() {
      const start = new Date(this.startDate);
      const end = new Date(this.endDate);

      return this.documents.filter(document => {
        const documentDate = new Date(document.date); // Assuming document.date is the date field
        return documentDate >= start && documentDate <= end;
      });
    },

    toggleSearchInput(field) {
      this.searchField = this.searchField === field ? '' : field;
    },
  },
};
</script>

<style scoped>
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css");

/* General Container Styling */
.container-fluid {
  height: 100%;
}

/* Button Styling */
.btn {
  margin-left: 20px;
}

.btn-success {
  padding: 8px 16px;
  border-radius: 5px;
  font-size: 16px;
  background-color: #28a745;
  color: white;
  transition: background-color 0.3s, box-shadow 0.3s;
}

.btn-success:hover {
  background-color: #218838;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Router Link Styling */
.router-link {
  display: flex;
  align-items: center;
  color: #007bff;
  font-weight: bold;
  transition: color 0.3s;
}

.router-link i {
  margin-right: 8px;
  color: white;
}

.router-link:hover {
  color: #0056b3;
}

.router-link.active {
  color: white;
  text-decoration: underline;
}

/* Active Page Styling */
.active-page {
  color: white !important;
  text-decoration: underline;
}

/* User Section Styling */
.user {
  display: flex;
  width: 100%;
  align-items: center;
  border: 1px solid #007bff;
  padding: 10px;
  border-radius: 10px;
  margin-top: auto;
  background-color: #f8f9fa;
}

/* Options Styling */
.options {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  margin-top: 10px;
  border: 1px solid #007bff;
  border-radius: 10px;
  padding: 10px;
}

.option {
  margin-right: 10px;
  cursor: pointer;
  color: #007bff !important;
  transition: color 0.3s;
}

.option:hover {
  color: #0056b3 !important;
}

/* Filter Section Styling */
.filter {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex-wrap: wrap;
}

.filter-row {
  display: flex;
  gap: 30px;
}

.filter-item {
  display: flex;
  flex-direction: column;
  margin-left: 10px;
}

.filter-item p {
  margin: 10px 0;
}

.filter-item input {
  margin-top: 5px;
  margin-left: 20px;
}

.filter-inline {
  display: flex;
  align-items: center;
}

.filter-inline .title {
  margin-right: 10px;
}

.filter-inline .date {
  margin-right: 20px;
}

.date {
  margin-left: 10px;
  height: fit-content;
}

.title {
  margin: 0 5px;
}

/* Custom Dropdown Button Styling */
.custom-dropdown-button {
  background-color: white;
  border: none;
  padding: auto;
  cursor: pointer;
  margin-left: 0;
}

.custom-dropdown-button .bi-three-dots-vertical {
  color: black;
  font-size: 1.5rem;
}

.custom-dropdown-button::after {
  display: none; /* Hide the default dropdown caret */
}

.custom-dropdown-button:hover,
.custom-dropdown-button:active {
  background-color: white;
}

/* Form Control Styling */
.form-control {
  width: auto;
  margin: 0 10px;
  height: 40px;
}

/* Custom Select Arrow Styling */
.custom-select-arrow {
  position: relative;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
}

.custom-select-arrow::after {
  content: "\f078";
  font-family: "Font Awesome 5 Free";
  font-weight: 900;
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}

/* Pagination Styling */
.pagination .page-link {
  border-radius: 0.25rem;
}

.page-item.active .page-link {
  background-color: #007bff;
  border-color: #007bff;
  color: #fff;
}

.page-item.disabled .page-link {
  pointer-events: none;
  color: #6c757d;
}

.custom-select,
.form-control {
  border-radius: 0.25rem;
  padding: 0.5rem 1rem;
}

.custom-select {
  background-color: #f8f9fa;
  border: 1px solid #ced4da;
  padding: 0.375rem 1.75rem 0.375rem 0.75rem;
  font-size: 1rem;
  color: #495057;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.custom-select:focus {
  border-color: #80bdff;
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.custom-select option {
  background-color: #ffffff;
  color: #495057;
}

/* Goto Section Styling */
.goto {
  margin-top: 10px;
  align-items: center;
  text-align: center;
  justify-content: center;
  margin: 0 0.5rem;
}

.pagination {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
}

/* Table Styling */
.table-responsive {
  position: relative;
}

.table-responsive input[type="text"] {
  margin-top: 5px;
  width: 100%;
}

.input-group .input-group-append {
  display: flex;
  align-items: center;
}

.search-icon,
th .fa-search {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
}

.table {
  width: 100%;
  table-layout: auto;
  margin-bottom: 1rem;
  background-color: #fff;
}

.table th,
.table td {
  white-space: nowrap;
  padding: 10px;
  font-size: 15px;
  vertical-align: top;
  border-top: 1px solid #dee2e6;
}

.table thead th {
  vertical-align: bottom;
  border-bottom: 2px solid #dee2e6;
}

.table tbody + tbody {
  border-top: 2px solid #dee2e6;
}

.table tbody tr:hover {
  background-color: #f5f5f5;
}

.sticky-header {
  position: sticky;
  top: 0;
  z-index: 2;
  background: white;
}

/* Custom Checkbox Styling */
.custom-checkbox {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-color: white;
  border: 1px solid #ced4da;
  border-radius: 0.25em;
  display: inline-block;
  position: relative;
  margin: 0;
  cursor: pointer;
  width: 1.25em;
  height: 1.25em;
}

.custom-checkbox:checked {
  background-color: #007bff;
  border-color: #007bff;
}

.custom-checkbox:checked::after {
  content: "\f00c";
  font-family: "Font Awesome 5 Free";
  font-weight: 900;
  font-size: 0.75em;
  color: white;
  position: absolute;
  top: 0.1em;
  left: 0.25em;
}

/* Tooltip Styling */
.tooltip {
  position: fixed;
  background-color: #333;
  color: white;
  padding: 0.5em;
  border-radius: 0.25em;
  font-size: 0.875em;
  z-index: 1000;
  pointer-events: none;
  white-space: nowrap;
}

/* Media Query for Mobile Devices */
@media (max-width: 768px) {
  .nav-bar {
    height: auto;
  }

  .col-md-10 {
    padding: 0 15px;
  }

  .input-group {
    flex-wrap: wrap;
  }

  .goto,
  .none {
    display: none;
  }

  .input-icon-wrapper {
    position: relative;
  }

  .input-icon-wrapper input {
    padding-left: 30px;
  }

  .input-icon {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    color: #ccc;
  }
}

/* Flex Container Styling */
.flex-container {
  display: flex;
  align-items: center;
}

.flex-container span {
  margin-right: 0;
  margin-left: 10px;
}

.d-flex {
  margin-top: 10px;
}

.bi-search {
  cursor: pointer;
  margin-left: 5px;
}

/* Header Container Styling */
.header-container {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.header-container i {
  margin-left: 5px;
}

.search-input {
  margin-top: 5px;
  width: 100%;
  display: block;
}

/* Additional Classes */
.ml-2 {
  margin-left: 0.5rem;
}

.none {
  width: 100px;
  border: 1px solid black;
  border-radius: 10px;
  margin: 0 10px;
}

.search-input-container {
  display: flex;
  align-items: center;
}

.input-search {
  flex: 1;
}

.search-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0 8px;
}

.date-filters {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.date-filters label {
  margin-right: 5px;
}

.date-filters input[type="date"] {
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 3px;
}

.date-filters button {
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.date-filters button:hover {
  background-color: #0056b3;
}
.header{
  margin-left: 0px;
  margin-top: 0px;
}
.custom-dropdown-button {
  background-color: #007bff;
  color: white;
  border: none;
}

.page-title {
  font-size: 1.5rem;
  font-weight: bold;
}

.actions {
  display: flex;
  gap: 10px;
}

.input-group {
  align-items: center;
}

.date-filters {
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 5px;
}

.sticky-header {
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
}

.input-search {
  width: 100%;
}

.table {
  margin-bottom: 0;
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.pagination-container .btn {
  margin: 0 10px;
}

.nav-underline .nav-link {
  color: #007bff;
}

.nav-underline .nav-link.active {
  font-weight: bold;
  border-bottom: 2px solid #007bff;
}

</style>
