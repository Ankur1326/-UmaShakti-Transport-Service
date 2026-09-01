import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

import dbConnect from "@/lib/db";
import ConsignmentModel from "@/models/Consignment";
import { billingFormSchema } from "@/lib/validations/billing";

/**
 * GET /api/consignments
 *
 * Query params (all optional):
 *  - search        free-text match against consignment number, vehicle number,
 *                   consignor name, consignee name
 *  - paymentStatus  filter by payment.status
 *  - segment        filter by segment
 *  - page           1-indexed page number (default 1)
 *  - limit          page size (default 20, max 100)
 */
export async function GET(request: NextRequest) {
    await dbConnect();

    try {
        const { searchParams } = new URL(request.url);

        const search = searchParams.get("search")?.trim();
        const paymentStatus = searchParams.get("paymentStatus")?.trim();
        const segment = searchParams.get("segment")?.trim();
        const page = Math.max(1, Number(searchParams.get("page")) || 1);
        const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit")) || 20));

        const query: Record<string, unknown> = {};
        // console.log("get is hitting...")
        if (search) {
            const regex = new RegExp(search, "i");
            query.$or = [
                { consignmentNumber: regex },
                { vehicleNumber: regex },
                { "consignor.name": regex },
                { "consignee.name": regex },
                { eWayBillNumber: regex },
            ];
        }

        if (paymentStatus) query["payment.status"] = paymentStatus;
        if (segment) query.segment = segment;

        const [consignments, total] = await Promise.all([
            ConsignmentModel.find(query)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),
            ConsignmentModel.countDocuments(query),
        ]);

        // console.log("consignments : ", consignments)

        return NextResponse.json(
            {
                success: true,
                message: "Consignments fetched successfully",
                data: consignments,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.max(1, Math.ceil(total / limit)),
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.log("Error while fetching consignments: ", error);
        return NextResponse.json(
            { success: false, message: "Error fetching consignments" },
            { status: 500 }
        );
    }
}