from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from supabase import create_client, Client
from dotenv import load_dotenv
import uvicorn
import os
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Adjust this to your frontend's URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

url: str = os.getenv("SUPABASE_URL")
key: str = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(url, key)

class UserAuth(BaseModel):
    email: str
    password: str
    company_name: str

@app.post("/signup")
async def sign_up(user: UserAuth):
    try:
        response = supabase.auth.sign_up({
            "email": user.email,
            "password": user.password,
            "options": {
                "data": {
                    "company_name": user.company_name
                }
            }
        })
        if response.user:
            # Insert additional user data into a custom table
            user_data = supabase.table("user_profiles").insert({
                "user_id": response.user.id,
                "company_name": user.company_name
            }).execute()
            return {"message": "User created successfully", "user": response.user}
        else:
            raise HTTPException(status_code=400, detail="Failed to create user")
    except Exception as e:
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
        if response.user:
            return {"message": "User signed in successfully", "user": response.user, "session": response.session}
        else:
            raise HTTPException(status_code=401, detail="Invalid credentials")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
