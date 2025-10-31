"use client";

import React, { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "./ui/Card";
import { LeaderboardEntry } from "../lib/types";
import DOMPurify from "dompurify";
import { useSession } from "next-auth/react";
import ScrollArea from "./ui/ScrollArea";

const Loader = () => (
  <div className="flex items-center justify-center h-48">
    <div className="w-12 h-12 border-4 border-green-500 border-dashed rounded-full animate-spin"></div>
  </div>
);

interface LeaderboardProps {
  currentUserName: string;
}

export default function Leaderboard({ currentUserName }: LeaderboardProps) {
  const { data: session } = useSession();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    const connectSSE = () => {
      const eventSource = new EventSource("/api/sse-leaderboard");
      eventSourceRef.current = eventSource;

      eventSource.onmessage = (event) => {
        console.log("Received data:", event.data); // Debug log
        const data = JSON.parse(event.data);
        setLeaderboard(data);
        setLoading(false); 
      };

      eventSource.onerror = (error) => {
        console.error("Error with SSE connection:", error);
        eventSource.close();

        setTimeout(() => {
          connectSSE();
        }, 5000);
      };
    };

    connectSSE();

    return () => {
      eventSourceRef.current?.close();
    };
  }, []);

  const userEntry = leaderboard.find(
    (entry) => entry.user_name === session?.user?.name
  );

  const formatDisplayName = (name: string) => {
    const sanitized = DOMPurify.sanitize(name, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
    });
    const words = sanitized.trim().split(/\s+/);
    const truncated = words.slice(0, 3).join(' ');
    return truncated || sanitized;
  };

  const topTierGradients = [
    "bg-gradient-to-r from-yellow-500/20 to-yellow-500/5 border border-yellow-500/30",
    "bg-gradient-to-r from-gray-200/15 to-gray-500/5 border border-gray-400/30",
    "bg-gradient-to-r from-amber-700/20 to-amber-500/5 border border-amber-500/30",
  ];
  const medals = ["🥇", "🥈", "🥉"];

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-xl font-semibold text-green-500 mb-4">Leaderboard</h3>
      
      {/* Scrollable list of all leaderboard entries */}
      <ScrollArea className="flex-1 space-y-2 pr-2 py-2">
        {leaderboard.length ? (
          leaderboard.map((player, index) => {
            const isCurrentUser = player.user_name === currentUserName;
            const baseCardStyles = isCurrentUser
              ? "bg-green-800/90 border border-green-500/40"
              : "bg-gray-900/70 border border-white/10";
            const highlight = index < 3 ? topTierGradients[index] : "";

            return (
              <Card
                key={`${player.user_name}-${player.points}-${index}`}
                className={`${baseCardStyles} ${highlight} text-green-100 backdrop-blur-sm transition-transform hover:translate-y-[-2px]`}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      {index < 3 && <span className="text-lg">{medals[index]}</span>}
                      <h4 className="text-lg font-medium">
                        {formatDisplayName(player.user_name)}
                        {isCurrentUser ? " (You)" : ""}
                      </h4>
                    </div>
                    <span className="text-sm font-semibold text-green-300">
                      #{index + 1}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-200">
                    Score: {player.points}
                  </p>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card className="bg-gray-900/70 text-green-500">
            <CardContent className="p-4 text-sm text-gray-300">
              No leaderboard data available yet.
            </CardContent>
          </Card>
        )}
      </ScrollArea>

      {userEntry && (
        <div className="mt-2">
          <Card className="bg-gray-900/80 text-green-100 border border-green-500/40">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-medium">
                  {formatDisplayName(userEntry.user_name)} (You)
                </h4>
                <span className="text-sm">
                  Rank:{" "}
                  {leaderboard.findIndex(
                    (entry) => entry.user_name === userEntry.user_name
                  ) + 1}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-200">
                Score: {userEntry.points}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
