from app import db
from flask import jsonify, request
from flask_jwt_extended import create_access_token
from datetime import timedelta
from app.models import File
from app.models import Users as User
from . import bp
import os
from .utils import get_user_from_token

@bp.route('/signin', methods=['POST'])
def signin():
    data = request.get_json()
    
    # Validate request data
    if 'email' not in data or 'password' not in data or 'role' not in data:
        return jsonify({"message": "Invalid request, email, password and role are required"}), 400

    user = User.query.filter_by(email=data['email']).first()
    
    # Check if user already exists
    if user:
        return jsonify({"message": "User with this email already exists"}), 400

    new_user = User(
        email=data['email'],
        password=data['password'],
        role=data['role']
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User created successfully"}), 201


@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    user = User.query.filter_by(email=data['email']).first()
    if not user or user.password != data['password']:
        return jsonify({"message": "Invalid email or password"}), 401

    token = create_access_token(identity={"id": user.id, "name":repr(user), "role": user.role}, expires_delta=timedelta(minutes=40))
    return jsonify({"token": token})

@bp.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([user.to_dict() for user in users])


@bp.route('/users/<int:id>', methods=['DELETE'])
def delete_user(id):
    # Find the user
    user = User.query.get_or_404(id)

    # Get all files associated with this user
    files = File.query.filter_by(user_id=id).all()

    # Loop through each file
    for file in files:
        # If the file exists in the system, delete it
        if os.path.exists(file.filepath):
            try:
                os.remove(file.filepath)
            except Exception as e:
                return jsonify({"message": f"Error deleting file {file.filename}: {str(e)}"}), 500

        # Delete the file record from the database
        db.session.delete(file)

    # Now delete the user
    db.session.delete(user)
    db.session.commit()

    return jsonify({"message": "User and associated files deleted successfully"}), 200

@bp.route('/users/<int:id>', methods=['PUT'])
def update_user(id):
    user = User.query.get(id)
    user.role = request.json.get('role', user.role)
    db.session.commit()
    return jsonify(user.to_dict())

