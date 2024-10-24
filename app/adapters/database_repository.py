from typing import List

from sqlalchemy.orm import scoped_session
from sqlalchemy.orm.exc import NoResultFound


from app.domain_model.model import User, Thread, Tag, Comment, Topic, SuperUser, Message
from app.adapters.repository import AbstractRepository


class SessionContextManager:
    def __init__(self, session_factory):
        self.__session_factory = session_factory
        self.__session = scoped_session(self.__session_factory)

    def __enter__(self):
        return self

    def __exit__(self, *args):
        self.rollback()

    @property
    def session(self):
        return self.__session

    def commit(self):
        self.__session.commit()

    def rollback(self):
        self.__session.rollback()

    def reset_session(self):
        self.close_current_session()
        self.__session = scoped_session(self.__session_factory)

    def close_current_session(self):
        if not self.__session is None:
            self.__session.close()


class SqlAlchemyRepository(AbstractRepository):
    def __init__(self, session_factory):
        self._session_cm = SessionContextManager(session_factory)

    def close_session(self):
        self._session_cm.close_current_session()

    def reset_session(self):
        self._session_cm.reset_session()


    # User methods
    def add_user(self, user: User):
        with self._session_cm as scm:
            scm.session.add(user)
            scm.commit()

    def get_user(self, username: str) -> User:
        user = None
        try:
            user = self._session_cm.session.query(User).filter(User.username == username).one()
        except NoResultFound:
            pass

        return user
    
    def get_user_by_id(self, user_id) -> User:
        user = None
        try:
            user = self._session_cm.session.query(User).filter(User.id == user_id).one()
        except NoResultFound:
            pass

        return user
    # End of user methods
    
    
    # Thread methods
    def add_thread(self, thread: Thread):
        with self._session_cm as scm:
            scm.session.add(thread)
            scm.commit()
    
    def get_thread_by_id(self, thread_id: int) -> Thread:
        thread = None
        try:
            thread = self._session_cm.session.query(Thread).filter(Thread.id == thread_id).one()
        except NoResultFound:
            pass

        return thread
    
    def add_comment_to_thread(self, comment: Comment, thread: Thread):
        with self._session_cm as scm:
            thread.add_comment(comment)
            scm.session.add(comment)
            scm.session.add(thread)
            scm.commit()
    # End of thread methods
    
    
    # Tag methods
    def add_tag(self, tag: Tag):
        with self._session_cm as scm:
            scm.session.add(tag)
            scm.commit()
            
    def get_tag_by_id(self, tag_id: int):
        tag = None
        try:
            tag = self._session_cm.session.query(Tag).filter(Tag.id == tag_id).one()
        except NoResultFound:
            pass

        return tag
    # End of tag methods
         
         
    # Comment methods
    def add_comment(self, comment: Comment):
        with self._session_cm as scm:
            scm.session.add(comment)
            scm.commit()
    def get_comment_by_id(self, comment_id: int) -> Comment:
        comment = None
        try:
            comment = self._session_cm.session.query(Comment).filter(Comment.id == comment_id).one()
        except NoResultFound:
            pass

        return comment    
    # End of comment methods
      
      
    # Topic methods   
    def add_topic(self, topic: Topic):
        with self._session_cm as scm:
            scm.session.add(topic)
            scm.commit()
            
    def get_topic_by_id(self, topic_id: int) -> Topic:
        topic = None
        try:
            topic = self._session_cm.session.query(Topic).filter(Topic.id == topic_id).one()
        except NoResultFound:
            pass

        return topic
    # End of topic methods
    
    # SuperUser methods   
    def add_superuser(self, superuser: SuperUser):
        with self._session_cm as scm:
            scm.session.add(superuser)
            scm.commit()
            
    def get_superuser_by_id(self, superuser_id: int) -> SuperUser:
        superuser = None
        try:
            superuser = self._session_cm.session.query(SuperUser).filter(SuperUser.user_id == superuser_id).one()
        except NoResultFound:
            pass

        return superuser
    # End of SuperUser methods
    
    # Shoutbox Message methods   
    def add_shoutbox_message(self, message: Message):
        with self._session_cm as scm:
            scm.session.add(message)
            scm.commit()
            
    def get_shoutbox_messages(self) -> List[Message]:
        messages = None
        try:
            messages = self._session_cm.session.query(Message).all()
        except NoResultFound:
            pass

        return messages
    # End of Shoutbox Message methods
    