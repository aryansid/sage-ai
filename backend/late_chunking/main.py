# main.py

import os
import zipfile
import pickle
from patent_processor import PatentProcessor
from retriever import Retriever
from embedder import Embedder
from image_embedder import ImageEmbedder
from tqdm import tqdm
import tkinter as tk
from tkinter import ttk, filedialog, messagebox
from tkinter.scrolledtext import ScrolledText
import numpy as np

import ssl
import warnings
import urllib.request

# Disable SSL certificate verification
ssl._create_default_https_context = ssl._create_unverified_context

# Suppress only the single warning from urllib3 needed.
warnings.filterwarnings('ignore', message='Unverified HTTPS request')

# Monkey patch urllib.request to use the unverified context
original_urlopen = urllib.request.urlopen

def urlopen_no_verify(*args, **kwargs):
    kwargs['context'] = ssl._create_unverified_context()
    return original_urlopen(*args, **kwargs)

urllib.request.urlopen = urlopen_no_verify

print("WARNING: SSL certificate verification has been disabled. This is not secure and should only be used for testing purposes.")


class PatentSearchGUI:
    def __init__(self, master, text_cache_file, image_cache_file):
        self.master = master
        self.master.title("Patent Search System")
        self.master.geometry("800x600")
        self.master.configure(bg="#f0f0f0")

        self.text_cache_file = text_cache_file
        self.image_cache_file = image_cache_file

        self.query = tk.StringVar()
        self.query_image_path = tk.StringVar()

        self.create_widgets()

        # Load retriever after GUI is set up
        self.load_retriever()

    def create_widgets(self):
        style = ttk.Style()
        style.theme_use('clam')
        style.configure('TLabel', background="#f0f0f0", font=('Arial', 12))
        style.configure('TEntry', font=('Arial', 12))
        style.configure('TButton', font=('Arial', 12))

        main_frame = ttk.Frame(self.master, padding="20 20 20 20", style='TFrame')
        main_frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        self.master.columnconfigure(0, weight=1)
        self.master.rowconfigure(0, weight=1)

        ttk.Label(main_frame, text="Query:").grid(row=0, column=0, sticky="w", padx=5, pady=5)
        ttk.Entry(main_frame, textvariable=self.query, width=50).grid(row=0, column=1, padx=5, pady=5)

        ttk.Label(main_frame, text="Query Image:").grid(row=1, column=0, sticky="w", padx=5, pady=5)
        ttk.Entry(main_frame, textvariable=self.query_image_path, width=50).grid(row=1, column=1, padx=5, pady=5)
        ttk.Button(main_frame, text="Browse", command=self.browse_image).grid(row=1, column=2, padx=5, pady=5)

        search_button = ttk.Button(main_frame, text="Search", command=self.search)
        search_button.grid(row=2, column=1, pady=20)
        search_button.configure(style='Accent.TButton')
        style.configure('Accent.TButton', background='#4CAF50', foreground='white')
        style.map('Accent.TButton', background=[('active', '#45a049')])

        self.results_text = ScrolledText(main_frame, height=15, width=80, font=('Arial', 10))
        self.results_text.grid(row=3, column=0, columnspan=3, padx=5, pady=5)

    def load_retriever(self):
        # Load embeddings from caches
        with open(self.text_cache_file, 'rb') as f:
            text_cache = pickle.load(f)
        with open(self.image_cache_file, 'rb') as f:
            image_cache = pickle.load(f)

        text_embeddings = np.array(text_cache['embeddings'])
        image_embeddings = np.array(image_cache['embeddings'])

        # Check for NaN values in text embeddings
        if np.isnan(text_embeddings).any():
            print("Warning: NaN values found in text embeddings.")
        else:
            print("Text embeddings are clean (no NaN values).")

        # Check for NaN values in image embeddings
        if np.isnan(image_embeddings).any():
            print("Warning: NaN values found in image embeddings.")
        else:
            print("Image embeddings are clean (no NaN values).")

        text_embedder = Embedder()
        image_embedder = ImageEmbedder()

        self.retriever = Retriever(
            text_embedder, image_embedder,
            text_embeddings=text_embeddings,
            text_documents=text_cache['documents'],
            image_embeddings=image_embeddings,
            image_documents=image_cache['documents']
        )

    def browse_directory(self):
        directory = filedialog.askdirectory()
        if directory:
            self.patents_dir.set(directory)

    def browse_image(self):
        file_path = filedialog.askopenfilename(filetypes=[("Image files", "*.jpg *.jpeg *.png *.tif *.tiff")])
        if file_path:
            self.query_image_path.set(file_path)

    def search(self):
        query = self.query.get()
        query_image_path = self.query_image_path.get()

        if not (query or query_image_path):
            messagebox.showerror("Error", "Please provide a query (text and/or image).")
            return

        try:
            top_10_results = self.retriever.retrieve(query_text=query, query_image_path=query_image_path, k=10)
            
            self.results_text.delete(1.0, tk.END)
            for i, (score, doc_path) in enumerate(top_10_results, 1):
                self.results_text.insert(tk.END, f"{i}. Score: {score:.4f}\nDocument: {doc_path}\n\n")
        except Exception as e:
            messagebox.showerror("Error", str(e))

    def load_or_create_cache(self, cache_file, patents_dir):
        if os.path.exists(cache_file):
            with open(cache_file, 'rb') as f:
                retriever = pickle.load(f)
            if len(retriever.embeddings) == 0:
                return self.create_cache(cache_file, patents_dir)
            return retriever
        else:
            return self.create_cache(cache_file, patents_dir)

    def create_cache(self, cache_file, patents_dir):
        text_embedder = Embedder()
        image_embedder = ImageEmbedder()
        processor = PatentProcessor()
        retriever = Retriever(text_embedder, image_embedder)
        
        self.process_patents(patents_dir, processor, retriever)
        
        with open(cache_file, 'wb') as f:
            pickle.dump(retriever, f)
        return retriever

    def process_patents(self, patents_dir, processor, retriever):
        date_folders = [f for f in os.listdir(patents_dir) if os.path.isdir(os.path.join(patents_dir, f)) and f.startswith('UTIL')]
        total_files = sum(len([f for f in os.listdir(os.path.join(patents_dir, date)) if f.endswith('.ZIP')]) for date in date_folders)
        
        self.progress['maximum'] = total_files
        processed_count = 0

        for date_folder in date_folders:
            date_path = os.path.join(patents_dir, date_folder)
            zip_files = [f for f in os.listdir(date_path) if f.endswith('.ZIP')]

            for zip_file in zip_files:
                zip_path = os.path.join(date_path, zip_file)
                try:
                    xml_content = self.extract_xml_from_zip(zip_path)
                    patent_text = processor.extract_text(xml_content)
                    
                    # Extract images and compute embeddings
                    images = processor.extract_images(zip_path)
                    image_embeddings = []
                    for image in images:
                        image_embedding = retriever.image_embedder.embed_image_object(image)
                        image_embeddings.append(image_embedding)
                    if image_embeddings:
                        image_embeddings = np.vstack(image_embeddings)
                    else:
                        image_embeddings = np.empty((0, retriever.image_embedding_dim))
                    
                    if patent_text or image_embeddings.size > 0:
                        retriever.add_document(patent_text, zip_path, image_embeddings)
                except Exception as e:
                    print(f"Error processing {zip_path}: {e}")  # Silently ignore errors
                
                processed_count += 1
                self.progress['value'] = processed_count
                self.master.update_idletasks()

def process_patents_cli(patents_dir, text_cache_file, image_cache_file):
    print("Processing patents and creating caches...")
    text_embedder = Embedder()
    image_embedder = ImageEmbedder()
    processor = PatentProcessor()

    text_documents = []
    text_embeddings = []
    image_documents = []
    image_embeddings = []

    # Identify 'UTIL' folders inside 'I20230103'
    util_folders = [os.path.join(patents_dir, f) for f in os.listdir(patents_dir)
                    if os.path.isdir(os.path.join(patents_dir, f)) and f.startswith('UTIL')]

    total_zip_files = sum(len([f for f in os.listdir(util_folder) if f.endswith('.ZIP')])
                          for util_folder in util_folders)

    progress_bar = tqdm(total=total_zip_files, unit="file", desc="Processing patents")

    for util_folder in util_folders:
        zip_files = [f for f in os.listdir(util_folder) if f.endswith('.ZIP')]

        for zip_file in zip_files:
            zip_path = os.path.join(util_folder, zip_file)
            try:
                # Extract XML contents from the ZIP file
                xml_contents = extract_xml_from_zip(zip_path)
                if not xml_contents:
                    print(f"No XML content extracted from {zip_path}. Skipping.")
                    continue  # Skip this file

                # Concatenate text from all XML contents
                patent_text = ""
                for xml_content in xml_contents:
                    extracted_text = processor.extract_text(xml_content)
                    patent_text += extracted_text + "\n"

                if not patent_text.strip():
                    print(f"No text extracted from {zip_path}. Skipping.")
                    continue  # Skip if no text extracted

                # Process and embed the text using late chunking
                token_embeddings = text_embedder.get_token_embeddings(patent_text)
                if token_embeddings is None or len(token_embeddings) == 0:
                    print(f"Warning: No token embeddings for {zip_path}")
                    continue

                late_chunk_embeddings = processor.late_chunking(token_embeddings, chunk_size=256)
                if not late_chunk_embeddings:
                    print(f"Warning: No chunk embeddings for {zip_path}")
                    continue

                # Average the chunk embeddings to get a single embedding for the document
                text_embedding = np.mean(late_chunk_embeddings, axis=0)

                # Check for NaN values
                if np.isnan(text_embedding).any():
                    print(f"Warning: NaN values found in text embedding for {zip_path}. Skipping.")
                    continue

                text_embeddings.append(text_embedding)
                text_documents.append((patent_text, zip_path))

                # Extract images and compute embeddings
                images = processor.extract_images(zip_path)
                for image in images:
                    image_embedding = image_embedder.embed_image_object(image)
                    image_embeddings.append(image_embedding)
                    image_documents.append(zip_path)
            except Exception as e:
                print(f"Error processing {zip_path}: {e}")  # Log errors but continue processing

            progress_bar.update(1)

    progress_bar.close()

    # Save text embeddings cache
    print("\nSaving text embeddings cache...")
    with open(text_cache_file, 'wb') as f:
        pickle.dump({'documents': text_documents, 'embeddings': text_embeddings}, f)
    print("Text embeddings cache created successfully.")

    # Save image embeddings cache
    print("\nSaving image embeddings cache...")
    with open(image_cache_file, 'wb') as f:
        pickle.dump({'documents': image_documents, 'embeddings': image_embeddings}, f)
    print("Image embeddings cache created successfully.")

def extract_xml_from_zip(zip_path):
    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        all_files = zip_ref.namelist()
        # Identify XML files (case-insensitive)
        xml_files = [f for f in all_files if f.lower().endswith('.xml')]

        if xml_files:
            xml_contents = []
            for xml_file in xml_files:
                with zip_ref.open(xml_file) as file:
                    xml_content = file.read().decode('utf-8', errors='ignore')
                    xml_contents.append(xml_content)
            return xml_contents
        else:
            print(f"No XML files found in {zip_path}.")
            return None  # Return None to indicate no XML content

def main():
    patents_dir = r"/Users/robbymanihani/Documents/Sage/sage-ai/sage-ai/backend/I20230103"
    text_cache_file = "text_embeddings_cache.pkl"
    image_cache_file = "image_embeddings_cache.pkl"

    # Check if caches exist
    if not os.path.exists(text_cache_file) or not os.path.exists(image_cache_file):
        process_patents_cli(patents_dir, text_cache_file, image_cache_file)
    else:
        print("Caches already exist. Skipping embedding process.")

    root = tk.Tk()
    PatentSearchGUI(root, text_cache_file, image_cache_file)
    root.mainloop()

if __name__ == "__main__":
    main()