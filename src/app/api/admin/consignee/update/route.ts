import dbConnect from "@/lib/db";
import Consignee from "@/models/Consignee";
// import { getSession } from "next-auth/react";

export async function PUT(request: Request) {
    await dbConnect();

    // const session = await getSession({ request })

    // if (!session) {
    //     return Response.json(
    //         {
    //             success: false,
    //             message: "Unauthorized. Please log in."
    //         },
    //         {
    //             status: 401
    //         }
    //     );
    // }

    // Check if the user has admin role
    // if (session.user?.role !== "admin") {
    //     return res.status(403).json({ error: "Forbidden. You do not have permission to perform this action." });
    // }

    try {
        const { _id, name, address, city, state, pincode, gstin, mobile, email } = await request.json();
        console.log(name, address, city, state, pincode, gstin, mobile, email);

        const consigneeId = _id;

        if (!consigneeId) {
            return Response.json(
                {
                    success: false,
                    message: "consigneeId is required",
                },
                {
                    status: 400,
                }
            );
        }

        // Check if the new name is already taken
        const existingConsignee: any = await Consignee.findOne({ name });
        if (existingConsignee && existingConsignee._id.toString() !== consigneeId) {
            return Response.json(
                {
                    success: false,
                    message: "Consignee with this name already exists",
                },
                {
                    status: 400,
                }
            );
        }

        // Find the category by ID and update it
        const updatedConsignee = await Consignee.findByIdAndUpdate(
            consigneeId,
            { name, address, city, state, pincode, gstin, mobile, email },
            { new: true, runValidators: true }
        );

        if (!updatedConsignee) {
            return Response.json(
                {
                    success: false,
                    message: "Consignee not found",
                },
                {
                    status: 404
                }
            );
        }

        return Response.json(
            {
                success: true,
                message: "Consignee updated successfully",
                data: updatedConsignee
            },
            {
                status: 200
            }
        );

    } catch (error) {
        console.log("Error while updating consignee : ", error);
        return Response.json(
            {
                success: false,
                message: "Internal server error while Updating Consignee",
                error
            },
            {
                status: 500
            }
        );
    }
}