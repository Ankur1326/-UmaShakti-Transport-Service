import dbConnect from "@/lib/db";
import Consigner from "@/models/Consigner";
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

        const consignerId = _id;

        if (!consignerId) {
            return Response.json(
                {
                    success: false,
                    message: "consignerId is required",
                },
                {
                    status: 400,
                }
            );
        }

        // Check if the new name is already taken
        const existingConsigner: any = await Consigner.findOne({ name });
        if (existingConsigner && existingConsigner._id.toString() !== consignerId) {
            return Response.json(
                {
                    success: false,
                    message: "Consigner with this name already exists",
                },
                {
                    status: 400,
                }
            );
        }

        // Find the category by ID and update it
        const updatedConsigner = await Consigner.findByIdAndUpdate(
            consignerId,
            { name, address, city, state, pincode, gstin, mobile, email },
            { new: true, runValidators: true }
        );

        if (!updatedConsigner) {
            return Response.json(
                {
                    success: false,
                    message: "Consigner not found",
                },
                {
                    status: 404
                }
            );
        }

        return Response.json(
            {
                success: true,
                message: "Consigner updated successfully",
                data: updatedConsigner
            },
            {
                status: 200
            }
        );

    } catch (error) {
        console.log("Error while deleting caterory : ", error);
        return Response.json(
            {
                success: false,
                message: "Internal server error while updatingConsigner",
                error
            },
            {
                status: 500
            }
        );
    }
}