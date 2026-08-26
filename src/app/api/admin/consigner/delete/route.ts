import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/db";
import Consigner from "@/models/Consigner";
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
        const consignerId = data._id

        // Fixing validation to check for undefined for isActive
        if (!consignerId) {
            return Response.json(
                {
                    success: false,
                    message: "Consigner ID is required."
                },
                {
                    status: 400
                }
            );
        }

        const result = await Consigner.deleteOne({ _id: consignerId });

        if (result.deletedCount === 0) {
            return Response.json(
                {
                    success: false,
                    message: "Consigner not found.",
                },
                {
                    status: 404,
                }
            );
        }

        return Response.json(
            {
                success: true,
                message: "Consigner deleted successfully.",
            },
            {
                status: 200,
            }
        );

    } catch (error) {
        console.log("Error while deleting Consigner : ", error);
        return Response.json(
            {
                success: false,
                message: "Internal server error while Consigner",
                error
            },
            {
                status: 500
            }
        );
    }
} 