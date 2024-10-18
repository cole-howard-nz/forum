from flask import Blueprint, render_template


home_blueprint = Blueprint('home', __name__)

@home_blueprint.route('/', methods=['GET', 'POST'])
def home():
    return(
        render_template('/home.html')
    )