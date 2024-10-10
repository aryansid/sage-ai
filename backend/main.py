from fastapi import FastAPI, HTTPException, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from late_chunking.retriever import Retriever
from late_chunking.embedder import Embedder
from late_chunking.image_embedder import ImageEmbedder
from supabase import create_client, Client
from dotenv import load_dotenv
import os
import json
from PIL import Image
import io

load_dotenv()

app = FastAPI()
supabase: Client = create_client(os.getenv('SUPABASE_URL'), os.getenv('SUPABASE_KEY'))

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load embeddings from Supabase
def load_embeddings():
    text_data = supabase.table('text_embeddings').select('*').execute()
    text_embeddings = [json.loads(item['embedding']) for item in text_data.data]
    text_documents = [(item['text'], item['doc_path']) for item in text_data.data]

    image_data = supabase.table('image_embeddings').select('*').execute()
    image_embeddings = [json.loads(item['embedding']) for item in image_data.data]
    image_documents = [item['doc_path'] for item in image_data.data]

    return text_embeddings, text_documents, image_embeddings, image_documents

text_embeddings, text_documents, image_embeddings, image_documents = load_embeddings()
text_embedder = Embedder()
image_embedder = ImageEmbedder()
retriever = Retriever(text_embedder, image_embedder, text_embeddings, text_documents, image_embeddings, image_documents)

@app.post("/api/retrieve")
async def retrieve(query: str = Form(None), image: UploadFile = None):
    if not query and not image:
        raise HTTPException(status_code=400, detail="Provide a query (text and/or image).")

    query_image_path = None
    if image:
        contents = await image.read()
        img = Image.open(io.BytesIO(contents)).convert("RGB")
        query_image_path = "temp_image.jpg"
        img.save(query_image_path)

    results = retriever.retrieve(query_text=query, query_image_path=query_image_path, k=10)

    if query_image_path:
        os.remove(query_image_path)

    return {"results": results}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)