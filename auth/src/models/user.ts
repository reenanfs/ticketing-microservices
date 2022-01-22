import mongoose from 'mongoose';
import {Password} from '../services/password';


//interface describing properties required to create new user
interface UserAttrs {
    email: string;
    password: string;
};

// interface describing properties a user model has
interface UserModel extends mongoose.Model<Userdoc> {
    build(attrs: UserAttrs): Userdoc;
};

//interface that describes the properties a single user has
interface Userdoc extends mongoose.Document {
    email: string;
    password: string;
}

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    toJSON: {
        transform(doc, ret){
            ret.id = ret._id;
            delete ret._id;
            delete ret.password;
            delete ret.__v;
        } 
    }
});

userSchema.pre('save', async function(done) {
    if (this.isModified('password')) {
        const hashed = await Password.toHash(this.get('password'));
        this.set('password', hashed);
    }
    done();
});

userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs);
};

const User = mongoose.model<Userdoc, UserModel>('User', userSchema);

export {User};