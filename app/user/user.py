''' User view layer '''

from flask import Blueprint, render_template, redirect, url_for, session

from app.user import services
from app.adapters import repository

from app.authentication.authentication import auth_required

user_blueprint = Blueprint('user', __name__)
repo = repository.repo_instance



@user_blueprint.route('/privileges', methods=['GET'])
@auth_required
def privileges():
    user = services.get_user(session['username'], repo)
        
    return( render_template('/layout.html',
                    user=user,
                    layout='privileges') )
    
@user_blueprint.route('/settings', methods=['GET'])
@auth_required
def settings():
    user = services.get_user(session['username'], repo)
        
    return( render_template('/layout.html',
                    user=user,
                    layout='settings') )
    
@user_blueprint.route('/panel', methods=['GET'])
@auth_required
def panel():
    user = services.get_user(session['username'], repo)
        
    return( render_template('/layout.html',
                    user=user,
                    layout='panel') )
    