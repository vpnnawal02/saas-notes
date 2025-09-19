'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadUserFromToken } from '../store/slices/authSlice';
import DashboardLayout from './DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'react-toastify';
import { createNote, deleteNote, fetchNotes, updateNote } from '../store/slices/notesSlice';

export default function DashboardPage() {
    const { notes } = useSelector(state => state.notes);
    const { user } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const [noteText, setNoteText] = useState('');
    const [editId, setEditId] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);
    const [contactEmail, setContactEmail] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            dispatch(loadUserFromToken());
        }
    }, [dispatch]);

    const handleDialogOpen = (id = null) => {
        if (id !== null) {
            const note = notes.find(n => n._id === id);
            setNoteText(note.content);
            setEditId(id);
        } else {
            setNoteText('');
            setEditId(null);
        }
        setDialogOpen(true);
    };

    const canAddMore = user && ((user.subscription === "free" && notes.length < 3) || user.subscription === "pro");

    const handleDialogClose = () => {
        setDialogOpen(false);
        setNoteText('');
        setEditId(null);
    };

    const handleSave = () => {
        if (!noteText.trim()) return;
        if (editId === null) {
            handleCreate();
        } else {
            handleUpdate();
        }
    };

    const handleCreate = async () => {
        try {
            const res = await dispatch(createNote(noteText)).unwrap();
            toast.success("Note added successfully");
            handleDialogClose();
        } catch (error) {
            console.log(error);
            toast.error(error || "Failed to add note");
        }
    }

    const handleUpdate = async () => {
        try {
            const res = await dispatch(updateNote({ id: editId, content: noteText })).unwrap();
            toast.success("Note updated successfully");
            handleDialogClose();
        } catch (error) {
            console.log(error);
            toast.error(error || "Failed to update note");
        }
    }

    const handleDelete = async (id) => {
        try {
            await dispatch(deleteNote(id)).unwrap();
            toast.success("Note deleted successfully");
            if (editId === id) handleDialogClose();
        } catch (error) {
            console.log(error);
            toast.error(error || "Failed to delete note");
        }
    };

    useEffect(() => {
        const fetchNote = async () => {
            try {
                const response = await dispatch(fetchNotes()).unwrap();
            } catch (error) {
                console.error('Error fetching notes:', error);
            }
        };
        fetchNote();
    }, [dispatch]);

    return (
        <DashboardLayout>
            <div className="max-w-5xl mx-auto w-full">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold">Notes</h2>
                    <div className="flex gap-2">
                        {/* Upgrade Dialog */}
                        <Dialog open={upgradeDialogOpen} onOpenChange={setUpgradeDialogOpen}>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Upgrade to Pro</DialogTitle>
                                </DialogHeader>
                                <div className="py-4">
                                    <p className="text-gray-600 mb-4">
                                        {"You've reached the limit of your free plan. Upgrade to Pro for unlimited notes! Please contact your admin to upgrade your account."}
                                    </p>

                                </div>
                            </DialogContent >
                        </Dialog>

                        {/* Add Note Dialog */}
                        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                            <DialogTrigger asChild>
                                <Button
                                    onClick={() => handleDialogOpen()}
                                    variant="default"
                                    disabled={!canAddMore}
                                >
                                    Add Note
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>{editId === null ? 'Add Note' : 'Edit Note'}</DialogTitle>
                                </DialogHeader>
                                <Textarea
                                    value={noteText}
                                    onChange={e => setNoteText(e.target.value)}
                                    placeholder="Write your note..."
                                    className="mt-4"
                                />
                                <DialogFooter className="mt-6 flex gap-2 justify-end">
                                    <Button onClick={handleSave} variant="default">
                                        {editId === null ? 'Add' : 'Update'}
                                    </Button>
                                    <DialogClose asChild>
                                        <Button variant="outline">Cancel</Button>
                                    </DialogClose>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        {/* Upgrade Button - Show for non-pro users who reached the limit */}
                        {!canAddMore && user?.subscription === "free" && (
                            <Button
                                variant="secondary"
                                onClick={() => setUpgradeDialogOpen(true)}
                            >
                                Upgrade to Pro
                            </Button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {notes.length === 0 && (
                        <Card className="p-8 text-gray-400 col-span-full">No notes yet.</Card>
                    )}
                    {notes?.map(note => (
                        <Card key={note._id} className="p-6 flex flex-col gap-4 justify-between">
                            <span className="text-base text-gray-800">{note.content}</span>
                            <div className="flex gap-2 justify-end">
                                <Button size="sm" variant="outline" onClick={() => handleDialogOpen(note._id)}>
                                    Edit
                                </Button>
                                <Button size="sm" variant="destructive" onClick={() => handleDelete(note._id)}>
                                    Delete
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}