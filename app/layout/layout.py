from flask import Blueprint, render_template


layout_blueprint = Blueprint('layout', __name__)

@layout_blueprint.route('/', methods=['GET', 'POST'])
def layout():
    return(
        render_template('/layout.html')
    )