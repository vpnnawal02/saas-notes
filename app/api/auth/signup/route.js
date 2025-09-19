import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { generateToken } from '@/lib/auth';

export async function POST(req) {
    try {
        await connectDB();

        const { name,
            email,
            password,
            role,
            subscription,
            company } = await req.json();

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { error: 'Email already registered' },
                { status: 400 }
            );
        }

        // Create new user
        const user = await User.create({
            name,
            email,
            password,
            role,
            subscription,
            company
        });

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
        console.error('Signup error:', error);
        return NextResponse.json(
            { error: 'Something went wrong' },
            { status: 500 }
        );
    }
}