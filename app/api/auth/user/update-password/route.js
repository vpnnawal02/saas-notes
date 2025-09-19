import { protect } from "@/lib/auth";
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { NextResponse } from 'next/server';

// PUT: Update user password
export async function PUT(req) {
    await connectDB();
    try {
        const { user, error, status } = await protect(req);
        if (error || status !== 200) {
            return NextResponse.json({ error }, { status });
        }
        const body = await req.json();
        console.log("Received body:", body);
        const dbUser = await User.findById(user._id).select('+password')
        if (!dbUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        const { password, newPassword } = body;
        if (!password || !newPassword) {
            return NextResponse.json({ error: 'Missing password fields' }, { status: 400 });
        }
        const isMatch = await dbUser.comparePassword(password);
        if (!isMatch) {
            return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
        }
        dbUser.password = newPassword;
        await dbUser.save();
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (err) {
        console.error('Error updating password:', err);
        // Handle Mongoose validation errors
        if (err.name === 'ValidationError' && err.errors && err.errors.password) {
            return NextResponse.json({ error: err.errors.password.message }, { status: 400 });
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
