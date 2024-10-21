from sqlalchemy import Table, MetaData, Column, Integer, String
from sqlalchemy.orm import mapper

from app.domain_model.model import User


metadata = MetaData()

users_table = Table( 'users', metadata,
                    Column('id', Integer, primary_key=True, autoincrement=True),
                    Column('username', String(127), unique=True, nullable=False),
                    Column('password', String(127), nullable=False))


def map_model_to_tables():
    mapper(User, users_table, properties={
        '_User_username': users_table.c.username,
        '_User_password': users_table.c.password
    })