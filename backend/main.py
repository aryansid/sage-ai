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
    retriever = Retriever()
    retriever.load_embeddings_from_supabase()
    
@app.post("/search", response_model=List[SearchResult])
async def search(query: Query):
    if retriever is None:
        raise HTTPException(status_code=500, detail="Retriever not initialized")
    
    results = retriever.retrieve(query_text=query.text, query_image=query.image_path, k=query.k)
    return [SearchResult(document=doc, similarity=float(sim)) for sim, doc in results]

@app.get("/")
async def root():
    return {"message": "Welcome to the Patent Search API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=10000)