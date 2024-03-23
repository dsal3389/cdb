from pydantic import BaseModel


__all__ = ("UserSchema", "UserCreateSchema",)


class UserSchema(BaseModel):
    username: str
    email: str


class UserCreateSchema(BaseModel):
    username: str
    email: str
    password: str
