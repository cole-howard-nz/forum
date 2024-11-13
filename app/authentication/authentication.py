''' Authentication view layer '''


from app.authentication import services
from app.adapters import repository

from flask import Blueprint, render_template, redirect, url_for, request, flash, session

from functools import wraps


authentication_blueprint = Blueprint('authentication', __name__)
repo = repository.repo_instance


@authentication_blueprint.route('/auth/register', methods=['GET', 'POST'])
def register():
    form = services.RegistrationForm()
    users = services.get_latest_users(30, repo)
    
    if form.validate_on_submit():
        try:
            services.add_user(form.username.data, form.password.data, repo)  
            return redirect(url_for('authentication.login'))
        
        except Exception:
            flash('username already taken', 'error')
        
    # Flash errors from form so they can be picked up in the template
    for _, field_errors in form.errors.items():
        for error in field_errors:
            flash(error, 'error')
                
    return( render_template('/pages/authentication.html',
                        form=form,
                        users=users,
                        type='register',
                        layout='authentication'))
    
    
@authentication_blueprint.route('/auth/login', methods=['GET', 'POST'])
def login():
    form = services.LoginForm()
    users = services.get_latest_users(30, repo)
    
    if form.validate_on_submit():
        try:
            user = services.get_user(form.username.data, repo)
            
            services.check_password(user, form.password.data, repo)
            
            services.create_session(user)
            
            return redirect(url_for('home.home'))
        except services.IncorrectPasswordException:
            flash('incorrect password', 'error')
        
    return( render_template('/pages/authentication.html',
                        form=form,
                        users=users,
                        type='login',
                        layout='authentication'))
    
@authentication_blueprint.route('/logout')
def logout():
    session.clear()

    return redirect(url_for('home.home'))

def auth_required(view):
    @wraps(view)
    def auth(**kwargs):
        if session.get('username') is None:
            return redirect(url_for('authentication.login'))

        return view(**kwargs)
    return auth