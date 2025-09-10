"use client"
import { Input, Card, CardHeader, CardBody, CardFooter, Button, Link } from "@heroui/react"
import { useState } from "react";
import { EyeOff, EyeIcon } from "lucide-react"
import { sendInicio } from "@/app/crear-cuenta/components/crearcuentaForm/scripts"

export default function CrearCuentaComponent() {
    const [isVisible, setIsVisible] = useState(false);
    const [form, setForm] = useState({
        fullname: "",
        email: "",
        birthdate: "",
        companyName: "",
        password: "",
        confirmPassword: ""
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const toggleVisibility = () => setIsVisible(!isVisible);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        if (form.password !== form.confirmPassword) {
            setMessage({ type: "error", text: "Las contraseñas no coinciden." });
            setLoading(false);
            return; // Detiene la ejecución
        }
        if (form.password.length < 8) {
            setMessage({ type: "error", text: "La contraseña debe tener al menos 8 caracteres." });
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });

            const data = await res.json();
            if (res.ok) {
                setMessage({ type: "success", text: data.message });
                setForm({
                    fullname: "",
                    email: "",
                    birthdate: "",
                    companyName: "",
                    password: "",
                    confirmPassword: ""
                });
                sendInicio()
            } else {
                setMessage({ type: "error", text: data.message });
            }
        } catch (error) {
            setMessage({ type: "error", text: "Error al conectar con el servidor." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <Card className="w-full max-w-md p-6">
                <CardHeader className="flex flex-col items-start">
                    <h1 className="text-2xl font-bold">Crear Cuenta</h1>
                    <p className="text-sm text-default-500">Ingresa tus datos para registrarte.</p>
                </CardHeader>
                <CardBody>
                    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                        <Input
                            isRequired
                            label="Nombre completo"
                            name="fullname"
                            placeholder="Ingresa tu nombre y apellido"
                            type="text"
                            value={form.fullname}
                            onChange={handleChange}
                        />
                        <Input
                            isRequired
                            label="Correo"
                            name="email"
                            placeholder="Correo electrónico"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                        />
                        <Input
                            isRequired
                            label="Fecha de nacimiento"
                            name="birthdate"
                            type="date"
                            value={form.birthdate}
                            onChange={handleChange}
                        />
                        <Input
                            isRequired
                            label="Nombre de la clínica"
                            name="companyName"
                            placeholder="Ingresa el nombre de la clínica"
                            type="text"
                            value={form.companyName}
                            onChange={handleChange}
                        />
                        <Input
                            isRequired
                            label="Contraseña"
                            name="password"
                            placeholder="Crea una contraseña segura"
                            endContent={
                                <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                                    {isVisible
                                        ? <EyeOff className="text-2xl text-default-400 pointer-events-none" />
                                        : <EyeIcon className="text-2xl text-default-400 pointer-events-none" />}
                                </button>
                            }
                            type={isVisible ? "text" : "password"}
                            value={form.password}
                            onChange={handleChange}
                        />
                        <Input
                            isRequired
                            label="Confirmar Contraseña"
                            name="confirmPassword"
                            placeholder="Repite tu contraseña"
                            type={isVisible ? "text" : "password"}
                            value={form.confirmPassword}
                            onChange={handleChange}
                        />

                        <Button
                            type="submit"
                            color="primary"
                            fullWidth
                            isLoading={loading}
                        >
                            Crear Cuenta
                        </Button>
                    </form>

                    {message && (
                        <p className={`mt-4 text-sm ${message.type === "success" ? "text-green-600" : "text-red-600"}`}>
                            {message.text}
                        </p>
                    )}
                </CardBody>
                <CardFooter>
                    <div className="flex justify-center text-sm w-full">
                        <Link href="/" size="sm">Iniciar sesión</Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
