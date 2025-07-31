from flask import Blueprint, request, jsonify
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token
from models.user_model import UserModel

auth_bp = Blueprint("auth", __name__)
bcrypt = Bcrypt()

@auth_bp.route("/signup", methods=["POST"])
@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    print("Signup data received:", data)  # DEBUG

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    
    print("Signup - Name:", name)  # DEBUG
    print("Signup - Email:", email)  # DEBUG
    print("Signup - Password length:", len(password) if password else 0)  # DEBUG

    if UserModel.find_by_email(email):
        print("User already exists:", email)  # DEBUG
        return jsonify({"message": "User already exists"}), 400

    password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    print("Password hash generated:", password_hash[:20] + "...")  # DEBUG

    result = UserModel.create_user(name, email, password_hash)
    print("User creation result:", result.inserted_id)  # DEBUG
    
    # Verify user was created
    created_user = UserModel.find_by_email(email)
    print("Verification - User found after creation:", created_user is not None)  # DEBUG

    return jsonify({"message": "User registered successfully"}), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    
    print("Login attempt - Email:", email)  # DEBUG
    print("Login attempt - Password length:", len(password) if password else 0)  # DEBUG

    user = UserModel.find_by_email(email)
    print("User found:", user is not None)  # DEBUG
    if user:
        print("User data:", {"id": str(user["_id"]), "name": user["name"], "email": user["email"]})  # DEBUG
        print("Stored password hash:", user["password"][:20] + "...")  # DEBUG (show first 20 chars of hash)
    
    if not user:
        print("Login failed: User not found")  # DEBUG
        return jsonify({"message": "Invalid credentials"}), 401
    
    password_check = bcrypt.check_password_hash(user["password"], password)
    print("Password check result:", password_check)  # DEBUG
    
    if not password_check:
        print("Login failed: Invalid password")  # DEBUG
        return jsonify({"message": "Invalid credentials"}), 401

    token = create_access_token(identity=str(user["_id"]))
    print("Login successful for user:", email)  # DEBUG
    return jsonify({
        "token": token,
        "user": {"id": str(user["_id"]), "name": user["name"], "email": user["email"]}
    })
