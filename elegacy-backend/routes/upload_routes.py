from flask import Blueprint, request, jsonify, send_file
from werkzeug.utils import secure_filename
from models.document_model import DocumentModel
import os, uuid

upload_bp = Blueprint("upload", __name__)
UPLOAD_FOLDER = os.getenv("UPLOAD_FOLDER", "uploads")

# Ensure upload folder exists
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# === Upload Document ===
@upload_bp.route("/upload", methods=["POST"])
def upload_document():
    try:
        user_email = request.form.get("email")
        title = request.form.get("title")
        property_name = request.form.get("propertyName")
        address = request.form.get("address")
        doc_type = request.form.get("type")
        file = request.files.get("document")

        if not user_email:
            return jsonify({"message": "Missing user email"}), 400
        if not file:
            return jsonify({"message": "Missing file"}), 400

        # Generate unique filename
        filename = f"{uuid.uuid4()}_{secure_filename(file.filename)}"
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(file_path)

        # Save document in DB (only filename stored)
        result = DocumentModel.create_document(
            user_email=user_email,
            title=title or filename,
            filename=filename,
            property_name=property_name or "",
            address=address or "",
            doc_type=doc_type or ""
        )

        # Return document with dynamic path
        return jsonify({
            "message": "Document uploaded successfully",
            "document": {
                "_id": str(result.inserted_id),
                "email": user_email,
                "title": title or filename,
                "property_name": property_name,
                "address": address,
                "type": doc_type,
                "fileUrl": f"/api/documents/file/{filename}"
            }
        }), 201

    except Exception as e:
        return jsonify({"message": f"Upload failed: {str(e)}"}), 500


# === Fetch User Documents ===
@upload_bp.route("/documents/<user_email>", methods=["GET"])
def get_user_documents(user_email):
    try:
        documents = DocumentModel.find_by_user_email(user_email)
        for doc in documents:
            doc["_id"] = str(doc["_id"])
            if "filename" in doc:
                doc["fileUrl"] = f"/api/documents/file/{doc['filename']}"
            if "upload_date" in doc and hasattr(doc["upload_date"], "isoformat"):
                doc["upload_date"] = doc["upload_date"].isoformat()
        return jsonify({"documents": documents}), 200
    except Exception as e:
        return jsonify({"message": f"Failed to fetch documents: {str(e)}"}), 500


# === Serve File Dynamically ===
@upload_bp.route("/documents/file/<filename>", methods=["GET"])
def serve_file(filename):
    try:
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        if not os.path.exists(file_path):
            return jsonify({"message": "File not found"}), 404
        return send_file(file_path, as_attachment=False)
    except Exception as e:
        return jsonify({"message": f"Failed to retrieve file: {str(e)}"}), 500
