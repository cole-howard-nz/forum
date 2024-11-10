''' Topic service layer '''

from app import utils
from app.utils import ShoutboxMessage
from app.adapters.repository import AbstractRepository

from typing import List


def get_shoutbox_messages(repo: AbstractRepository):
    return utils.get_shoutbox_messages(repo)

def add_shoutbox_message(form, repo: AbstractRepository):
    utils.add_shoutbox_message(form, repo)

def get_user(username: str, repo: AbstractRepository):
    return utils.get_user(username, repo)

def get_all_topics(repo: AbstractRepository):
    return repo.get_all_topics()

def get_threads_for_topics(topic: str, repo: AbstractRepository):
    return repo.get_threads_by_topic(topic)

def get_topic(topic: str, repo: AbstractRepository):
    topic = topic.split('-')[0]
    topics = repo.get_all_topics()
    
    for current in topics:
        print(current.title, topic)
        if current.title == topic:
            return current
    
    return None
