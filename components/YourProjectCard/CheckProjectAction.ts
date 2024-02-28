'use server'

import { CreateProjectSchema } from '@/app/lib/types'
import { CreateProjectInputs } from '@/app/lib/types'
import { prisma } from "@/prisma";
import { Prisma } from '@prisma/client'

export async function checkProject(sessionEmail: string | null | undefined) {

}