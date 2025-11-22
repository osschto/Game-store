from typing import List

from fastapi import APIRouter, Depends
from sqlmodel import Session, select

from db.db import get_session
from models.models import Genre
from models.schemas import GenreAdd, GenreGet, GenreUpdate

router = APIRouter(prefix="/genres", tags=["Genre"])

@router.post("", summary="Добавить жанр")
def add_genre(genre : GenreAdd, db : Session = Depends(get_session)):
    Genre.check_uniq(db, genre.name)

    db_genre = Genre(**genre.model_dump())
    db.add(db_genre)
    db.commit()
    db.refresh(db_genre)
    return {"message" : f"Жанр <{db_genre.name}> добавлен"}


@router.get("/", response_model=List[GenreGet], summary="Получить список всех жанров")
def get_all_genres(db : Session = Depends(get_session)):
    return db.exec(select(Genre)).all()


@router.put("/{genre_id}", summary="Изменить имя жанра")
def edit_genre(genre_id : int, update : GenreUpdate, db : Session = Depends(get_session)):
    Genre.check_exist(db, genre_id)
    Genre.check_uniq(db, update.name, genre_id)

    db_genre = db.exec(select(Genre).where(Genre.id == genre_id)).first()
    db_genre.name = update.name

    db.add(db_genre)
    db.commit()
    return {"message" : "Имя жанра изменено"}


@router.delete("/{genre_id}", summary="Удалить жанр")
def delete_genre(genre_id : int, db : Session = Depends(get_session)):
    Genre.check_exist(db, genre_id)

    db_genre = db.exec(select(Genre).where(Genre.id == genre_id)).first()
    db.delete(db_genre)
    db.commit()
    return {"message" : "Жанр удален"}