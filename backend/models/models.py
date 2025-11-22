from datetime import date
from typing import List, Optional

from fastapi import HTTPException
from pydantic import EmailStr
from sqlalchemy import func
from sqlmodel import Field, Relationship, Session, SQLModel, select


# -------------------------LIBRARY------------------------- #
class Library(SQLModel, table=True):
    user_id : Optional[int] = Field(default=None, primary_key=True, foreign_key="user.id")
    game_id : Optional[int] = Field(default=None, primary_key=True, foreign_key="game.id")


# -------------------------USER------------------------- #
class User(SQLModel, table=True):
    id : Optional[int] = Field(default=None, primary_key=True)
    name : str
    email : EmailStr

    games : List["Game"] = Relationship(back_populates="users", link_model=Library)
    orders : List["Order"] = Relationship(back_populates="user", sa_relationship_kwargs={"cascade" : "all, delete"})
    reviews : List["Review"] = Relationship(back_populates="user", sa_relationship_kwargs={"cascade" : "all, delete"})
    
    @classmethod
    def check_uniq_add(cls, db : Session, name : str, email : str):
        user = db.exec(select(cls).where(cls.name == name)).first()
        if user:
            raise HTTPException(status_code=400, detail=f"Пользователь с именем <{name}> уже существует")
        
        user = db.exec(select(cls).where(cls.email == email)).first()
        if user:
            raise HTTPException(status_code=400, detail=f"Пользователь с email <{email}> уже существует")
    
    @classmethod
    def check_uniq_edit(cls, db : Session, email : str, user_id : int):
        user = db.exec(select(cls).where(cls.email == email)).first()
        if user and user.id != user_id:
            raise HTTPException(status_code=400, detail=f"Пользователь с email <{email}> уже существует")
        
    @classmethod
    def check_exist(cls, db : Session, user_id : int):
        user = db.exec(select(cls).where(cls.id == user_id)).first()
        if not user:
            raise HTTPException(status_code=404, detail="Пользователь не найден")


# -------------------------GAME------------------------- #
class Game(SQLModel, table=True):
    id : Optional[int] = Field(default=None, primary_key=True)
    genre_id : Optional[int] = Field(foreign_key="genre.id")
    platform_id : Optional[int] = Field(foreign_key="platform.id")
    title : str
    description : str
    price : float
    release_date : date
    developer : str
    rating : float = Field(default=0)

    users : List["User"] = Relationship(back_populates="games", link_model=Library)
    genre : Optional["Genre"] = Relationship(back_populates="games")
    platform : Optional["Platform"] = Relationship(back_populates="games")
    orders : List["Order"] = Relationship(back_populates="game", sa_relationship_kwargs={"cascade" : "all, delete"})
    reviews : List["Review"] = Relationship(back_populates="game", sa_relationship_kwargs={"cascade" : "all, delete"})

    @classmethod
    def check_uniq(cls, db : Session, title : str, game_id : int = None):
        game = db.exec(select(Game).where(Game.title == title)).first()
        if game and game.id != game_id:
            raise HTTPException(status_code=400, detail=f"Игра <{title}> уже была добавлена")
    
    @classmethod
    def check_exist(cls, db : Session, game_id : int):
        game = db.exec(select(Game).where(Game.id == game_id)).first()
        if not game:
            raise HTTPException(status_code=404, detail="Игра не найдена")

    @classmethod
    def check_correct(cls, db : Session, genre_id, platform_id):
        genre = db.exec(select(Genre).where(Genre.id == genre_id)).first()
        if not genre:
            raise HTTPException(status_code=400, detail="Жанр с таким id не найден")
        
        platform = db.exec(select(Platform).where(Platform.id == platform_id)).first()
        if not platform:
            raise HTTPException(status_code=400, detail="Платформа с таким id не найдена")
        
    @classmethod
    def calculate_rating(cls, db : Session, review_game_id : int):
        db_game = db.exec(select(Game).where(Game.id == review_game_id)).first()
        avg = db.query(func.avg(Review.rating)).filter(Review.game_id == review_game_id).scalar()
        db_game.rating = round(avg, 1)
        db.commit()


# -------------------------GENRE------------------------- #
class Genre(SQLModel, table=True):
    id : Optional[int] = Field(default=None, primary_key=True)
    name : str

    games : List["Game"] = Relationship(back_populates="genre")

    @classmethod
    def check_uniq(cls, db : Session, name : str, genre_id : int = None):
        genre = db.exec(select(Genre).where(func.lower(Genre.name) == name.lower())).first()
        if genre and genre.id != genre_id:
            raise HTTPException(status_code=400, detail=f"Жанр <{name}> уже был добавлен")
    
    @classmethod
    def check_exist(cls, db : Session, genre_id : int):
        genre = db.exec(select(Genre).where(Genre.id == genre_id)).first()
        if not genre:
            raise HTTPException(status_code=404, detail="Жанр не найден")


# -------------------------PLATFORM------------------------- #
class Platform(SQLModel, table=True):
    id : Optional[int] = Field(default=None, primary_key=True)
    name : str

    games : List["Game"] = Relationship(back_populates="platform") 

    @classmethod
    def check_uniq(cls, db : Session, name : str, platform_id : int = None):
        platform = db.exec(select(Platform).where(func.lower(Platform.name) == name.lower())).first()
        if platform and platform.id != platform_id:
            raise HTTPException(status_code=400, detail=f"Платформа <{name}> уже была добавлена")
    
    @classmethod
    def check_exist(cls, db : Session, platform_id : int):
        platform = db.exec(select(Platform).where(Platform.id == platform_id)).first()
        if not platform:
            raise HTTPException(status_code=404, detail="Платформа не найдена")


# -------------------------ORDER------------------------- #
class Order(SQLModel, table=True):
    id : Optional[int] = Field(default=None, primary_key=True)
    user_id : Optional[int] = Field(foreign_key="user.id")
    game_id: Optional[int] = Field(foreign_key="game.id")
    game_price : float

    user : Optional["User"] = Relationship(back_populates="orders")
    game : Optional["Game"] = Relationship(back_populates="orders")

    @classmethod
    def check_user_exist(cls, db : Session, user_id : int):
        user = db.exec(select(User).where(User.id == user_id)).first()
        if not user:
            raise HTTPException(status_code=400, detail="Пользователь не найден")
    
    @classmethod
    def check_game_exist(cls, db : Session, game_id : int):
        game = db.exec(select(Game).where(Game.id == game_id)).first()
        if not game:
            raise HTTPException(status_code=400, detail="Игра не найдена")
    
    @classmethod
    def check_order_exist(cls, db : Session, user_id : int, game_id : int):
        order = db.exec(select(Order).where((Order.user_id == user_id)&(Order.game_id == game_id))).first()
        if not order:
            raise HTTPException(status_code=404, detail="Покупка по данным id не найдена")
        
    @classmethod
    def check_in_library(cls, db : Session, user_id : int, game_id : int):
        library = db.exec(select(Library).where((Library.user_id == user_id)&(Library.game_id == game_id))).first()
        if library:
            raise HTTPException(status_code=400, detail="Игра уже была куплена")


# -------------------------REVIEW------------------------- #
class Review(SQLModel, table=True):
    id : Optional[int] = Field(default=None, primary_key=True)
    user_id : Optional[int] = Field(foreign_key="user.id")
    game_id : Optional[int] = Field(foreign_key="game.id")
    rating : int
    comment : str

    user : Optional["User"] = Relationship(back_populates="reviews")
    game : Optional["Game"] = Relationship(back_populates="reviews")

    @classmethod
    def check_user_exist(cls, db : Session, user_id : int):
        user = db.exec(select(User).where(User.id == user_id)).first()
        if not user:
            raise HTTPException(status_code=404, detail="Пользователь не найден")
    
    @classmethod
    def check_game_exist(cls, db : Session, game_id : int):
        game = db.exec(select(Game).where(Game.id == game_id)).first()
        if not game:
            raise HTTPException(status_code=404, detail="Игра не найдена")
    
    @classmethod
    def check_already_exist(cls, db : Session, user_id : int, game_id : int):
        review = db.exec(select(Review).where((Review.user_id == user_id)&(Review.game_id == game_id))).first()
        if review:
            raise HTTPException(status_code=400, detail="Вы уже оставляли комментарий этой игре")
        