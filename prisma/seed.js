const { MongoClient } = require('mongodb');
require('dotenv').config();

const eventsData = [
    {
        oldId: 1,
        title: 'NST Hackathon 2025',
        description: 'Join the biggest coding competition of the year. Build innovative solutions and win amazing prizes!',
        category: 'TECHNICAL',
        type: 'TEAM',
        date: '2025-12-15T09:00:00',
        time: '09:00 AM',
        registrationDeadline: '2025-12-14T23:59:59',
        venue: 'NST Tech Hub, Building A',
        banner: '/event-image.jpeg',
        maxParticipants: 4,
        isPaid: true,
        price: 200,
        rules: ['Teams must consist of 2-4 members.', 'All code must be written during the hackathon.', 'Plagiarism will lead to immediate disqualification.', 'Participants must bring their own laptops.'],
        faqs: { question: 'General', answer: 'See website for details' }
    },
    {
        oldId: 2,
        title: 'NST Tech Talk: AI & ML',
        description: 'Learn about the latest trends in Artificial Intelligence and Machine Learning from industry experts.',
        category: 'TECHNICAL',
        type: 'SOLO',
        date: '2025-12-20T14:00:00',
        time: '02:00 PM',
        registrationDeadline: '2025-12-19T23:59:59',
        venue: 'NST Auditorium',
        banner: '/ai_tech_talk.png',
        maxParticipants: 500,
        isPaid: false,
        price: 0,
        rules: ['Entry is free but registration is mandatory.', 'Please be seated 15 minutes before the start.', 'Q&A session will be held at the end.'],
        faqs: { question: 'General', answer: 'See website for details' }
    },
    {
        oldId: 3,
        title: 'NST Code Sprint',
        description: '24-hour competitive programming marathon. Test your skills against the best coders!',
        category: 'TECHNICAL',
        type: 'SOLO',
        date: '2025-12-25T10:00:00',
        time: '10:00 AM',
        registrationDeadline: '2025-12-24T23:59:59',
        venue: 'NST Computer Lab',
        banner: '/code_sprint.png',
        maxParticipants: 100,
        isPaid: true,
        price: 150,
        rules: ['Individual participation only.', 'Use of mobile phones is strictly prohibited.', 'Internet access is allowed only for documentation.'],
        faqs: { question: 'General', answer: 'See website for details' }
    },
    {
        oldId: 4,
        title: 'NST Cultural Fest 2025',
        description: 'Experience the vibrant culture of NST with music, dance, and drama performances.',
        category: 'CULTURAL',
        type: 'SOLO',
        date: '2025-12-18T16:00:00',
        time: '04:00 PM',
        registrationDeadline: '2025-12-17T23:59:59',
        venue: 'NST Main Stadium',
        banner: '/cultural_fest.png',
        maxParticipants: 1000,
        isPaid: true,
        price: 100,
        rules: ['Valid ID card is mandatory for entry.', 'Outside food and drinks are not allowed.', 'Maintain discipline and cleanliness.'],
        faqs: { question: 'General', answer: 'See website for details' }
    },
    {
        oldId: 5,
        title: 'NST Music Night',
        description: 'Live band performances, DJ sets, and open mic sessions. Showcase your talent!',
        category: 'CULTURAL',
        type: 'SOLO',
        date: '2025-12-22T19:00:00',
        time: '07:00 PM',
        registrationDeadline: '2025-12-21T23:59:59',
        venue: 'NST Open Air Theater',
        banner: '/music_night.png',
        maxParticipants: 500,
        isPaid: true,
        price: 100,
        rules: ['Performances must adhere to the time limit.', 'No offensive content allowed.', 'Bring your own instruments (except drum kit).'],
        faqs: { question: 'General', answer: 'See website for details' }
    },
    {
        oldId: 6,
        title: 'NST Dance Competition',
        description: 'Show off your moves! Solo, duo, and group dance categories with exciting prizes.',
        category: 'CULTURAL',
        type: 'TEAM',
        date: '2025-12-28T17:00:00',
        time: '05:00 PM',
        registrationDeadline: '2025-12-27T23:59:59',
        venue: 'NST Dance Studio',
        banner: '/dance_competition.png',
        maxParticipants: 50,
        isPaid: true,
        price: 150,
        rules: ['Music track must be submitted 2 days prior.', 'Costumes must be decent and appropriate.', 'Judges decision will be final.'],
        faqs: { question: 'General', answer: 'See website for details' }
    },
    {
        oldId: 7,
        title: 'NST Inter-College Cricket',
        description: 'Premier cricket tournament featuring teams from colleges across the city.',
        category: 'SPORTS',
        type: 'TEAM',
        date: '2025-12-16T08:00:00',
        time: '08:00 AM',
        registrationDeadline: '2025-12-15T23:59:59',
        venue: 'NST Cricket Ground',
        banner: '/nst-logo.png',
        maxParticipants: 16,
        isPaid: true,
        price: 300,
        rules: ['T20 format rules apply.', 'Teams must report 30 minutes before match time.', 'Umpire decision is final.'],
        faqs: { question: 'General', answer: 'See website for details' }
    },
    {
        oldId: 8,
        title: 'NST Marathon 2025',
        description: '10K run for fitness enthusiasts. All proceeds go to charity!',
        category: 'SPORTS',
        type: 'SOLO',
        date: '2025-12-21T06:00:00',
        time: '06:00 AM',
        registrationDeadline: '2025-12-20T23:59:59',
        venue: 'NST Campus Route',
        banner: '/nst-logo.png',
        maxParticipants: 500,
        isPaid: true,
        price: 50,
        rules: ['Bib number must be visible at all times.', 'Follow the marked route strictly.', 'Medical assistance available at checkpoints.'],
        faqs: { question: 'General', answer: 'See website for details' }
    },
    {
        oldId: 9,
        title: 'NST Basketball Championship',
        description: '3v3 basketball tournament. Fast-paced action and incredible prizes await!',
        category: 'SPORTS',
        type: 'TEAM',
        date: '2025-12-27T09:00:00',
        time: '09:00 AM',
        registrationDeadline: '2025-12-26T23:59:59',
        venue: 'NST Basketball Court',
        banner: '/nst-logo.png',
        maxParticipants: 32,
        isPaid: true,
        price: 250,
        rules: ['FIBA 3x3 rules apply.', 'Games are 10 minutes or first to 21 points.', 'Fair play is mandatory.'],
        faqs: { question: 'General', answer: 'See website for details' }
    },
    {
        oldId: 10,
        title: 'NST Web Development Workshop',
        description: 'Learn modern web development from scratch. Build your first website in one day!',
        category: 'WORKSHOP',
        type: 'SOLO',
        date: '2025-12-17T10:00:00',
        time: '10:00 AM',
        registrationDeadline: '2025-12-16T23:59:59',
        venue: 'NST Innovation Center',
        banner: '/nst-logo.png',
        maxParticipants: 50,
        isPaid: true,
        price: 150,
        rules: ['Bring your own laptop.', 'Install VS Code and Node.js beforehand.', 'Certificates provided upon completion.'],
        faqs: { question: 'General', answer: 'See website for details' }
    },
    {
        oldId: 11,
        title: 'NST Entrepreneurship Bootcamp',
        description: 'Transform your ideas into successful startups. Learn from industry leaders!',
        category: 'WORKSHOP',
        type: 'SOLO',
        date: '2025-12-23T11:00:00',
        time: '11:00 AM',
        registrationDeadline: '2025-12-22T23:59:59',
        venue: 'NST Entrepreneurship Cell',
        banner: '/nst-logo.png',
        maxParticipants: 40,
        isPaid: true,
        price: 200,
        rules: ['Open to all students.', 'Business idea presentation is optional.', 'Networking session included.'],
        faqs: { question: 'General', answer: 'See website for details' }
    },
    {
        oldId: 12,
        title: 'NST Design Thinking Workshop',
        description: 'Master the art of creative problem-solving and user-centered design.',
        category: 'WORKSHOP',
        type: 'SOLO',
        date: '2025-12-29T13:00:00',
        time: '01:00 PM',
        registrationDeadline: '2025-12-28T23:59:59',
        venue: 'NST Design Studio',
        banner: '/nst-logo.png',
        maxParticipants: 30,
        isPaid: true,
        price: 100,
        rules: ['No prior design experience needed.', 'All materials will be provided.', 'Interactive group activities.'],
        faqs: { question: 'General', answer: 'See website for details' }
    }
];

async function main() {
    console.log('Seeding database using MongoDB native driver...');

    const client = new MongoClient(process.env.DATABASE_URL);

    try {
        await client.connect();
        const db = client.db();

        const usersCollection = db.collection('User');
        const eventsCollection = db.collection('Event');
        const registrationsCollection = db.collection('Registration');

        let organizer = await usersCollection.findOne({ email: 'organizer@nst.edu' });

        if (!organizer) {
            const res = await usersCollection.insertOne({
                email: 'organizer@nst.edu',
                name: 'NST Organizer',
                role: 'ORGANIZER',
                password: 'password123',
                createdAt: new Date(),
                updatedAt: new Date()
            });
            organizer = { _id: res.insertedId };
        }

        console.log('Organizer ID:', organizer._id.toString());

        await registrationsCollection.deleteMany({});
        console.log('Cleared existing registrations');
        await eventsCollection.deleteMany({});
        console.log('Cleared existing events');

        const idMapping = {};

        for (const eventData of eventsData) {
            const { oldId, ...data } = eventData;

            const eventDoc = {
                ...data,
                date: new Date(data.date),
                registrationDeadline: new Date(data.registrationDeadline),
                organizerId: organizer._id,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            const res = await eventsCollection.insertOne(eventDoc);
            idMapping[oldId] = res.insertedId.toString();
            console.log(`Created: ${eventDoc.title} -> ${res.insertedId.toString()}`);
        }

        console.log('\nID MAPPING FOR FRONTEND:');
        console.log(JSON.stringify(idMapping, null, 2));

    } catch (e) {
        console.error(e);
        process.exit(1);
    } finally {
        await client.close();
    }
}

main();
