import abc

from app.domain_model.model import User, Thread, Tag, Comment, Topic, SuperUser, Message


repo_instance = None


class RepositoryException(Exception):
    def __init__(self, message=None):
        pass


class AbstractRepository(abc.ABC):
    @abc.abstractmethod
    def add_user(self, user: User):
        raise NotImplementedError

    @abc.abstractmethod
    def get_user(self, user_name) -> User:
        raise NotImplementedError
    
    @abc.abstractmethod
    def get_user_by_id(self, user_id) -> User:
        raise NotImplementedError
    
    
    
    @abc.abstractmethod
    def add_thread(self, thread: Thread):
        raise NotImplementedError
    
    @abc.abstractmethod
    def get_thread_by_id(self, thread_id: int) -> Thread:
        raise NotImplementedError
    
    
    
    @abc.abstractmethod
    def add_tag(self, tag: Tag):
        raise NotImplementedError
    
    @abc.abstractmethod
    def get_tag_by_id(self, tag_id: int):
        raise NotImplementedError
    
    
    
    @abc.abstractmethod
    def add_comment(self, comment: Comment):
        raise NotImplementedError
    
    @abc.abstractmethod
    def add_comment_to_thread(self, comment: Comment, thread: Thread):
        raise NotImplementedError
    
    @abc.abstractmethod
    def get_comment_by_id(self, tag_id: int):
        raise NotImplementedError
    
    
    
    @abc.abstractmethod
    def add_topic(self, topic: Topic):
        raise NotImplementedError

    @abc.abstractmethod
    def get_topic_by_id(self, topic_id: int):
        raise NotImplementedError
    
    
    
    @abc.abstractmethod
    def add_superuser(self, superuser: SuperUser):
        raise NotImplementedError
    @abc.abstractmethod
    def get_superuser_by_id(self, superuser_id: int):
        raise NotImplementedError
    


    @abc.abstractmethod
    def add_shoutbox_message(self, message: Message):
        raise NotImplementedError
    
    @abc.abstractmethod
    def get_shoutbox_messages(self):
        raise NotImplementedError
