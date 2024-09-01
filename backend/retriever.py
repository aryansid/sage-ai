import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

class Retriever:
    def __init__(self, embedder):
        self.embedder = embedder
        self.documents = []
        self.embeddings = []

    def add_document(self, doc_text, doc_path, embedding=None):
        self.documents.append((doc_text, doc_path))
        if embedding is None:
            embedding = self.embedder.embed(doc_text)
        self.embeddings.append(embedding)

    def retrieve(self, query, k=5):
        query_embedding = self.embedder.embed(query)
        similarities = cosine_similarity([query_embedding], self.embeddings)[0]
        top_indices = np.argsort(similarities)[::-1][:k]
        
        return [(similarities[i], self.documents[i][1]) for i in top_indices]