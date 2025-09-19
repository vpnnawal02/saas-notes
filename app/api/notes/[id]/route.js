import connectDB from '@/lib/mongodb';
import Note from '@/models/notes';
import { protect } from '@/lib/auth';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
const ObjectId = mongoose.Types.ObjectId;


// PATCH: Update a note by id
export async function PATCH(req, { params }) {
    await connectDB();
    const { user, error, status } = await protect(req);
    if (error || status !== 200) {
        return NextResponse.json({ error }, { status });
    }
    const { content } = await req.json();
    let noteId = params.id
    console.log("noteId:", noteId);

    const note = await Note.findOne({ _id: noteId, user: user._id });
    if (!note) return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    note.content = content;
    await note.save();
    return NextResponse.json({ success: true });
}

// DELETE: Delete a note by id
export async function DELETE(req, { params }) {
    await connectDB();
    const { user, error, status } = await protect(req);
    if (error || status !== 200) {
        return NextResponse.json({ error }, { status });
    }
    let noteId = params.id  
    const note = await Note.findOneAndDelete({ _id: noteId, user: user._id });
    if (!note) return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    return NextResponse.json({ success: true });
}
