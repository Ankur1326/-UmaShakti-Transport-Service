import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/db";
import Consignee from "@/models/Consignee";
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
        // console.log(name, address, city, state, pincode, gstin, mobile, email);

        // Fixing validation to check for undefined for isActive
        if (!name) {
            return Response.json(
                {
                    success: false,
                    message: "Consignee name is required."
                },
                {
                    status: 400
                }
            );
        }

        // Check if the category already exists by name
        const existingConsignee = await Consignee.findOne({ name });
        console.log("existingConsignee : ", existingConsignee);

        if (existingConsignee) {
            return Response.json(
                {
                    success: true,
                    message: "Consignee with this name already exists",
                },
                { status: 400 }
            )
        }

        const newConsignee = new Consignee({
            name, address, city, state, pincode, gstin, mobile, email
        });

        // Save the new category to the database
        await newConsignee.save();

        return Response.json(
            {
                success: true,
                message: "New Consignee tag created successfully",
                data: newConsignee,
            },
            {
                status: 200
            }
        );

    } catch (error) {
        console.log("Error while creating new Consignee : ", error);
        return Response.json(
            {
                success: false,
                message: "Internal server error while creating new Consignee",
                error
            },
            {
                status: 500
            }
        );
    }
}