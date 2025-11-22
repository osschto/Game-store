from typing import List

from fastapi import APIRouter, Depends
from sqlmodel import Session, select

from db.db import get_session
from models.models import Game
from models.schemas import GameAdd, GameGet, GameUpdate

router = APIRouter(prefix="/games", tags=["Game"])

@router.post("", summary="Добавить новую игру")
def add_game(game : GameAdd, db : Session = Depends(get_session)):
    Game.check_uniq(db, game.title)
    Game.check_correct(db, game.genre_id, game.platform_id)

    db_game = Game(**game.model_dump())
    db.add(db_game)
    db.commit()
    db.refresh(db_game)
    return {"message" : f"Игра <{db_game.title}> добавлена"}


@router.get("/", response_model=List[GameGet], summary="Получить список всех игр")
def get_all_games(db : Session = Depends(get_session)):
    return db.exec(select(Game)).all()


@router.get("/{game_id}", response_model=GameGet, summary="Получить информацию об игре")
def get_game_by_id(game_id : int, db : Session = Depends(get_session)):
    Game.check_exist(db, game_id)

    return db.exec(select(Game).where(Game.id == game_id)).first()

@router.get("/search/{keyword}", response_model=List[GameGet], summary="Найти игру по ключевому слову из названия")
def search(keyword : str, db : Session = Depends(get_session)):
    return db.query(Game).filter(Game.title.ilike(f"%{keyword}%")).all()


@router.put("/{game_id}", summary="Изменить информацию об игре")
def edit_game(game_id : int, update : GameUpdate, db : Session = Depends(get_session)):
    Game.check_exist(db, game_id)
    Game.check_uniq(db, update.title, game_id)
    Game.check_correct(db, update.genre_id, update.platform_id)

    db_game = db.exec(select(Game).where(Game.id == game_id)).first()
    db_game.genre_id = update.genre_id
    db_game.platform_id = update.platform_id
    db_game.title = update.title
    db_game.description = update.description
    db_game.price = update.price
    db_game.release_date = update.release_date
    db_game.developer = update.developer

    db.add(db_game)
    db.commit()
    return {"message" : "Данные обновлены"}


@router.delete("/{game_id}", summary="Удалить игру")
def delete_game(game_id : int, db: Session = Depends(get_session)):
    Game.check_exist(db, game_id)

    db_game = db.exec(select(Game).where(Game.id == game_id)).first()
    db.delete(db_game)
    db.commit()
    return {"message" : "Игра удалена"}