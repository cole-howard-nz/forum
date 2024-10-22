from pathlib import Path

from app.adapters.repository import AbstractRepository
from app.adapters.csv_reader import load_users, load_threads, load_tags, load_comments, load_topics, load_superusers


def populate(data_path: Path, repo: AbstractRepository, database_mode: bool):
    load_users(data_path, repo)
    load_superusers(data_path, repo)
    load_tags(data_path, repo)
    load_topics(data_path, repo)
    load_threads(data_path, repo)
    load_comments(data_path, repo)