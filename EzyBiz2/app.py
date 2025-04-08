from flask import Flask, request, jsonify, render_template
from pymongo import MongoClient
from bson.objectid import ObjectId
import logging
from demandforecast import model as demand_model  # Assuming model is defined in demandforecast.py
from sale_opt import model as sale_model  # Assuming model is defined in sale_opt.py

app = Flask(__name__, static_folder='static', template_folder='templates')

# Configure MongoDB Connection
client = MongoClient("mongodb://localhost:27017/")
db = client["ecommerce_db"]
users_collection = db["users"]
products_collection = db["products"]
orders_collection = db["orders"]

# Logging Setup
logging.basicConfig(level=logging.INFO)

@app.route('/')
def index():
    return render_template("index.html")

# API: User Registration
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.json
    if users_collection.find_one({"email": data["email"]}):
        return jsonify({"error": "User already exists"}), 400
    users_collection.insert_one(data)
    return jsonify({"message": "User registered successfully"})

# API: User Login (Basic Email Check for Now)
@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    user = users_collection.find_one({"email": data["email"]})
    if not user:
        return jsonify({"error": "Invalid credentials"}), 401
    return jsonify({"message": "Login successful"})

# API: Fetch Products
@app.route('/api/products', methods=['GET'])
def get_products():
    products = list(products_collection.find())
    for product in products:
        product['_id'] = str(product['_id'])
    return jsonify(products)

# API: Place Order
@app.route('/api/orders', methods=['POST'])
def place_order():
    data = request.json
    orders_collection.insert_one(data)
    return jsonify({"message": "Order placed successfully"})

# AI Recommendation API
@app.route('/api/ai/recommend', methods=['POST'])
def recommend_products():
    user_id = request.json.get('userId')
    recommendations = sale_model.predict(user_id)  # Placeholder function
    return jsonify({"recommendations": recommendations})

# AI Demand Forecast API
@app.route('/api/ai/forecast', methods=['POST'])
def forecast_demand():
    product_data = request.json
    forecast = demand_model.predict(product_data)  # Placeholder function
    return jsonify({"forecast": forecast})

# Global Error Handler
@app.errorhandler(500)
def internal_error(error):
    logging.error(str(error))
    return jsonify({"error": "Internal Server Error"}), 500

if __name__ == '__main__':
    app.run(debug=True)
