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

          
          <div class="col-md-6 middle-column">
            <div class="pdf-container" ref="containerRef">
              <canvas v-for="page in pages" :key="page.num" class="pdf-canvas" :ref="'canvas-' + page.num"
                @mousedown="startDrawing(page.num, $event)" @mousemove="draw" @mouseup="endDrawing"></canvas>
              <!-- Vùng ký đã vẽ -->
              <div v-for="(area, index) in signatureAreas" :key="index"
                :style="{ top: area.y + 'px', left: area.x + 'px', width: area.width + 'px', height: area.height + 'px' }"
                class="signature-area" @mouseover="hoveredArea = area" @mouseleave="hoveredArea = null">
                <span>Vùng ký cho {{ area.email }}</span>
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
            <button class="btn btn-secondary me-md-2" type="button" @click="handleBack">Quay lại</button>
            <button class="btn btn-primary" type="button" @click="handleNext">Gửi yêu cầu</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted, watch, computed, nextTick } from 'vue';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import * as pdfjsLib from "pdfjs-dist/build/pdf.mjs";
import Navbar from '../layout/Processing.vue';
import Sidebar from '../layout/Sidebar.vue';
import Header from '../layout/Header.vue';
import { useRouter } from 'vue-router';
// Configure PDF.js worker
GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.5.136/build/pdf.worker.min.mjs';
const router = useRouter();
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

const handleBack = () => {
  router.push('/Them-nguoi');
};

// Function to handle the "Next" button click
const handleNext = () => {
  router.push('/Xac-nhan');
};

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

const fetchEmailList = async () => {
  try {
    const savedContacts = localStorage.getItem('formData');
    if (savedContacts) {
      const data = JSON.parse(savedContacts);
      emailList.value = [
        ...data.signers.map(signer => signer.email),
        ...data.recipients.map(recipient => recipient.email)
      ];
      if (emailList.value.length > 0) {
        selectedEmails.value = [emailList.value[0]];
      }
    } else {
      console.warn('Không tìm thấy dữ liệu trong localStorage.');
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
const startDrawing = (pageNum, event) => {
  console.log("Start Drawing", { pageNum, event });
  if (isDrawing.value === false && signatureAreas.value.length >= linkedList.value.length) {
    alert('Đã hoàn thành việc vẽ vùng ký cho tất cả người ký.');
    return;
  }

  const container = containerRef.value;
  if (!container) return;

  const canvas = event.target;
  const rect = canvas.getBoundingClientRect();
  startX = event.clientX - rect.left;
  startY = event.clientY - rect.top;
  isDrawing.value = true;

  drawingArea.value = {
    x: startX,
    y: startY,
    width: 0,
    height: 0,
    page: pageNum,
  };
};

// Function to draw the rectangle
const draw = (event) => {
  console.log("Drawing", event);
  if (!isDrawing.value) return;

  const container = containerRef.value;
  if (!container) return;

  const canvas = event.target;
  const rect = canvas.getBoundingClientRect();
  const currentX = event.clientX - rect.left;
  const currentY = event.clientY - rect.top;

  drawingArea.value = {
    ...drawingArea.value,
    width: Math.abs(currentX - startX),
    height: Math.abs(currentY - startY),
  };

  // Optionally draw the rectangle as feedback
  context.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas for testing
  context.strokeRect(drawingArea.value.x, drawingArea.value.y, drawingArea.value.width, drawingArea.value.height);
};

// Function to end drawing
const endDrawing = (event) => {
  console.log("End Drawing", event);
  if (!isDrawing.value) return;

  isDrawing.value = false;

  if (linkedList.value.length > 0 && drawingStep < linkedList.value.length) {
    const canvas = event.target;
    const pageNum = pages.value.find(p => p.canvas === canvas)?.num;
    if (pageNum === undefined) {
      console.error('Page number not found for the canvas.');
      return;
    }

    signatureAreas.value.push({
      page: pageNum,
      ...drawingArea.value,
      email: linkedList.value[drawingStep].email,
      borderColor: 'red',
    });
    drawingStep++;
  } else {
    alert('Vui lòng chọn người ký trước khi vẽ vùng ký.');
  }

  drawingArea.value = { x: 0, y: 0, width: 0, height: 0 };
};

// Function to toggle email select dropdown
const toggleEmailSelect = () => {
  showEmailSelect.value = !showEmailSelect.value;
};

// Function to add a signer to the list
const addSigner = (email, order) => {
  const existingIndex = linkedList.value.findIndex(signer => signer.order === order);
  if (existingIndex !== -1) {
    linkedList.value.splice(existingIndex + 1, 0, {
      email: email,
      order: order + 1,
      selectedAt: new Date().getTime(),
    });
    for (let i = existingIndex + 2; i < linkedList.value.length; i++) {
      linkedList.value[i].order += 1;
    }
  } else {
    // Nếu không có người ký với thứ tự trùng, thêm trực tiếp vào danh sách
    linkedList.value.push({
      email: email,
      order: order,
      selectedAt: new Date().getTime(),
    });
  }

  // Sắp xếp lại danh sách theo thứ tự và thời gian chọn
  linkedList.value = linkedList.value.sort((a, b) => {
    if (a.order === b.order) {
      return a.selectedAt - b.selectedAt;
    }
    return a.order - b.order;
  });
};

// Function to update the linked list
const updateLinkedList = () => {
  // Sắp xếp dựa trên trình tự ký
  linkedList.value = selectedEmails.value.map((email, index) => ({
    email: email,
    order: index + 1, // Thứ tự ký
    selectedAt: new Date().getTime(), // Thời gian được chọn để so sánh thứ tự
  })).sort((a, b) => {
    // Sắp xếp dựa vào thứ tự ký và thời gian chọn
    if (a.order === b.order) {
      return a.selectedAt - b.selectedAt; // Ai được chọn trước sẽ ở trước
    }
    return a.order - b.order;
  });
};

// Function to update signature area
const updateSignatureArea = (area) => {
  const updatedArea = signatureAreas.value.find(a => a === area);
  if (updatedArea) {
    updatedArea.email = prompt('Cập nhật email cho vùng ký:', updatedArea.email) || updatedArea.email;
  }
};

// Function to save signature area
const saveSignatureArea = () => {
  if (signatureAreas.value.length !== linkedList.value.length) {
    alert('Vui lòng hoàn thành việc vẽ vùng ký cho tất cả người ký.');
    return;
  }

  // Save signature areas
  localStorage.setItem('signatureAreas', JSON.stringify(signatureAreas.value));
  alert('Đã lưu vùng ký thành công.');
};

// Function to complete the setup
const completeSetup = () => {
  saveSignatureArea();
  // Redirect to the next step or perform any further actions
};

// Function to update order in the linked list
const updateOrder = (index) => {
  const reorderedList = [...linkedList.value];
  const [movedItem] = reorderedList.splice(index, 1);
  reorderedList.splice(movedItem.order - 1, 0, movedItem);
  linkedList.value = reorderedList.map((item, idx) => ({
    ...item,
    order: idx + 1,
  }));
};

// Function to delete a signature area
const deleteSignatureArea = (area) => {
  signatureAreas.value = signatureAreas.value.filter(a => a !== area);
};

// Computed properties
const totalEmails = computed(() => emailList.value.length);

</script>

<style scoped>
/* Container and Layout */
.container {
    display: grid;
    width: 100%;
    grid-template-columns: 1fr 2.5fr 1fr; /* Slightly adjusted column widths for better balance */
    gap: 20px;
    padding: 20px;
    background-color: #f4f4f9;
}

.left-column,
.middle-column,
.right-column {
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    padding: 20px;
    transition: box-shadow 0.3s ease-in-out;
}

.left-column:hover,
.middle-column:hover,
.right-column:hover {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

/* Buttons and Controls */
.btn {
    padding: 5px 8px;
    font-size: 16px;
    border-radius: 6px;
    transition: all 0.3s;
    cursor: pointer;
    margin-bottom: 15px;
    width: 100%; /* Full width buttons */
    border: none;
    text-align: center;
}

.btn-primary {
    background-color: #007bff;
    color: #fff;
    width: auto;
}
.btn-secondary {
    background-color: #6c757d;
    color: #fff;
    width: auto;
}
.btn-success {
    background-color: #28a745;
    color: #fff;
}

.btn-info {
    background-color: #17a2b8;
    color: #fff;
}

.btn-danger {
    background-color: #dc3545;
    color: #fff;
}

.btn-warning {
    background-color: #ffc107;
    color: #212529;
}

.btn:focus {
    outline: 3px solid #007bff;
    outline-offset: -2px;
}

.btn:hover {
    opacity: 0.9;
}

/* Email Selection and Order */
.email-select-container label {
    font-size: 14px;
    margin-bottom: 10px;
    display: block;
    color: #495057;
}

.email-select-container select {
    width: 100%;
    padding: 10px;
    margin-bottom: 15px;
    border: 1px solid #ced4da;
    border-radius: 4px;
    font-size: 14px;
    background-color: #ffffff;
    color: #495057;
    transition: border-color 0.3s;
}

.email-select-container select:focus {
    border-color: #80bdff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
}

/* Signature Areas */
.signature-area {
    position: absolute;
    border: 2px solid #007bff;
    background-color: rgba(0, 123, 255, 0.1);
    box-sizing: border-box;
    border-radius: 4px;
}

.drawing-area {
    position: absolute;
    border: 2px dashed #6c757d;
    background-color: rgba(108, 117, 125, 0.1);
    box-sizing: border-box;
    border-radius: 4px;
}

.pdf-container {
    position: relative;
    background-color: #f8f9fa;
    border: 1px solid #ced4da;
    border-radius: 8px;
    height: calc(100vh - 40px); /* Adjust height to fit within viewport */
    overflow-y: auto;
}
.pdf-canvas {
    z-index: 1;
}

.signature-area, .drawing-area {
    position: absolute;
    z-index: 2; /* Ensure it's above the canvas */
    border: 2px dashed #00f;
}
/* File List */
.right-column .title {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 20px;
    color: #343a40;
    border-bottom: 2px solid #ced4da;
    padding-bottom: 10px;
}

.file-list {
    list-style: none;
    padding: 0;
    margin: 0;
    max-height: 300px; /* Limit file list height */
    overflow-y: auto;
}

.file-item {
    margin-bottom: 10px;
    padding: 10px;
    background-color: #e9ecef;
    border-radius: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: background-color 0.3s;
}

.file-item:hover {
    background-color: #dee2e6;
}

.file-item button {
    background-color: #007bff;
    color: #fff;
    padding: 8px 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.2s;
}

.file-item button:focus {
    outline: 3px solid #007bff;
    outline-offset: -2px;
}

.file-item button:hover {
    background-color: #0056b3;
    transform: translateY(-2px);
}

/* Responsive Design */
@media (max-width: 1024px) {
    .container {
        grid-template-columns: 1fr 2fr 1fr; /* Adjusted layout for medium screens */
    }

    .btn {
        font-size: 14px;
    }
}

@media (max-width: 768px) {
    .container {
        grid-template-columns: 1fr; /* Single column layout */
    }

    .left-column,
    .middle-column,
    .right-column {
        padding: 15px;
    }

    .btn {
        width: auto; /* Reset button width on small screens */
        padding: 10px;
        font-size: 14px;
    }
}

@media (max-width: 576px) {
    .container {
        padding: 15px;
    }

    .btn {
        padding: 8px 12px;
        font-size: 12px;
    }
}
</style>