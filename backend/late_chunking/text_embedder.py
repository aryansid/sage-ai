# text_embedder.py

import torch
from transformers import CLIPModel, CLIPTokenizer

class TextEmbedder:
    def __init__(self, model_name='openai/clip-vit-base-patch32'):
        self.device = torch.device("cpu")
        self.model = CLIPModel.from_pretrained(model_name).to(self.device)
        self.tokenizer = CLIPTokenizer.from_pretrained(model_name)

    def embed(self, text):
        inputs = self.tokenizer(text, return_tensors="pt", padding=True).to(self.device)
        with torch.no_grad():
            text_features = self.model.get_text_features(**inputs)
        return text_features.cpu().numpy()
