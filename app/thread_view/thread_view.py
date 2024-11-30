''' Topic view layer '''

from flask import Blueprint, render_template, redirect, url_for, flash, request, session

from app.thread_view import services
from app.adapters import repository

from app.authentication.authentication import auth_required


thread_view_blueprint = Blueprint('thread_view', __name__)
repo = repository.repo_instance



@thread_view_blueprint.route('/<string:topic>/<string:thread_id>', methods=['GET'])
def view(topic: str, thread_id: str):
    thread = services.get_thread_by_id(thread_id, repo)
    
    form = services.CommentForm()
    comments = services.get_comments_for_thread(thread_id, repo)
    
    if 'username' in session:
        user = services.get_user(session['username'], repo)
        
        return( render_template('/pages/thread.html',
                        user=user,
                        form=form,
                        topic=topic,
                        thread=thread,
                        comments=comments,
                        layout='thread') )

    return( redirect(url_for('home.home')) )
    
@thread_view_blueprint.route('/<string:topic>/<string:thread_id>', methods=['POST'])
@auth_required
def post_comment(topic: str, thread_id: str):
    thread = services.get_thread_by_id(thread_id, repo)
    form = services.CommentForm()

    if form.validate_on_submit():
        owner = services.get_user(session['username'], repo)
        
        services.add_comment_to_thread(form, owner, thread, repo)
        
        flash('true', 'posted')
        flash(f'successfully posted comment', 'success')
                
        return redirect(url_for('thread_view.view', topic=topic, thread_id=thread_id) + '#thread-comment-ui')
    
    return redirect(url_for('thread_view.view', topic=topic, thread_id=thread_id))

@thread_view_blueprint.route('/<string:topic>/<int:thread_id>/del=<int:comment_id>', methods=['GET'])
@auth_required
def delete_comment(topic: str, thread_id: int, comment_id: int):
    services.delete_comment(comment_id, repo)
    flash(f'successfully deleted comment', 'success')
    
    return redirect(url_for('thread_view.view', topic=topic, thread_id=thread_id))

@thread_view_blueprint.route('/<string:topic>/<int:thread_id>/edit=<int:comment_id>', methods=['POST'])
@auth_required
def edit_comment(topic: str, thread_id: int, comment_id: int):
    form = services.CommentForm()
    
    if form.validate_on_submit():
        services.edit_comment(form, comment_id, repo)
        
        flash('true', 'posted')
        flash(f'successfully editted comment', 'success')
    
    return redirect(url_for('thread_view.view', topic=topic, thread_id=thread_id))
    