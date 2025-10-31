"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import ScrollArea from "./ui/ScrollArea";
import { Question } from "../lib/types";

interface QuestionsMenuProps {
  questions: Question[];
  selectedQuestion: Question | null;
  onSelectQuestion: (question: Question) => void;
}

export default function QuestionsMenu({
  questions,
  selectedQuestion,
  onSelectQuestion,
}: QuestionsMenuProps) {
  const handleSelect = (question: Question) => {
    if (question.completed) {
      return;
    }
    onSelectQuestion(question);
  };

  return (
    <Card className="bg-gray-900 text-green-500 h-full shadow-lg border border-white/10">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold text-green-400">
          Available Challenges
        </CardTitle>
        <p className="text-sm text-gray-400">Pick your next exploit. Completed ones are highlighted.</p>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="max-h-[70vh] pr-2 px-4 py-3">
          <div className="space-y-2">
            {questions.length ? (
              questions.map((q) => {
                const isSelected = selectedQuestion?.id === q.id;
                const isCompleted = q.completed;

                return (
                  <Card
                    key={q.id}
                    onClick={() => handleSelect(q)}
                    className={`transition-colors ${
                      isSelected
                        ? "border-green-500 bg-green-900/60"
                        : "border-transparent bg-gray-800/80 hover:border-green-500/60"
                    } ${
                      isCompleted
                        ? "opacity-60 cursor-not-allowed"
                        : "cursor-pointer"
                    } text-green-100 backdrop-blur-sm`}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <h4 className="text-lg font-medium">{q.name}</h4>
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full shadow-sm ${
                            q.difficulty.toLowerCase() === "easy"
                              ? "bg-green-500/90 text-gray-900"
                              : q.difficulty.toLowerCase() === "medium"
                              ? "bg-yellow-500/90 text-gray-900"
                              : "bg-red-500/90 text-gray-100"
                          }`}
                        >
                          {q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1)}
                        </span>
                      </div>
                      {isCompleted ? (
                        <span className="mt-3 inline-flex items-center gap-1 text-sm text-green-300">
                          <span aria-hidden>✔</span> Completed
                        </span>
                      ) : (
                        <p className="mt-3 text-xs text-gray-400">
                          Tap to load the briefing in the command terminal.
                        </p>
                      )}
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <Card className="bg-gray-800/80 text-gray-300 border border-white/10">
                <CardContent className="p-4 text-sm">
                  No challenges available yet. Check back soon.
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
