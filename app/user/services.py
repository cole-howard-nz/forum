''' User service layer '''

from app import utils
from app.adapters.repository import AbstractRepository


def get_user(username: str, repo: AbstractRepository):
    return utils.get_user(username, repo)