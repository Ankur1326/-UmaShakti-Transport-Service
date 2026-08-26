import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/db";
import Consignee from "@/models/Consignee";
import { getServerSession } from "next-auth";
// import { getSession } from "next-auth/react";

export async function DELETE(request: Request) {
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

    // Check if the user has admin role
    if (session.user?.role !== "admin") {
        return Response.json(
            {
                success: false,
                message: "Forbidden. You do not have permission to perform this action"
            },
            {
                status: 403
            }
        );
    }

    try {
        const data = await request.json();
        const consigneeId = data._id

        // Fixing validation to check for undefined for isActive
        if (!consigneeId) {
            return Response.json(
                {
                    success: false,
                    message: "Consignee ID is required."
                },
                {
                    status: 400
                }
            );
        }

        const result = await Consignee.deleteOne({ _id: consigneeId });

        if (result.deletedCount === 0) {
            return Response.json(
                {
                    success: false,
                    message: "Consignee not found.",
                },
                {
                    status: 404,
                }
            );
        }

        return Response.json(
            {
                success: true,
                message: "Consignee deleted successfully.",
            },
            {
                status: 200,
            }
        );

    } catch (error) {
        console.log("Error while deleting Consignee : ", error);
        return Response.json(
            {
                success: false,
                message: "Internal server error while Consignee",
                error
            },
            {
                status: 500
            }
        );
    }
} 