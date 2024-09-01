import os
import zipfile
import pickle
from patent_processor import PatentProcessor
from retriever import Retriever
from embedder import Embedder
from tqdm import tqdm
import tkinter as tk
from tkinter import ttk, filedialog, messagebox
from tkinter.scrolledtext import ScrolledText

class PatentSearchGUI:
    def __init__(self, master):
        self.master = master
        self.master.title("Patent Search System")
        self.master.geometry("800x600")
        self.master.configure(bg="#f0f0f0")

        self.patents_dir = tk.StringVar(value=r"D:\Sage.ai\patents\I20240730")
        self.cache_file = tk.StringVar(value="patent_cache.pkl")
        self.query = tk.StringVar()

        self.create_widgets()

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

        ttk.Label(main_frame, text="Patents Directory:").grid(row=0, column=0, sticky="w", padx=5, pady=5)
        ttk.Entry(main_frame, textvariable=self.patents_dir, width=50).grid(row=0, column=1, padx=5, pady=5)
        ttk.Button(main_frame, text="Browse", command=self.browse_directory).grid(row=0, column=2, padx=5, pady=5)

        ttk.Label(main_frame, text="Cache File:").grid(row=1, column=0, sticky="w", padx=5, pady=5)
        ttk.Entry(main_frame, textvariable=self.cache_file, width=50).grid(row=1, column=1, padx=5, pady=5)

        ttk.Label(main_frame, text="Query:").grid(row=2, column=0, sticky="w", padx=5, pady=5)
        ttk.Entry(main_frame, textvariable=self.query, width=50).grid(row=2, column=1, padx=5, pady=5)

        search_button = ttk.Button(main_frame, text="Search", command=self.search)
        search_button.grid(row=3, column=1, pady=20)
        search_button.configure(style='Accent.TButton')
        style.configure('Accent.TButton', background='#4CAF50', foreground='white')
        style.map('Accent.TButton', background=[('active', '#45a049')])

        self.results_text = ScrolledText(main_frame, height=15, width=80, font=('Arial', 10))
        self.results_text.grid(row=4, column=0, columnspan=3, padx=5, pady=5)

        self.progress = ttk.Progressbar(main_frame, length=600, mode='determinate', style='TProgressbar')
        self.progress.grid(row=5, column=0, columnspan=3, padx=5, pady=5)
        style.configure("TProgressbar", thickness=20, troughcolor='#f0f0f0', background='#4CAF50')

    def browse_directory(self):
        directory = filedialog.askdirectory()
        if directory:
            self.patents_dir.set(directory)

    def search(self):
        patents_dir = self.patents_dir.get()
        cache_file = self.cache_file.get()
        query = self.query.get()

        if not patents_dir or not query:
            messagebox.showerror("Error", "Please provide both patents directory and query.")
            return

        try:
            retriever = self.load_or_create_cache(cache_file, patents_dir)
            if not retriever.embeddings:
                messagebox.showwarning("Warning", "No documents were processed. Please check the patents directory.")
                return

            top_10_results = retriever.retrieve(query, k=10)
            
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
        embedder = Embedder()
        processor = PatentProcessor()
        retriever = Retriever(embedder)
        
        self.process_patents(patents_dir, processor, retriever)
        
        with open(cache_file, 'wb') as f:
            pickle.dump(retriever, f)
        return retriever

    def process_patents(self, patents_dir, processor, retriever):
        date_folders = [f for f in os.listdir(patents_dir) if os.path.isdir(os.path.join(patents_dir, f))]
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
                    if patent_text:
                        retriever.add_document(patent_text, zip_path)
                except Exception:
                    pass  # Silently ignore errors
                
                processed_count += 1
                self.progress['value'] = processed_count
                self.master.update_idletasks()

    @staticmethod
    def extract_xml_from_zip(zip_path):
        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            xml_file = [f for f in zip_ref.namelist() if f.endswith('.XML')][0]
            with zip_ref.open(xml_file) as file:
                return file.read()
                
def process_patents_cli(patents_dir, cache_file):
    print("Processing patents and creating cache...")
    embedder = Embedder()
    processor = PatentProcessor()
    retriever = Retriever(embedder)
    
    date_folders = [f for f in os.listdir(patents_dir) if os.path.isdir(os.path.join(patents_dir, f))]
    total_files = sum(len([f for f in os.listdir(os.path.join(patents_dir, date)) if f.endswith('.ZIP')]) for date in date_folders)
    
    progress_bar = tqdm(total=total_files, unit="file", desc="Processing patents")

    for date_folder in date_folders:
        date_path = os.path.join(patents_dir, date_folder)
        zip_files = [f for f in os.listdir(date_path) if f.endswith('.ZIP')]

        for zip_file in zip_files:
            zip_path = os.path.join(date_path, zip_file)
            try:
                xml_content = PatentSearchGUI.extract_xml_from_zip(zip_path)
                patent_text = processor.extract_text(xml_content)
                if patent_text:
                    retriever.add_document(patent_text, zip_path)
            except Exception:
                pass  # Silently ignore errors
            
            progress_bar.update(1)

    progress_bar.close()

    print("\nSaving cache...")
    with open(cache_file, 'wb') as f:
        pickle.dump(retriever, f)
    print("Cache created successfully.")

def main():
    patents_dir = r"D:\Sage.ai\patents\I20240730"
    cache_file = "patent_cache.pkl"

    if not os.path.exists(cache_file):
        process_patents_cli(patents_dir, cache_file)
    
    root = tk.Tk()
    PatentSearchGUI(root)
    root.mainloop()

if __name__ == "__main__":
    main()