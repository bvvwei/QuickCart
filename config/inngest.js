import { Inngest } from "inngest";
import connectDB from "./db";
import  User  from "@/models/user";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "quickcard-next" });

// ingest funtion to save user data to database
export const syncUserCreation = inngest.createFunction(
    {
        id:'sync-user-from-clerk'
    },
    {event: 'clerk/user.created'},
    async ({event}) => {
        const {id, first_name,last_name,image_url, email_addresses} = event.data
        const userData = {
            _id:id,
            email: email_addresses[0].email_addresses,
            name: first_name + '' + last_name,
            imageUrl: image_url
        }
        await connectDB()
        await User.create(userData)
    }
)

// inngest function to update user data in database
export const syncUserUpdation = inngest.createFunction(
    {
        id: 'update-user-from-clerk'
    },
        {event: 'clerk/user.updated'},
        async ({event}) =>{
            const {id, first_name,last_name,image_url, email_addresses} = event.data
            const userData = {
                _id:id,
                email: email_addresses[0].email_addresses,
                name: first_name + '' + last_name,
                imageUrl: image_url
            }
            await connectDB()
            await User.findByIdAndUpdate(id,userData)
        }   
)

// inngest function to delete user from the database

export const syncUserDeletion =inngest.createFunction(
    {
        id:'delete-user-with-clerk '
    },
    {event: 'clerk/user.deleted'},
    async({event})=>{
        const {id} = event.data
        
        await connectDB()
        await User.findByIdAndDelete(id)
    }
)