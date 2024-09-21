"use client";

import React from "react";
import { Card, CardContent } from "./ui/Card";
import { Question } from "../lib/types";
import { toast } from "react-toastify";

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
      toast.info(`You have already completed the "${question.name}" challenge.`);
      return;
    }
    onSelectQuestion(question);
    toast.info(`Changed to directory: ${question.name}`);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-green-500">Available Challenges</h3>
      <div className="space-y-2">
        {questions.map((q) => (
          <Card
            key={q.id}
            onClick={() => handleSelect(q)}
            className={`cursor-pointer border ${
              selectedQuestion?.id === q.id
                ? "border-green-500"
                : "border-transparent"
            } hover:border-green-500 transition-colors bg-gray-900 text-green-500`}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-medium">{q.name}</h4>
                <span
                  className={`px-2 py-1 text-sm rounded ${
                    q.difficulty.toLowerCase() === "easy"
                      ? "bg-green-500"
                      : q.difficulty.toLowerCase() === "medium"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  } text-white`}
                >
                  {q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1)}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-300">
                {q.description.substring(0, 60)}...
              </p>
              {q.completed && (
                <span className="mt-2 inline-block text-green-400 font-semibold">
                  ✓ Completed
                </span>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
