// import { generateOTP } from "@/helpers/generateOtp";
import dbConnect from "@/lib/db";
import UserModel from "@/models/User";

export async function POST(request: Request) {
    await dbConnect()

    try {
        const { email, password, role } = await request.json()

        console.log("email, password, role : ", email, password, role)

        const existingUserByEmail = await UserModel.findOne({ email })

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                console.log("User already exist with this email")
                return Response.json({
                    success: false,
                    message: "User already exist with this email",
                }, { status: 400 })
            }
            // else if (existingUserByEmail.verifyCodeExpiry && existingUserByEmail.verifyCodeExpiry > new Date()) {
            //     return new Response(
            //         JSON.stringify({ success: false, message: "A verification code is already active. Please use it or wait until it expires." }),
            //         { status: 400 }
            //     );
            // } else {
            //     existingUserByEmail.password = password
            //     await existingUserByEmail.save()
            // }
        } else {
            const newUser = new UserModel({
                email,
                password,
                role,
                isVerified: true
            })

            await newUser.save()

            console.log("User created successfully")
            return Response.json({
                success: true,
                message: "User created successfully",
            }, { status: 200 })
        }

    } catch (error) {
        console.log("Error registring user: ", error);
        return Response.json(
            {
                success: false,
                message: "Error registring user"
            },
            {
                status: 500
            }
        )

    }
}