import os
import sys
from pathlib import Path
import logging
import asyncio
import ast
import numpy as np
import tempfile
import zipfile
import xml.etree.ElementTree as ET
import io
import shutil
import base64
from PIL import Image

# Add the project root to the Python path
project_root = Path(__file__).resolve().parent.parent
sys.path.append(str(project_root))

import pickle
from fastapi import FastAPI, HTTPException, File, UploadFile, Form
from pydantic import BaseModel
from typing import List, Optional
from backend.retriever import Retriever
from backend import Embedder, ImageEmbedder
import numpy as np
from supabase import create_client, Client
from dotenv import load_dotenv
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for debugging
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Supabase client
supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(supabase_url, supabase_key)

# Initialize embedders
text_embedder = Embedder()
image_embedder = ImageEmbedder()

# Initialize retriever
retriever = None

class Query(BaseModel):
    text: str
    image_path: Optional[str] = None
    k: int = 10

class SearchResult(BaseModel):
    document: str
    similarity: float

@app.on_event("startup")
async def startup_event():
    global retriever
    logger.info("Starting up and initializing retriever...")
    # Load embeddings from Supabase
    text_data = supabase.table("text_embeddings").select("*").execute()
    image_data = supabase.table("image_embeddings").select("*").execute()
    
    text_documents = [(item['text'], item['doc_path']) for item in text_data.data]
    text_embeddings = []
    for item in text_data.data:
        if isinstance(item['embedding'], str):
            # Parse the string representation of the list
            embedding_list = ast.literal_eval(item['embedding'])
            text_embeddings.append(np.array(embedding_list))
        else:
            text_embeddings.append(np.array(item['embedding']))
    
    image_documents = [item['doc_path'] for item in image_data.data]
    image_embeddings = []
    for item in image_data.data:
        if isinstance(item['embedding'], str):
            # Parse the string representation of the list
            embedding_list = ast.literal_eval(item['embedding'])
            image_embeddings.append(np.array(embedding_list))
        else:
            image_embeddings.append(np.array(item['embedding']))
    
    retriever = Retriever(text_embedder, image_embedder, text_documents, image_documents, text_embeddings, image_embeddings)
    logger.info("Retriever initialized successfully.")

async def download_and_unzip(file_path):
    bucket_name = "demo"
    
    logger.info(f"Processing file: {file_path}")
    
    try:
        # Download the file from Supabase storage
        file_content = supabase.storage.from_(bucket_name).download(file_path)
        
        if not file_content:
            logger.error(f"Failed to download file: {file_path}. No content received.")
            raise HTTPException(status_code=404, detail="File not found in storage")
        
        # Create a temporary directory to store the unzipped files
        with tempfile.TemporaryDirectory() as temp_dir:
            zip_path = os.path.join(temp_dir, "temp.zip")
            
            # Write the downloaded content to a temporary zip file
            with open(zip_path, "wb") as f:
                f.write(file_content)
            
            # Unzip the file
            with zipfile.ZipFile(zip_path, "r") as zip_ref:
                zip_ref.extractall(temp_dir)
            
            # Check if there's a directory in the unzipped contents
            all_files = os.listdir(temp_dir)
            subdirs = [d for d in all_files if os.path.isdir(os.path.join(temp_dir, d))]
            if subdirs:
                temp_dir = os.path.join(temp_dir, subdirs[0])
                all_files = os.listdir(temp_dir)
            
            # Find TIFF images in the directory
            tiff_files = [f for f in all_files if f.lower().endswith('.tif') or f.lower().endswith('.tiff')]
            image_urls = []

            for tiff_file in tiff_files:
                tiff_path = os.path.join(temp_dir, tiff_file)
                with Image.open(tiff_path) as img:
                    # Convert to RGB mode if it's not already
                    if img.mode != 'RGB':
                        img = img.convert('RGB')
                    
                    # Save as PNG in memory
                    buffer = io.BytesIO()
                    img.save(buffer, format='PNG')
                    buffer.seek(0)
                    
                    # Encode to base64
                    encoded_string = base64.b64encode(buffer.getvalue()).decode()
                    image_urls.append(f"data:image/png;base64,{encoded_string}")

            # Find the XML file in the directory (case-insensitive)
            xml_files = [f for f in all_files if f.lower().endswith('.xml')]
            if not xml_files:
                logger.error(f"No XML file found in the directory for {file_path}")
                raise HTTPException(status_code=404, detail="No XML file found in the directory")
            
            xml_path = os.path.join(temp_dir, xml_files[0])
            logger.info(f"Processing XML file: {xml_files[0]}")
            
            # Parse the XML file
            tree = ET.parse(xml_path)
            root = tree.getroot()
            
            # Extract relevant information from the XML
            title = root.find(".//invention-title")
            id = root.find(".//document-id/doc-number")
            abstract = root.find(".//abstract/p")
            claims = root.findall(".//claim")
            description = root.find(".//description")
            
            return {
                "title": title.text if title is not None else "Title not found",
                "id": id.text if id is not None else "ID not found",
                "abstract": abstract.text if abstract is not None else "Abstract not found",
                "claims": "\n".join([ET.tostring(claim, encoding='unicode', method='text').strip() for claim in claims]) if claims else "Claims not found",
                "specification": ET.tostring(description, encoding='unicode', method='text').strip() if description is not None else "Specification not found",
                "images": image_urls
            }
    except Exception as e:
        logger.error(f"Error processing file {file_path}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")

@app.options("/search")
async def search_options():
    return JSONResponse(
        content={"message": "OK"},
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        },
    )

@app.post("/search", response_model=List[dict])
async def search(
    text: str = Form(...),
    image: Optional[UploadFile] = File(None),
    k: int = Form(10)
):
    if retriever is None:
        raise HTTPException(status_code=503, detail="Retriever not initialized. Please try again later.")
    
    logger.info(f"Search query received: {text}")
    if image:
        logger.info(f"Image uploaded: {image.filename}")
    logger.info("=" * 50)

    image_path = None
    if image:
        try:
            with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(image.filename)[1]) as temp_image:
                shutil.copyfileobj(image.file, temp_image)
                image_path = temp_image.name
        except Exception as e:
            logger.error(f"Error saving uploaded image: {str(e)}")
            raise HTTPException(status_code=500, detail="Error processing uploaded image")

    try:
        results = retriever.retrieve(query_text=text, query_image=image_path, k=k)
        # Process results as before
        processed_results = []
        for i, (sim, doc) in enumerate(results):
            logger.info(f"\nResult {i+1}:")
            logger.info("-" * 30)  # Add a separator for each result
            logger.info(f"Similarity: {sim}")
            logger.info(f"Document: {doc}")
            
            # Extract the relevant part of the path starting from "I20230103"
            try:
                file_path = doc[doc.index("I20230103"):]
                logger.info(f"File path: {file_path}")
            except ValueError:
                logger.error(f"Could not find 'I20230103' in the document string: {doc}")
                logger.info("-" * 30)  # Add a separator after each result, even if it fails
                continue

            try:
                patent_data = await download_and_unzip(file_path)
                processed_results.append(patent_data)
                logger.info("Successfully processed patent data")
            except Exception as e:
                logger.error(f"Error processing document {file_path}: {str(e)}")
            
            logger.info("-" * 30)  # Add a separator after each result
        
        logger.info("=" * 50)  # Add a separator after all results
        logger.info(f"Total results processed: {len(processed_results)}")
        
        return JSONResponse(
            content=processed_results,
            headers={
                "Access-Control-Allow-Origin": "*",
            },
        )
    finally:
        if image_path and os.path.exists(image_path):
            os.unlink(image_path)

@app.get("/")
async def root():
    return {"message": "Welcome to the Patent Search API"}


url: str = os.getenv("SUPABASE_URL")
key: str = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(url, key)

class UserAuth(BaseModel):
    email: str
    password: str
    company_name: str
    company_email: str  # Add this line

@app.post("/signup")
async def sign_up(user: UserAuth):
    logger.info(f"Received signup request for email: {user.email}")
    try:
        logger.info("Attempting to sign up user with Supabase")
        response = supabase.auth.sign_up({
            "email": user.email,
            "password": user.password,
            "options": {
                "data": {
                    "company_name": user.company_name,
                    "company_email": user.company_email
                }
            }
        })
        logger.info(f"Supabase signup response: {response}")
        if response.user:
            logger.info(f"User created successfully. User ID: {response.user.id}")
            logger.info("Inserting additional user data into user_profiles table")
            user_data = supabase.table("user_profiles").insert({
                "user_id": response.user.id,
                "company_name": user.company_name,
                "company_email": user.company_email
            }).execute()
            logger.info(f"User profile insertion response: {user_data}")
            return {"message": "User created successfully", "user": response.user}
        else:
            logger.error("Failed to create user: No user object in response")
            raise HTTPException(status_code=400, detail="Failed to create user")
    except Exception as e:
        logger.error(f"Error during signup: {str(e)}")
        if "User already registered" in str(e):
            raise HTTPException(status_code=400, detail="User already exists")
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/signin")
async def sign_in(user: UserAuth):
    try:
        response = supabase.auth.sign_in_with_password({
            "email": user.email,
            "password": user.password
        })
        if response.user and response.session:
            return {"message": "User signed in successfully", "user": response.user, "session": response.session}
        else:
            raise HTTPException(status_code=401, detail="Invalid credentials")
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid credentials")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
