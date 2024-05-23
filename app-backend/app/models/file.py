from app import db

class File(db.Model):
    __bind_key__ = 'default'  # Utilise la base de données par défaut
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(255), nullable=False)
    filepath = db.Column(db.String(255), nullable=False)
    mimetype = db.Column(db.String(100), nullable=False)
    size = db.Column(db.Integer, nullable=False)
    user_id = db.Column(db.Integer, nullable=False)
    tag = db.Column(db.String(100), nullable=True)
