''' Authentication service layer '''

from sqlite3 import IntegrityError
from app.domain_model.model import User
from app.adapters.repository import AbstractRepository

from flask_wtf import FlaskForm
from wtforms import PasswordField, StringField, SubmitField
from wtforms.validators import ValidationError, DataRequired, Length

from datetime import datetime

from password_validator import PasswordValidator
from werkzeug.security import generate_password_hash, check_password_hash


class UniqueUserException(Exception):
    pass

class PasswordValid:
    def __init__(self, message=None):
        if not message:
            message = u'enter a password that contains 8 characters, both upper and lower case letters and a digit'

        self.message = message
            
    def __call__(self, form, field):
        schema = PasswordValidator()
        schema.min(8).has().uppercase() \
                     .has().lowercase() \
                     .has().digits() \
                     .no().spaces()
        
        if not schema.validate(field.data):
            raise ValidationError(self.message)
    
class RegistrationForm(FlaskForm):
    username = StringField('username', [
        DataRequired(),
        Length(min=3)])
    
    password = PasswordField('password', [
        DataRequired(),
        PasswordValid()])
    
    submit = SubmitField('register', render_kw={"id": "submit-button"})
    
class LoginForm(FlaskForm):
    username = StringField('username', [
        DataRequired(),
        Length(min=3)])
    
    password = PasswordField('password', [
        DataRequired()])
    
    submit = SubmitField('login', render_kw={"id": "submit-button"})
    
    
def add_user(username: str, password: str, repo: AbstractRepository):
    user = repo.get_user(username)
    if user is not None:
        raise UniqueUserException(f'The username {username} is taken')
    
    password = generate_password_hash(password)
    time_created = datetime.now().strftime('%d/%m/%Y, %H:%M:%S')
    user = User(username, password, time_created)
    
    try:
        repo.add_user(user)
    except IntegrityError:
        raise UniqueUserException(f'The username {username} is taken')
    
    
    