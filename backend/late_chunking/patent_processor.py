# patent_processor.py

import xml.etree.ElementTree as ET
from PIL import Image
import zipfile
import re
import numpy as np

class PatentProcessor:
    def extract_text(self, xml_content):
        try:
            root = ET.fromstring(xml_content)
        except ET.ParseError as e:
            print(f"XML parsing error: {e}")
            return ""

        # Identify the namespace, if present
        namespace = ''
        m = re.match(r'\{(.*)\}', root.tag)
        if m:
            namespace = m.group(1)
            namespaces = {'ns': namespace}
        else:
            namespaces = {}

        # Adjust XPath queries to include the namespace if necessary
        ns_prefix = 'ns:' if namespace else ''

        title_element = root.find(f".//{ns_prefix}invention-title", namespaces)
        title = title_element.text.strip() if title_element is not None and title_element.text else ''

        abstract_element = root.find(f".//{ns_prefix}abstract", namespaces)
        abstract = abstract_element.text.strip() if abstract_element is not None and abstract_element.text else ''

        description_elements = root.findall(f".//{ns_prefix}description//{ns_prefix}p", namespaces)
        description = ' '.join([p.text.strip() for p in description_elements if p.text])

        claim_elements = root.findall(f".//{ns_prefix}claims//{ns_prefix}claim", namespaces)
        claims = ' '.join([claim.text.strip() for claim in claim_elements if claim.text])

        full_text = f"Title: {title}\n\nAbstract: {abstract}\n\nDescription: {description}\n\nClaims: {claims}"
        return full_text

    def extract_images(self, zip_path):
        images = []
        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            image_files = [f for f in zip_ref.namelist() if f.lower().endswith(('.tif', '.tiff', '.png', '.jpg', '.jpeg'))]
            for image_file in image_files:
                with zip_ref.open(image_file) as file:
                    try:
                        image = Image.open(file).convert("RGB")
                        images.append(image)
                    except Exception as e:
                        print(f"Error processing image {image_file} in {zip_path}: {e}")
        return images

    def get_boundary_cues(self, text, chunk_size=256):
        tokens = text.split()
        cues = []
        current_length = 0
        for idx, token in enumerate(tokens):
            current_length += 1
            if current_length >= chunk_size:
                cues.append(idx)
                current_length = 0
        cues.append(len(tokens))
        return cues

    def late_chunking(self, token_embeddings, chunk_size=256):
        """
        Perform late chunking by dividing token embeddings into chunks and averaging each chunk.
        """
        chunk_embeddings = []
        num_tokens = len(token_embeddings)
        for i in range(0, num_tokens, chunk_size):
            end = min(i + chunk_size, num_tokens)
            chunk_embedding = np.mean(token_embeddings[i:end], axis=0)
            chunk_embeddings.append(chunk_embedding)
        return chunk_embeddings
