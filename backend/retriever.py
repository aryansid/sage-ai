import os
import json
import numpy as np
from supabase import create_client, Client
from dotenv import load_dotenv
from sklearn.metrics.pairwise import cosine_similarity
from .late_chunking.embedder import Embedder
from .late_chunking.image_embedder import ImageEmbedder
from PIL import Image

load_dotenv()

class Retriever:
    def __init__(self, text_embedder, image_embedder, text_documents, image_documents, text_embeddings, image_embeddings):
        self.text_embedder = text_embedder
        self.image_embedder = image_embedder
        self.text_documents = text_documents
        self.image_documents = image_documents
        self.text_embeddings = np.array(text_embeddings)
        self.image_embeddings = np.array(image_embeddings)

        supabase_url = os.getenv('SUPABASE_URL')
        supabase_key = os.getenv('SUPABASE_KEY')
        self.supabase: Client = create_client(supabase_url, supabase_key)

    def retrieve(self, query_text=None, query_image=None, k=5):
        similarities = np.zeros(len(self.text_documents))
        weight = 0

        if query_text:
            query_text_embedding = self.text_embedder.embed(query_text)
            text_similarities = cosine_similarity([query_text_embedding], self.text_embeddings)[0]
            similarities += text_similarities
            weight += 1

        if query_image:
            # Open the image file and convert it to RGB
            with Image.open(query_image) as img:
                img = img.convert('RGB')
            # Use embed_image_object instead of embed_image_path
            query_image_embedding = self.image_embedder.embed_image_object(img)
            image_similarities = np.zeros(len(self.text_documents))
            for idx, doc in enumerate(self.text_documents):
                doc_path = doc[1]
                indices = [i for i, img_doc in enumerate(self.image_documents) if img_doc == doc_path]
                if indices:
                    doc_image_embeddings = self.image_embeddings[indices]
                    sims = cosine_similarity([query_image_embedding], doc_image_embeddings)
                    image_similarities[idx] = np.max(sims)
            similarities += image_similarities
            weight += 1

        if weight > 0:
            similarities /= weight

        top_indices = np.argsort(similarities)[::-1][:k]
        return [(similarities[i], self.text_documents[i][1]) for i in top_indices]
