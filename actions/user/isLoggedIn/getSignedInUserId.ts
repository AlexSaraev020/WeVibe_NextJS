import { cookies } from "next/headers";
import { connect } from "@/db/mongo/db";
import { UserModel } from "@/models/user";
import { verifyAuthToken } from "@/lib/auth/verifyAuthToken";

/* the question every page gate should ask: does this cookie still describe an account that exists?
   Reading only — no cookie writes here, which a Server Component is not allowed to do — and never
   "cookie present means signed in", which is what bounced people from /auth/login to /home */
export const getSignedInUserId = async () => {
  const token = (await cookies()).get("authToken");
  if (!token) {
    return null;
  }
  let userId: string;
  try {
    userId = await verifyAuthToken(token.value);
  } catch {
    return null;
  }
  await connect();
  const account = await UserModel.findById(userId).select("_id").exec();
  return account ? userId : null;
};
