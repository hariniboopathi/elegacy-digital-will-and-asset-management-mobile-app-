from flask_pymongo import PyMongo
from flask import Flask
import os

mongo = PyMongo()

def init_db(app: Flask):
    app.config["MONGO_URI"] = os.getenv("MONGO_URI", "mongodb://localhost:27017/elegacy")
    mongo.init_app(app)
    return mongo
