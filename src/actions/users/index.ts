import { Types } from "mongoose";
import { User } from "../../../types/index"

async function updateUser(_id: string, data: any){
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/users/user`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({_id, ...data}),
    });

    
    if (!res.ok) {
        throw new Error('Failed to update user');
    }

    const updatedUser = await res.json();
    return updatedUser;
}

export {updateUser}