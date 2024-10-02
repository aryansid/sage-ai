# embedding_model.py

from sentence_transformers import SentenceTransformer
import numpy as np

class JinaEmbeddingModel:
    def __init__(self, model_name='jinaai/jina-embeddings-v2-base-en'):
        self.model = SentenceTransformer(model_name)

    def encode(self, texts, batch_size=32):
        return self.model.encode(texts, batch_size=batch_size, show_progress_bar=True)

    def get_token_embeddings(self, text):
        return self.model.encode(text, output_type='token_embeddings')