import { NextResponse } from "next/server";
import pool from "@/libs/database/mysql";
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid'; // Para generar códigos de invitación únicos

export async function POST(req) {
    let db; // Definimos la conexión fuera del bloque try para que sea accesible en finally

    try {
        const body = await req.json();
        const { fullname, email, birthdate, companyName, password, confirmPassword } = body;

        // --- Validación de datos ---
        if (!fullname || !email || !birthdate || !companyName || !password || !confirmPassword) {
            return NextResponse.json({ message: 'Todos los campos son obligatorios.' }, { status: 400 });
        }
        if (password !== confirmPassword) {
            return NextResponse.json({ message: 'Las contraseñas no coinciden.' }, { status: 400 });
        }
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if (!passwordRegex.test(password)) {
            return NextResponse.json({ message: 'La contraseña debe tener al menos 8 caracteres, incluyendo letras y números.' }, { status: 400 });
        }

        db = await pool.getConnection();

        // Verificar si el correo ya existe
        const [existingUser] = await db.query('SELECT id FROM user WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return NextResponse.json({ message: 'El correo electrónico ya está registrado.' }, { status: 409 });
        }

        // --- INICIAMOS LA TRANSACCIÓN ---
        await db.beginTransaction();

        // El primer usuario que se registra crea la empresa, por lo tanto, es 'administrador'
        // Asumimos que el ID del rol 'administrador' es 2, según las inserciones iniciales.
        const adminRoleId = 2;

        // Hashear la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // 1. Crear el usuario en la tabla 'user'
        const userQuery = 'INSERT INTO user (fullname, birthdate, email, password, companyName, rol_id) VALUES (?, ?, ?, ?, ?, ?)';
        const [userResult] = await db.query(userQuery, [fullname, birthdate, email, hashedPassword, companyName, adminRoleId]);
        const newUserId = userResult.insertId;

        if (!newUserId) throw new Error("No se pudo crear el usuario.");

        // 2. Crear la compañía en la tabla 'company'
        const inviteCode = uuidv4();
        const companyQuery = 'INSERT INTO company (idUser, name, invite_code) VALUES (?, ?, ?)';
        const [companyResult] = await db.query(companyQuery, [newUserId, companyName, inviteCode]);
        const newCompanyId = companyResult.insertId;

        if (!newCompanyId) throw new Error("No se pudo crear la compañía.");

        // 3. Vincular al usuario con la compañía en 'user_company'
        const userCompanyQuery = 'INSERT INTO user_company (idUser, idCompany) VALUES (?, ?)';
        await db.query(userCompanyQuery, [newUserId, newCompanyId]);

        // --- SI TODO FUE BIEN, CONFIRMAMOS LOS CAMBIOS ---
        await db.commit();

        return NextResponse.json({ message: `¡Empresa '${companyName}' y usuario administrador creados exitosamente!` }, { status: 201 });

    } catch (error) {
        // Si ocurre cualquier error, revertimos todos los cambios
        if (db) await db.rollback();

        console.error("Error en el registro:", error);
        return NextResponse.json({ message: 'Error en el servidor. No se pudo completar el registro.' }, { status: 500 });
    } finally {
        // Nos aseguramos de liberar la conexión, haya o no un error
        if (db) db.release();
    }
}

