from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Configuration des bases de données
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://root:root@0.0.0.0/file_db'
app.config['SQLALCHEMY_BINDS'] = {
    'default': 'postgresql://root:root@0.0.0.0/file_db',
    'user_db': 'postgresql://root:root@0.0.0.0:5433/user_db'
}
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'abc123'
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['BASE_DIR'] = '/Users/arthur/Documents/GitHub/docker-app/app-backend'
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024  # Limite de téléchargement à 50 Mo

db = SQLAlchemy(app)

migrate = Migrate(app, db)
jwt = JWTManager(app)

from app.api import bp as api_bp
app.register_blueprint(api_bp, url_prefix='/api')



if __name__ == '__main__':
    app.run(debug=True)


from app.models import Users, File

