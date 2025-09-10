'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
export const createCookie = async (token) => {
    const createCookie = await cookies()
    createCookie.set('token', token)
    return
}


export const closession = async () => {
    const createCookie = await cookies()
    createCookie.delete('token')
    redirect("/")
    return
}