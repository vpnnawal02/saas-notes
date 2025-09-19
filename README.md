# Note SaaS - Secure Note-Taking Application

A secure, encrypted note-taking SaaS application built with Next.js 13, featuring end-to-end encryption, user authentication, and subscription-based access control.

## Features

- 🔒 **End-to-End Encryption**
  - AES-256-CBC encryption for all notes
  - Unique IV generation for each note
  - Secure key management
- 👤 **User Authentication**
  - Secure login and signup
  - Protected API routes
  - Session-based authentication
- 📝 **Note Management**
  - Create, read, update, and delete notes
  - Automatic encryption/decryption
  - Real-time updates
- 💳 **Subscription System**

  - Free tier with limited notes
  - Premium features for subscribers
  - Usage limits management

- 🎨 **Modern UI**
  - Responsive design
  - Dark/Light mode support
  - Clean and intuitive interface

## Tech Stack

- **Frontend:**

  - Next.js 13 (App Router)
  - Redux Toolkit for state management
  - Shadcn UI components
  - Tailwind CSS

- **Backend:**

  - Next.js API Routes
  - MongoDB with Mongoose
  - Crypto for encryption

- **Authentication:**
  - JWT-based authentication
  - Secure session management

## Getting Started

### Prerequisites

- Node.js 16+ installed
- MongoDB instance
- npm or yarn package manager

### Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NOTE_ENCRYPTION_KEY=your_32_byte_hex_key
```

Note: Generate a secure NOTE_ENCRYPTION_KEY using:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/note-saas.git
cd note-saas
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
note-saas/
├── app/                  # Next.js 13 app directory
│   ├── api/             # API routes
│   ├── dashboard/       # Dashboard pages
│   ├── login/          # Authentication pages
│   ├── signup/         # User registration
│   └── store/          # Redux store and slices
├── components/          # Reusable components
├── lib/                 # Utility functions
├── models/             # Mongoose models
└── public/             # Static assets
```

## API Routes

### Notes

- `GET /api/notes` - Get all notes for authenticated user
- `POST /api/notes` - Create a new note
- `GET /api/notes/[id]` - Get a specific note
- `PATCH /api/notes/[id]` - Update a note
- `DELETE /api/notes/[id]` - Delete a note

### Authentication

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/getme` - Get current user

## Security Features

1. **Note Encryption:**

   - AES-256-CBC encryption algorithm
   - Unique IV for each encryption
   - Secure key handling

2. **API Security:**

   - JWT authentication
   - Route protection
   - Input validation

3. **Data Protection:**
   - Encrypted storage
   - Secure transmission
   - User data isolation

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
