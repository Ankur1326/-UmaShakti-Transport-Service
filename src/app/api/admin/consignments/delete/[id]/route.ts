import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import dbConnect from "@/lib/db";
import ConsignmentModel from "@/models/Consignment";

function isValidObjectId(id: string) {
    return mongoose.Types.ObjectId.isValid(id);
}

/** DELETE /api/consignments/:id */
export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ [key: string]: string | string[] }> }
) {
    await dbConnect();
    const resolvedParams = await params;
    const id = typeof resolvedParams.id === "string" ? resolvedParams.id : Array.isArray(resolvedParams.id) ? resolvedParams.id[0] : "";

    if (!isValidObjectId(id)) {
        return NextResponse.json({ success: false, message: "Invalid consignment id" }, { status: 400 });
    }

    try {
        const consignment = await ConsignmentModel.findByIdAndDelete(id);

        if (!consignment) {
            return NextResponse.json(
                { success: false, message: "Consignment not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, message: "Consignment deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.log("Error while deleting consignment: ", error);
        return NextResponse.json({ success: false, message: "Error deleting consignment" }, { status: 500 });
    }
}