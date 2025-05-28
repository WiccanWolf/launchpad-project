import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
  EventModel,
  OrganiserModel,
  EventSignup,
  StaffModel,
} from '../models/index.model.js';
import { google } from 'googleapis';

const JWT_SECRET = process.env.JWT_SECRET;

export const getEvents = (req, res) => {
  EventModel.find()
    .then((events) => {
      console.log(events);
      res.json(events);
    })
    .catch((err) => res.json(err));
};

export const getOrganisers = async (_req, res) => {
  try {
    const organisers = await OrganiserModel.find()
      .populate('organiser', 'firstName lastName email')
      .populate('events');
    res.json(organisers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to load organisers' });
  }
};

export const addEvent = async (req, res) => {
  try {
    console.log('Incoming Data: ', req.body);
    if (!req.body.name || !req.body.date) {
      return res.status(400).json({
        message: 'Missing Required Fields',
        required: ['Name', 'Date'],
      });
    }
    const event = req.body;
    const createdEvent = await EventModel.create({
      name: event.name,
      description: event.description,
      date: new Date(event.date),
      image: event.image,
      location: {
        zip_code: event.location.zip_code,
        address: event.location.address,
        city: event.location.city,
      },
      organiser: event.organiser,
    });
    console.log(`Created Event: ${createdEvent}`);
    res.status(201).json(createdEvent);
  } catch (err) {
    console.error(`Error Creating Event: ${err}`);
    res.status(500).json({ error: err.message });
  }
};

export const signUp = async (req, res) => {
  const { email } = req.body;
  const { eventId } = req.params;

  try {
    const event = await EventModel.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event Not Found' });
    }

    const existingSignup = await EventSignup.findOne({ email, eventId });
    if (existingSignup) {
      return res
        .status(400)
        .json({ message: `This email has already been used.` });
    }
    const signup = new EventSignup({ email, eventId });
    await signup.save();
    res.status(200).json({ message: 'Signup Successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error during Signup' });
  }
};

export const addToGoogle = async (req, res) => {
  const { token, event } = req.body;

  try {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: token });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: {
        summary: event.summary,
        description: event.description,
        location: event.location,
        start: { dateTime: event.start },
        end: { dateTime: event.end },
      },
    });
    res.status(200).json({
      message: 'Event added to google calendar',
      eventLink: response.data.htmlLink,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to insert event' });
  }
};

export const staffSignIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    console.log(`Staff login attempt for: ${email}`);

    const staff = await StaffModel.findOne({ email: email });

    if (!staff || !staff.passwordHash) {
      console.log(`Staff not found or no password hash for: ${email}`);
      return res.status(401).json({ message: 'Invalid Credentials' });
    }

    const isMatching = await bcrypt.compare(password, staff.passwordHash);
    if (!isMatching) {
      console.log(`Password mismatch for: ${email}`);
      return res.status(401).json({ message: 'Invalid Password' });
    }

    console.log(`Password validated for: ${email}, creating token...`);

    const tokenPayload = {
      id: staff._id,
      email: staff.email,
      role: staff.role,
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, {
      expiresIn: '24h',
      issuer: 'launchpad-events',
      audience: 'staff',
    });

    console.log(`Token created for: ${email}`);

    if (req.session) {
      req.session.staff = {
        id: staff._id,
        email: staff.email,
        role: staff.role,
        authenticated: true,
      };
    }

    res.status(200).json({
      message: 'Staff Login Successful',
      token: token,
      staff: {
        _id: staff._id,
        email: staff.email,
        firstName: staff.firstName,
        lastName: staff.lastName,
        role: staff.role,
      },
    });
  } catch (err) {
    console.error(`Login Error: ${err}`);
    res.status(500).json({ message: 'Server Error During Login' });
  }
};

export const createOrganiser = async (req, res) => {
  try {
    const { staffId, eventIds } = req.body;
    const staff = await StaffModel.findById(staffId);
    if (!staff) {
      return res.status(404).json({ message: 'Staff Member Not Found' });
    }

    if (eventIds && eventIds.length > 0) {
      const events = await EventModel.find({ _id: { $in: eventIds } });
      if (events.length !== eventIds.length) {
        return res
          .status(404)
          .json({ message: 'One or More Events Not Found' });
      }
    }
    const organiser = await OrganiserModel.create({
      timestamp_dat: new Date(),
      organiser: staffId,
      events: eventIds || [],
    });

    const populatedOrganiser = await OrganiserModel.findById(organiser._id)
      .populate('organiser', 'firstName lastName email')
      .populate('events');
    res.status(201).json(populatedOrganiser);
  } catch (err) {
    console.error(`Error Creating Organiser: ${err}`);
    res.status(500).json({ error: err.message });
  }
};

export const addStaff = async (req, res) => {
  try {
    const { email, firstName, lastName, password, role } = req.body;
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        message: 'Missing Required Fields',
        required: ['email', 'password', 'firstName', 'lastName'],
      });
    }
    const existingStaff = await StaffModel.findOne({ email });
    if (existingStaff) {
      return res.status(400).json({ message: 'Staff Member Already Exists' });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const staff = await StaffModel.create({
      email,
      firstName,
      lastName,
      passwordHash,
      role: role || 'Staff',
    });
    res.status(201).json({
      message: 'Staff Member Created Successfully',
      staff: {
        _id: staff._id,
        email: staff.email,
        firstName: staff.firstName,
        lastName: staff.lastName,
        role: staff.role,
      },
    });
  } catch (err) {
    console.error(`Error Created Staff: ${err}`);
    res.status(500).json({ error: err.message });
  }
};

export const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.staff = decoded;
    next();
  } catch (err) {
    console.error('JWT verification error:', err);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

export const verifyStaffSession = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.staff = decoded;
      return next();
    } catch (err) {
      console.error('JWT verification failed:', err);
    }
  }

  if (req.session?.staff?.authenticated) {
    return next();
  }

  res.status(401).json({ message: 'Unauthorized - Please Log In' });
};

export const staffLogout = (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        console.error(`Logout Error: ${err}`);
      }
    });
    res.clearCookie('connect.sid');
  }

  res.status(200).json({
    message: 'Logout Successful',
    note: 'Please remove token from client storage',
  });
};
export const checkStaffSession = (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      return res.json({
        isAuthenticated: true,
        staff: decoded,
        authMethod: 'jwt',
      });
    } catch (err) {
      console.error('JWT check failed:', err);
    }
  }
  console.log('Checking staff session:', {
    sessionExists: !!req.session,
    sessionId: req.sessionID,
    staffData: req.session?.staff,
    isAuthenticated: !!req.session?.staff?.authenticated,
  });

  res.json({
    isAuthenticated: !!req.session?.staff?.authenticated,
    staff: req.session?.staff,
    authMethod: 'session',
  });
};
