from flask import Flask
from pathlib import Path

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, clear_mappers
from sqlalchemy.pool import NullPool

import app.adapters.repository as repo
from app.adapters import database_repository
from app.adapters.repository_populate import populate
from app.adapters.orm import metadata, map_model_to_tables


def create_app(test_config=None):
    app = Flask(__name__)
    app.config.from_object('config.Config')
    data_path = Path('app') / 'adapters' / 'data'

    if test_config is not None:
        app.config.from_mapping(test_config)
        data_path = app.config['TEST_DATA_PATH']

    print(f" x Repository Mode: {app.config['REPOSITORY']}")

    if app.config['REPOSITORY'] == 'memory':
        pass
    
    elif app.config['REPOSITORY'] == 'database':
        database_uri = app.config['SQLALCHEMY_DATABASE_URI']
        database_echo = app.config['SQLALCHEMY_ECHO']
        database_engine = create_engine(database_uri, connect_args={"check_same_thread": False}, poolclass=NullPool, echo=database_echo)

        session_factory = sessionmaker(autocommit=False, autoflush=True, bind=database_engine)
        repo.repo_instance = database_repository.SqlAlchemyRepository(session_factory)

        if app.config['TESTING'] == 'True' or len(database_engine.table_names()) == 0:
            print(" x Creating mappings for new database")
            clear_mappers()
            metadata.create_all(database_engine)
            for table in reversed(metadata.sorted_tables):
                database_engine.execute(table.delete())

            database_mode = True
            map_model_to_tables()
            populate(data_path, repo.repo_instance, database_mode)
            
            print(" x Finished mapping creation")

        else:
            map_model_to_tables()  
            
    with app.app_context():
        from .home import home
        app.register_blueprint(home.home_blueprint)

        from .authentication import authentication
        app.register_blueprint(authentication.authentication_blueprint)
        
        from .topic_view import topic_view
        app.register_blueprint(topic_view.topic_view_blueprint)
        
        from .thread_view import thread_view
        app.register_blueprint(thread_view.thread_view_blueprint)

        from .user import user
        app.register_blueprint(user.user_blueprint)

    return app
