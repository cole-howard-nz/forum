import { PermissionNode, PERMISSIONS } from "../constants/permissions"
import prisma from "./prisma"

const checkUserPermission = async (userId: string, requiredNodes: PermissionNode | PermissionNode[]): Promise<boolean> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { role: { include: { permissions: true } } }
  })

  if (!user?.role) return false

  const nodes = Array.isArray(requiredNodes) ? requiredNodes : [requiredNodes]

  return user.role.permissions.some(permission => permission.node === PERMISSIONS.ROOT || nodes.includes(permission.node))
}

const userHasPermission = async (userId: string | undefined, node: PermissionNode): Promise<boolean> => {
  const hasPermission = await checkUserPermission(userId || '', node)

  if (!hasPermission) {
    return false
  }

  return true
}

export { checkUserPermission, userHasPermission, PERMISSIONS }