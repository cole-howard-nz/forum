''' Authentication service layer '''

from app.domain_model.model import Message
from app.adapters.repository import AbstractRepository

import datetime
from typing import List

from flask_wtf import FlaskForm
from wtforms import PasswordField, StringField, SubmitField
from wtforms.validators import ValidationError, DataRequired, Length

from password_validator import PasswordValidator
from werkzeug.security import generate_password_hash, check_password_hash


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
    