<template>
  <div class="container-fluid h-100">
    <div class="row h-100">
      <Sidebar />
      <div class="col-md-10 p-4 content-area">
        <Header />
        <Navbar />
        <div class="row">
          <!-- Left Column -->
          <div class="col-md-3 left-column bg-light p-3 rounded shadow-sm">
            <h5 class="text-primary mb-3">Chọn Người Ký</h5>
            <button @click="toggleEmailSelect" class="btn btn-info w-100 mb-3">
              {{ showEmailSelect ? 'Ẩn Chọn Người Ký' : '+ Thêm Vùng Ký' }}
            </button>
            <div v-if="showEmailSelect">
              <label for="email-select" class="form-label">Người ký và Trình Tự Ký:</label>
              <select v-model="selectedEmails" id="email-select" class="form-select mb-3" multiple
                @change="updateLinkedList">
                <option v-for="(item, index) in linkedList" :key="index" :value="item.email">
                  {{ item.email }} - Trình tự: {{ item.order }}
                </option>
              </select>
            </div>
            <button @click="saveRectangles" class="btn btn-success w-100 mb-2">Lưu Vùng Ký</button>
            <button @click="enableDrawing" class="btn btn-warning w-100 mb-2">Tạo Vùng Ký</button>
            <button @click="completeSetup" class="btn btn-primary w-100">Hoàn tất</button>
          </div>

          <!-- Middle Column -->
          <div class="col-md-6 middle-column bg-white p-3 rounded shadow-sm">
            <div class="text-center mb-3">
              <div class="d-flex justify-content-between align-items-center">
                <button @click="cancelRectangles" class="btn btn-danger">Hủy Vùng Ký</button>
                <input type="file" accept=".pdf" @change="onFileChange" ref="fileInput" hidden />
                <button @click="$refs.fileInput.click()" class="btn btn-secondary">Chọn file PDF</button>
              </div>
            </div>

            <div class="d-flex justify-content-center my-4">
              <div class="d-flex align-items-center me-4">
                <button @click="scaleDown" class="btn btn-outline-secondary">-</button>
                <span class="mx-2">{{ (scale * 100).toFixed(0) }}%</span>
                <button @click="scaleUp" class="btn btn-outline-secondary">+</button>
              </div>
              <div class="d-flex align-items-center">
                <button @click="backTrangky" class="btn btn-outline-secondary">←</button>
                <span class="mx-2">Trang {{ Trangky }} / {{ totalPage }}</span>
                <button @click="nextTrangky" class="btn btn-outline-secondary">→</button>
              </div>
            </div>

            <div class="pdf-viewer">
              <canvas ref="pdfCanvas" style="display: none"></canvas>
              <v-stage ref="stageRef" :config="stageConfig" @mousedown="handleMouseDown" @mouseup="handleMouseUp"
                @mousemove="handleMouseMove" class="pdf-stage">
                <v-layer>
                  <v-image :image="image" />
                  <v-rect v-if="drawing" :x="startX" :y="startY" :width="currentWidth" :height="currentHeight"
                    fill="rgba(0, 0, 255, 0.3)" />
                  <v-rect v-if="rec" :x="rec.x" :y="rec.y" :width="rec.width" :height="rec.height"
                    fill="rgba(0, 0, 255, 0.3)" />
                </v-layer>
              </v-stage>
            </div>
          </div>

          <!-- Right Column -->
          <div class="col-md-3 right-column bg-light p-3 rounded shadow-sm">
            <h5 class="text-primary mb-3">Tài liệu ({{ pdfFiles.length }})</h5>
            <ul class="list-group">
            
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, toRaw, } from 'vue'
import Navbar from '../layout/Processing.vue';
import Sidebar from '../layout/Sidebar.vue';
import Header from '../layout/Header.vue';
import * as pdfjsLib from "pdfjs-dist/build/pdf.mjs";
import { useRouter } from 'vue-router';
// this import is needed in to configure a default worker for pdfjs
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.5.136/build/pdf.worker.min.mjs';
import {cloneDeep} from "lodash-es";

defineProps<{ msg: string }>()
const pdfCanvas = ref(null);
const pdfDocument = ref<any>();
const totalPage = ref();
const Trangky = ref(1);
const viewportConst = reactive<any>({});
const scale = ref(1);
const pdfFiles = ref([]);
const router = useRouter();
const stageConfig = reactive({
  width: 800,
  height: 800,
});
const image = ref<any>();
const startDrawing = ref(false);
const drawing = ref(false);
const startX = ref(0);
const startY = ref(0);
const rec = ref<any>([]);
const stageRef = ref();
const currentWidth = ref(0);
const currentHeight = ref(0);
const fileInput = ref();
const showEmailSelect = ref(false);
interface Signer {
  email: string;
  order: number;
}
const linkedList = ref<Signer[]>([]);
const drawingState = ref(0);
const signatureAreas = ref([]);
const selectedEmails = ref<string[]>([]);

onMounted(async () => {
  await fetchSigners();

  if (linkedList.value.length > 0) {
    selectedEmails.value = linkedList.value.map(item => item.email);
  }
  //Production
  const url = '/test.pdf';

  const loadingTask = pdfjsLib.getDocument(url);
  pdfDocument.value = await loadingTask.promise;
  totalPage.value = pdfDocument.value.numPages;
  await getImageData();
});

const getImageData = async () => {
  const page = await toRaw(pdfDocument.value).getPage(Trangky.value);
  const canvas: any = pdfCanvas.value;
  const viewport = page.getViewport({ scale: scale.value });
  canvas.height = viewport.height;
  canvas.width = viewport.width;
  canvas.style.height = `${viewport.width * window.devicePixelRatio}px`;
  canvas.style.width = `${viewport.width * window.devicePixelRatio}px`;
  viewportConst.height = viewport.height;
  viewportConst.width = viewport.width;
  stageConfig.height = viewport.height;
  stageConfig.width = viewport.width;
  const canvasContext = canvas.getContext("2d");
  const renderContext = {
    canvasContext,
    viewport,
  };
  await page.render(renderContext).promise;

  const imageDataURL = canvas.toDataURL();
  image.value = new window.Image();
  image.value.src = imageDataURL;
};
const backTrangky = async () => {
  Trangky.value = Trangky.value > 1 ? Trangky.value - 1 : Trangky.value;
  await getImageData();
};
const nextTrangky = async () => {
  Trangky.value =
    Trangky.value < totalPage.value ? Trangky.value + 1 : Trangky.value;
  await getImageData();
};
const scaleUp = async () => {
  scale.value = scale.value < 2 ? scale.value + 0.25 : scale.value;
  await getImageData();
};
const scaleDown = async () => {
  scale.value = scale.value > 0.25 ? scale.value - 0.25 : scale.value;
  await getImageData();
};

const handleMouseDown = () => {
  if (startDrawing.value) {
    drawing.value = true;
    const pos = getPointerPosition();
    startX.value = pos.x;
    startY.value = pos.y;
  }
};

const handleMouseUp = () => {
  if (drawing.value) {
    drawing.value = false;
    const pos = getPointerPosition();
    const width = pos.x - startX.value;
    const height = pos.y - startY.value;
    rec.value = { x: startX.value, y: startY.value, width, height };
  }

  currentWidth.value = 0;
  currentHeight.value = 0;
};

const getPointerPosition = () => {
  return stageRef.value.getStage().getPointerPosition();
};



const handleMouseMove = () => {
  if (!drawing.value) return;

  const pos = getPointerPosition();
  const width = pos.x - startX.value;
  const height = pos.y - startY.value;

  currentWidth.value = width;
  currentHeight.value = height;
};

const enableDrawing = () => {
  const dataKy: any = {
    Hinhthucky: 0,
    TaikhoanDB: "admin",
    Trinhtuky: 1,
    label: "dinhnhat0810@gmail.com(Trình tự ký 1)",
    value: "dinhnhat0810@gmail.com_1"
  }
  if (dataKy && dataKy.daKyNhap === 1) {
    rec.value = dataKy.rec;
    Trangky.value = dataKy.Trangky;
    Object.assign(stageConfig, dataKy.stageConfig);
    scale.value = dataKy.scale;
  }
  startDrawing.value = true;
  drawingState.value = 1;
};
const saveRectangles = () => {
  console.log("Hình đã vẽ:", rec.value);
  console.log(
    "File - Chiều dài :" +
    stageConfig.height +
    "||  Chiều rộng :" +
    stageConfig.width
  );
  console.log("page :" + Trangky.value);
  console.log("scale :" + scale.value);


  const x1 = rec.value.x / scale.value;
  const y1 = (stageConfig.height - rec.value.y) / scale.value;
  const x2 = (rec.value.x + rec.value.width) / scale.value;
  const y2 = (y1 - rec.value.height) / scale.value;

  const newData = {
    Trangky: cloneDeep(Trangky.value),
    rec: cloneDeep(rec.value),
    stageConfig: cloneDeep(stageConfig),
    scale: cloneDeep(scale.value),
    daKyNhap: 1,
    info: `${x1} ${y1} ${x2} ${y2} Trang số: ${Trangky.value}`
  }

  alert("Đã lưu vùng ký với toa độ" + newData.info);

  drawingState.value = 2;
  startDrawing.value = false;

}

const cancelRectangles = () => {
  rec.value = null;

  drawingState.value = 0;
  startDrawing.value = false;
};

const onFileChange = async (e: any) => {
  const file = e.target.files[0];
  const fileReader = new FileReader();
  fileReader.onload = async (e: any) => {
    const typedArray = new Uint8Array(e.target.result);
    const pdf = await pdfjsLib.getDocument(typedArray).promise;
    pdfDocument.value = pdf;
    totalPage.value = pdf.numPages;
    Trangky.value = 1;
    await getImageData();

  };
  fileReader.readAsArrayBuffer(file);
};

const toggleEmailSelect = () => {
  showEmailSelect.value = !showEmailSelect.value;
  if (showEmailSelect.value) {
    fetchSigners();
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
const updateLinkedList = () => {
  linkedList.value = selectedEmails.value.map((email, index) => ({ email, order: index + 1 }));
};
const completeSetup = () => {
  if (signatureAreas.value.length === 0) {
    alert('Vui lòng vẽ ít nhất một vùng ký.');
  } else {
    alert('Đã hoàn thành thiết lập ký.');
    handleNext();
  }
};
const handleBack = () => {
  router.push('/Them-nguoi');
};

const handleNext = () => {
  router.push('/Xac-nhan');
};
</script>

<style scoped>
.content-area {
  background-color: #f8f9fa;
}

.left-column,
.right-column {
  height: 100%;
  overflow-y: auto;
}

.middle-column {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.pdf-viewer {
  position: relative;
  width: 100%;
  height: 70vh;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
}

.pdf-stage {
  width: 100%;
  height: 100%;
}

.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
