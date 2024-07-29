from fastapi import APIRouter
from .routes.auth import router as auth_router
from .routes.game import router as game_router
from .routes.profile import router as profile_router


router = APIRouter()


router.include_router(auth_router, prefix="/auth", tags=["v1 auth"])
router.include_router(game_router, prefix="/games", tags=["v1 games"])
router.include_router(profile_router, prefix="/profile", tags=["v1 profile"])
