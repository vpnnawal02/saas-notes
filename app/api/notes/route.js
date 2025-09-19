import { protect, subscriptionLimit } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Note from "@/models/notes";
import { NextResponse } from "next/server";

// GET: Get all notes for authenticated user
export async function GET(req) {
    await connectDB();
    const { user, error, status } = await protect(req);

    if (error || status !== 200) {
        return NextResponse.json({ error }, { status });
    }


    const notes = await Note.find({ user: user._id });

    // Decrypt and convert to plain objects
    const finalNotes = await Promise.all(notes.map(async note => {
        const plainNote = note.toObject();
        try {
            plainNote.content = await note.decryptContent(note.content);
        } catch (error) {
            console.error('Error decrypting note:', error);
            // Keep the encrypted content if decryption fails
        }
        return plainNote;
    }));

    return NextResponse.json({ notes: finalNotes, success: true }, { status: 200 });
}

// POST: Add a new note for authenticated user
export async function POST(req) {
    await connectDB();
    const { user, error, status } = await protect(req);
    if (error || status !== 200) {
        return NextResponse.json({ error }, { status });
    }
    const { canAddmore } = await subscriptionLimit(req, 3);
    if (!canAddmore) {
        return NextResponse.json({ error: 'Note limit reached. Please upgrade your subscription.' }, { status: 403 });
    }
    const { content } = await req.json();
    if (!content) {
        return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }
    const note = new Note({ content, user: user._id });
    await note.save();
    return NextResponse.json({ success: true, note });
}









