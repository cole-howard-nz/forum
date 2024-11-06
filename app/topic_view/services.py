''' Topic service layer '''

from app import utils
from app.utils import ShoutboxMessage
from app.domain_model.model import Message
from app.adapters.repository import AbstractRepository

from typing import List


def get_shoutbox_messages(repo: AbstractRepository) -> List[Message]:
    return utils.get_shoutbox_messages(repo)

def add_shoutbox_message(form, repo: AbstractRepository):
    utils.add_shoutbox_message(form, repo)

def get_user(username: str, repo: AbstractRepository):
    return utils.get_user(username, repo)