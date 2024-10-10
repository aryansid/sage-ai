# retriever.py

import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import xml.etree.ElementTree as ET
import os

class Retriever:
    def __init__(self, text_embedder, image_embedder, text_embeddings, text_documents, image_embeddings, image_documents):
        self.text_embedder = text_embedder
        self.image_embedder = image_embedder
        self.text_documents = text_documents
        self.image_documents = image_documents
        self.text_embeddings = np.array(text_embeddings)
        self.image_embeddings = np.array(image_embeddings)

    def retrieve(self, query_text=None, query_image_path=None, k=10):
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
            image_similarities = np.zeros(num_docs)
            for idx, doc in enumerate(self.text_documents):
                doc_path = doc[1]
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
            similarities /= weight

        top_indices = np.argsort(similarities)[::-1][:k]
        return self.process_results([(similarities[i], self.text_documents[i][1]) for i in top_indices])

    def process_results(self, results):
        processed_results = []
        for similarity, doc_path in results:
            xml_path = doc_path.replace('.ZIP', '.XML')
            tif_files = [f for f in os.listdir(os.path.dirname(doc_path)) if f.endswith('.TIF')]
            claims = self.extract_claims(xml_path)
            processed_results.append({
                'similarity': similarity,
                'doc_path': doc_path,
                'xml_path': xml_path,
                'tif_files': tif_files,
                'claims': claims
            })
        return processed_results

    def extract_claims(self, xml_path):
        try:
            tree = ET.parse(xml_path)
            root = tree.getroot()
            claims = root.findall('.//claim')
            return [claim.text for claim in claims]
        except Exception as e:
            print(f"Error extracting claims from {xml_path}: {e}")
            return []