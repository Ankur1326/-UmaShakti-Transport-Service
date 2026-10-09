import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function getAuthenticatedCompanyId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  const user = session?.user as
    | { _id?: unknown; role?: unknown; isApproved?: unknown }
    | undefined;

  if (
    user?.role !== "transporter" ||
    user.isApproved !== true ||
    typeof user._id !== "string" ||
    !user._id
  ) {
    return null;
  }

  return user._id;
}
