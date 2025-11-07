import { cookies } from "next/headers";

import { RoomClient } from "@/app/room/[code]/_components/room-client";

export default async function RoomPage({ params }) {
  const { code } = await params;
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return <RoomClient roomCode={code} defaultOpen={defaultOpen} />;
}
