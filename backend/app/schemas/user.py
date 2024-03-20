from pydantic import BaseModel


class UserSchema(BaseModel):
    username: str
    email: str


class UserCreateSchema(BaseModel):
    username: str
    email: str
    password: str
