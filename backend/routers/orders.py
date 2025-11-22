from typing import List

from fastapi import APIRouter, Depends
from sqlmodel import Session, select

from db.db import get_session
from models.models import Order, Library, Game
from models.schemas import OrderAdd, OrderGet

router = APIRouter(prefix="/orders", tags=["Order"])

@router.post("", summary="Купить игру")
def add_order(order : OrderAdd, db : Session = Depends(get_session)):
    Order.check_user_exist(db, order.user_id)
    Order.check_game_exist(db, order.game_id)
    Order.check_in_library(db, order.user_id, order.game_id)

    db_game = db.exec(select(Game).where(Game.id == order.game_id)).first()
    db_order = Order(user_id=order.user_id, game_id=order.game_id, game_price=db_game.price)
    db_library = Library(user_id=order.user_id, game_id=order.game_id)

    db.add(db_order)
    db.add(db_library)
    db.commit()

    return {"message": "Игра куплена и добавлена в вашу библиотеку",
                "game_title" : db_game.title,
                "game_price" : db_game.price}


@router.get("/", response_model=List[OrderGet], summary="Получить список всех покупок")
def get_all_purcashed_games(db : Session = Depends(get_session)):
    return db.exec(select(Order)).all()


@router.get("/{user_id}", response_model=list[OrderGet], summary="Получить список покупок конкретного пользователя")
def get_order_by_user_id(user_id : int, db : Session = Depends(get_session)):
    Order.check_user_exist(db, user_id)
    return db.exec(select(Order).where(Order.user_id == user_id)).all()


@router.delete("/{user_id}/{game_id}", summary="Вернуть игру")
def delete_order(user_id : int, game_id : int, db : Session = Depends(get_session)):
    Order.check_user_exist(db, user_id)
    Order.check_game_exist(db, game_id)
    Order.check_order_exist(db, user_id, game_id)

    db_order = db.exec(select(Order).where((Order.user_id == user_id)&(Order.game_id == game_id))).first()
    db_library = db.exec(select(Library).where((Library.user_id == user_id)&(Library.game_id == game_id))).first()

    db.delete(db_order)
    db.delete(db_library)
    db.commit()
    return {"message" : "Вы успешно вернули игру"}
