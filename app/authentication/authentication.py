''' Authentication view layer '''

from flask import Blueprint, render_template, redirect, url_for, request

from app.home import services
from app.adapters import repository

authentication_blueprint = Blueprint('authentication', __name__)
repo = repository.repo_instance


@authentication_blueprint.route('/auth/', methods=['GET'])
def home():
    type = request.args.get('type')
    
    return( render_template('/layout.html',
                        type=type,
                        layout='authentication'))

@authentication_blueprint.route('/auth/register', methods=['POST'])
def register():
    shoutbox_messages = reversed(services.get_shoutbox_messages(repo))
    form = services.ShoutboxMessage()

    return( render_template('/layout.html',
                        form=form,
                        shoutbox_messages=shoutbox_messages))
    