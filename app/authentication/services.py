''' Authentication service layer '''

from app.domain_model.model import Message
from app.adapters.repository import AbstractRepository

import datetime
from typing import List
from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField
from wtforms.validators import DataRequired, Length


class ShoutboxMessage(FlaskForm):
    message = StringField('comment', [
        DataRequired(),
        Length(min=2, message='Your message is too short')],
                            
        render_kw={"class": "comment-box", "placeholder": "post a comment", "value": "", "minlength": "2"})
    
    submit = SubmitField('submit')
    


def get_shoutbox_messages(repo: AbstractRepository) -> List[Message]:
    all_messages = repo.get_shoutbox_messages()
    
    for message in all_messages:
        message.owner = repo.get_user_by_id(message.owner_id).username
        message.title = repo.get_superuser_by_id(message.owner_id).title if repo.get_superuser_by_id(message.owner_id) is not None else 'user'
    
    return all_messages

def add_shoutbox_message(form, repo: AbstractRepository):
    new_message = Message(1, form.data['message'], datetime.datetime.now().strftime("%d/%m/%Y %I:%M %p"))
    repo.add_shoutbox_message(new_message)