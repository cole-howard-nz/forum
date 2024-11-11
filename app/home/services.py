''' Layout service layer '''

from app import utils
from app.utils import ShoutboxMessage
from app.domain_model.model import Message, Topic
from app.adapters.repository import AbstractRepository

from typing import List


def get_shoutbox_messages(repo: AbstractRepository) -> List[Message]:
    return utils.get_shoutbox_messages(repo)

def add_shoutbox_message(form, repo: AbstractRepository):
    utils.add_shoutbox_message(form, repo)
    
def get_user(username: str, repo: AbstractRepository):
    return utils.get_user(username, repo)

def get_topics(repo: AbstractRepository) -> List[Topic]:
        topics = repo.get_all_topics()
        
        for topic in topics:
            threads = repo.get_threads_by_topic(topic.title)
            comments = sum(len(repo.get_comments_for_thread(thread.id)) for thread in threads)
            
            topic.thread_count = len(threads)
            topic.comment_count = comments
            
        return topics if topics else []
