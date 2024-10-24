import datetime
from pathlib import Path

from app.domain_model.model import Message
from app.adapters.repository import AbstractRepository
from app.adapters.csv_reader import load_users, load_threads, load_tags, load_comments, load_topics, load_superusers


def test_populate(repo: AbstractRepository):
    user = repo.get_user_by_id(1)
    user_two = repo.get_user_by_id(2)
    user_three = repo.get_user_by_id(3)
    user_four = repo.get_user_by_id(4)
    
    message_one = Message(
        user.id,
        "Test Message One",
        str(datetime.datetime(2008, 11, 22, 19, 53, 42))
    )
    
    message_two = Message(
        user_four.id,
        "Test Message Two",
        str(datetime.datetime(2008, 11, 22, 19, 53, 42))
    )
    
    message_three = Message(
        user_two.id,
        "Test Message Three",
        str(datetime.datetime(2008, 11, 22, 19, 53, 42))
    )
    
    message_four = Message(
        user_three.id,
        "Test Message Four",
        str(datetime.datetime(2008, 11, 22, 19, 53, 42))
    )
    
    repo.add_shoutbox_message(message_one)
    repo.add_shoutbox_message(message_two)
    repo.add_shoutbox_message(message_three)
    repo.add_shoutbox_message(message_four)

def populate(data_path: Path, repo: AbstractRepository, database_mode: bool):
    load_users(data_path, repo)
    load_superusers(data_path, repo)
    load_tags(data_path, repo)
    load_topics(data_path, repo)
    load_threads(data_path, repo)
    load_comments(data_path, repo)
    
    test_populate(repo)
    