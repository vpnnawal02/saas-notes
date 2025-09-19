
import { protect } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET(req) {
    try {
        const { user, error, status } = await protect(req);
        if (error || status !== 200) {
            return NextResponse.json({ error }, { status });
        }
        return NextResponse.json({ user, success: true }, { status: 200 });
    } catch (error) {
        console.error('Error fetching user:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// PATCH: Update user info or password
export async function PATCH(req) {
    await connectDB();
    try {
        const { user, error, status } = await protect(req);
        if (error || status !== 200) {
            return NextResponse.json({ error }, { status });
        }
        const body = await req.json();
        const update = {};
        if (body.name) update.name = body.name;
        if (body.avatar !== undefined) update.avatar = body.avatar;
        // Only update password if both fields are present
        if (body.password && body.newPassword) {
            // Validate current password
            const dbUser = await User.findById(user._id);
            if (!dbUser || !(await dbUser.comparePassword(body.password))) {
                return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
            }
            dbUser.password = body.newPassword;
            await dbUser.save();
            return NextResponse.json({ success: true, user: dbUser }, { status: 200 });
        }
        // Update info only
        if (Object.keys(update).length > 0) {
            const dbUser = await User.findByIdAndUpdate(user._id, update, { new: true });
            return NextResponse.json({ success: true, user: dbUser }, { status: 200 });
        }
        return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}