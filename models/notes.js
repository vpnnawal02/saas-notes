import mongoose from 'mongoose';
import crypto from 'crypto';

const noteSchema = new mongoose.Schema({
    content: {
        type: String,
        required: [true, 'Please provide content'],
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, { timestamps: true });


// encrypt content before saving
noteSchema.pre('save', async function (next) {
    if (!this.isModified('content')) return next();
    try {
        const key = process.env.NOTE_ENCRYPTION_KEY;
        if (!key) {
            return next(new Error('NOTE_ENCRYPTION_KEY must be set'));
        }
        // Convert hex key to buffer and ensure it's 32 bytes
        const keyBuffer = Buffer.from(key, 'hex');
        if (keyBuffer.length !== 32) {
            return next(new Error('NOTE_ENCRYPTION_KEY must be 64 characters (32 bytes in hex)'));
        }
        // Generate a random IV for each encryption
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv('aes-256-cbc', keyBuffer, iv);
        let encrypted = cipher.update(this.content, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        // Store IV with the encrypted content
        this.content = iv.toString('hex') + ':' + encrypted;
        next();
    } catch (error) {
        console.log(error);
        next(error);
    }
});
// decrypt content after fetching
noteSchema.methods.decryptContent = function (content) {
    try {
        const key = process.env.NOTE_ENCRYPTION_KEY;
        if (!key) {
            throw new Error('NOTE_ENCRYPTION_KEY must be set');
        }
        // Convert hex key to buffer and ensure it's 32 bytes
        const keyBuffer = Buffer.from(key, 'hex');
        if (keyBuffer.length !== 32) {
            throw new Error('NOTE_ENCRYPTION_KEY must be 64 characters (32 bytes in hex)');
        }
        // Split the IV from the content
        const [ivHex, encryptedContent] = content.split(':');
        const iv = Buffer.from(ivHex, 'hex');
        const decipher = crypto.createDecipheriv('aes-256-cbc', keyBuffer, iv);
        let decrypted = decipher.update(encryptedContent, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
    catch (error) {
        throw error;
    }
};


const Note = mongoose.models.Note || mongoose.model('Note', noteSchema);
export default Note;


