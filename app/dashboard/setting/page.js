"use client";

import React, { useEffect, useState } from 'react';
import DashboardLayout from '../DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { loadUserFromToken, updatePassword, updateUser } from '@/app/store/slices/authSlice';
import { toast } from 'react-toastify';

export default function SettingsPage() {

    const dispatch = useDispatch();

    const { user } = useSelector(state => state.auth);
    // Example user data, replace with actual user info from context/store
    const [form, setForm] = useState({
        name: 'John Doe',
        email: 'john@example.com',
        avatar: '', // URL or empty for fallback
        company: 'Example Inc.',
        subscription: 'Pro',
        role: 'admin',
        password: '',
        newPassword: ''
    });
    const [editMode, setEditMode] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [userUpdating, setUserUpdating] = useState(false);
    const [passwordUpdating, setPasswordUpdating] = useState(false);

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
    };

    const handleSaveInfo = async () => {
        try {
            setUserUpdating(true);
            const formData = {
                name: form.name,
                avatar: form.avatar,
            }
            const res = await dispatch(updateUser(formData)).unwrap();

            if (res && res.success) {
                // Optionally show a success message
                toast.success("User info updated successfully");
                setEditMode(false);

            }

        } catch (error) {
            console.error("Failed to save user info:", error);
            toast.error("Failed to save user info");
        } finally {
            setUserUpdating(false);
        }


    };

    const handleSavePassword = async () => {
        setPasswordUpdating(true);
        try {

            const formdata = {
                password: form.password,
                newPassword: form.newPassword
            }
            const res = await dispatch(updatePassword(formdata)).unwrap();

            if (res && res.success) {
                toast.success("Password updated successfully");
                setForm(f => ({ ...f, password: '', newPassword: '' }));
            }

        } catch (error) {
            console.log("Failed to update password:", error);
            toast.error(error || "Failed to update password");

        } finally {
            setPasswordUpdating(false);
        }
    };

    useEffect(() => {
        if (!user) {
            dispatch(loadUserFromToken())
        } else {
            setForm(f => ({
                ...f,
                name: user.name || '',
                email: user.email || '',
                avatar: user.avatar || '',
                company: user.company || '',
                subscription: user.subscription || 'Free',
                role: user.role || 'tenant',
            }))
        }
    }, [user, dispatch])


    return (
        <DashboardLayout>
            <div className="w-fullmx-auto w-full mt-10 flex flex-row justify-evenly items-start gap-8 ">
                <Card className="w-3/5 p-8 flex flex-col gap-6 shadow-lg border border-gray-200">

                    <div className="flex items-center gap-4 mb-6">
                        <Avatar className="size-16">
                            <AvatarImage src={form.avatar} alt={form.name} />
                            <AvatarFallback>{form.name ? form.name[0] : 'U'}</AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="text-2xl font-bold text-gray-800">{form.name}</div>
                            <div className="text-base text-gray-500">{form.email}</div>
                        </div>
                        <div className="flex flex-col mb-4 ml-auto">
                            <p>
                                <span className="font-semibold">Company:</span> {form?.company || 'N/A'}</p>
                            <p><span className="font-semibold">Subscription:</span> {form?.subscription || 'N/A'}</p>
                            <p><span className="font-semibold">Role:</span>  {form?.role || 'N/A'}</p>
                        </div>
                    </div>
                    <h2 className="text-lg font-semibold mb-2 text-gray-700">Personal Info</h2>
                    <Input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Name"
                        disabled={!editMode}
                        className="mb-2"
                    />
                    <Input
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Email"
                        type="email"
                        readOnly
                        disabled={true}
                        className="mb-2"
                    />
                    {editMode && (
                        <Input
                            name="avatar"
                            value={form.avatar}
                            onChange={handleChange}
                            placeholder="Avatar URL (optional)"
                            className="mb-2"
                        />
                    )}

                    <div className="flex gap-2 justify-end mt-4">
                        {!editMode ? (
                            <Button variant="default" onClick={() => setEditMode(true)}>Edit Info</Button>
                        ) : (
                            <>
                                <Button variant="default" onClick={handleSaveInfo} disabled={userUpdating}>{
                                    userUpdating ? 'Saving...' : 'Save'
                                }</Button>
                                <Button variant="outline" onClick={() => setEditMode(false)}>Cancel</Button>
                            </>
                        )}
                    </div>
                </Card>
                <Card className="w-2/5 p-8 flex flex-col gap-6 shadow-lg border border-gray-200">
                    <h3 className="text-lg font-semibold mb-2 text-gray-700">Update Password</h3>
                    <div className="relative mb-4">
                        <Input
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Current Password"
                            type={showPassword ? 'text' : 'password'}
                            className="pr-10"
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                            onClick={() => setShowPassword(v => !v)}
                            tabIndex={-1}
                            style={{ background: 'none', border: 'none', padding: 0 }}
                        >
                            {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                        </button>
                    </div>
                    <div className="relative mb-4">
                        <Input
                            name="newPassword"
                            value={form.newPassword}
                            onChange={handleChange}
                            placeholder="New Password"
                            type={showNewPassword ? 'text' : 'password'}
                            className="pr-10"
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                            onClick={() => setShowNewPassword(v => !v)}
                            tabIndex={-1}
                            style={{ background: 'none', border: 'none', padding: 0 }}
                        >
                            {showNewPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                        </button>
                    </div>
                    <div className="flex gap-2 justify-end mt-2">
                        <Button variant="default" onClick={handleSavePassword}>Update Password</Button>
                    </div>
                </Card>
            </div>
        </DashboardLayout>
    );
}
