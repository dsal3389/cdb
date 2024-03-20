import pathlib
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(validate_default=False)

    DATABASE_URL: str
    DEFAULT_ELO: int = 1000
    TOKEN_VALID_MINUTES: int = 30
    DEFAULT_IMAGE_PATH: pathlib.Path


settings = Settings()
