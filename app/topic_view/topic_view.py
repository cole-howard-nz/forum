''' Topic view layer '''

from flask import Blueprint, render_template, redirect, url_for, session

from app.topic_view import services
from app.adapters import repository

topic_view_blueprint = Blueprint('topic_view', __name__)
repo = repository.repo_instance



@topic_view_blueprint.route('/<string:topic>', methods=['GET'])
def view(topic: str):
    form = services.ShoutboxMessage()
    
    if 'username' in session:
        user = services.get_user(session['username'], repo)
        
        return( render_template('/layout.html',
                        user=user,
                        form=form,
                        layout='topic') )

    return( render_template('/layout.html',
                            form=form,
                            layout='topic') )
    