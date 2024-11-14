from sqlalchemy import Table, MetaData, UniqueConstraint, ForeignKey, Column, Integer, String
from sqlalchemy.orm import mapper, relationship

from app.domain_model.model import User, Thread, Tag, Comment, Topic, SuperUser, Message


metadata = MetaData()

users_table = Table( 'users', metadata,
                    Column('id', Integer, primary_key=True, autoincrement=True),
                    Column('username', String(127), unique=True, nullable=False),
                    Column('password', String(127), nullable=False),
                    Column('signature', String(127), nullable=True),
                    Column('time_created', String(127), nullable=False))

threads_table = Table( 'threads', metadata,
                    Column('id', Integer, primary_key=True, autoincrement=True),
                    Column('title', String(127), nullable=False),
                    Column('owner_id', ForeignKey('users.id'), nullable=False),
                    Column('time_created', String(127), nullable=False),
                    Column('content', String(127), nullable=False),
                    Column('topic_id', ForeignKey('topics.id'), nullable=False))

tags_table = Table( 'tags', metadata,
                    Column('id', Integer, primary_key=True, autoincrement=True),
                    Column('name', String(127), unique=True, nullable=False),
                    Column('colour', String(127), nullable=False))

comments_table = Table( 'comments', metadata,
                    Column('id', Integer, primary_key=True, autoincrement=True),
                    Column('owner_id', ForeignKey('users.id'), nullable=False),
                    Column('thread_id', ForeignKey('threads.id'), nullable=False),
                    Column('time_created', String(127), nullable=False),
                    Column('editted', Integer, nullable=True),
                    Column('content', String(127), nullable=False))

topics_table = Table( 'topics', metadata,
                    Column('id', Integer, primary_key=True, autoincrement=True),
                    Column('title', String(127), nullable=False),
                    Column('description', String(127), nullable=False),
                    Column('time_created', String(127), nullable=False))

superusers_table = Table( 'superusers', metadata,
                    Column('id', Integer, primary_key=True, autoincrement=True),
                    Column('user_id', ForeignKey('users.id'), nullable=False),
                    Column('time_created', String(127), nullable=False),
                    Column('colour', String(127), nullable=False),
                    Column('title', String(127), nullable=False),
                    UniqueConstraint('id', 'user_id', name='id_-_user_id'))

thread_tags_table = Table( 'thread_tags', metadata,
                    Column('id', Integer, primary_key=True, autoincrement=True),
                    Column('thread_id', ForeignKey('threads.id'), nullable=False),
                    Column('tag_id', ForeignKey('tags.id'), nullable=False))

shoutbox_messages_table = Table( 'shoutbox_messages', metadata,
                    Column('id', Integer, primary_key=True, autoincrement=True),
                    Column('owner_id', ForeignKey('users.id'), nullable=False),
                    Column('message', String(127), nullable=False),
                    Column('time_created', String(127), nullable=False))


# Todo: find a way to have nested comments
# comment_comments_table = Table( 'comment_comments', metadata,
#                     Column('id', Integer, primary_key=True, autoincrement=True),
#                     Column('parent_comment_id', ForeignKey('comments.id'), nullable=False),
#                     Column('comment_id', ForeignKey('comments.id'), nullable=False))


def map_model_to_tables():
    mapper(User, users_table, properties={
        '_username': users_table.c.username,
        '_password': users_table.c.password,
        '_time_created': users_table.c.time_created,
        '_signature': users_table.c.signature,
        '_superuser': relationship(SuperUser, uselist=False, back_populates='_user')})

    mapper(SuperUser, superusers_table, properties={
        '_time_created': superusers_table.c.time_created,
        '_colour': superusers_table.c.colour,
        '_title': superusers_table.c.title,
        '_user': relationship(User, back_populates='_superuser', uselist=False)})

    mapper(Thread, threads_table, properties={
        '_title': threads_table.c.title,
        '_owner': relationship(User, backref="_threads"),
        '_topic': relationship(Topic, backref="_threads"),
        '_time_created': threads_table.c.time_created,
        '_content': threads_table.c.content,
        '_tag': relationship(Tag, secondary=thread_tags_table, back_populates='_threads')})

    mapper(Tag, tags_table, properties={
        '_name': tags_table.c.name,
        '_colour': tags_table.c.colour,
        '_threads': relationship(Thread, secondary=thread_tags_table, back_populates='_tag')})

    mapper(Comment, comments_table, properties={
        '_owner': relationship(User, backref="_comments"),
        '_time_created': comments_table.c.time_created,
        '_content': comments_table.c.content,
        '_editted': comments_table.c.editted,
        '_thread': relationship(Thread, backref='_comments')})

    mapper(Topic, topics_table, properties={
        '_title': topics_table.c.title,
        '_description': topics_table.c.description,
        '_time_created': topics_table.c.time_created })

    mapper(Message, shoutbox_messages_table, properties={
        '_owner_id': shoutbox_messages_table.c.owner_id,
        '_message': shoutbox_messages_table.c.message,
        '_time_created': shoutbox_messages_table.c.time_created,
    })
