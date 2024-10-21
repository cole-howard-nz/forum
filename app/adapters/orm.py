from sqlalchemy import Table, MetaData, ForeignKey, Column, Integer, String
from sqlalchemy.orm import mapper, relationship

from app.domain_model.model import User, Thread, Tag, Comment, Topic, SuperUser


metadata = MetaData()

users_table = Table( 'users', metadata,
                    Column('id', Integer, primary_key=True, autoincrement=True),
                    Column('username', String(127), unique=True, nullable=False),
                    Column('password', String(127), nullable=False),
                    Column('time_created', String(127), nullable=False))

threads_table = Table( 'threads', metadata,
                    Column('id', Integer, primary_key=True, autoincrement=True),
                    Column('title', String(127), unique=True, nullable=False),
                    Column('owner_id', ForeignKey('users.id'), nullable=False),
                    Column('time_created', String(127), nullable=False),
                    Column('content', String(127), nullable=False),
                    Column('topic', String(127), nullable=False))

tags_table = Table( 'tags', metadata,
                    Column('id', Integer, primary_key=True, autoincrement=True),
                    Column('name', String(127), unique=True, nullable=False),
                    Column('colour', String(127), nullable=False))

comments_table = Table( 'comments', metadata,
                    Column('id', Integer, primary_key=True, autoincrement=True),
                    Column('owner_id', ForeignKey('users.id'), nullable=False),
                    Column('time_created', String(127), nullable=False),
                    Column('content', String(127), nullable=False))

topics_table = Table( 'topics', metadata,
                    Column('id', Integer, primary_key=True, autoincrement=True),
                    Column('title', String(127), nullable=False),
                    Column('time_created', String(127), nullable=False))

superusers_table = Table( 'superusers', metadata,
                    Column('id', Integer, primary_key=True, autoincrement=True),
                    Column('user_id', ForeignKey('users.id'), nullable=False),
                    Column('time_created', String(127), nullable=False),
                    Column('colour', String(127), nullable=False),
                    Column('title', String(127), nullable=False))

def map_model_to_tables():
    mapper(User, users_table, properties={
        '_username': users_table.c.username,
        '_password': users_table.c.password,
        '_time_created': users_table.c.time_created,
        '_superuser': relationship(SuperUser, uselist=False, back_populates='_user')
    })

    mapper(SuperUser, superusers_table, properties={
        '_time_created': superusers_table.c.time_created,
        '_colour': superusers_table.c.colour,
        '_title': superusers_table.c.title,
        '_user': relationship(User, back_populates='_superuser', uselist=False)  # Create a one-to-one relationship with User
    })
        
    mapper(Thread, threads_table, properties={
        '_title': threads_table.c.title,
        '_owner': relationship(User, backref="_threads"),
        '_time_created': threads_table.c.time_created,
        '_content': threads_table.c.content,
        '_topic': threads_table.c.topic
    })
    
    mapper(Tag, tags_table, properties={
        '_name': tags_table.c.name,
        '_colour': tags_table.c.colour
    })
    
    mapper(Comment, comments_table, properties={
        '_owner': relationship(User, backref="_comments"),
        '_time_created': comments_table.c.time_created,
        '_content': comments_table.c.content
    })
    
    mapper(Topic, topics_table, properties={
        '_title': topics_table.c.title,
        '_time_created': topics_table.c.time_created
    })
