"use server"
import { redirect } from "next/navigation"

export const sendInicio = async () => {
    redirect("/")
}