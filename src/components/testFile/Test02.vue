<template>
  <div class="container">
    <NavBar />
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
        <div class="pdf-container">
          <canvas ref="canvasRef" @mousedown="startDrawing" @mousemove="draw" @mouseup="stopDrawing"></canvas>
          <div v-for="(area, index) in signatureAreas" :key="index"
            :style="{ top: area.y + 'px', left: area.x + 'px', width: area.width + 'px', height: area.height + 'px' }"
            class="signature-area"
            @mouseenter="hoveredArea = area"
            @mouseleave="hoveredArea = null">
            <span>Signature Area for {{ area.email }}</span>
            <div v-if="hoveredArea === area" class="drawing-buttons">
              <button @click="deleteSignatureArea(area)" class="btn btn-danger">Xóa</button>
              <button @click="updateSignatureArea(area)" class="btn btn-warning">Cập nhật</button>
            </div>
          </div>
          <div v-if="isDrawing" 
            class="drawing-area"
            :style="{ top: drawingArea.y + 'px', left: drawingArea.x + 'px', width: drawingArea.width + 'px', height: drawingArea.height + 'px' }">
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
  </div>
</template>

<script setup>
import { ref, onMounted ,onBeforeUnmount, watch, computed, nextTick } from 'vue';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
//import NavBar from "./Processing.vue";

// Ensure the correct path to the worker script
GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.5.136/build/pdf.worker.min.mjs';

const pdfFiles = ref([]);
const pdfUrl = ref('');
const signatureAreas = ref([]);
const emailList = ref([]);
const selectedEmails = ref([]);
const showEmailSelect = ref(false);
const linkedList = ref([]);
const containerRef = ref(null);
const canvasRef = ref(null);
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
    pdfFiles.value = JSON.parse(files);
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
// mounted() {
//     const element = this.$refs.someElement;
//     console.log(element); // Check if element is null
//     if (element) {
//         // Perform operations on the element
//     } else {
//         console.error('Element is null');
//     }
// };
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
  isDrawing.value = true;
  const canvas = canvasRef.value;
  if (canvas) {
    const rect = canvas.getBoundingClientRect();
    drawingArea.value.startX = event.clientX - rect.left;
    drawingArea.value.startY = event.clientY - rect.top;
  }
};


const draw = (event) => {
  if (!isDrawing.value) return;

  const canvas = canvasRef.value;
  if (canvas) {
    const rect = canvas.getBoundingClientRect();
    const currentX = event.clientX - rect.left;
    const currentY = event.clientY - rect.top;

    drawingArea.value.width = currentX - drawingArea.value.startX;
    drawingArea.value.height = currentY - drawingArea.value.startY;

    const context = canvas.getContext('2d');
    if (context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.strokeRect(
        drawingArea.value.startX,
        drawingArea.value.startY,
        drawingArea.value.width,
        drawingArea.value.height
      );
    }
  }
};
const stopDrawing = () => {
  isDrawing.value = false;
};

onMounted(async () => {
  const canvas = canvasRef.value;
  if (canvas) {
    canvas.width = 800; // Set canvas width
    canvas.height = 600; // Set canvas height
  }
});

onBeforeUnmount(() => {
  const canvas = canvasRef.value;
  if (canvas) {
    const context = canvas.getContext('2d');
    if (context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
});

// const endDrawing = () => {
//   if (!isDrawing.value) return;

//   const { width, height } = drawingArea.value;
//   if (width < 15 || height < 15) {
//     alert('Kích thước vùng ký phải lớn hơn 15x15px.');
//     return;
//   }

//   if (signatureAreas.value.length < linkedList.value.length) {
//     const signer = linkedList.value[drawingStep];
//     signatureAreas.value.push({
//       ...drawingArea.value,
//       email: signer.email
//     });
//     drawingStep++;
//   } else {
//     alert('Bạn đã vẽ đủ các vùng ký cần thiết.');
//   }

//   isDrawing.value = false;
//   drawingArea.value = { x: 0, y: 0, width: 0, height: 0 };
// };

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
    width: fit-content;
}

.btn-info {
    background-color: #17a2b8;
    color: #fff;
    width: fit-content;
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
    overflow-y: auto;
}
.pdf-canvas {
    z-index: 1;
    height: fit-content;
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
    width: fit-content;
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
    width: fit-content;
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
