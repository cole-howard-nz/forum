''' Authentication view layer '''

from flask import Blueprint, render_template, redirect, url_for, request, flash

from app.authentication import services
from app.adapters import repository

authentication_blueprint = Blueprint('authentication', __name__)
repo = repository.repo_instance


@authentication_blueprint.route('/auth/', methods=['GET', 'POST'])
def home():
    type = request.args.get('type')
    form = services.RegistrationForm()
        
    return( render_template('/layout.html',
                        form=form,
                        type=type,
                        layout='authentication'))

@authentication_blueprint.route('/auth/register', methods=['POST'])
def register():
    form = services.RegistrationForm()
    
    if form.validate_on_submit():
        return redirect(url_for('authentication.home', type='login'))
        
    for _, field_errors in form.errors.items():
            for error in field_errors:
                flash(error, 'error')
                
    return redirect(url_for('authentication.home', type='register'))
    