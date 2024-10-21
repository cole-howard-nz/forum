from sqlalchemy.orm.exc import NoResultFound

from sqlalchemy.orm import scoped_session

from app.domain_model.model import User, Thread, Tag, Comment, Topic, SuperUser
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
            thread = self._session_cm.session.query(Thread).filter(Thread._Thread_id == thread_id).one()
        except NoResultFound:
            pass

        return thread
    # End of thread methods
    
    
    # Tag methods
    def add_tag(self, tag: Tag):
        with self._session_cm as scm:
            scm.session.add(tag)
            scm.commit()
    # End of tag methods
         
         
    # Comment methods
    def add_comment(self, comment: Comment):
        with self._session_cm as scm:
            scm.session.add(comment)
            scm.commit()
    # End of comment methods
      
      
    # Topic methods   
    def add_topic(self, topic: Topic):
        with self._session_cm as scm:
            scm.session.add(topic)
            scm.commit()
    # End of topic methods
    
    # SuperUser methods   
    def add_superuser(self, superuser: SuperUser):
        with self._session_cm as scm:
            scm.session.add(superuser)
            scm.commit()
    # End of SuperUser methods
    