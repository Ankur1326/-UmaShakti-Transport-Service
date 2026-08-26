// import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/db";
import Consignee from "@/models/Consignee";
// import { getServerSession } from "next-auth";

export async function GET(request: Request) {
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

    const url = new URL(request.url)
    const currentPage = parseInt(url.searchParams.get("currentPage") || "1", 10);  // Default to page 1 if not provided
    const name = url.searchParams.get("name") || "";
    const state = url.searchParams.get("state") || "";
    const itemsPerPage = parseInt(url.searchParams.get("itemsPerPage") || "5", 10); // Default to 5 items per page

    try {
        // console.log(name, isActive, currentPage, itemsPerPage);

        let filter: any = {};

        // Filter by `name` if provided (case-insensitive, partial match)
        if (name) {
            filter.name = { $regex: name, $options: "i" };
        }

        if (name) {
            filter.state = { $regex: state, $options: "i" };
        }

        const skip = (currentPage - 1) * itemsPerPage;
        const limit = itemsPerPage;
        // Fetch categories based on filter and pagination
        const consignees = await Consignee.find(filter).skip(skip).limit(limit).exec();
        const totalConsignees = await Consignee.countDocuments(filter).exec();

        if (!consignees) {
            return Response.json(
                {
                    success: false,
                    message: "Consignees not found"
                },
                {
                    status: 404
                }
            );
        }

        return Response.json(
            {
                success: true,
                message: "Consignees fetched successfully",
                data: {
                    consignees,
                    totalConsignees,
                    currentPage,
                    totalPages: Math.ceil(totalConsignees / itemsPerPage)
                }
            },
            {
                status: 200
            }
        );

    } catch (error) {
        console.log("Error while fetching consignees: ", error);
        return Response.json(
            {
                success: false,
                message: "Internal server error while fetching consignees",
                error
            },
            {
                status: 500
            }
        );
    }
}