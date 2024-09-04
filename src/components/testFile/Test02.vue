<template>
  <div class="container">
    <div class="main-content">
      <div class="content">
        <h4 class="title">Các tệp PDF đã tải lên:</h4>
        <ul class="file-list">
          <li v-for="file in pdfFiles" :key="file.name" class="file-item">
            <button @click="showPdf(file)" class="btn btn-primary">
              {{ file.name }}
            </button>
          </li>
        </ul>
      </div>

      <!-- PDF Viewer -->
      <div v-if="pdfUrl" class="pdf-viewer">
        <h4 class="viewer-title">PDF Viewer</h4>
        <div class="pdf-container" ref="containerRef" @mousedown="startDrawing" @mousemove="draw" @mouseup="endDrawing">
          <canvas v-for="page in pages" :key="page.num" class="pdf-canvas"></canvas>
          <div v-for="(area, index) in signatureAreas" :key="index"
            :style="{ top: area.y + 'px', left: area.x + 'px', width: area.width + 'px', height: area.height + 'px' }"
            class="signature-area" @mouseenter="hoveredArea = area" @mouseleave="hoveredArea = null">
            <span>Signature Area for {{ area.email }}</span>
            <div v-if="hoveredArea === area" class="drawing-buttons">
              <button @click="deleteSignatureArea(area)" class="btn btn-danger">Xóa</button>
              <button @click="updateSignatureArea(area)" class="btn btn-warning">Cập nhật</button>
            </div>
          </div>
          <div v-if="isDrawing" class="drawing-area"
            :style="{ top: drawingArea.y + 'px', left: drawingArea.x + 'px', width: drawingArea.width + 'px', height: drawingArea.height + 'px' }">
          </div>
        </div>
      </div>
      <div class="controls">
        <button @click="toggleEmailSelect" class="btn btn-info">
          {{ showEmailSelect ? 'Ẩn Chọn Người Ký' : 'Thêm Vùng Ký' }}
        </button>
        <div v-if="showEmailSelect" class="email-select-container">
          <label for="email-select">Chọn người ký:</label>
          <select v-model="selectedEmails" id="email-select" multiple @change="updateLinkedList">
            <option v-for="email in emailList" :key="email" :value="email">
              {{ email }}
            </option>
          </select>
        </div>
        <button @click="saveSignatureArea" class="btn btn-success">Lưu Vùng Ký</button>
        <button @click="completeSetup" class="btn btn-primary">Hoàn tất</button>
      </div>
      <div class="selected-emails">
        <h4>Email và Trình Tự Ký:</h4>
        <ul>
          <li v-for="(item, index) in linkedList" :key="index">
            <div>
              <span>{{ item.email }} - Trình tự: </span>
              <select v-model="item.order" @change="updateOrder(index)">
                <option v-for="num in totalEmails" :key="num" :value="num">{{ num }}</option>
              </select>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed, nextTick } from 'vue';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';

// Ensure the correct path to the worker script
GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.5.136/build/pdf.worker.min.mjs';
const pdfFiles = ref([]);
const pdfUrl = ref('');
signatureAreas: [
  { x: 10, y: 20, width: 100, height: 50, email: 'example@example.com' },
  // Add more signature areas as needed
];
const emailList = ref([]);
const selectedEmails = ref([]);
const showEmailSelect = ref(false);
const linkedList = ref([]);
const containerRef = ref(null);
const isDrawing = ref(false);
const drawingArea = ref({ x: 0, y: 0, width: 0, height: 0 });
const hoveredArea = ref(null);
const pages = ref([]);
let startX = 0;
let startY = 0;
let drawingStep = 0;

onMounted(async () => {
  const files = localStorage.getItem('pdfFiles');
  if (files) {
    //   pdfFiles.value = JSON.parse(files);
    pdfFiles.value = [
      {
        name: "10",
        url: "https://pdfobject.com/pdf/sample.pdf"
      }
    ]
  }

  try {
    const response = await fetch('/src/data/contacts.json');
    const data = await response.json();
    emailList.value = data.map(contact => contact.email);
    if (emailList.value.length > 0) {
      selectedEmails.value = [emailList.value[0]];
    }
  } catch (error) {
    console.error('Lỗi tải danh sách email:', error);
  }

  await nextTick(); // Ensure DOM has been updated
  if (pdfUrl.value) {
    renderPdf(pdfUrl.value);
  }
});

watch(pdfUrl, async (newUrl) => {
  if (newUrl) {
    await nextTick(); // Ensure DOM has been updated
    renderPdf(newUrl);
  }
});

const showPdf = (file) => {
  pdfUrl.value = file.url;
};

const renderPdf = async (url) => {
  const container = containerRef.value;
  if (!container) {
    console.error('Container element is not found.');
    return;
  }

  const loadingTask = getDocument(url);
  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;

  pages.value = []; // Reset pages array
  container.innerHTML = '';

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: 1 });

    // Create a new canvas for each page
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context) {
      console.error('2D context is not available.');
      continue;
    }

    canvas.width = viewport.width;
    canvas.height = viewport.height;
    container.appendChild(canvas);

    const renderContext = {
      canvasContext: context,
      viewport: viewport
    };
    await page.render(renderContext).promise;

    pages.value.push({ num: pageNum, canvas });
  }
};

const startDrawing = (event) => {
  if (isDrawing.value === false && signatureAreas.value.length >= linkedList.value.length) {
    alert('Đã hoàn thành việc vẽ vùng ký cho tất cả người ký.');
    return;
  }

  const container = containerRef.value;
  if (!container) return;
  const rect = container.getBoundingClientRect();
  startX = event.clientX - rect.left;
  startY = event.clientY - rect.top;
  isDrawing.value = true;
};

const draw = (event) => {
  if (!isDrawing.value) return;

  const container = containerRef.value;
  if (!container) return;
  const rect = container.getBoundingClientRect();
  const currentX = event.clientX - rect.left;
  const currentY = event.clientY - rect.top;

  drawingArea.value = {
    x: Math.min(startX, currentX),
    y: Math.min(startY, currentY),
    width: Math.abs(currentX - startX),
    height: Math.abs(currentY - startY)
  };
};

const endDrawing = () => {
  if (!isDrawing.value) return;

  const { width, height } = drawingArea.value;
  if (width < 15 || height < 15) {
    alert('Kích thước vùng ký phải lớn hơn 15x15px.');
    return;
  }

  if (signatureAreas.value.length < linkedList.value.length) {
    const signer = linkedList.value[drawingStep];
    signatureAreas.value.push({
      ...drawingArea.value,
      email: signer.email
    });
    drawingStep++;
  } else {
    alert('Bạn đã vẽ đủ các vùng ký cần thiết.');
  }

  isDrawing.value = false;
  drawingArea.value = { x: 0, y: 0, width: 0, height: 0 };
};

const saveSignatureArea = () => {
  if (signatureAreas.value.length === 0) {
    alert('Vui lòng khoanh vùng ký trước khi lưu.');
    return;
  }
  console.log('Lưu vùng ký:', signatureAreas.value);
};

const deleteSignatureArea = (areaToDelete) => {
  const indexToDelete = signatureAreas.value.indexOf(areaToDelete);

  if (indexToDelete !== -1) {
    signatureAreas.value.splice(indexToDelete, 1);
    drawingStep--;

    const signerIndex = linkedList.value.findIndex(item => item.email === areaToDelete.email);
    if (signerIndex !== -1) {
      drawingStep = signerIndex;
    }
  }
};

const updateSignatureArea = (areaToUpdate) => {
  const index = signatureAreas.value.indexOf(areaToUpdate);
  if (index > -1) {
    signatureAreas.value[index] = { ...drawingArea.value, email: areaToUpdate.email };
    drawingStep = linkedList.value.findIndex(item => item.email === areaToUpdate.email) + 1;
  }
};

const completeSetup = () => {
  console.log('Hoàn tất thiết lập vùng ký.');
};

const toggleEmailSelect = () => {
  showEmailSelect.value = !showEmailSelect.value;
};

const updateLinkedList = () => {
  linkedList.value = selectedEmails.value.map((email, index) => ({
    email: email,
    order: index + 1
  }));
};

const updateOrder = (index) => {
  linkedList.value.sort((a, b) => a.order - b.order);
};

const totalEmails = computed(() => linkedList.value.length > 0 ? Math.max(...linkedList.value.map(item => item.order)) + 1 : 1);
</script>

<style scoped>
/* @import '../assets/Display.css'; */
</style>