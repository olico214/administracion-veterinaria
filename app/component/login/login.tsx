"use client";

import { useState } from "react";
import {
    Input,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Button,
} from "@heroui/react";

import { EyeOff, EyeIcon } from "lucide-react";
import { setSession } from "@/app/component/login/scripts";

export default function LoginComponent() {

    const [form, setForm] = useState({ email: "", password: "" });
    const [isVisible, setIsVisible] = useState(false);
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

        if (!form.email || !form.password) {
            setMessage({ type: "error", text: "Por favor, ingresa tu correo y contraseña." });
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (res.ok) {
                setSession()
                setMessage({ type: "success", text: data.message });
            } else {
                setMessage({ type: "error", text: data.message || "Ocurrió un error." });
            }
        } catch (error) {
            console.error("Login request failed:", error);
            setMessage({ type: "error", text: "Error al conectar con el servidor." });
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="flex justify-center items-center min-h-screen">
            <Card className="w-full max-w-md p-6">
                <CardHeader className="flex flex-col items-start">
                    <h1 className="text-2xl font-bold">Iniciar Sesión</h1>
                    <p className="text-sm text-default-500">Bienvenido de nuevo.</p>
                </CardHeader>
                <CardBody>
                    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Correo</label>
                            <input
                                required
                                placeholder="Ingresa tu correo electrónico"
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                            <input
                                required
                                placeholder="Ingresa tu contraseña"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                type={isVisible ? "text" : "password"}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <button className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-gray-400" type="button" onClick={toggleVisibility}>
                                {isVisible ? <EyeOff className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                            </button>
                        </div>

                        <div className="flex justify-between items-center text-sm">
                            <a href="/crear-cuenta" className="font-medium text-indigo-600 hover:text-indigo-500">
                                Crear cuenta
                            </a>
                            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                                ¿Olvidaste tu contraseña?
                            </a>
                        </div>

                        {message && (
                            <p className={`text-sm text-center ${message.type === "success" ? "text-green-600" : "text-red-600"}`}>
                                {message.text}
                            </p>
                        )}

                        <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400">
                            {loading ? 'Iniciando...' : 'Iniciar Sesión'}
                        </button>
                    </form>
                </CardBody>

            </Card>
        </div>
    );
}