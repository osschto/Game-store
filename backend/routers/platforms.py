from typing import List

from fastapi import APIRouter, Depends
from sqlmodel import Session, select

from db.db import get_session
from models.models import Platform
from models.schemas import PlatformAdd, PlatformGet, PlatformUpdate

router = APIRouter(prefix="/platforms", tags=["Platform"])

@router.post("", summary="Добавить платформу")
def add_platform(platform : PlatformAdd, db : Session = Depends(get_session)):
    Platform.check_uniq(db, platform.name)

    db_platform = Platform(**platform.model_dump())
    db.add(db_platform)
    db.commit()
    db.refresh(db_platform)
    return {"message" : f"Платформа <{db_platform.name}> добавлена"}


@router.get("/", response_model=List[PlatformGet], summary="Получить список всех платформ")
def get_all_platforms(db : Session = Depends(get_session)):
    return db.exec(select(Platform)).all()


@router.put("/{platform_id}", summary="Изменить имя платформы")
def edit_paltform(platform_id : int, update : PlatformUpdate, db : Session = Depends(get_session)):
    Platform.check_exist(db, platform_id)
    Platform.check_uniq(db, update.name, platform_id)

    db_platform = db.exec(select(Platform).where(Platform.id == platform_id)).first()
    db_platform.name = update.name

    db.add(db_platform)
    db.commit()
    return {"message" : "Имя платформы изменено"}


@router.delete("/{platform_id}", summary="Удалить платформу")
def delete_platform(platform_id : int, db : Session = Depends(get_session)):
    Platform.check_exist(db, platform_id)

    db_platform = db.exec(select(Platform).where(Platform.id == platform_id)).first()
    db.delete(db_platform)
    db.commit()
    return {"message" : "Платформа удалена"}