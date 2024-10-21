from flask import Flask

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, clear_mappers
from sqlalchemy.pool import NullPool

import app.adapters.repository as repo
from app.adapters import database_repository
from app.adapters.orm import metadata, map_model_to_tables

def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')

    if app.config['REPOSITORY'] == 'memory':
      print(" * Repository Mode: memory")  
      
    elif app.config['REPOSITORY'] == 'database':
      print(" * Repository Mode: database")
      
      database_uri = app.config['SQLALCHEMY_DATABASE_URI']
      database_echo = app.config['SQLALCHEMY_ECHO']
      database_engine = create_engine(database_uri, connect_args={"check_same_thread": False}, poolclass=NullPool,
                                        echo=database_echo)

      session_factory = sessionmaker(autocommit=False, autoflush=True, bind=database_engine)
      repo.repo_instance = database_repository.SqlAlchemyRepository(session_factory)

      if app.config['TESTING'] == 'True' or len(database_engine.table_names()) == 0:
        print("Creating mappings for new database")
        clear_mappers()
        metadata.create_all(database_engine)
        for table in reversed(metadata.sorted_tables):
          database_engine.execute(table.delete())

        map_model_to_tables()

        print("Finished mapping creation")

      else:
        map_model_to_tables()
        
        
    with app.app_context():
        from .layout import layout
        app.register_blueprint(layout.layout_blueprint)

    return app