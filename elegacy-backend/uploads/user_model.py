from utils.db import mongo
from datetime import datetime
from bson import ObjectId

class DocumentModel:
    @staticmethod
    def create_document(user_email, title, filename, property_name, address, doc_type, encrypted_path):
        document = {
            "user_email": user_email,
            "title": title,
            "filename": filename,
            "property_name": property_name,
            "address": address,
            "type": doc_type,
            "encrypted_path": encrypted_path,
            "upload_date": datetime.utcnow(),
            "created_at": datetime.utcnow(),
        }
        return mongo.db.documents.insert_one(document)

    @staticmethod
    def find_by_user_email(user_email):
        return list(mongo.db.documents.find({"user_email": user_email}))

    @staticmethod
    def find_by_id(doc_id):
        return mongo.db.documents.find_one({"_id": ObjectId(doc_id)})

    @staticmethod
    def update_document(doc_id, updates):
        return mongo.db.documents.update_one({"_id": ObjectId(doc_id)}, {"$set": updates})

    @staticmethod
    def delete_document(doc_id):
        return mongo.db.documents.delete_one({"_id": ObjectId(doc_id)})
