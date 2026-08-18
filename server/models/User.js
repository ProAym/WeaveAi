import mongoose, {Schema} from 'mongoose'
import bcrypt from 'bcrypt'

const UserSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required : true, unique: true, lowercase: true, trim: true},
    password: {type: String, required: function() { return !this.googleId; }},
    googleId: {type: String, unique: true, sparse: true},
}, {timestamps: true})

//Hash password before saving
UserSchema.pre('save', async function () {
    if(!this.isModified('password') || !this.password) return;
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})
//Compare password method
UserSchema.methods.comparePassword = async function (password){
    if (!this.password) return false;
    return bcrypt.compare(password, this.password)
}

export  const User = mongoose.model('User', UserSchema)