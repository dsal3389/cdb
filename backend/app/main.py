import importlib
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from app.core.database import database_session
from app.crud import profile, user, game


ROUTES_MODULES = ("app.routes.game", "app.routes.auth", "app.routes.profile")

ORIGINS = (
    "http://localhost:3000",
    "http://localhost:4000",
    "http://localhost:5173",
    "http://10.100.102.47:3000",
)  # development endpoint


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.mount("/static", StaticFiles(directory="static"), name="static")


@app.on_event("startup")
async def startup_event() -> None:
    async for session in database_session():
        session.autocommit = True

        with session.cursor() as cursor:
            user.create_table(cursor)
            profile.create_table(cursor)
            game.create_table(cursor)
        session.commit()


for module_path in ROUTES_MODULES:
    module = importlib.import_module(module_path)
    router = getattr(module, "router")
    app.include_router(router)
