const { ClerkExpressRequireAuth, users } = require('@clerk/clerk-sdk-node');
const prisma = require('../utils/prisma');

// Middleware to sync Clerk user with local database
const syncUser = async (req, res, next) => {
    try {
        if (!req.auth || !req.auth.userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const clerkId = req.auth.userId;
        
        // Check if user exists in local DB
        let user = await prisma.user.findUnique({
            where: { clerkId },
        });

        if (!user) {
            // Fetch user details from Clerk
            try {
                const clerkUser = await users.getUser(clerkId);
                const email = clerkUser.emailAddresses[0]?.emailAddress;
                
                if (!email) {
                     return res.status(400).json({ message: 'Email is required for account creation' });
                }

                const firstName = clerkUser.firstName || '';
                const lastName = clerkUser.lastName || '';
                const name = `${firstName} ${lastName}`.trim() || email.split('@')[0];

                // Check if user exists by email (link account)
                const existingUser = await prisma.user.findUnique({
                    where: { email },
                });

                if (existingUser) {
                    // Link account
                    user = await prisma.user.update({
                        where: { id: existingUser.id },
                        data: { clerkId },
                    });
                } else {
                    // Create new user
                    user = await prisma.user.create({
                        data: {
                            clerkId,
                            email,
                            name,
                            role: 'STUDENT', 
                        },
                    });
                }
            } catch (clerkError) {
                console.error('Clerk API Error:', clerkError);
                return res.status(500).json({ message: 'Failed to fetch user data from Clerk' });
            }
        }

        // Attach user to request object for downstream controllers
        req.user = user;
        next();
    } catch (error) {
        console.error('User sync error:', error);
        res.status(500).json({ message: 'Authentication error' });
    }
};

// Composite middleware: Verify Clerk Token -> Sync User to DB
exports.protect = [ClerkExpressRequireAuth(), syncUser];

exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: `User role ${req.user ? req.user.role : 'unknown'} is not authorized to access this route` });
        }
        next();
    };
};
