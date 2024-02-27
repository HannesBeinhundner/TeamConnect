'use server'

import { z } from 'zod'
import { CreateProjectSchema } from '@/app/lib/types'
import { CreateProjectInputs } from '@/app/lib/types'
import { NextResponse } from 'next/server'
import { prisma } from "@/prisma";

export async function addEntry(inputData: CreateProjectInputs) {
    const result = CreateProjectSchema.safeParse(inputData)
    let zodErrors = {}
    if (result.success) {
        //await prisma.project.create({ data: { inputData, complete: false } })
        return { success: true, data: result.data }
    }

    if (result.error) {
        return { success: false, error: result.error.format() }
        // result.error.issues.forEach((issue) => {
        //     zodErrors = { ...zodErrors, [issue.path[0]]: issue.message };
        // });
        //return zodErrors
    }

    // return NextResponse.json(
    //     Object.keys(zodErrors).length > 0
    //         ? { errors: zodErrors }
    //         : { success: true }
    // )
}