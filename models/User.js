import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide your name'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [6, 'Password should be at least 6 characters'],
        select: false, // Don't include password in normal queries
    },
    avatar: {
        type: String,
        trim: true,
        default: '',
    },
    role: {
        type: String,
        enum: ['admin', 'member'],
        default: 'member',
    },
    subscription: {
        type: String,
        enum: ['free', 'pro'],
        default: 'free',
    },
    company: {
        type: String,
        trim: true,
        default: '',
    },
}, { timestamps: true })

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare password for login
userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        if (!candidatePassword || !this.password) return false;
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        return false;
    }
};

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;