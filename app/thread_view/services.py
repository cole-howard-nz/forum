''' Topic service layer '''

from app import utils
from app.utils import ShoutboxMessage
from app.adapters.repository import AbstractRepository

from typing import List


def get_comments_for_thread(string_thread, repo: AbstractRepository):
    return repo.get_comments_for_thread(string_thread)

def get_thread_by_id(thread_id, repo: AbstractRepository):
    thread = repo.get_thread_by_id(thread_id)
    
    print(thread.time_created)
    thread.format_time_created = utils.date_time_formatter(thread.time_created)
    print(thread.format_time_created)
    return thread

def get_user(username: str, repo: AbstractRepository):
    return utils.get_user(username, repo)
