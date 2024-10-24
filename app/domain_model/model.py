''' Domain model classes '''

# Overview:
#  - Thread, Comment, Tag, Topic (Main Thread), User, SuperUser, Message (Shoutbox Message)

from typing import List


class Message:
    def __init__(self, owner_id: int, message, time_created):
        self._owner_id = owner_id
        self._message = message
        self._time_created = time_created
    
    @property
    def owner_id(self) -> int:
        return self._owner_id
    
    @property
    def message(self) -> str:
        return self._message
    
    @message.setter
    def message(self, new_message: str):
        self._message = new_message
    
    @property
    def time_created(self) -> str:
        return self._time_created
    
    @time_created.setter
    def time_created(self, new_time_created: str):
        self._time_created = new_time_created
        
    

class Thread:
    def __init__(self, title, owner, time_created, content, topic):
        self._title = title                 # 1
        self._owner = owner                 # 1
        self._time_created = time_created   # 1
        self._content = content             # 1
        self._topic = topic                 # 1
        self._comments = []                 # 0->many
        self._tag = []                      # 0->many

    @property
    def title(self) -> str:
        return self._title
    
    @title.setter
    def title(self, new_title: str):
        self._title = new_title
    
    @property
    def owner(self) -> 'User':
        return self._owner

    @property
    def time_created(self) -> str:
        return self._time_created

    @property
    def content(self) -> str:
        return self._content

    @content.setter
    def content(self, new_content: str):
        self._content = new_content
        
    @property
    def topic(self) -> 'Topic':
        return self._topic

    @topic.setter
    def topic(self, new_topic: 'Topic'):
        self._topic = new_topic

    @property
    def comments(self) -> List['Comment']:
        return self._comments

    @comments.setter
    def comments(self, new_comments: List['Comment']):
        self._comments = new_comments
    
    @property
    def tag(self) -> List['Tag']:
        return self._tag

    @tag.setter
    def tag(self, new_tag: List['Tag']):
        self._tag = new_tag
        
    def add_comment(self, new_comment: 'Comment'):
        if isinstance(new_comment, Comment):
            self._comments.append(new_comment)
            
    def del_comment(self, comment: 'Comment'):
        if isinstance(comment, Comment):
            if comment in self._comments:
                self._comments.remove(comment)
    
    def add_tag(self, new_tag: 'Tag'):
        if isinstance(new_tag, Tag):
            self._tag.append(new_tag)
            
    def del_tag(self, tag: 'Tag'):
        if isinstance(tag, Tag):
            if tag in self._tag:
                self._tag.remove(tag)


class Comment:
    def __init__(self, owner, time_created, content, thread):
        self._owner = owner                 # 1
        self._time_created = time_created   # 1
        self._content = content             # 1
        self._thread = thread               # 1
        self._comments = []                 # 0->many

    @property
    def owner(self) -> 'User':
        return self._owner

    @property
    def time_created(self) -> str:
        return self._time_created

    @property
    def content(self) -> str:
        return self._content

    @content.setter
    def content(self, new_content: str):
        self._content = new_content
        
    @property
    def thread(self) -> Thread:
        return self._thread

    @thread.setter
    def thread(self, new_thread: Thread):
        self._thread = new_thread

    @property
    def comments(self) -> List['Comment']:
        return self._comments

    @comments.setter
    def comments(self, new_comments: List['Comment']):
        self._comments = new_comments
        
    def add_comment(self, new_comment: 'Comment'):
        if isinstance(new_comment, Comment):
            self._comments.append(new_comment)
            
    def del_comment(self, comment: 'Comment'):
        if isinstance(comment, Comment):
            if comment in self._comments:
                self._comments.remove(comment)


class Tag:
    def __init__(self, name, colour):
        self._name = name      # 1
        self._colour = colour  # 1

    @property
    def name(self) -> str:
        return self._name

    @name.setter
    def name(self, new_name: str):
        self._name = new_name

    @property
    def colour(self) -> str:
        return self._colour

    @colour.setter
    def colour(self, new_colour: str):
        self._colour = new_colour
        
        
class Topic:
    def __init__(self, title, time_created):
        self._title = title                 # 1
        self._time_created = time_created   # 1
        self._threads = []                  # 0->many

    @property
    def title(self) -> str:
        return self._title

    @title.setter
    def title(self, new_title):
        self._title = new_title

    @property
    def time_created(self) -> str:
        return self._time_created

    @time_created.setter
    def time_created(self, new_time_created):
        self._time_created = new_time_created

    @property
    def threads(self) -> List[Thread]:
        return self._threads
        
    @threads.setter
    def threads(self, new_threads: List[Thread]):
        self._threads = new_threads

    def add_thread(self, thread: Thread):
        if isinstance(thread, Thread):
            self._threads.append(thread)

    def del_thread(self, thread: Thread):
        if isinstance(thread, Thread) and thread in self._threads:
            self._threads.remove(thread)
                

class User:
    def __init__(self, username: str, password: str, time_created: str):
        self._username = username
        self._password = password
        self._time_created = time_created
        self._threads = []
        self._comments = []

    @property
    def username(self) -> str:
        return self._username

    @username.setter
    def username(self, new_username: str):
        self._username = new_username

    @property
    def password(self) -> str:
        return self._password

    @password.setter
    def password(self, new_password: str):
        self._password = new_password

    @property
    def time_created(self) -> str:
        return self._time_created

    @property
    def threads(self) -> List['Thread']:
        return self._threads

    @threads.setter
    def threads(self, new_threads: List['Thread']):
        self._threads = new_threads

    @property
    def comments(self) -> List['Comment']:
        return self._comments

    @comments.setter
    def comments(self, new_comments: List['Comment']):
        self._comments = new_comments

    def add_thread(self, new_thread: 'Thread'):
        if isinstance(new_thread, Thread):
            self._threads.append(new_thread)
    
    def del_thread(self, thread: 'Thread'):
        if isinstance(thread, Thread) and thread in self._threads:
            self._threads.remove(thread)

    def add_comment(self, comment: 'Comment'):
        if isinstance(comment, Comment):
            self._comments.append(comment)

    def del_comment(self, comment: 'Comment'):
        if isinstance(comment, Comment) and comment in self._comments:
            self._comments.remove(comment)
                

class SuperUser(User):
    def __init__(self, username: str, password: str, time_created: str, colour: str, title: str):
        super().__init__(username, password, time_created)
        self._colour = colour
        self._title = title
        
    @property
    def colour(self) -> str:
        return self._colour
    
    @colour.setter
    def colour(self, new_colour: str):
        self._colour = new_colour
    
    @property
    def title(self) -> str:
        return self._title
    
    @title.setter
    def title(self, new_title: str):
        self._title = new_title