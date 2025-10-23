export const PERMISSIONS = {
  // Root access
  ROOT: 'root',
  
  // Profile permissions
  PROFILE: {
    VIEW_OWN: 'profile:view:own',
    VIEW_OTHERS: 'profile:view:others',
    MODIFY_OWN: 'profile:modify:own',
    MODIFY_OTHERS: 'profile:modify:others',
    DELETE_OWN: 'profile:delete:own',
    DELETE_OTHERS: 'profile:delete:others',
  },
  
  // User permissions
  USER: {
    VIEW_ALL: 'user:view:all',
    CREATE: 'user:create',
    MODIFY_OTHERS: 'user:modify:others',
    DELETE_OTHERS: 'user:delete:others',
  },
  
  // Role permissions
  ROLE: {
    VIEW_ALL: 'role:view:all',
    CREATE: 'role:create',
    MODIFY: 'role:modify',
    DELETE: 'role:delete',
    ASSIGN: 'role:assign',
  },
  
}

export const getAllPermissionNodes = (): string[] => {
  const nodes: string[] = [PERMISSIONS.ROOT]
  
  const extractNodes = (obj: any) => {
    Object.values(obj).forEach(value => {
      if (typeof value === 'string') {
        nodes.push(value)

      } else if (typeof value === 'object') {
        extractNodes(value)
      }
    })
  }
  
  extractNodes(PERMISSIONS)
  return nodes
}

export type PermissionNode = typeof PERMISSIONS[keyof typeof PERMISSIONS] | string