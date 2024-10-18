from flask import Flask

from app.home.home import home_blueprint


def create_app():
    app = Flask(__name__)

    app.register_blueprint(home_blueprint)

    return app