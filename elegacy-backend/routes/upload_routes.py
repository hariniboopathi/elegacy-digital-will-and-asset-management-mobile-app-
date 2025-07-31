from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
import os
from utils.encryption import encrypt_file
from models.user_model import DocumentModel
from bson import ObjectId

upload_bp = Blueprint("upload", __name__)
UPLOAD_FOLDER = os.getenv("UPLOAD_FOLDER", "uploads")

# Create upload directory if it doesn't exist
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)


@upload_bp.route("/upload", methods=["POST"])
def upload_document():
    try:
        print("\n=== UPLOAD REQUEST RECEIVED ===")
        print("Request form keys:", list(request.form.keys()))
        print("Request files keys:", list(request.files.keys()))

        # Extract form fields
        user_email = request.form.get("email")
        title = request.form.get("title")
        property_name = request.form.get("propertyName")
        address = request.form.get("address")
        doc_type = request.form.get("type")
        file = request.files.get("document")

        print(f"User Email: {user_email}")
        print(f"Title: {title}")
        print(f"Property Name: {property_name}")
        print(f"Address: {address}")
        print(f"Type: {doc_type}")
        print(f"File Present? {'Yes' if file else 'No'}")

        if not user_email:
            print("ERROR: Missing user_email in form data")
            return jsonify({"message": "Missing user email"}), 400
        if not file:
            print("ERROR: Missing document file in request")
            return jsonify({"message": "Missing file"}), 400

        # Secure filename and paths
        filename = secure_filename(file.filename)
        raw_path = os.path.join(UPLOAD_FOLDER, filename)
        encrypted_path = os.path.join(UPLOAD_FOLDER, f"{filename}.enc")

        print(f"Saving raw file to {raw_path}")
        file.save(raw_path)

        print(f"Encrypting file -> {encrypted_path}")
        # encrypt_file(raw_path, encrypted_path)
        # os.remove(raw_path)
        # print("Raw file removed after encryption")

        # Save metadata to MongoDB
        print("Saving document metadata to MongoDB...")
        result = DocumentModel.create_document(
            user_email=user_email,
            title=title or filename,
            filename=filename,
            property_name=property_name or "",
            address=address or "",
            doc_type=doc_type or "",
            encrypted_path=encrypted_path
        )
        print(f"Document saved with ID: {result.inserted_id}")

        return jsonify({
            "message": "Document uploaded and encrypted successfully",
            "document_id": str(result.inserted_id)
        }), 201

    except Exception as e:
        print(f"ERROR during upload: {e}")
        return jsonify({"message": f"Upload failed: {str(e)}"}), 500


@upload_bp.route("/documents/<user_email>", methods=["GET"])
def get_user_documents(user_email):
    try:
        print(f"Fetching documents for user: {user_email}")
        documents = DocumentModel.find_by_user_email(user_email)

        # Convert ObjectId and dates for JSON
        for doc in documents:
            doc["_id"] = str(doc["_id"])
            if "upload_date" in doc and hasattr(doc["upload_date"], "isoformat"):
                doc["upload_date"] = doc["upload_date"].isoformat()

        print(f"Found {len(documents)} documents for {user_email}")
        return jsonify({"documents": documents}), 200
    except Exception as e:
        print(f"ERROR fetching documents: {e}")
        return jsonify({"message": f"Failed to fetch documents: {str(e)}"}), 500


@upload_bp.route("/documents/<doc_id>", methods=["PUT"])
def update_document(doc_id):
    try:
        print(f"Updating document: {doc_id}")
        data = request.get_json()
        print(f"Update payload: {data}")

        updates = {}
        for key in ["title", "property_name", "address", "type"]:
            if key in data:
                updates[key] = data[key]

        result = DocumentModel.update_document(ObjectId(doc_id), updates)
        if result.modified_count > 0:
            print("Document updated successfully")
            return jsonify({"message": "Document updated successfully"}), 200
        else:
            print("Document not found or no changes made")
            return jsonify({"message": "Document not found or no changes made"}), 404

    except Exception as e:
        print(f"ERROR updating document: {e}")
        return jsonify({"message": f"Failed to update document: {str(e)}"}), 500


@upload_bp.route("/documents/<doc_id>", methods=["DELETE"])
def delete_document(doc_id):
    try:
        print(f"Deleting document: {doc_id}")
        doc = DocumentModel.find_by_id(ObjectId(doc_id))
        if not doc:
            print("Document not found in DB")
            return jsonify({"message": "Document not found"}), 404

        if os.path.exists(doc["encrypted_path"]):
            os.remove(doc["encrypted_path"])
            print("Encrypted file removed")

        result = DocumentModel.delete_document(ObjectId(doc_id))
        if result.deleted_count > 0:
            print("Document deleted successfully")
            return jsonify({"message": "Document deleted successfully"}), 200
        else:
            print("Document not found in DB")
            return jsonify({"message": "Document not found"}), 404

    except Exception as e:
        print(f"ERROR deleting document: {e}")
        return jsonify({"message": f"Failed to delete document: {str(e)}"}), 500
