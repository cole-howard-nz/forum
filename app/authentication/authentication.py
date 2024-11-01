''' Authentication view layer '''


from sqlite3 import IntegrityError
from app.authentication import services
from app.adapters import repository

from flask import Blueprint, render_template, redirect, url_for, request, flash


authentication_blueprint = Blueprint('authentication', __name__)
repo = repository.repo_instance


@authentication_blueprint.route('/auth/register', methods=['GET', 'POST'])
def register():
    form = services.RegistrationForm()
    
    if form.validate_on_submit():
        try:
            services.add_user(form.username.data, form.password.data, repo)  
            return redirect(url_for('authentication.login'))
        
        except Exception:
            flash('username already taken', 'error')
        
    # Flash errors from form so can be picked up in template
    for _, field_errors in form.errors.items():
        for error in field_errors:
            flash(error, 'error')
                
    return( render_template('/layout.html',
                        form=form,
                        type='register',
                        layout='authentication'))
    
    
@authentication_blueprint.route('/auth/login', methods=['GET', 'POST'])
def login():
    form = services.LoginForm()
    
    if form.validate_on_submit():
        # get user from form.username.data (service)
        # compare form password with real password (service)
        # clear session then add to session (service)
        
        return redirect(url_for('home.home'))
        
    return( render_template('/layout.html',
                        form=form,
                        type='login',
                        layout='authentication'))