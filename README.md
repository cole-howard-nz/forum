# forum
Community forum full stack web application

!!!   TEMP   !!!

# Migration Steps
```bash
npm run generate
npm run migrate
```

# RBAC Details
Permission object for each action controlled by a permission node
Role object which can hold many permission objects and user ids
User model contains roleId attribute in session to use in API
Stored in Prisma schema / postgres database. Manual modification in prisma studio


# API
> [!NOTE]
> These are the endpoints related to the Profile model

**GET /api/profile/**
> Get own profile

**GET /api/profile/:userId**
> Get a profile by the userId, use 'all' for everyone

**POST /api/profile/:userId**
> Create a profile by the userId, requires permission _PROFILE_MODIFY_OTHERS_ to create for other users

**PUT /api/profile/:userId**
> Edit a profile by the userId, requires permission _PROFILE_MODIFY_OTHERS_ to edit for other users

**DELETE /api/profile/:userId**
> Delete a profile by the userId, requires permission _PROFILE_MODIFY_OTHERS_ to delete for other users

> [!NOTE]
> These are the endpoints related to the Group model

**GET /api/group/**
> Get all groups session user has access to

**GET /api/group/alpha**
> Get all groups sorted alphabetically with the title attribute

**GET /api/group/posts**
> Get all groups sorted with the most posts first

**GET /api/group/:groupId**
> Get a group by the id

**POST /api/group/**
> Create a group, requires permission _GROUP_CREATE_

**PUT /api/group/:groupId**
> Edit a group by the groupId, requires permission _GROUP_MODIFY_ 

**DELETE /api/group/:userId**
> Delete a group by the groupId, requires permission _GROUP_MODIFY_ 

> [!NOTE]
> These are the endpoints related to the Category model

**GET /api/category/**
> Get all categories session user has access to

**GET /api/category/:categoryId**
> Get category from the id

**GET /api/category/:groupId**
> Get all categories from a group

**POST /api/category/**
> Create a category, requires permission _CATEGORY_CREATE_

**PUT /api/category/:categoryId**
> Edit a category by the categoryId, requires permission _CATEGORY_MODIFY_ 

**DELETE /api/category/:categoryId**
> Delete a category by the categoryId, requires permission _CATEGORY_MODIFY_ 

> [!NOTE]
> These are the endpoints related to the Post model

**GET /api/post**
> Get all posts session user has access to

**GET /api/post/alpha/**
> Get post from the id

**GET /api/post/hidden/**
> Get all hidden posts

**GET /api/post/pinned/**
> Get all pinned posts

**GET /api/post/locked/**
> Get all locked posts

**GET /api/post/most-views/**
> Get all posts sorted by most views

**GET /api/post/:userId/**
> Get all post from the post owners userId
