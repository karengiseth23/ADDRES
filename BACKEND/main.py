
from fastapi import Request
from fastapi import Response
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from database import SessionLocal
from routers import presupuesto_router

app = FastAPI()
origins = [
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(presupuesto_router)

@app.middleware("http")
async def db_session_middleware(request: Request, call_next):
    response = Response("Internal server error", status_code=500)
    try:
        request.state.db = SessionLocal()
        response = await call_next(request)
    finally:
        request.state.db.close()
    return response

@app.get("/")
def read_root():
    return {"Hello": "World"}