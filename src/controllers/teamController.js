const prisma = require('../utils/prisma');
const crypto = require('crypto');

exports.createTeam = async (req, res) => {
    try {
        const { name, eventId } = req.body;
        const userId = req.user.id;

        // Check if event exists and is TEAM type
        const event = await prisma.event.findUnique({ where: { id: eventId } });
        if (!event) return res.status(404).json({ message: 'Event not found' });
        if (event.type !== 'TEAM') return res.status(400).json({ message: 'This is not a team event' });

        // Generate unique team code
        const code = crypto.randomBytes(3).toString('hex').toUpperCase();

        // Transaction to create team, member, and registration
        const result = await prisma.$transaction(async (prisma) => {
            // Create team and add creator as leader
            const team = await prisma.team.create({
                data: {
                    name,
                    code,
                    eventId,
                    members: {
                        create: {
                            userId,
                            status: 'ACCEPTED'
                        }
                    }
                },
                include: { members: true }
            });

            // Create registration for the leader
            await prisma.registration.create({
                data: {
                    userId,
                    eventId,
                    teamId: team.id
                }
            });

            return team;
        });

        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create team' });
    }
};

exports.joinTeam = async (req, res) => {
    try {
        const { code } = req.body;
        const userId = req.user.id;

        const team = await prisma.team.findUnique({
            where: { code },
            include: { event: true }
        });

        if (!team) return res.status(404).json({ message: 'Invalid team code' });

        // Check if already in a team for this event or registered
        const existingRegistration = await prisma.registration.findUnique({
            where: {
                userId_eventId: {
                    userId,
                    eventId: team.eventId
                }
            }
        });

        if (existingRegistration) return res.status(400).json({ message: 'Already registered for this event' });

        // Transaction to add member and registration
        const result = await prisma.$transaction(async (prisma) => {
            const member = await prisma.teamMember.create({
                data: {
                    userId,
                    teamId: team.id,
                    status: 'ACCEPTED'
                }
            });

            await prisma.registration.create({
                data: {
                    userId,
                    eventId: team.eventId,
                    teamId: team.id
                }
            });

            return member;
        });

        res.json({ message: 'Joined team successfully', member: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to join team' });
    }
};

exports.getMyTeams = async (req, res) => {
    try {
        const teams = await prisma.teamMember.findMany({
            where: { userId: req.user.id },
            include: {
                team: {
                    include: {
                        event: true,
                        members: {
                            include: { user: { select: { name: true, email: true } } }
                        }
                    }
                }
            }
        });
        res.json(teams.map(t => t.team));
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch teams' });
    }
};
