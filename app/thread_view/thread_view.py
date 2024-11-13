''' Topic view layer '''

from flask import Blueprint, render_template, redirect, url_for, session

from app.thread_view import services
from app.adapters import repository

thread_view_blueprint = Blueprint('thread_view', __name__)
repo = repository.repo_instance



@thread_view_blueprint.route('/<string:topic>/<string:thread_id>', methods=['GET'])
def view(topic: str, thread_id: str):
    thread = services.get_thread_by_id(thread_id, repo)
    
    form = services.ShoutboxMessage()
    comments = services.get_comments_for_thread(thread_id, repo)
    
    if 'username' in session:
        user = services.get_user(session['username'], repo)
        
        return( render_template('/layout.html',
                        user=user,
                        topic=topic,
                        form=form,
                        thread=thread,
                        comments=comments,
                        layout='thread') )

    return( redirect(url_for('home.home')) )
    