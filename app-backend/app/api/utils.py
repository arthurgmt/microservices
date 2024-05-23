from flask import request
from app.models import Users as User
from flask_jwt_extended import decode_token
from app import db

def get_user_from_token():
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return None

    try:
        _, token = auth_header.split(' ')

        decoded = decode_token(token)
        user_id = decoded['sub']['id']
        user = User.query.get(user_id)

        return user

    except (Exception, ValueError, KeyError):
        return None
