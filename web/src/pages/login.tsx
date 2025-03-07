import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log("Login attempt with:", email, password)
        navigate("/dash")
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-black">
            <div className="w-full max-w-md p-8 space-y-8 bg-zinc-900 rounded-xl shadow-2xl shadow-zinc-800/20">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-bold text-white">Welcome back</h2>
                    <p className="mt-2 text-sm text-zinc-400">Please sign in to your account</p>
                </div>
                <form className="mt-8 space-y-6">
                    <div className="space-y-4 rounded-md">
                        <div>
                            <label htmlFor="email-address" className="sr-only">
                                Email address
                            </label>
                            <Input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="relative block w-full px-3 py-2 text-white bg-zinc-800 placeholder-zinc-500 border-zinc-700 rounded-md focus:outline-none focus:ring-zinc-500 focus:border-zinc-500 focus:z-10 sm:text-sm"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="relative block w-full px-3 py-2 text-white bg-zinc-800 placeholder-zinc-500 border-zinc-700 rounded-md focus:outline-none focus:ring-zinc-500 focus:border-zinc-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <Button
                            type="button"
                            onClick={handleSubmit}
                            className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-zinc-700 border border-transparent rounded-md group hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500"
                        >
                            Sign in
                        </Button>
                    </div>
                </form>

                <p className="mt-8 text-sm text-center text-zinc-400">
                    Don't have an account?{" "}
                    <a href="/signup" className="font-medium text-zinc-300 hover:text-white transition-colors">
                        Sign up
                    </a>
                </p>
            </div>
        </div>
    )
}
