from flask import Flask

from app.layout.layout import layout_blueprint


def create_app():
    app = Flask(__name__)

    app.register_blueprint(layout_blueprint)

    return app