''' Topic service layer '''


import app.domain_model.model as model

from app import utils
from app.utils import ShoutboxMessage
from app.adapters.repository import AbstractRepository

from typing import List
from datetime import datetime

from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField
from wtforms.validators import DataRequired, Length


class CommentForm(FlaskForm):
    message = StringField('comment', [
        DataRequired(),
        Length(min=2)],
                            
        render_kw={"class": "thread-comment-input", "placeholder": "type a comment", "value": ""})
    
    submit = SubmitField('submit')


def get_comments_for_thread(thread_id, repo: AbstractRepository):
    return repo.get_comments_for_thread(thread_id)

def get_thread_by_id(thread_id, repo: AbstractRepository):
    thread = repo.get_thread_by_id(thread_id)
    
    thread.format_time_created = utils.date_time_formatter(thread.time_created)
    return thread

def get_user(username: str, repo: AbstractRepository):
    return utils.get_user(username, repo)

def add_comment_to_thread(form, owner, thread, repo: AbstractRepository):
    time = datetime.now().strftime('%B %d, %Y').replace(' 0', ' ').lower()
    comment = model.Comment(owner, time, form.data['message'], thread)
    
    repo.add_comment_to_thread(comment, thread)
