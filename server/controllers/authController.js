import { User } from "../models/User.js";
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';

const JWT_SECRET =  process.env.JWT_SECRET ;
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

//helper to set cookies
const setSessionCookie = (res, payload) =>{
    const token = jwt.sign(payload, JWT_SECRET, {expiresIn: "30d"})
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 30 * 24 * 60 * 60 * 1000, //30 days
        path: "/",
    })

}

export async function register(req, res){
    const {name, email, password} = req.body

    if(!name || !email || !password){
        res.status(400).json({error: "Name, email, and password are required"})
        return;
    }

    const trimmedEmail = email.toLowerCase().trim();
    const existing = await User.findOne({email: trimmedEmail})
    if(existing){
        res.status(400).json({error: "An account with this email already exists!"})
        return;
    }
    const user =  await User.create({
        name,
        email: trimmedEmail,
        password
    })
    setSessionCookie(res, {userId: user._id.toString(), email: user.email})

    res.status(201).json({
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            hasPassword: !!user.password
        }
    })
}
export async function googleAuth(req, res){
    const { credential } = req.body;

    if(!credential){
        res.status(400).json({error: "Missing Google credential"});
        return;
    }

    try {
        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { sub: googleId, email, name } = payload;

        let user = await User.findOne({ $or: [{ googleId }, { email: email.toLowerCase().trim() }] });

        if(!user){
            user = await User.create({
                name: name || "User",
                email: email.toLowerCase().trim(),
                googleId,
            });
        } else if(!user.googleId){
            user.googleId = googleId;
            await user.save();
        }

        setSessionCookie(res, {userId: user._id.toString(), email: user.email});

        res.status(200).json({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                hasPassword: !!user.password
            }
        });
    } catch (err) {
        console.error("Google auth failed:", err.message);
        res.status(401).json({error: "Google sign-in failed"});
    }
}

export async function login(req, res){
    const {email, password} = req.body

    if(!email || !password){
        res.status(400).json({error: "Email, and password are required"})
        return;
    }
    const user = await User.findOne({email: email.toLowerCase().trim()})
    if(!user){
        res.status(401).json({error: "Invalid email or password!"})
        return;
    }

    const isValid = await user.comparePassword(password)
    if(!isValid){
        res.status(401).json({error: "Invalid email or password!"})
        return;
    }
    setSessionCookie(res, {userId: user._id.toString(), email: user.email})

    res.status(201).json({
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            hasPassword: !!user.password
        }
    })
}
export async function updateProfile(req, res){
    if(!req.user){
        res.status(401).json({error: "Not authenticated"});
        return;
    }
    const { name, email } = req.body;
    if(!name || !email){
        res.status(400).json({error: "Name and email are required"});
        return;
    }
    const trimmedEmail = email.toLowerCase().trim();

    const existing = await User.findOne({ email: trimmedEmail, _id: { $ne: req.user.userId } });
    if(existing){
        res.status(400).json({error: "An account with this email already exists!"});
        return;
    }

    const user = await User.findById(req.user.userId);
    if(!user){
        res.status(404).json({error: "User not found!"});
        return;
    }

    user.name = name;
    user.email = trimmedEmail;
    await user.save();

    // Refresh session cookie since email is part of the token payload
    setSessionCookie(res, {userId: user._id.toString(), email: user.email});

    res.json({
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            hasPassword: !!user.password,
        }
    });
}

export async function updatePassword(req, res){
    if(!req.user){
        res.status(401).json({error: "Not authenticated"});
        return;
    }
    const { currentPassword, newPassword } = req.body;
    if(!newPassword || newPassword.length < 6){
        res.status(400).json({error: "New password must be at least 6 characters"});
        return;
    }

    const user = await User.findById(req.user.userId);
    if(!user){
        res.status(404).json({error: "User not found!"});
        return;
    }

    if(user.password){
        if(!currentPassword){
            res.status(400).json({error: "Current password is required"});
            return;
        }
        const isValid = await user.comparePassword(currentPassword);
        if(!isValid){
            res.status(401).json({error: "Current password is incorrect"});
            return;
        }
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true });
}

export async function logout(_req, res){
    res.cookie("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite : process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge : 0,
        path: "/"
    })
    res.json({success: true})
}
export async function me(req, res){
    if(!req.user){
        res.status(401).json({error: "Not authenticated"})
        return;
    }

    const user =  await User.findById(req.user.userId).select("-password");
    if(!user){
        res.status(404).json({error: "User not found!"});
        return;
    }
    res.json({
    user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        hasPassword: !!user.password
    }
})
}