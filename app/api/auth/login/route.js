import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { generateToken } from '@/lib/auth';

export async function POST(req) {
    try {
        await connectDB();

        const { email, password } = await req.json();

        // Find user and include password for comparison
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Compare password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Generate JWT token
        const token = generateToken(user);

        // Return user data and token
        return NextResponse.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
            token,
            success: true,
        });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Something went wrong' },
            { status: 500 }
        );
    }
}