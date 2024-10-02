# retriever.py

import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

class Retriever:
    def __init__(self, text_embedder, image_embedder, text_embeddings, text_documents, image_embeddings, image_documents):
        self.text_embedder = text_embedder
        self.image_embedder = image_embedder
        self.text_documents = text_documents  # List of tuples: (doc_text, doc_path)
        self.image_documents = image_documents  # List of doc_paths
        self.text_embeddings = np.array(text_embeddings)
        self.image_embeddings = np.array(image_embeddings)
        self.text_embedding_dim = self.text_embedder.embedding_dim
        self.image_embedding_dim = self.image_embedder.embedding_dim

    def retrieve(self, query_text=None, query_image_path=None, k=5):
        num_docs = len(self.text_documents)
        similarities = np.zeros(num_docs)
        weight = 0

        if query_text:
            query_text_embedding = self.text_embedder.embed(query_text)
            text_similarities = cosine_similarity([query_text_embedding], self.text_embeddings)[0]
            similarities += text_similarities
            weight += 1

        if query_image_path:
            query_image_embedding = self.image_embedder.embed(query_image_path)
            # Compute image similarities
            image_similarities = np.zeros(num_docs)
            for idx, doc in enumerate(self.text_documents):
                doc_path = doc[1]
                # Find all image embeddings corresponding to this doc_path
                indices = [i for i, img_doc in enumerate(self.image_documents) if img_doc == doc_path]
                if indices:
                    doc_image_embeddings = self.image_embeddings[indices]
                    sims = cosine_similarity([query_image_embedding], doc_image_embeddings)
                    max_sim = np.max(sims)
                    image_similarities[idx] = max_sim
                else:
                    image_similarities[idx] = 0
            similarities += image_similarities
            weight += 1

        if weight > 0:
            similarities /= weight  # Average the similarities

        top_indices = np.argsort(similarities)[::-1][:k]
        return [(similarities[i], self.text_documents[i][1]) for i in top_indices]
