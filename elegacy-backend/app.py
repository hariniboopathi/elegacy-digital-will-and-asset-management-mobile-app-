from flask import Flask
from flask_jwt_extended import JWTManager
from utils.db import init_db
from routes.auth_routes import auth_bp
from routes.upload_routes import upload_bp
from dotenv import load_dotenv
import os
from flask_cors import CORS
CORS


load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "super-secret-key")

db = init_db(app)
jwt = JWTManager(app)

app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(upload_bp, url_prefix="/api")

@app.route("/")
def home():
    return {"message": "eLegacy Backend Running"}

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)

