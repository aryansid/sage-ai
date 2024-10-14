# embedder.py

from sentence_transformers import SentenceTransformer
import numpy as np
import torch

class Embedder:
    def __init__(self, model_name='all-MiniLM-L6-v2'):
        self.device = torch.device('mps' if torch.backends.mps.is_available() else 'cpu')
        self.model = SentenceTransformer(model_name, device=self.device)
        self.embedding_dim = self.model.get_sentence_embedding_dimension()

    def embed(self, text):
        return self.model.encode(text, show_progress_bar=False)

    def get_token_embeddings(self, text):
        # Tokenize the text
        encoded_input = self.model.tokenize([text])
        # Move tensors to device
        encoded_input = {k: v.to(self.device) for k, v in encoded_input.items()}

        with torch.no_grad():
            # Access the underlying transformer model
            transformer_model = self.model._first_module().auto_model
            model_output = transformer_model(
                **encoded_input,
                output_hidden_states=True,
                return_dict=True
            )
        # Get token embeddings from the last hidden state
        token_embeddings = model_output.hidden_states[-1][0].cpu().numpy()
        return token_embeddings
