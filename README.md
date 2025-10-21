# forum
Community forum full stack web application

Temp Info Dump


Migration Steps
```bash
npm run generate
npm run migrate
```



RBAC Details
```bash
Permission object for each action controlled by a permission node
Role object which can hold many permission objects and user ids
User model contains roleId attribute in session to use in API
Stored in Prisma schema / postgres database. Manual modification in prisma studio
```
