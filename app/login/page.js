'use client';

import { useState } from 'react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useDispatch } from 'react-redux';
import { loginUser } from '../store/slices/authSlice';
import { toast } from 'react-toastify';



export default function LoginPage() {
    const router = useRouter();
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await dispatch(loginUser(formData)).unwrap();

            if (res && res.success) {
                toast.success('Login successful!');
                // Redirect to dashboard
                router.push('/dashboard');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted">
            <Card className="w-full max-w-md">
                <CardHeader className="text-2xl font-bold text-center">Login</CardHeader>
                <CardContent>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                            <Input type="email" id="email" name="email" placeholder="Enter your email" required value={formData.email} onChange={handleChange} />
                        </div>
                        <div className="relative">
                            <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
                            <Input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                placeholder="Enter your password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="pr-10"
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-8 text-gray-500 hover:text-gray-700"
                                onClick={() => setShowPassword(v => !v)}
                                tabIndex={-1}
                                style={{ background: 'none', border: 'none', padding: 0 }}
                            >
                                {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                            </button>
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>Login</Button>
                    </form>
                </CardContent>
                <CardFooter>
                    <p className="w-full text-center text-sm">
                        Don&apos;t have an account?{' '}
                        <Link href="/signup" className="text-primary underline">Sign up</Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}