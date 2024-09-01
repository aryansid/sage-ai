import re
from typing import List, Tuple
import numpy as np

class DocumentProcessor:
    def __init__(self, chunk_size=256):
        self.chunk_size = chunk_size

    def get_boundary_cues(self, text: str) -> List[int]:
        return [m.start() for m in re.finditer(r'\S+\s*', text) if m.start() % self.chunk_size == 0]

    def naive_chunking(self, text: str) -> List[str]:
        cues = self.get_boundary_cues(text)
        return [text[i:j] for i, j in zip(cues, cues[1:] + [None])]

    def late_chunking(self, token_embeddings: np.ndarray, text: str) -> List[np.ndarray]:
        cues = self.get_boundary_cues(text)
        chunk_embeddings = []
        for i, j in zip(cues, cues[1:] + [None]):
            chunk_embedding = token_embeddings[i:j].mean(axis=0)
            chunk_embeddings.append(chunk_embedding)
        return chunk_embeddings

    def process_document(self, text: str, embedding_model) -> Tuple[List[str], List[np.ndarray], List[np.ndarray]]:
        naive_chunks = self.naive_chunking(text)
        naive_embeddings = embedding_model.encode(naive_chunks)
        
        token_embeddings = embedding_model.get_token_embeddings(text)
        late_embeddings = self.late_chunking(token_embeddings, text)
        
        return naive_chunks, naive_embeddings, late_embeddings