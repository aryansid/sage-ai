import os
import json
import numpy as np
from supabase import create_client, Client
from dotenv import load_dotenv
from sklearn.metrics.pairwise import cosine_similarity
from late_chunking.embedder import Embedder
from late_chunking.image_embedder import ImageEmbedder

load_dotenv()

class Retriever:
    def __init__(self):
        supabase_url = os.getenv('SUPABASE_URL')
        supabase_key = os.getenv('SUPABASE_KEY')
        self.supabase: Client = create_client(supabase_url, supabase_key)
        self.text_embedder = Embedder()
        self.image_embedder = ImageEmbedder()
        self.text_embeddings = None
        self.image_embeddings = None
        self.text_documents = []
        self.image_documents = []

    def load_embeddings_from_supabase(self):
        text_data = self.supabase.table('text_embeddings').select('*').execute()
        self.text_embeddings = np.array([json.loads(item['embedding']) for item in text_data.data])
        self.text_documents = [(item['text'], item['doc_path']) for item in text_data.data]

        image_data = self.supabase.table('image_embeddings').select('*').execute()
        self.image_embeddings = np.array([json.loads(item['embedding']) for item in image_data.data])
        self.image_documents = [item['doc_path'] for item in image_data.data]

    def retrieve(self, query_text=None, query_image=None, k=5):
        if self.text_embeddings is None or self.image_embeddings is None:
            self.load_embeddings_from_supabase()

        similarities = np.zeros(len(self.text_documents))
        weight = 0

        if query_text:
            query_text_embedding = self.text_embedder.embed(query_text)
            text_similarities = cosine_similarity([query_text_embedding], self.text_embeddings)[0]
            similarities += text_similarities
            weight += 1

        if query_image:
            query_image_embedding = self.image_embedder.embed_image_object(query_image)
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