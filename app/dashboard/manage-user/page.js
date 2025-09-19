"use client";

import { Button } from '@/components/ui/button';
import DashboardLayout from '../DashboardLayout';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectLabel,
    SelectValue,
    SelectGroup
} from '@/components/ui/select';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { useDispatch, useSelector } from 'react-redux';
import { addMember, deleteMember, fetchCompanyUsers, updateMember } from '@/app/store/slices/adminSlice';
import Loader from '@/app/utils/Loader';
import { toast } from 'react-toastify';

export default function ManageUserPage() {
    const { users } = useSelector(state => state.admin);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', password: '', subscription: 'free', role: 'member' });
    const dispatch = useDispatch();

    const handleDialogOpen = async (id = null) => {
        if (id !== null) {
            const user = users.find(u => u._id === id);
            setForm({ ...user });
            setEditId(id);
        } else {
            setForm({ name: '', email: '', notes: '', subscription: 'Free', role: 'member' });
            setEditId(null);
        }
        setDialogOpen(true);

    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setForm({ name: '', email: '', notes: '', subscription: 'Free' });
        setEditId(null);
    };

    const handleSave = async () => {
        if (!form.name.trim() || !form.email.trim()) return;

        if (editId === null) {
            await handleAdd();
        } else {
            await handleUpgrade(editId);
        }

    };

    const handleDelete = async (id) => {
        try {
            setDeleting(true);
            await dispatch(deleteMember(id)).unwrap();
            toast.success("User deleted");
            if (editId === id) handleDialogClose();
        } catch (error) {
            console.log("Error deleting user:", error);
            toast.error(error || "Error deleting user");
        } finally {
            setDeleting(false);
        }


    };

    const handleAdd = async () => {
        try {
            setUpdating(true);

            const res = await dispatch(addMember(form)).unwrap();
            handleDialogClose();


        } catch (error) {
            console.log("Error saving user:", error);

        } finally {
            setUpdating(false);

        }
    }
    const handleUpgrade = async (id) => {

        try {
            setUpdating(true);
            const res = await dispatch(updateMember({ id, updates: form })).unwrap();
            if (res && res.success) {
                toast.success("User updated");
                handleDialogClose();
            }
        } catch (error) {
            console.log("Error updating user:", error);
            toast.error(error || "Error updating user");
        } finally {
            setUpdating(false);
        }
        // setUsers(users.map(u => u.id === id ? { ...u, subscription: 'Premium' } : u));
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                await dispatch(fetchCompanyUsers()).unwrap();
            } catch (error) {
                console.log("Error fetching users:", error);
            } finally {
                setLoading(false);
            }
        }
        if (!users || users.length === 0) {
            fetchUsers();
        }

    }, [dispatch])

    return (
        <DashboardLayout>
            <div className="max-w-5xl mx-auto w-full">
                {loading ? <Loader /> : <>

                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-semibold">Manage Users</h2>
                        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                            <DialogTrigger asChild>
                                <Button onClick={() => handleDialogOpen()} variant="default">Add User</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>{editId === null ? 'Add User' : 'Edit User'}</DialogTitle>
                                </DialogHeader>
                                <div className="flex flex-col gap-4 mt-2">
                                    <Input

                                        value={form.name}
                                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                        placeholder="Name"
                                    />
                                    <Input
                                        value={form.email}
                                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                        placeholder="Email"
                                        type="email"
                                    />
                                    <Input
                                        value={form.password ?? ''}
                                        onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                                        placeholder="Password"
                                        type="password"
                                    />
                                    <div className='grid grid-cols-2 gap-4 md:flex md:gap-2'>
                                        <div className="mt-2 col-span-1">
                                            <Select value={form.role} onValueChange={value => setForm(f => ({ ...f, role: value }))}>
                                                <SelectGroup>
                                                    <SelectLabel>Role</SelectLabel>
                                                    <SelectTrigger className="w-full mt-1">
                                                        <SelectValue placeholder="Select role" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="admin">Admin</SelectItem>
                                                        <SelectItem value="member">Member</SelectItem>
                                                    </SelectContent>
                                                </SelectGroup>
                                            </Select>
                                        </div>
                                        <div className="mt-2 col-span-1">
                                            <Select value={form.subscription} onValueChange={value => setForm(f => ({ ...f, subscription: value }))}>
                                                <SelectGroup>
                                                    <SelectLabel>Subscription</SelectLabel>
                                                    <SelectTrigger className="w-full mt-1">
                                                        <SelectValue placeholder="Select subscription" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="free">Free</SelectItem>
                                                        <SelectItem value="pro">Pro</SelectItem>
                                                    </SelectContent>
                                                </SelectGroup>
                                            </Select>
                                        </div>
                                    </div>

                                </div>
                                <DialogFooter className="mt-6 flex gap-2 justify-end">
                                    <Button onClick={handleSave} variant="default" disabled={updating}>
                                        {editId === null
                                            ? (updating ? 'Adding...' : 'Add')
                                            : (updating ? 'Saving...' : 'Save')}
                                    </Button>
                                    <DialogClose asChild>
                                        <Button variant="outline">Cancel</Button>
                                    </DialogClose>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {users.length === 0 && (
                            <Card className="p-8 text-gray-400 col-span-full">No users yet.</Card>
                        )}
                        {users.map(user => (
                            <Card key={user._id} className="p-6 flex flex-col gap-4 justify-between">
                                <div>
                                    <div className="font-semibold text-lg">{user.name}</div>
                                    <div className="text-sm text-gray-500">{user.email}</div>
                                    <div className="text-xs text-gray-400 mt-1">{user.notes}</div>
                                    <div className="mt-2 flex gap-2">
                                        <span className="px-2 py-1 rounded bg-gray-100 text-xs  font-medium">{user.subscription}</span>
                                        <span className="px-2 py-1 rounded bg-blue-100 text-xs font-medium">{user.role}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2 justify-end">
                                    <Button size="sm" variant="outline" onClick={() => handleDialogOpen(user._id)} disabled={user.role === 'admin'}>Edit</Button>
                                    <Button size="sm" variant="destructive" onClick={() => handleDelete(user._id || user.id)} disabled={deleting || user.role === 'admin'}>{
                                        deleting ? "Deleting..." : "Delete"
                                    }</Button>

                                </div>
                            </Card>
                        ))}
                    </div>
                </>}

            </div>
        </DashboardLayout>
    );
}
