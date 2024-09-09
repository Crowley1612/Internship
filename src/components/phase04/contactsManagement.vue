<template>
    <div class="container-fluid h-100">
        <div class="row h-100">
            <Sidebar />
            <div class="col-md-10 p-4">
                <Header />
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h1>Quản lý danh bạ</h1>
                    <div class="actions">
                        <router-link to="/Upload-file">
                            <button class="btn btn-success">
                                <i class="bi bi-plus"></i> Thêm mới liên lạc
                            </button>
                        </router-link>
                    </div>
                </div>
                <nav aria-label="Page navigation" class="mt-3">
                    <ul class="pagination d-flex align-items-center">
                        <li class="page-item" :class="{ disabled: currentPage === 1 }">
                            <a class="page-link" href="#" aria-label="Previous"
                                @click.prevent="changePage(currentPage - 1)">
                                <span aria-hidden="true">&laquo;</span>
                            </a>
                        </li>
                        <li v-for="page in totalPages" :key="page" class="page-item"
                            :class="{ active: page === currentPage }">
                            <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
                        </li>
                        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                            <a class="page-link" href="#" aria-label="Next"
                                @click.prevent="changePage(currentPage + 1)">
                                <span aria-hidden="true">&raquo;</span>
                            </a>
                        </li>
                        <div class="ml-2">
                            <select class="custom-select" v-model.number="currentPage"
                                @change="changePage(currentPage)">
                                <option v-for="page in totalPages" :key="page" :value="page">{{ page }} / {{ totalPages
                                    }}</option>
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
                                            <input type="text" placeholder="Nhập email" v-model="searchQueries.email"
                                                @input="filterDocuments" class="input-search" />
                                        </div>
                                    </div>
                                </th>

                                <!-- Tên khách hàng column -->
                                <th>
                                    <div class="search-container">
                                        Tên khách hàng
                                        <i class="bi bi-search" @click="toggleSearch('customer_name')"></i>
                                        <div v-if="searchField === 'customer_name'" class="search-box">
                                            <input type="text" placeholder="Nhập tên khách hàng"
                                                v-model="searchQueries.customer_name" @input="filterDocuments"
                                                class="input-search" />
                                        </div>
                                    </div>
                                </th>

                                <!-- Số điện thoại column -->
                                <th>
                                    <div class="search-container">
                                        Số điện thoại
                                        <i class="bi bi-search" @click="toggleSearch('phone_number')"></i>
                                        <div v-if="searchField === 'phone_number'" class="search-box">
                                            <input type="text" placeholder="Nhập số điện thoại"
                                                v-model="searchQueries.phone_number" @input="filterDocuments"
                                                class="input-search" />
                                        </div>
                                    </div>
                                </th>

                                <!-- Mã số thuế column -->
                                <th>
                                    <div class="search-container">
                                        Mã số thuế
                                        <i class="bi bi-search" @click="toggleSearch('tax_code')"></i>
                                        <div v-if="searchField === 'tax_code'" class="search-box">
                                            <input type="text" placeholder="Nhập mã số thuế"
                                                v-model="searchQueries.tax_code" @input="filterDocuments"
                                                class="input-search" />
                                        </div>
                                    </div>
                                </th>

                                <!-- Tên tổ chức column -->
                                <th>
                                    <div class="search-container">
                                        Tên tổ chức
                                        <i class="bi bi-search" @click="toggleSearch('organization_name')"></i>
                                        <div v-if="searchField === 'organization_name'" class="search-box">
                                            <input type="text" placeholder="Nhập tên tổ chức"
                                                v-model="searchQueries.organization_name" @input="filterDocuments"
                                                class="input-search" />
                                        </div>
                                    </div>
                                </th>

                                <!-- Thao tác column (Actions) -->
                                <th>Thao tác</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr v-for="(item, index) in sortedDocuments" :key="index">
                                <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                                <td>{{ item.email }}</td>
                                <td>{{ item.customer_name }}</td>
                                <td>{{ item.phone_number }}</td>
                                <td>{{ item.tax_code }}</td>
                                <td>{{ item.organization_name }}</td>
                                <td>
                                    <a class="dropdown-item" @click="fixDocument(item)"><i
                                            class="bi bi-pencil-square"></i> Sửa</a>
                                    <a class="dropdown-item text-danger" @click="deleteDocument(item)"><i
                                            class="bi bi-trash3"></i> Xóa</a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
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
            searchField: '',
            searchQueries: {
                email: '',
                customer_name: '',
                phone_number: '',
                tax_code: '',
                organization_name: ''
            },
            currentPage: 1,
            itemsPerPage: 8,
            gotoPage: 1,
            sortKey: '',
            sortOrder: 'asc',
            currentDocument: null // Define currentDocument here
        };
    },
    created() {
        this.fetchData();
    },
    computed: {
        filteredDocuments() {
            return this.documents.filter(document => {
                const matchesEmail = document.email.toLowerCase().includes(this.searchQueries.email.toLowerCase());
                const matchesName = document.customer_name.toLowerCase().includes(this.searchQueries.customer_name.toLowerCase());
                const matchesPhone = document.phone_number.toLowerCase().includes(this.searchQueries.phone_number.toLowerCase());
                const matchesTaxCode = document.tax_code.toLowerCase().includes(this.searchQueries.tax_code.toLowerCase());
                const matchesOrganization = document.organization_name.toLowerCase().includes(this.searchQueries.organization_name.toLowerCase());
                return matchesEmail && matchesName && matchesPhone && matchesTaxCode && matchesOrganization;
            });
        },
        sortedDocuments() {
            const sorted = [...this.filteredDocuments];
            if (!this.sortKey) return sorted;

            return sorted.sort((a, b) => {
                let result = a[this.sortKey] > b[this.sortKey] ? 1 : -1;
                return this.sortOrder === 'asc' ? result : -result;
            });
        },
        totalPages() {
            return Math.ceil(this.filteredDocuments.length / this.itemsPerPage);
        }
    },
    methods: {
        async deleteDocument(document) {
            if (confirm('Bạn có chắc chắn muốn xóa người này?')) {
                try {
                    await axios.delete(`/src/data/contact.json/${document.id}`); // Adjust API endpoint as needed
                    this.fetchData();
                } catch (error) {
                    console.error('Error deleting document:', error);
                }
            }
        },
        fixDocument(item) {
            this.currentDocument = { ...item }; // Store the current document
        },
        fetchData() {
            axios.get('/src/data/contact.json')
                .then(response => {
                    this.documents = response.data;
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        },
        changePage(page) {
            if (page < 1 || page > this.totalPages) return;
            this.currentPage = page;
        },
        goToPage() {
            this.changePage(this.gotoPage);
        },
        filterDocuments() {
            this.currentPage = 1;
        },
        toggleSearch(field) {
            this.searchField = this.searchField === field ? '' : field;
        },
        setSortKey(key) {
            this.sortOrder = this.sortKey === key && this.sortOrder === 'asc' ? 'desc' : 'asc';
            this.sortKey = key;
        }
    }
};
</script>



<style scoped>
@import '@/assets/MasterPage.css';
</style>