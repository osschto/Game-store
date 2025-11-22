from datetime import date, datetime
from typing import List

from fastapi import HTTPException
from pydantic import BaseModel, EmailStr, field_serializer, field_validator
from sqlmodel import SQLModel


# -------------------------USER------------------------- #
class UserAdd(BaseModel):
    name : str
    email : EmailStr

    @field_validator("name")
    def validate_name(cls, v):
        if len(v) < 4:
            raise HTTPException(status_code=422, detail="Имя не может быть меньше четырех символов")
        return v

class UserGet(SQLModel):
    id : int
    name : str
    email : EmailStr

class UserUpdate(SQLModel):
    email : EmailStr


# -------------------------GAME------------------------- #
class GameAdd(BaseModel):
    genre_id : int
    platform_id : int
    title : str
    description : str
    price : float
    release_date : str = "11.11.2011"
    developer : str

    @field_validator("release_date")
    def parse_release_date(cls, v : str) -> date:
        try:
            return datetime.strptime(v, "%d.%m.%Y").date()
        except ValueError:
            raise HTTPException(status_code=422, detail="Дата должна быть в формате дд.мм.гггг")
        
    @field_validator("price")
    def validate_price(cls, v):
        if v < 0:
            raise HTTPException(status_code=422, detail="Цена не может быть меньше нуля")
        return v

class GameGet(SQLModel):
    id : int
    genre_id : int
    platform_id : int
    title : str
    description : str
    price : float
    release_date : date
    developer : str
    rating : float

    @field_serializer("release_date")
    def serialize_release_date(self, v : date) -> str:
        return v.strftime("%d.%m.%Y")


class GameUpdate(SQLModel):
    genre_id : int
    platform_id : int
    title : str
    description : str
    price : float
    release_date : str = "11.11.2011"
    developer : str

    @field_validator("release_date")
    def parse_release_date(cls, v : str) -> date:
        try:
            return datetime.strptime(v, "%d.%m.%Y").date()
        except ValueError:
            raise HTTPException(status_code=422, detail="Дата должна быть в формате дд.мм.гггг")
        
    @field_validator("price")
    def validate_price(cls, v):
        if v < 0:
            raise HTTPException(status_code=422, detail="Цена не может быть меньше нуля")
        return v
        

# -------------------------GENRE------------------------- #
class GenreAdd(BaseModel):
    name : str

class GenreGet(SQLModel):
    id : int
    name : str

class GenreUpdate(SQLModel):
    name : str


# -------------------------PLATFORM------------------------- #
class PlatformAdd(BaseModel):
    name : str

class PlatformGet(SQLModel):
    id : int
    name : str

class PlatformUpdate(SQLModel):
    name : str


# -------------------------ORDER------------------------- #
class OrderAdd(BaseModel):
    user_id : int
    game_id : int

class OrderGet(SQLModel):
    id : int
    user_id : int
    game_id : int
    game_price : float


# -------------------------REVIEW------------------------- #
class ReviewAdd(BaseModel):
    user_id : int
    game_id : int
    rating : int = 5
    comment : str

    @field_validator("rating")
    def validate_rating(cls, v):
        if v < 1 or v > 5:
            raise HTTPException(status_code=422, detail="Рейтинг должен быть в диапазоне от 1 до 5")
        return v

class ReviewGet(SQLModel):
    user_id : int
    game_id : int
    rating : int
    comment : str