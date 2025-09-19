import { protect } from "@/lib/auth";
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { NextResponse } from 'next/server';


// PATCH: Update user info
export async function PATCH(req) {
    await connectDB();
    const { user, error, status } = await protect(req);
    if (error || status !== 200) {
        return NextResponse.json({ error }, { status });
    }
    const body = await req.json();
    const dbUser = await User.findById(user._id);
    if (!dbUser) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    if (body.name) dbUser.name = body.name;
    if (body.email) dbUser.email = body.email;
    if (body.avatar !== undefined) dbUser.avatar = body.avatar;
    await dbUser.save();
    return NextResponse.json({ success: true, user: dbUser }, { status: 200 });
}
