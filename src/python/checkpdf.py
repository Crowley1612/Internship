import pythoncom
from flask import Flask, request, send_file
from flask_cors import CORS
import os
import io
import tempfile
from docx import Document
from docx2pdf import convert
from PIL import Image
import pandas as pd
from fpdf import FPDF
import win32com.client as win32

app = Flask(__name__)
CORS(app, resources={r"/upload": {"origins": "*"}})

def convert_doc_to_docx(doc_path, docx_path):
    pythoncom.CoInitialize()  # Initialize COM
    try:
        word = win32.Dispatch('Word.Application')
        word.Visible = False
        doc = word.Documents.Open(doc_path)
        doc.SaveAs(docx_path, FileFormat=16)  # 16 is the file format for .docx
        doc.Close()
        word.Quit()
    finally:
        pythoncom.CoUninitialize()  # Uninitialize COM

def convert_excel_to_pdf(excel_path, pdf_path):
    pythoncom.CoInitialize()  # Initialize COM
    try:
        excel = win32.Dispatch('Excel.Application')
        excel.Visible = False
        wb = excel.Workbooks.Open(excel_path)
        
        if wb.Worksheets.Count == 0:
            raise ValueError("The workbook contains no worksheets")
        
        ws = wb.Worksheets(1)
        ws.ExportAsFixedFormat(0, pdf_path)  # 0 is the file format for PDF
        wb.Close(False)
        excel.Quit()
    finally:
        pythoncom.CoUninitialize()  # Uninitialize COM

def convert_to_pdf(input_file_path, output_file_path):
    file_extension = input_file_path.split('.')[-1].lower()
    print(f"Processing file with extension: {file_extension}")  # Debugging statement
    pdf_content = None

    if file_extension == 'pdf':
        # File is already a PDF, no conversion needed
        with open(input_file_path, 'rb') as file:
            pdf_content = file.read()
    elif file_extension in ['doc', 'docx']:
        # Convert DOC to DOCX if necessary
        if file_extension == 'doc':
            docx_path = input_file_path + 'x'
            convert_doc_to_docx(input_file_path, docx_path)
            input_file_path = docx_path
        
        # Convert DOCX to PDF using docx2pdf
        pythoncom.CoInitialize()  # Initialize COM
        try:
            convert(input_file_path, output_file_path)
            with open(output_file_path, 'rb') as file:
                pdf_content = file.read()
        finally:
            pythoncom.CoUninitialize()  # Uninitialize COM

        # Remove the temporary DOCX file if it was created
        if file_extension == 'doc':
            os.remove(input_file_path)
    elif file_extension in ['xlsx', 'xls']:
        # Convert Excel to PDF
        convert_excel_to_pdf(input_file_path, output_file_path)
        with open(output_file_path, 'rb') as file:
            pdf_content = file.read()
    elif file_extension in ['png', 'jpeg', 'jpg']:
        # Convert image to PDF
        with Image.open(input_file_path) as image:
            pdf_buffer = io.BytesIO()
            image.convert('RGB').save(pdf_buffer, format='PDF')
            pdf_buffer.seek(0)
            pdf_content = pdf_buffer.read()
    elif file_extension == 'txt':
        # Convert text file to PDF
        text_to_pdf(input_file_path, output_file_path)
        
    else:
        raise ValueError("Unsupported file format: " + file_extension)

    # Write bytes directly to the output file
    with open(output_file_path, 'wb') as output_file:
        output_file.write(pdf_content)

    return output_file_path

def text_to_pdf(input_file_path, output_file_path):
    pdf = FPDF()
    pdf.add_page()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.set_font("Arial", size=12)

    # Try different encodings to handle various text files
    encodings = ['utf-8', 'latin-1', 'cp1252']
    for encoding in encodings:
        try:
            with open(input_file_path, 'r', encoding=encoding) as file:
                for line in file:
                    pdf.multi_cell(0, 10, txt=line)  # Use multi_cell to handle long lines
            break
        except (UnicodeDecodeError, IOError):
            continue
    else:
        raise ValueError("Unsupported file encoding")

    pdf.output(output_file_path)

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return 'No file part', 400

    file = request.files['file']

    if file.filename == '':
        return 'No selected file', 400
    
    # Extract original filename without extension and add .pdf
    original_filename = os.path.splitext(file.filename)[0]
    output_filename = original_filename + '.pdf'

    # Use tempfile to create a temporary file
    with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[-1]) as temp_file:
        temp_file_path = temp_file.name
        file.save(temp_file_path)

    output_file_path = tempfile.mktemp(suffix='.pdf')
    convert_to_pdf(temp_file_path, output_file_path)

    # Clean up the temporary input file
    os.remove(temp_file_path)

    return send_file(output_file_path, as_attachment=True, download_name=output_filename)

if __name__ == '__main__':
    app.run(debug=True)
