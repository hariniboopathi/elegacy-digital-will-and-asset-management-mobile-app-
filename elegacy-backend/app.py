from flask import Flask
from flask_jwt_extended import JWTManager
from utils.db import mongo
from routes.auth_routes import auth_bp
from routes.upload_routes import upload_bp
from dotenv import load_dotenv
from flask_cors import CORS
import os

load_dotenv()

# Initialize Flask (no public static folder for uploads)
app = Flask(__name__)

# Enable CORS
CORS(app)

# JWT Configuration
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "super-secret-key")

# MongoDB Configuration
app.config["MONGO_URI"] = os.getenv("MONGO_URI", "mongodb://localhost:27017/eLegacy")
mongo.init_app(app)

# Register Blueprints
app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(upload_bp, url_prefix="/api")

@app.route("/")
def home():
    return {"message": "eLegacy Backend Running"}

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
