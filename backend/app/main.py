from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from .core.database import database_session
from .api.v1.app import router as v1_router


ORIGINS = (
    "http://localhost:3000",
    "http://localhost:4000",
    "http://localhost:5173",
    "http://10.100.102.47:3000",
)  # development endpoint


async def startup() -> None:
    pass


app = FastAPI(on_startup=(startup,))

app.add_middleware(
    CORSMiddleware,
    allow_origins=ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.mount("/static", StaticFiles(directory="static"), name="static")
app.include_router(v1_router, prefix="/v1", tags=["v1"])


async def startup_event() -> None:
    async for session in database_session():
        session.autocommit = True

        with session.cursor() as cursor:
            user.create_table(cursor)
            profile.create_table(cursor)
            game.create_table(cursor)
        session.commit()
