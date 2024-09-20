import React from "react";
import NavStructure from "./navcomponents/navStructure/navStructure";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
interface DecodedToken {
  userId: string;
}
export default function Nav() {
  const cookieStore = cookies();
  const token = cookieStore.get("authToken");
  if (token) {
    const decodedToken = jwtDecode(token.value) as DecodedToken;
    return (
      <nav>
        <NavStructure userID={decodedToken.userId} />
      </nav>
    );
  }
}
