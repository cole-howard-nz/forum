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
