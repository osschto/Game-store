from typing import List

from fastapi import APIRouter, Depends
from sqlmodel import Session, select

from db.db import get_session
from models.models import User, Library
from models.schemas import UserAdd, UserGet, UserUpdate

router = APIRouter(prefix="/users", tags=["User"])

@router.post("", summary="Добавление нового пользователя")
def add_user(user : UserAdd, db : Session = Depends(get_session)):
    User.check_uniq_add(db, user.name, user.email)

    db_user = User(**user.model_dump())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return {"message" : f"Пользователь <{db_user.name}> добавлен"}


@router.get("/", response_model=List[UserGet], summary="Получить список всех пользователей")
def get_all_users(db : Session = Depends(get_session)):
    return db.exec(select(User)).all()


@router.get("/{user_id}", response_model=UserGet, summary="Получить информацию о пользователе")
def get_user_by_id(user_id : int, db : Session = Depends(get_session)):
    User.check_exist(db, user_id)
    
    return db.exec(select(User).where(User.id == user_id)).first()


@router.get("/{user_id}/library", summary="Получить список всех игр из библиотеки пользователя")
def get_library_games(user_id : int, db : Session = Depends(get_session)):
    User.check_exist(db, user_id)

    db_lib_games = db.exec(select(Library).where(Library.user_id == user_id)).all()                  #-----------------------------------------
    return db_lib_games


@router.put("/{user_id}", summary="Изменить email пользователя")
def edit_user(user_id : int, update : UserUpdate, db : Session = Depends(get_session)):
    User.check_exist(db, user_id)
    User.check_uniq_edit(db, update.email, user_id)

    db_user = db.exec(select(User).where(User.id == user_id)).first()
    db_user.email = update.email

    db.add(db_user)
    db.commit()
    return {"message" : "Данные обновлены"}


@router.delete("/{user_id}", summary="Удалить пользователя")
def delete_user(user_id : int, db : Session = Depends(get_session)):
    User.check_exist(db, user_id)

    db_user = db.exec(select(User).where(User.id == user_id)).first()
    db.delete(db_user)
    db.commit()
    return {"message" : "Пользователь удален"}