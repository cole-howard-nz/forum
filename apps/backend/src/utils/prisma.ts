/*
 *    Create prisma client instance
 */

import { PrismaClient } from "@prisma/client"

const prisma: PrismaClient = new PrismaClient()

export default prisma