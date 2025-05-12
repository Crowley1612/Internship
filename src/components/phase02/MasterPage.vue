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
      itemsPerPage: 10,
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
    totalPages() {
      return Math.ceil(this.totalItems / this.itemsPerPage);
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
      axios.get('http://localhost:3002/document')
        .then(response => {
          this.documents = response.data;
        })
        .catch(error => {
          console.error('There was an error!', error);
        });
    },
    deleteDocument(document) {
      console.log("Attempting to delete document:", document);

      if (!document.id) {
        console.error("Invalid document ID. Cannot delete.", document);
        alert("Invalid document ID. Cannot delete.");
        return;
      }

      if (confirm("Bạn có chắc chắn xóa tài liệu này?")) {
        axios
          .delete(`http://localhost:3002/document/${document.id}`)
          .then(() => {
            this.documents = this.documents.filter(
              (item) => item.id !== document.id
            );
            alert("Xóa thành công!");
          })
          .catch((error) => {
            console.error("Error deleting document:", error);
            alert("Có lỗi xảy ra khi xóa.");
          });
      }
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
    changePage(page) {
      this.currentPage = page;
      console.log(`Current page: ${this.currentPage}`);
    },
    updatePageSize() {
      this.currentPage = 1;
      console.log(`Items per page: ${this.itemsPerPage}`);
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
@import '@/assets/MasterPage.css';
</style>
