import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { restrictTo } from '@/lib/auth';
import { NextResponse } from 'next/server';
// POST: Add a member to the admin's company
export async function POST(req) {
    try {
        await connectDB();
        const { user, error, status } = await restrictTo('admin', req);
        if (error || status !== 200) {
            return NextResponse.json({ error }, { status });
        }
        if (!user.company) {
            return NextResponse.json({ error: 'No company found for user' }, { status: 400 });
        }
        const body = await req.json();
        // Required fields: name, email, password
        const { name, email, password, avatar, subscription, role } = body;
        if (!name || !email || !password) {
            return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
        }
        // Default role is 'tenant', subscription is 'free' if not provided
        const newUser = new User({
            name,
            email,
            password,
            avatar: avatar || '',
            company: user.company,
            subscription: subscription || 'free',
            role: role || 'member'
        });
        await newUser.save();
        return NextResponse.json({ user: newUser, success: true }, { status: 201 });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed to add member' }, { status: 500 });
    }
}
// GET: Get all users related to the same company as the authenticated admin user
export async function GET(req) {
    try {
        await connectDB();
        const { user, error, status } = await restrictTo('admin', req);
        if (error || status !== 200) {
            return NextResponse.json({ error }, { status });
        }
        if (!user.company) {
            return NextResponse.json({ error: 'No company found for user' }, { status: 400 });
        }

        const users = await User.find({ company: user.company, _id: { $ne: user._id } });
        return NextResponse.json({ users, success: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Database connection error' }, { status: 500 });
    }

}