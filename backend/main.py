import os
import pickle
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from retriever import Retriever
from late_chunking.embedder import Embedder
from late_chunking.image_embedder import ImageEmbedder
import numpy as np
from supabase import create_client, Client

app = FastAPI()

# Initialize Supabase client
supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(supabase_url, supabase_key)

# Initialize embedders
text_embedder = Embedder()
image_embedder = ImageEmbedder()

# Initialize retriever
retriever = None

class Query(BaseModel):
    text: str
    image_path: Optional[str] = None
    k: int = 10

class SearchResult(BaseModel):
    document: str
    similarity: float

@app.on_event("startup")
async def startup_event():
    global retriever
    # Load embeddings from Supabase
    text_data = supabase.table("text_embeddings").select("*").execute()
    image_data = supabase.table("image_embeddings").select("*").execute()
    
    text_documents = [(item['text'], item['doc_path']) for item in text_data.data]
    text_embeddings = [np.array(item['embedding']) for item in text_data.data]
    
    image_documents = [item['doc_path'] for item in image_data.data]
    image_embeddings = [np.array(item['embedding']) for item in image_data.data]
    
    retriever = Retriever(text_embedder, image_embedder, text_documents, image_documents, text_embeddings, image_embeddings)

@app.post("/search", response_model=List[SearchResult])
async def search(query: Query):
    if retriever is None:
        raise HTTPException(status_code=500, detail="Retriever not initialized")
    
    query_text_embedding = text_embedder.embed(query.text)
    query_image_embedding = None
    if query.image_path:
        query_image_embedding = image_embedder.embed(query.image_path)
    
    results = retriever.retrieve(query_text_embedding, query_image_embedding, k=query.k)
    return [SearchResult(document=doc, similarity=float(sim)) for doc, sim in results]

@app.get("/")
async def root():
    return {"message": "Welcome to the Patent Search API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=10000)