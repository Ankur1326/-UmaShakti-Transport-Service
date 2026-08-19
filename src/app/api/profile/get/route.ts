import dbConnect from "@/lib/db";
import UserModel from '@/models/User';

export async function GET(request: Request) {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    
    try {
        // const { username, email } = await request.json()

        if (!email) {
            return Response.json(
                {
                    success: false,
                    message: "Email are required"
                },
                {
                    status: 409
                }
            )
        }

        const user = await UserModel.findOne({
            email
        })

        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },
                {
                    status: 404
                }
            );
        }

        return Response.json(
            {
                success: true,
                message: "User successfully fetched",
                user
            },
            { status: 200 }
        )

    } catch (error) {
        console.log("Error while fetching user profile: ", error);
        return Response.json(
            {
                success: false,
                message: "Error fetching user profile"
            },
            {
                status: 500
            }
        );
    }
}