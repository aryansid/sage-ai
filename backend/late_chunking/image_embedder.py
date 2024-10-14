# image_embedder.py

from PIL import Image
import torch
import clip
import numpy as np

class ImageEmbedder:
    def __init__(self, model_name='ViT-B/32'):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.model, self.preprocess = clip.load(model_name, device=self.device)
        self.embedding_dim = self.model.visual.output_dim

    def embed(self, image_path):
        image = Image.open(image_path).convert("RGB")
        return self.embed_image_object(image)

    def embed_image_object(self, image):
        image_input = self.preprocess(image).unsqueeze(0).to(self.device)
        with torch.no_grad():
            image_embedding = self.model.encode_image(image_input)
        return image_embedding.cpu().numpy()[0]
