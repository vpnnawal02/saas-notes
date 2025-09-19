import jwt from 'jsonwebtoken';
import connectDB from './mongodb';
import User from '@/models/User';
import Note from '@/models/notes';


const JWT_SECRET = process.env.JWT_SECRET;

export const generateToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
        },
        JWT_SECRET,
        { expiresIn: '7d' }
    );
};

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        throw new Error('Invalid token');
    }
};

// Auth middleware for API routes
export const authMiddleware = async (req) => {
    try {
        const token = req.headers.get('authorization')?.replace('Bearer ', '');

        if (!token) {
            throw new Error('No token provided');
        }

        const decoded = verifyToken(token);
        return decoded;
    } catch (error) {
        throw new Error('Authentication failed');
    }
};

export async function protect(req) {
    try {
        await connectDB();
        // 1. Try to get token from Authorization header
        let token = req.headers.get('authorization')?.split(' ')[1]; // Bearer <token>

        // 2. If no token in header, try to get it from cookies
        if (!token) {
            token = req.cookies.get('token')?.value;
        }

        if (!token) {
            return { error: 'Unauthorized', status: 401 };
        }

        // Verify token
        const user = jwt.verify(token, process.env.JWT_SECRET);
        const id = user.id;
        if (!id) {
            return { error: 'Unauthorized', status: 401 };
        }
        const dbUser = await User.findById(id);
        if (!dbUser) {
            return { error: 'Unauthorized', status: 401 };
        }
        return { user: dbUser, status: 200 }; // return decoded user object
    } catch (err) {
        return { error: 'Invalid token', status: 401 };
    }
}

export async function restrictTo(role, req) {
    try {
        const { user, error, status } = await protect(req);
        if (error) {
            return { error, status };
        }
        if (user.role !== role) {
            return { error: 'Forbidden', status: 403 };
        }
        return { user, status: 200 };
    } catch (err) {
        return { error: 'Something went wrong', status: 500 };
    }
}

export async function subscriptionLimit(req, limit) {
    try {
        const { user, error, status } = await protect(req);
        if (error) {
            return { error, status };
        }
        const notesCount = await Note.countDocuments({ user: user._id });
        if (user.subscription !== 'pro' && notesCount >= limit) {
            return { error: 'Subscription limit reached', status: 403 };
        }
        return { canAddmore: user.subscription === 'pro' || notesCount < limit, status: 200 };
    } catch (err) {
        return { error: 'Something went wrong', status: 500 };
    }
}
