from utils.db import mongo
from datetime import datetime

class UserModel:
    @staticmethod
    def find_by_email(email):
        return mongo.db.users.find_one({"email": email})

    @staticmethod
    def create_user(name, email, password_hash):
        return mongo.db.users.insert_one({
            "name": name,
            "email": email,
            "password": password_hash
        })

class DocumentModel:
    @staticmethod
    def create_document(user_email, title, filename, property_name, address, doc_type, encrypted_path):
        return mongo.db.documents.insert_one({
            "user_email": user_email,
            "title": title,
            "filename": filename,
            "property_name": property_name,
            "address": address,
            "type": doc_type,
            "encrypted_path": encrypted_path,
            "upload_date": datetime.utcnow(),
            "created_at": datetime.utcnow()
        })

    @staticmethod
    def find_by_user_email(user_email):
        return list(mongo.db.documents.find({"user_email": user_email}))

    @staticmethod
    def find_by_id(doc_id):
        return mongo.db.documents.find_one({"_id": doc_id})

    @staticmethod
    def update_document(doc_id, updates):
        return mongo.db.documents.update_one(
            {"_id": doc_id},
            {"$set": updates}
        )

    @staticmethod
    def delete_document(doc_id):
        return mongo.db.documents.delete_one({"_id": doc_id})
