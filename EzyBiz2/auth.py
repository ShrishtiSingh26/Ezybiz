from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
from functools import wraps
from pymongo import MongoClient
from config import SECRET_KEY

# Initialize Blueprint for authentication
auth_bp = Blueprint('auth', __name__)

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["ecommerce_db"]
users_collection = db["users"]

# JWT Authentication Decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({"error": "Token is missing!"}), 401
        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            current_user = users_collection.find_one({"email": data["email"]})
        except:
            return jsonify({"error": "Invalid token!"}), 401
        return f(current_user, *args, **kwargs)
    return decorated

# User Registration
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    if users_collection.find_one({"email": data["email"]}):
        return jsonify({"error": "User already exists"}), 400
    hashed_password = generate_password_hash(data["password"], method='sha256')
    users_collection.insert_one({
        "name": data["name"],
        "email": data["email"],
        "password": hashed_password,
        "role": data.get("role", "customer")
    })
    return jsonify({"message": "User registered successfully"})

# User Login
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    user = users_collection.find_one({"email": data["email"]})
    if not user or not check_password_hash(user["password"], data["password"]):
        return jsonify({"error": "Invalid credentials"}), 401
    token = jwt.encode({
        "email": user["email"],
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    }, SECRET_KEY, algorithm="HS256")
    return jsonify({"token": token})

# Get User Profile
@auth_bp.route('/profile', methods=['GET'])
@token_required
def profile(current_user):
    user_data = {"name": current_user["name"], "email": current_user["email"], "role": current_user["role"]}
    return jsonify(user_data)
