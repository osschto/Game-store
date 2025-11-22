from fastapi import FastAPI

from db.db import create_db_and_tables
from routers import games, users, genres, platforms, orders, reviews

app = FastAPI(title="Game Store API")

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

app.include_router(users.router)
app.include_router(games.router)
app.include_router(genres.router)
app.include_router(platforms.router)
app.include_router(orders.router)
app.include_router(reviews.router)