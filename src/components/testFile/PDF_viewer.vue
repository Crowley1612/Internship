import { GlobalWorkerOptions } from 'pdfjs-dist';

GlobalWorkerOptions.workerSrc = '../../pdf.js/src/pdf.worker.js'; // Ensure the path matches where you placed the worker
