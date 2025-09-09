import { NextResponse} from "next/server";
import User from "@/models/User"

export async function GET() {
  try {
      const users = await User.find();
      if(!users){
        return new NextResponse(JSON.stringify({ error: 'Data is empty' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
      }else{
        return new NextResponse(JSON.stringify(users), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
      }
  } catch (error) {
    console.log(error)
  }
//   return new NextResponse(JSON.stringify(users), {
//     status: 200,
//     headers: { 'Content-Type': 'application/json' }
//   });
}
 
// export async function POST(request: Request) {
//   // Parse the request body
//   const body = await request.json();
//   const { name } = body;
 
//   // e.g. Insert new user into your DB
//   const newUser = { id: Date.now(), name };
 
//   return new Response(JSON.stringify(newUser), {
//     status: 201,
//     headers: { 'Content-Type': 'application/json' }
//   });
// }