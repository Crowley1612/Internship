<template>
  <div class="container-fluid h-100">
    <div class="row h-100">
      <Sidebar />
      <div class="col-md-10 p-4">
        <Header />
        <NavBar />
        <div class="row">
          <div class="col-md-3 left-column">
            <div class="controls">
              <button @click="toggleEmailSelect" class="btn btn-info">
                {{ showEmailSelect ? 'Ẩn Chọn Người Ký' : '+ Thêm Vùng Ký' }}
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

          <div class="col-md-6 middle-column">
            <div class="pdf-container" ref="containerRef">
              <canvas v-for="page in pages" :key="page.num" class="pdf-canvas" :ref="'canvas-' + page.num"
                @mousedown="startDrawing(page.num, $event)" @mousemove="draw" @mouseup="endDrawing"></canvas>
            </div>
            <div v-for="(page, pageIndex) in pages" :key="pageIndex">
              <canvas :ref="'canvas-' + page.num" class="pdf-canvas" @mousedown="startDrawing(page.num, $event)"
                @mousemove="draw" @mouseup="endDrawing"></canvas>
              <div v-for="(area, areaIndex) in signatureAreas.filter(a => a.page === page.num)" :key="areaIndex"
                :style="{ top: area.y + 'px', left: area.x + 'px', width: area.width + 'px', height: area.height + 'px' }"
                class="signature-area">
                <span>Signature Area for {{ area.email }}</span>
                <div v-if="hoveredArea === area" class="drawing-buttons">
                  <button @click="deleteSignatureArea(area)" class="btn btn-danger">Xóa</button>
                  <button @click="updateSignatureArea(area)" class="btn btn-warning">Cập nhật</button>
                </div>
              </div>
            </div>
            <div v-if="isDrawing" class="drawing-area"
              :style="{ top: drawingArea.y + 'px', left: drawingArea.x + 'px', width: drawingArea.width + 'px', height: drawingArea.height + 'px' }">
            </div>
          </div>

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
        <div>
          <div class="d-grid gap-2 d-md-flex justify-content-md-end">
            <router-link class="nav-link" to="/Them-nguoi" exact-active-class="active-link">
              <button class="btn btn-secondary me-md-2" type="button" @click="handleBack">Quay lại</button>
            </router-link>
            <router-link class="nav-link" to="/Xac-nhan" exact-active-class="active-link">
              <button class="btn btn-primary" type="button" @click="handleNext">Gửi yêu cầu</button>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
// import NavBar from "../Processing.vue";
// import Sidebar from './layout/Sidebar.vue';
// import Header from './layout/Header.vue';
// Configure PDF.js worker
GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.5.136/build/pdf.worker.min.mjs';

// Reactive properties
const pdfFiles = ref([]);
const pdfUrl = ref('');
const signatureAreas = ref([]);
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

// On component mount
onMounted(async () => {
  // Load PDF files from local storage
  loadPdfFilesFromLocalStorage();

  // Fetch email list
  await fetchEmailList();

  // Render PDF if URL is provided
  if (pdfUrl.value) {
    await nextTick();
    await renderPdf(pdfUrl.value);
  }
});

// Watch for changes in pdfUrl
watch(pdfUrl, async (newUrl) => {
  if (newUrl) {
    await nextTick();
    await renderPdf(newUrl);
  }
});

// Function to load PDF files from local storage
const loadPdfFilesFromLocalStorage = () => {
  const files = localStorage.getItem('pdfFiles');
  if (files) {
    //pdfFiles.value = JSON.parse(files);
    pdfFiles.value = [
      {
        name: "10",
        url: "https://pdfobject.com/pdf/sample.pdf"
      }
    ]
  }
};


// Function to fetch email list
const fetchEmailList = async () => {
  try {
    const response = await fetch('/src/data/contacts.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    emailList.value = data.map(contact => contact.email);
    if (emailList.value.length > 0) {
      selectedEmails.value = [emailList.value[0]];
    }
  } catch (error) {
    console.error('Lỗi tải danh sách email:', error.message);
  }
};

// Function to show selected PDF
const showPdf = (file) => {
  pdfUrl.value = file.url;
};

// Function to render PDF
const renderPdf = async (url) => {
  try {
    const container = containerRef.value;
    if (!container) {
      console.error('Container element is not found.');
      return;
    }

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
      if (!context) {
        console.error('2D context is not available.');
        continue;
      }

      canvas.width = viewport.width;
      canvas.height = viewport.height;
      container.appendChild(canvas);

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };
      await page.render(renderContext).promise;

      pages.value.push({ num: pageNum, canvas });
    }
  } catch (error) {
    console.error('Error rendering PDF:', error.message);
  }
};

// Function to start drawing
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

// Function to draw the signature area
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
    height: Math.abs(currentY - startY),
  };
};

// Function to end drawing
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
      email: signer.email,
    });
    drawingStep++;
  } else {
    alert('Bạn đã vẽ đủ các vùng ký cần thiết.');
  }

  isDrawing.value = false;
  drawingArea.value = { x: 0, y: 0, width: 0, height: 0 };
};

// Function to save signature areas
const saveSignatureArea = () => {
  if (signatureAreas.value.length === 0) {
    alert('Vui lòng khoanh vùng ký trước khi lưu.');
    return;
  }
  console.log('Lưu vùng ký:', signatureAreas.value);
};

// Function to delete a signature area
const deleteSignatureArea = (area) => {
  const index = signatureAreas.value.indexOf(area);
  if (index > -1) {
    signatureAreas.value.splice(index, 1);
    drawingStep--;
  }
};

// Function to update a signature area
const updateSignatureArea = (area) => {
  const index = signatureAreas.value.indexOf(area);
  if (index > -1) {
    // Logic for updating signature area
  }
};

// Toggle email selection visibility
const toggleEmailSelect = () => {
  showEmailSelect.value = !showEmailSelect.value;
};

// Update linked list from selected emails
const updateLinkedList = () => {
  linkedList.value = selectedEmails.value.map((email, index) => ({
    email,
    order: index + 1,
  }));
};

// Update the order of items in the linked list
const updateOrder = (index) => {
  const item = linkedList.value[index];
  linkedList.value.splice(index, 1);
  linkedList.value.splice(item.order - 1, 0, item);
};

// Complete the setup
const completeSetup = () => {
  alert('Thiết lập vùng ký đã hoàn tất.');
};
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.title {
  font-weight: bold;
  margin-bottom: 10px;
}

.file-list {
  padding-left: 0;
  list-style: none;
}

.file-item {
  margin-bottom: 10px;
}

.pdf-viewer {
  margin-top: 20px;
}

.pdf-container {
  border: 1px solid #ccc;
  height: 600px;
  position: relative;
  overflow: auto;
}

.signature-area {
  border: 2px dashed #4caf50;
  position: absolute;
  color: #333;
  padding: 4px;
  cursor: pointer;
}

.drawing-buttons {
  margin-top: 10px;
}

.drawing-area {
  position: absolute;
  border: 2px dashed #2196f3;
}

.controls {
  margin-top: 20px;
}

.email-select-container {
  margin-top: 10px;
}

.selected-emails {
  margin-top: 20px;
}

.selected-emails ul {
  padding-left: 0;
  list-style: none;
}

.selected-emails li {
  margin-bottom: 10px;
}

.pdf-canvas {
  display: block;
  margin: 0 auto;
}

.viewer-title {
  font-weight: bold;
  margin-bottom: 10px;
}
</style>
