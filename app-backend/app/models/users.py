from app import db

class Users(db.Model):
    __bind_key__ = 'user_db'  # Utilise la base de données 'user_db'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(32), nullable=False)

    def __repr__(self):
        return f'<User {self.email.split("@")[0]}>'

    def to_dict(self):
        return {'id': self.id, 'email': self.email, 'role': self.role}