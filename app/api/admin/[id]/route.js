import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { restrictTo } from '@/lib/auth';
import { NextResponse } from 'next/server';

// PATCH: Update a tenant user by id (admin only)
export async function PATCH(req, context) {
    try {
        await connectDB();
        const { user: admin, error, status } = await restrictTo('admin', req);
        if (error || status !== 200) {
            return NextResponse.json({ error }, { status });
        }
        const params = await context.params;
        const userId = params.id;
        console.log("Params ID:", userId);
        let body;
        try {
            body = await req.json();
        } catch (err) {
            return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
        }
        const tenantUser = await User.findById({ _id: userId });
        if (!tenantUser) {
            return NextResponse.json({ error: 'Member user not found' }, { status: 404 });
        }
        if (tenantUser.role !== 'member') {
            return NextResponse.json({ error: 'User is not a member' }, { status: 403 });
        }
        if (body.name) tenantUser.name = body.name;
        if (body.email) tenantUser.email = body.email;
        if (body.avatar !== undefined) tenantUser.avatar = body.avatar;
        if (body.subscription !== undefined) tenantUser.subscription = body.subscription;
        if (body.role && ['member', 'admin'].includes(body.role)) tenantUser.role = body.role;
        await tenantUser.save();
        return NextResponse.json({ success: true });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
    }
}

// DELETE: Delete a tenant user by id (admin only)
export async function DELETE(req, context) {
    try {
        await connectDB();
        const { user: admin, error, status } = await restrictTo('admin', req);
        if (error || status !== 200) {
            return NextResponse.json({ error }, { status });
        }
        const params = await context.params;
        const userId = params.id;
        const tenantUser = await User.findOne({ _id: userId });
        if (!tenantUser) {
            return NextResponse.json({ error: 'Member user not found' }, { status: 404 });
        }
        if (tenantUser.role !== 'member') {
            return NextResponse.json({ error: 'User is not a member' }, { status: 403 });
        }
        await User.deleteOne({ _id: userId });
        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
    }
}
