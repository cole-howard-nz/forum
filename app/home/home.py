''' Layout view layer '''

from flask import Blueprint, render_template, redirect, url_for

from app.home import services
from app.adapters import repository

home_blueprint = Blueprint('home', __name__)
repo = repository.repo_instance



@home_blueprint.route('/', methods=['GET'])
def home():
    shoutbox_messages = reversed(services.get_shoutbox_messages(repo))
    form = services.ShoutboxMessage()

    return( render_template('/layout.html',
                        form=form,
                        shoutbox_messages=shoutbox_messages))

@home_blueprint.route('/post', methods=['POST'])
def post_shoutbox():
    shoutbox_messages = reversed(services.get_shoutbox_messages(repo))
    form = services.ShoutboxMessage()

    if form.validate_on_submit():
        services.add_shoutbox_message(form, repo)
                
        return redirect(url_for('home.home'))
        
        
    return( render_template('/layout.html',
                        form=form,
                        shoutbox_messages=shoutbox_messages))
    