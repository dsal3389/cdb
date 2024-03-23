import importlib
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from app.core.database import database_session
from app.crud.profile import create_profile_table
from app.crud.user import create_user_table
from app.crud.game import create_game_table


ROUTES_MODULES = (
    "app.routes.game",
    "app.routes.auth",
    "app.routes.profile"
)

ORIGINS = ("http://localhost:3000", "http://10.100.102.47:3000")  # development endpoint


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
            create_user_table(cursor)
            create_profile_table(cursor)
            create_game_table(cursor)
        session.commit()


for module_path in ROUTES_MODULES:
    module = importlib.import_module(module_path)
    router = getattr(module, "router")
    app.include_router(router)
