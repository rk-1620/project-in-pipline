import mongoose from "mongoose";

let profile_imgs_name_list = ["Garfield", "Tinkerbell", "Annie", "Loki", "Cleo", "Angel", "Bob", "Mia", "Coco", "Gracie", "Bear", "Bella", "Abby", "Harley", "Cali", "Leo", "Luna", "Jack", "Felix", "Kiki"];
let profile_imgs_collections_list = ["notionists-neutral", "adventurer-neutral", "fun-emoji"];

const userSchema = mongoose.Schema({
    personal_info: {
        fullname: { type: String, required: true, minlength: 3, lowercase: true },
        email: { type: String, required: true, unique: true, lowercase: true },
        password: String,
        username: { type: String, unique: true, minlength: 3 },
        bio: { type: String, maxlength: 200, default: "" },
        profile_img: {
            type: String,
            default: () => {
                const collection = profile_imgs_collections_list[Math.floor(Math.random() * profile_imgs_collections_list.length)];
                const name = profile_imgs_name_list[Math.floor(Math.random() * profile_imgs_name_list.length)];
                return `https://api.dicebear.com/6.x/${collection}/svg?seed=${name}`;
            }
        },
    },
    social_links: {
        youtube: { type: String, default: "" },
        instagram: { type: String, default: "" },
        facebook: { type: String, default: "" },
        twitter: { type: String, default: "" },
        github: { type: String, default: "" },
        website: { type: String, default: "" }
    },
    categories: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }
  ],
    google_auth: { type: Boolean, default: false },
}, { timestamps: { createdAt: 'joinedAt', updatedAt: 'updatedAt' } });

export default mongoose.model("User", userSchema);
