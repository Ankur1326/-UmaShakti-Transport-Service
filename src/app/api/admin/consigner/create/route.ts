import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/db";
import Consigner from "@/models/Consigner";
import { getServerSession } from "next-auth";
// import { getSession } from "next-auth/react";

export async function POST(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return Response.json(
            {
                success: false,
                message: "Unauthorized. Please log in."
            },
            {
                status: 401
            }
        );
    }

    try {
        const { name, address, city = "", state = "", pincode = "", gstin = "", mobile, email } = await request.json();
        console.log(name, address, city, state, pincode, gstin, mobile, email);

        // Fixing validation to check for undefined for isActive
        if (!name) {
            return Response.json(
                {
                    success: false,
                    message: "Consigner name is required."
                },
                {
                    status: 400
                }
            );
        }

        // Check if the category already exists by name
        const existingConsigner = await Consigner.findOne({ name });
        console.log("existingConsigner : ", existingConsigner);

        if (existingConsigner) {
            return Response.json(
                {
                    success: true,
                    message: "Consigner with this name already exists",
                },
                { status: 400 }
            )
        }

        const newConsigner = new Consigner({
            name, address, city, state, pincode, gstin, mobile, email
        });

        // Save the new category to the database
        await newConsigner.save();

        return Response.json(
            {
                success: true,
                message: "New Consigner tag created successfully",
                data: newConsigner,
            },
            {
                status: 200
            }
        );

    } catch (error) {
        console.log("Error while creating new Consigner : ", error);
        return Response.json(
            {
                success: false,
                message: "Internal server error while creating new Consigner",
                error
            },
            {
                status: 500
            }
        );
    }
}