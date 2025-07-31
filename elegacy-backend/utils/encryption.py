import os
from cryptography.fernet import Fernet
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise ValueError("SECRET_KEY not found in .env")

cipher = Fernet(SECRET_KEY.encode())

def encrypt_file(input_path, output_path):
    """Encrypt a file and save as .enc"""
    with open(input_path, 'rb') as file:
        data = file.read()
    encrypted_data = cipher.encrypt(data)
    with open(output_path, 'wb') as file:
        file.write(encrypted_data)

def decrypt_file(input_path, output_path):
    """Decrypt a file"""
    with open(input_path, 'rb') as file:
        encrypted_data = file.read()
    decrypted_data = cipher.decrypt(encrypted_data)
    with open(output_path, 'wb') as file:
        file.write(decrypted_data)
