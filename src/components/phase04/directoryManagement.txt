<template>
    <div class="container-fluid h-100">
        <div class="row h-100">
            <Sidebar />
            <div class="col-md-10 p-4">
                <Header />
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h1>Quản lý danh mục</h1>
                    <div class="actions">
                        <router-link to="/Upload-file">
                            <button class="btn btn-success">
                                <i class="bi bi-plus"></i> Thêm mới danh mục
                            </button>
                        </router-link>
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
                                <th>
                                    <div class="search-container">
                                        Tên danh mục
                                        <i class="bi bi-search" @click="toggleSearch('directory_name')"></i>
                                        <div v-if="searchField === 'directory_name'" class="search-box">
                                            <input type="text" placeholder="Nhập tên danh mục" v-model="searchQueries.directory_name" @input="filterDocuments" class="input-search" />
                                        </div>
                                    </div>
                                </th>
                                <th>
                                    <div class="search-container">
                                        Ghi chú
                                        <i class="bi bi-search" @click="toggleSearch('note')"></i>
                                        <div v-if="searchField === 'note'" class="search-box">
                                            <input type="text" placeholder="Nhập ghi chú" v-model="searchQueries.note" @input="filterDocuments" class="input-search" />
                                        </div>
                                    </div>
                                </th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in paginatedDocuments" :key="index">
                                <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                                <td>{{ item.directory_name }}</td>
                                <td>{{ item.note }}</td>
                                <td>
                                    <a class="dropdown-item" @click="editDocument(item)"><i class="bi bi-pencil-square"></i> Sửa</a>
                                    <a class="dropdown-item text-danger" @click="deleteDocument(item)"><i class="bi bi-trash3"></i> Xóa</a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <!-- Edit Modal -->
    <div class="modal fade" tabindex="-1" role="dialog" v-if="currentDocument">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Chỉnh sửa danh mục</h5>
                    <button type="button" class="btn-close" @click="currentDocument = null"></button>
                </div>
                <div class="modal-body">
                    <input type="text" v-model="currentDocument.directory_name" class="form-control" placeholder="Tên danh mục">
                    <textarea v-model="currentDocument.note" class="form-control" placeholder="Ghi chú"></textarea>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" @click="currentDocument = null">Đóng</button>
                    <button type="button" class="btn btn-primary" @click="updateDocument">Lưu thay đổi</button>
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
                directory_name: '',
                note: ''
            },
            currentPage: 1,
            itemsPerPage: 5,
            gotoPage: 1,
            sortKey: '',
            sortOrder: 'asc',
            currentDocument: null,
        };
    },
    created() {
        this.fetchData();
    },
    computed: {
        filteredDocuments() {
            return this.documents.filter(document => {
                const matchesDirectoryName = document.directory_name.toLowerCase().includes(this.searchQueries.directory_name.toLowerCase());
                const matchesNote = document.note.toLowerCase().includes(this.searchQueries.note.toLowerCase());
                return matchesDirectoryName && matchesNote;
            });
        },
        paginatedDocuments() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.sortedDocuments.slice(start, end);
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
            if (confirm('Bạn có chắc chắn muốn xóa danh mục này không?')) {
                try {
                    await axios.delete(`/api/directory/${document.id}`); // Adjust API endpoint as needed
                    alert('Document deleted successfully.');
                    this.fetchData();
                } catch (error) {
                    console.error('Error deleting document:', error);
                    alert('Failed to delete the document.');
                }
            }
        },
        changePage(page) {
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
            }
        },
        updatePageSize() {
            this.currentPage = 1;
        },
        editDocument(item) {
            this.currentDocument = { ...item };
        },
        async updateDocument() {
            if (this.currentDocument) {
                try {
                    await axios.put(`/api/directory/${this.currentDocument.id}`, this.currentDocument); // Adjust API endpoint as needed
                    alert('Document updated successfully.');
                    this.currentDocument = null;
                    this.fetchData();
                } catch (error) {
                    console.error('Error updating document:', error);
                    alert('Failed to update the document.');
                }
            }
        },
        fetchData() {
            axios.get('/src/data/directory.json')
                .then(response => {
                    this.documents = response.data;
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        },
        goToPage() {
            if (this.gotoPage >= 1 && this.gotoPage <= this.totalPages) {
                this.changePage(this.gotoPage);
            } else {
                alert('Invalid page number');
            }
        },
        filterDocuments() {
            this.currentPage = 1;
        },
        toggleSearch(field) {
            this.searchField = this.searchField === field ? '' : field;
        },
    }
};
</script>


<style scoped>
@import '@/assets/MasterPage.css';
</style>
