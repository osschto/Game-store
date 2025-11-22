from typing import List

from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from sqlalchemy import func

from db.db import get_session
from models.models import Review, Game
from models.schemas import ReviewAdd, ReviewGet

router = APIRouter(prefix="/reviews", tags=["Review"])

@router.post("", summary="Оставить отзыв игре")
def add_review(review : ReviewAdd, db : Session = Depends(get_session)):
    Review.check_user_exist(db, review.user_id)
    Review.check_game_exist(db, review.game_id)
    Review.check_already_exist(db, review.user_id, review.game_id)

    db_review = Review(**review.model_dump())
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    Game.calculate_rating(db, db_review.game_id)
    return {"message" : f"Комментарий к игре <{db_review.game.title}> успешно оставлен"}


@router.get("/", response_model=List[ReviewGet], summary="Получить список всех отзывов")
def get_all_reviews(db : Session = Depends(get_session)):
    return db.exec(select(Review)).all()


@router.get("/user/{user_id}", response_model=List[ReviewGet], summary="Получить список отзывов пользователя")
def get_reviews_by_id(user_id : int, db : Session = Depends(get_session)):
    Review.check_user_exist(db, user_id)

    return db.exec(select(Review).where(Review.user_id == user_id)).all()


@router.get("/game/{game_id}", response_model=List[ReviewGet], summary="Получить список отзывов игры")
def get_reviews_by_id(game_id : int, db : Session = Depends(get_session)):
    Review.check_game_exist(db, game_id)

    return db.exec(select(Review).where(Review.game_id == game_id)).all()


@router.delete("/games/{game_id}/users/{user_id}", summary="Удалить отзыв")
def delete_review(game_id : int, user_id : int, db : Session = Depends(get_session)):
    Review.check_game_exist(db, game_id)
    Review.check_user_exist(db , user_id)

    db_review = db.exec(select(Review).where((Review.user_id == user_id)&(Review.game_id == game_id))).first()
    db.delete(db_review)
    db.commit()
    return {"message" : "Отзыв удален"}
