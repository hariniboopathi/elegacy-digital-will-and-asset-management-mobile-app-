from utils.db import mongo
import os

# Base server URL - change when running on different network
SERVER_URL = os.getenv("SERVER_URL", "http:// 192.168.31.110:5000")


from utils.db import mongo
from datetime import datetime
from bson import ObjectId

class UserModel:
    @staticmethod
    def find_by_email(email):
        """Find a user by email."""
        return mongo.db.users.find_one({"email": email})

    @staticmethod
    def create_user(name, email, password_hash):
        """Create a new user."""
        user = {
            "name": name,
            "email": email,
            "password": password_hash,
            "created_at": datetime.utcnow()
        }
        return mongo.db.users.insert_one(user)
