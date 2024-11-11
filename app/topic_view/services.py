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
    threads = repo.get_threads_by_topic(topic)
    
    for thread in threads:
        count = len(repo.get_comments_for_thread(thread.id))
        thread.comment_count = utils.plural_or_singular(f'{count} comment', count)
        
        # Todo: add view counters to threads
        thread.view_count = 0
    
    return threads

def get_topic(topic_name: str, repo: AbstractRepository):
    topic_name = topic_name.split('-')[0]
    topics = repo.get_all_topics()
    
    
    for topic in topics:
        if topic.title == topic_name:
            return topic
    
    return None
