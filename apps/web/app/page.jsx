"use client";

import { useState } from "react";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { useCreateRoom } from "@/features/daily/api/use-create-room";

export default function Home() {
  const { mutate: createRoom, isPending } = useCreateRoom();
  const [name, setName] = useState("");

  const handleCreateRoom = () => createRoom({ name });

  return (
    <div className="bg-background relative min-h-screen overflow-hidden">
      {/* Animated color blobs */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 h-96 w-96 animate-[float_6s_ease-in-out_infinite] rounded-full bg-red-400 opacity-70 mix-blend-multiply blur-xl filter dark:opacity-40 dark:mix-blend-screen"></div>
        <div className="absolute top-40 right-20 h-112 w-md animate-[float_8s_ease-in-out_infinite_reverse] rounded-full bg-blue-400 opacity-70 mix-blend-multiply blur-xl filter dark:opacity-40 dark:mix-blend-screen"></div>
        <div className="absolute bottom-32 left-108 h-128 w-lg animate-[float_7s_ease-in-out_infinite_0.5s] rounded-full bg-green-400 opacity-70 mix-blend-multiply blur-xl filter dark:opacity-40 dark:mix-blend-screen"></div>
      </div>

      {/* Content overlay */}
      <div className="bg-background/30 dark:bg-background/50 relative z-10 flex min-h-screen items-center justify-center backdrop-blur-sm">
        <div className="w-full max-w-4xl px-6">
          <div className="space-y-16 text-center">
            <div className="space-y-4">
              <h1 className="text-foreground text-8xl leading-none font-black tracking-tight md:text-[10rem]">
                Icebreaker
              </h1>
              <p className="text-muted-foreground mx-auto max-w-lg text-3xl font-light">
                A new icebreaker question every day
              </p>
            </div>
            <div className="bg-foreground mx-auto h-px w-24"></div>
            <div className="mx-auto max-w-lg">
              <div className="bg-card/80 relative flex items-center rounded-md shadow-lg backdrop-blur-sm">
                <Input
                  placeholder="Enter your name"
                  className="border-none bg-transparent px-4 shadow-none dark:bg-transparent"
                  disabled={isPending}
                  onChange={(e) => setName(e.target.value)}
                />
                <Button
                  className="rounded-l-none px-8 py-8 text-base"
                  disabled={isPending}
                  onClick={handleCreateRoom}
                >
                  Create room
                </Button>
              </div>
              <p className="text-muted-foreground mt-2 text-base font-light">
                Create a room and share the link with your team.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translate(0px, 0px) rotate(0deg);
          }
          33% {
            transform: translate(30px, -30px) rotate(120deg);
          }
          66% {
            transform: translate(-20px, 20px) rotate(240deg);
          }
        }
      `}</style>
    </div>
  );
}
