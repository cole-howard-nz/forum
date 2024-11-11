''' Topic view layer '''

from flask import Blueprint, render_template, redirect, url_for, session

from app.topic_view import services
from app.adapters import repository

topic_view_blueprint = Blueprint('topic_view', __name__)
repo = repository.repo_instance



@topic_view_blueprint.route('/<string:topic>', methods=['GET'])
def view(topic: str):
    string_topic = topic.split('-')[0]
    
    form = services.ShoutboxMessage()
    threads = services.get_threads_for_topics(string_topic, repo)
    
    if 'username' in session:
        user = services.get_user(session['username'], repo)
        topic = services.get_topic(topic, repo)
        
        return( render_template('/layout.html',
                        user=user,
                        form=form,
                        topic=topic,
                        threads=threads,
                        layout='topic') )

    return( redirect(url_for('home.home')) )
    