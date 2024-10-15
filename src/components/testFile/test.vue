<template>
  <div class="container-fluid h-100">
    <div class="row h-100">
      <Sidebar />
      <div class="col-md-10 p-4">
        <Header />
        <Navbar />
        <div class="row">
          <!-- Left Column: Controls -->
          <div class="col-md-3 left-column">
            <div class="controls">
              <button @click="toggleEmailSelect" class="btn btn-info">
                {{ showEmailSelect ? 'Ẩn Chọn Người Ký' : '+ Thêm Vùng Ký' }}
              </button>
              <div v-if="showEmailSelect">
                <label for="email-select">Chọn người ký và Trình Tự Ký:</label>
                <select v-model="selectedEmails" id="email-select" multiple @change="updateLinkedList">
                  <option v-for="(item, index) in linkedList" :key="index" :value="item.email">
                    {{ item.email }} - Trình tự: {{ item.order }}
                  </option>
                </select>
              </div>
              <button @click="saveSignatureArea" class="btn btn-success">Lưu Vùng Ký</button>
              <button @click="completeSetup" class="btn btn-primary">Hoàn tất</button>
            </div>
          </div>

          <!-- Middle Column: PDF Viewer and Signature Drawing -->
          <div class="col-md-6 middle-column" style="position: relative;">
  <div class="pdf-container" ref="containerRef"
       @mousedown="startDrawing(null, $event)"
       @mousemove="draw"
       @mouseup="endDrawing">
    <canvas v-for="page in pages" :key="page.num"
            :ref="'canvas-' + page.num"
            @mousedown="startDrawing(page.num, $event)"
            @mousemove="draw"
            @mouseup="endDrawing"></canvas>

    <!-- Signature Areas -->
    <div v-for="(area, index) in signatureAreas" :key="index"
         :style="{ top: area.y + 'px', left: area.x + 'px', width: 'auto', height: 'auto', position: 'absolute' }"
         class="signature-area"
         @mousedown="startDragging($event, area)"
         @mousemove="drag"
         @mouseup="endDragging"
         @click="toggleButtons(index)">
      <span>Vùng ký cho <br>{{ area.email }}</span>
      <div class="drawing-buttons" v-if="area.showButtons">
        <button @click="deleteSignatureArea(area)" class="btn btn-danger">Xóa</button>
        <button @click="updateSignatureArea(area)" class="btn btn-warning">Cập nhật</button>
      </div>
    </div>
  </div>

  <div v-if="isDrawing" class="drawing-area"
       :style="{ top: drawingArea.y + 'px', left: drawingArea.x + 'px', width: drawingArea.width + 'px', height: drawingArea.height + 'px' }">
  </div>
</div>


          <!-- Right Column: File List -->
          <div class="col-md-3 right-column">
            <h4 class="title">Tài liệu ({{ pdfFiles.length }})</h4>
            <ul class="file-list">
              <li v-for="file in pdfFiles" :key="file.name" class="file-item">
                <button @click="showPdf(file)" class="btn btn-primary">
                  {{ file.name }}
                </button>
              </li>
            </ul>
          </div>
        </div>

        <!-- Navigation Buttons -->
        <div class="d-grid gap-2 d-md-flex justify-content-md-end">
          <button class="btn btn-secondary me-md-2" type="button" @click="handleBack">Quay lại</button>
          <button class="btn btn-primary" type="button" @click="handleNext">Gửi yêu cầu</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import Navbar from '../layout/Processing.vue';
import Sidebar from '../layout/Sidebar.vue';
import Header from '../layout/Header.vue';
import { useRouter } from 'vue-router';

GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.5.136/build/pdf.worker.min.mjs';

const pdfFiles = ref([]);
const pdfUrl = ref('');
const signatureAreas = ref([]);
const selectedEmails = ref([]);
const showEmailSelect = ref(false);
const linkedList = ref([]);
const containerRef = ref(null);
const isDrawing = ref(false);
const drawingArea = ref({ x: 0, y: 0, width: 0, height: 0 });
const hoveredArea = ref(null);
const pages = ref([]);
const startX = ref(0);
const startY = ref(0);
let drawingStep = 0;
const router = useRouter();
let draggingArea = null;
let offsetX = 0;
let offsetY = 0;

const startDragging = (event, area) => {
  draggingArea = area;
  const rect = containerRef.value.getBoundingClientRect();
  offsetX = event.clientX - rect.left - area.x;
  offsetY = event.clientY - rect.top - area.y;

  // Ngăn không cho sự kiện chuột nổi lên
  event.preventDefault();
};

const drag = (event) => {
  if (!draggingArea) return;

  const rect = containerRef.value.getBoundingClientRect();
  draggingArea.x = event.clientX - rect.left - offsetX;
  draggingArea.y = event.clientY - rect.top - offsetY;
};

const endDragging = () => {
  draggingArea = null;
};

const toggleButtons = (index) => {
  signatureAreas.value.forEach((area, idx) => {
    area.showButtons = idx === index ? !area.showButtons : false; // Toggle for clicked area, hide others
  });
};


const handleBack = () => {
  router.push('/Them-nguoi');
};

const handleNext = () => {
  router.push('/Xac-nhan');
};

onMounted(async () => {
  loadPdfFilesFromLocalStorage();
  await fetchSigners();

  if (linkedList.value.length > 0) {
    selectedEmails.value = linkedList.value.map(item => item.email);
  }

  if (pdfUrl.value) {
    await nextTick();
    await renderPdf(pdfUrl.value);
  }
});

watch(pdfUrl, async (newUrl) => {
  if (newUrl) {
    await nextTick();
    await renderPdf(newUrl);
  }
});

const loadPdfFilesFromLocalStorage = () => {
  const files = localStorage.getItem('pdfFiles');
  if (files) {
    pdfFiles.value = [
      { name: "Sample PDF", url: "https://pdfobject.com/pdf/sample.pdf" }
    ];
  }
};

const fetchSigners = async () => {
  try {
    const savedContacts = localStorage.getItem('signersRecipientsData');
    if (savedContacts) {
      const data = JSON.parse(savedContacts);
      linkedList.value = data.signers.map((signer, index) => ({ email: signer.email, order: index + 1 }));
      selectedEmails.value = linkedList.value.map(item => item.email);
    }
  } catch (error) {
    console.error('Error fetching signers list:', error.message);
  }
};

const showPdf = (file) => {
  pdfUrl.value = file.url;
};

const renderPdf = async (url) => {
  try {
    const container = containerRef.value;
    if (!container) return;

    const loadingTask = getDocument(url);
    const pdf = await loadingTask.promise;
    const numPages = pdf.numPages;

    pages.value = [];
    container.innerHTML = '';

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: 1 });

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) continue;

      canvas.width = viewport.width;
      canvas.height = viewport.height;
      container.appendChild(canvas);

      const renderContext = { canvasContext: context, viewport: viewport };
      await page.render(renderContext).promise;

      pages.value.push({ num: pageNum, canvas });
    }
  } catch (error) {
    console.error('Error rendering PDF:', error.message);
  }
};

const toggleEmailSelect = () => {
  showEmailSelect.value = !showEmailSelect.value;
  if (showEmailSelect.value) {
    fetchSigners();
  }
};

const startDrawing = (pageNum, event) => {
  if (isDrawing.value || signatureAreas.value.length >= linkedList.value.length) {
    // alert('Đã hoàn thành việc vẽ vùng ký cho tất cả người ký.');
    return;
  }

  const rect = event.target.getBoundingClientRect();
  startX.value = event.clientX - rect.left;
  startY.value = event.clientY - rect.top;
  isDrawing.value = true;

  drawingArea.value = { x: startX.value, y: startY.value, width: 0, height: 0 };
};

const draw = (event) => {
  if (!isDrawing.value) return;

  const rect = event.target.getBoundingClientRect();
  const currentX = event.clientX - rect.left;
  const currentY = event.clientY - rect.top;

  drawingArea.value = {
    x: startX.value,
    y: startY.value,
    width: currentX - startX.value,
    height: currentY - startY.value,
  };
};

const endDrawing = () => {
  if (isDrawing.value) {
    const email = selectedEmails.value[drawingStep];
    signatureAreas.value.push({
      ...drawingArea.value,
      email,
    });
    drawingStep++;

    isDrawing.value = false;
    drawingArea.value = { x: 0, y: 0, width: 0, height: 0 };
  }
};

const saveSignatureArea = () => {
  if (signatureAreas.value.length === 0) {
    alert('Vui lòng vẽ ít nhất một vùng ký.');
  } else {
    alert('Vùng ký đã được lưu thành công.');
  }
};

const completeSetup = () => {
  if (signatureAreas.value.length === 0) {
    alert('Vui lòng vẽ ít nhất một vùng ký.');
  } else {
    alert('Đã hoàn thành thiết lập ký.');
    handleNext();
  }
};

const deleteSignatureArea = (area) => {
  signatureAreas.value = signatureAreas.value.filter(item => item !== area);
  drawingStep--;
};

const updateSignatureArea = (area) => {
  // Implement logic for updating a specific signature area
};
</script>
  
<style scoped>
@import '@/assets/Display.css';
.pdf-container {
  position: relative;
  overflow: hidden;
}

.signature-area {
  position: absolute;
  border: 2px dashed #007bff;
  background: rgba(0, 123, 255, 0.1);
}

.drawing-area {
  position: absolute;
  border: 2px solid #28a745;
  background: rgba(40, 167, 69, 0.2);
}
</style>