import csv
from pathlib import Path
from datetime import datetime, date

from werkzeug.security import generate_password_hash

from app import utils
from app.adapters.repository import AbstractRepository
from app.domain_model.model import User, Thread, Tag, Comment, Topic, SuperUser


def read_csv_file(filename: str):
    with open(filename, encoding='utf-8-sig') as infile:
        reader = csv.reader(infile)

        next(reader)

        for row in reader:
            row = [item.strip() for item in row]
            yield row

def load_users(data_path: Path, repo: AbstractRepository):
    users = dict()
    users_filename = str(Path(data_path) / "users.csv")
    
    for data_row in read_csv_file(users_filename):
        user = User(
            username=data_row[1],
            password=generate_password_hash(data_row[2]),
            time_created=utils.date_time_formatter(data_row[3]),
            signature=data_row[4])
        
        repo.add_user(user)
        users[data_row[0]] = user
    return users

def load_threads(data_path: Path, repo: AbstractRepository):
    threads = dict()
    threads_filename = str(Path(data_path) / "threads.csv")
    
    for data_row in read_csv_file(threads_filename):
        thread = Thread(
                title=data_row[1],
                owner=repo.get_user_by_id(data_row[2]),
                time_created=utils.date_time_formatter(data_row[3]),
                content=data_row[4],
                topic=repo.get_topic_by_id(data_row[5]))
        
        tags = data_row[6].split(';')
        
        for tag in tags:
            tag_obj = repo.get_tag_by_id(tag)
            thread.add_tag(tag_obj)
            
        repo.add_thread(thread)
        threads[data_row[0]] = thread
    return threads

def load_tags(data_path: Path, repo: AbstractRepository):
    tags = dict()
    tags_filename = str(Path(data_path) / "tags.csv")
    
    for data_row in read_csv_file(tags_filename):
        tag = Tag(
                name=data_row[1],
                colour=data_row[2])
        
        repo.add_tag(tag)
        tags[data_row[0]] = tag
    return tags

def load_comments(data_path: Path, repo: AbstractRepository):
    comments = dict()
    comments_filename = str(Path(data_path) / "comments.csv")
    
    for data_row in read_csv_file(comments_filename):
        found_thread=repo.get_thread_by_id(data_row[4])
        
        comment = Comment(
                owner = repo.get_user_by_id(data_row[1]),
                time_created=utils.date_time_formatter(data_row[2]),
                content=data_row[3],
                thread=found_thread)
        
        repo.add_comment_to_thread(comment, found_thread)
        
        comments[data_row[0]] = comment
    return comments

def load_topics(data_path: Path, repo: AbstractRepository):
    topics = dict()
    topics_filename = str(Path(data_path) / "topics.csv")
    
    for data_row in read_csv_file(topics_filename):
        topic = Topic(
                title=data_row[1],
                description=data_row[2],
                time_created=utils.date_time_formatter(data_row[3]))
        
        repo.add_topic(topic)
        topics[data_row[0]] = topic
    return topics

def load_superusers(data_path: Path, repo: AbstractRepository):
    superusers = dict()
    superusers_filename = str(Path(data_path) / "superusers.csv")
    
    for data_row in read_csv_file(superusers_filename):
        user = repo.get_user_by_id(data_row[1])
        
        superuser = SuperUser(
                username=user.username,
                password=user.password,
                time_created=utils.date_time_formatter(data_row[2]),
                colour=data_row[3],
                title=data_row[4])
        
        superuser._user = user
        
        repo.add_superuser(superuser)
        superusers[data_row[0]] = superuser
    return superusers
