''' Domain model classes '''

# Overview:
#  - Thread, Comment, Tag, Topic, User, SuperUser

from typing import List
            

class Thread:
    def __init__(self, title, owner, time_created, content, replies):
        self._title = title
        self._owner = owner
        self._time_created = time_created
        self._content = content
        self._replies = replies

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
    def replies(self) -> List['Comment']:
        return self._replies

    @replies.setter
    def replies(self, new_replies: List['Thread']):
        self._replies = new_replies
        
    def add_reply(self, new_reply: 'Thread'):
        if isinstance(new_reply, Thread):
            self._replies.append(new_reply)
            
    def del_reply(self, reply: 'Thread'):
        if isinstance(reply, Thread):
            if reply in self._replies:
                self._replies.remove(reply)

class Comment:
    def __init__(self, owner, time_created, content, replies):
        self._owner = owner
        self._time_created = time_created
        self._content = content
        self._replies = replies

    @property
    def owner(self) -> str:
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
    def replies(self) -> List['Comment']:
        return self._replies

    @replies.setter
    def replies(self, new_replies: List['Comment']):
        self._replies = new_replies
        
    def add_reply(self, new_reply: 'Comment'):
        if isinstance(new_reply, Comment):
            self._replies.append(new_reply)
            
    def del_reply(self, reply: 'Comment'):
        if isinstance(reply, Comment):
            if reply in self._replies:
                self._replies.remove(reply)


class Tag:
    def __init__(self, name, colour):
        self._name = name
        self._colour = colour

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
    def __init__(self, title, time_created, threads, comments):
        self._title = title
        self._time_created = time_created

        self._threads = threads
        self._comments = comments

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

    @property
    def comments(self) -> List[Comment]:
        return self._comments
        
    @comments.setter
    def comments(self, new_comments: List[Comment]):
        self._comments = new_comments


    def add_thread(self, thread: Thread):
        if (isinstance(thread, Thread)):
            self._threads.append(thread)

    def del_thread(self, thread: Thread):
        if (isinstance(thread, Thread)):
            if (thread in self._threads):
                self._threads.remove(thread)
        
    def add_comment(self, new_comment: Comment):
        if (isinstance(new_comment, Comment)):
            self._threads.append(new_comment)

    def del_comment(self, comment: Comment):
        if (isinstance(comment, Comment)):
            if (comment in self._comment):
                self._comment.remove(comment)
   
                
class User:
    def __init__(self, username: str, password: str, time_created: str, threads: List['Thread'], comments: List['Comment']):
        self._username = username
        self._password = password
        self._time_created = time_created
        self._threads = threads
        self._comments = comments

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
        if isinstance(thread, Thread):
            if thread in self._threads:
                self._threads.append(thread)

    def add_comment(self, comment: 'Comment'):
        if isinstance(comment, Comment):
            self._comments.append(comment)

    def del_comment(self, comment: 'Comment'):
        if isinstance(comment, Thread):
            if comment in self._comments:
                self._comments.append(comment)
                

class SuperUser(User):
    def __init__(self, colour, title):
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