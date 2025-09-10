import { NextResponse } from "next/server";
import pool from "@/libs/database/mysql";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createCookie } from "@/libs/session/login";

export async function POST(req) {
    let db; // Define the connection outside the try block to be accessible in finally

    try {
        const body = await req.json();
        const { email, password } = body;

        // --- 1. Basic validation ---
        if (!email || !password) {
            return NextResponse.json({ message: 'El correo y la contraseña son obligatorios.' }, { status: 400 });
        }

        db = await pool.getConnection();

        // --- 2. Find the user in the database ---
        // We select the id to create the token and the password to compare it.
        const userQuery = 'SELECT id, password FROM user WHERE email = ?';
        const [users] = await db.query(userQuery, [email]);

        // If no user is found, return a generic error to avoid revealing registered emails.
        if (users.length === 0) {
            return NextResponse.json({ message: 'Credenciales inválidas.' }, { status: 401 });
        }

        const user = users[0];

        // --- 3. Compare the provided password with the hashed password ---
        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return NextResponse.json({ message: 'Credenciales inválidas.' }, { status: 401 });
        }

        // --- 4. If credentials are correct, create the JWT ---
        const payload = {
            id: user.id,
            // You could add other non-sensitive data here if needed in the future
            // For example: rol: user.rol_id
        };

        // Sign the token with a secret key from environment variables
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '7d' // The token will be valid for 7 days
        });

        await createCookie(token)

        return NextResponse.json({
            message: 'Inicio de sesión exitoso.',

        }, { status: 200 });

    } catch (error) {
        console.error("Error en el login:", error);
        return NextResponse.json({ message: 'Error en el servidor. No se pudo iniciar sesión.' }, { status: 500 });
    } finally {
        // Ensure the database connection is released whether there is an error or not
        if (db) db.release();
    }
}
