<template>
    <div class="container-fluid h-100">
        <div class="row h-100">
            <Sidebar />
            <div class="col p-4">
                <Header />
                <h1 class="text-center mb-4">Tải lên tài liệu mới</h1>

                <!-- File Upload Area -->
                <div class="upload-area" @dragover.prevent @drop="handleDrop">
                    <div class="upload-icon">
                        <i class="bi bi-cloud-upload"></i>
                    </div>
                    <div class="upload-text">
                        <p>Kéo và thả tài liệu ở đây hoặc</p>
                        <input type="file" ref="fileInput" class="d-none" @change="handleFileSelect"
                            accept=".pdf,.doc,.docx,.txt,.xml,.xls,.xlsx,.png,.jpeg,.jpg" />
                        <button @click="triggerFileSelect" class="btn btn-primary" :disabled="uploadedFiles.length > 0">
                            Tải lên từ thiết bị
                        </button>
                    </div>
                    <div class="upload-info text-center mt-4">
                        <p>Định dạng được hỗ trợ: pdf, docx, doc, txt, xml, xls, xlsx, png, jpeg, jpg</p>
                        <p>Kích thước file nhỏ hơn 4MB</p>
                    </div>
                </div>

                <!-- File Upload Progress -->
                <div v-if="uploadProgress > 0" class="mt-4">
                    <div class="progress">
                        <div class="progress-bar" role="progressbar" :style="{ width: uploadProgress + '%' }"
                            :aria-valuenow="uploadProgress" aria-valuemin="0" aria-valuemax="100">
                            {{ uploadProgress }}%
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, reactive } from 'vue';
import removeAccents from 'remove-accents';
import axios from 'axios';
import { useRouter } from 'vue-router';
import Sidebar from '../layout/Sidebar.vue';
import Header from '../layout/Header.vue';

export default {
    components: {
        Sidebar,
        Header,
    },
    setup() {
        const router = useRouter();
        const uploadProgress = ref(0);
        const uploadedFiles = reactive([]);

        const fileInput = ref(null);

        const handleFileSelect = (e) => {
            handleFiles(e.target.files);
        };

        const handleFiles = (files) => {
            if (uploadedFiles.length > 0) {
                alert('Bạn chỉ được tải lên 1 file duy nhất.');
                return;
            }

            Array.from(files).forEach(file => {
                if (file.size > 4 * 1024 * 1024) {
                    alert(`File ${file.name} vượt quá kích thước cho phép (4MB)`);
                } else {
                    uploadFile(file);
                }
            });
        };

        const uploadFile = async (file) => {
            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await axios.post('http://localhost:5000/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    responseType: 'blob',
                    onUploadProgress: (progressEvent) => {
                        if (progressEvent.lengthComputable) {
                            uploadProgress.value = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        }
                    },
                });

                const originalFilename = file.name.replace(/\.[^/.]+$/, "");
                const convertedFile = new File([response.data], `${originalFilename}.pdf`, { type: 'application/pdf' });

                uploadedFiles.push(convertedFile);

                const fileObject = {
                    name: convertedFile.name,
                    url: URL.createObjectURL(convertedFile),
                };

                localStorage.setItem('pdfFiles', JSON.stringify([fileObject]));

                router.push({
                    name: 'EditFile',
                    params: {
                        fileName: convertedFile.name,
                        fileUrl: fileObject.url,
                    },
                });

                // Clean up after file is no longer needed
                URL.revokeObjectURL(fileObject.url);
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        };

        const triggerFileSelect = () => {
            fileInput.value.click();
        };

        return {
            uploadProgress,
            uploadedFiles,
            fileInput,
            handleFileSelect,
            triggerFileSelect,
            handleDrop: (e) => handleFiles(e.dataTransfer.files),
        };
    },
};
</script>


<style scoped>
@import '@/assets/UploadFile.css';
</style>