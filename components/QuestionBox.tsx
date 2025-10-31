"use client";

import React, { useState, useEffect } from "react";
import { Button } from "./ui/Button";
import { Card, CardContent } from "./ui/Card";
import ScrollArea from "./ui/ScrollArea";
import { Input } from "./ui/Input";
import { toast } from "react-toastify";
import { Question } from "../lib/types";
import DOMPurify from "dompurify";

interface QuestionBoxProps {
  question: Question;
  onSubmitAnswer: (answer: string) => void;
}

export default function QuestionBox({ question, onSubmitAnswer }: QuestionBoxProps) {
  const [answer, setAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (question.completed) {
      toast.info("You have already completed this challenge.");
    }
  }, [question.completed]);

  const handleSubmit = async () => {
    if (question.completed) {
      toast.error("You have already completed this challenge.");
      return;
    }

    if (answer.trim() === "") {
      toast.error("Please enter an answer.");
      return;
    }

    setIsSubmitting(true);
    await onSubmitAnswer(answer);
    setIsSubmitting(false);
    setAnswer("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <Card
      className="h-full flex flex-col bg-gray-900 text-green-500 relative border border-white overflow-hidden min-h-0"
    >
      <div
        className="absolute inset-0 opacity-20 pointer-events-none flex items-center justify-center"
      >
        <img
          src="/images/cx.png"
          alt="Watermark"
          className="max-w-xs"
        />
      </div>
      <CardContent className="flex-1 min-h-0 relative z-10 overflow-hidden p-6">
        <ScrollArea className="h-full pr-2 p-0">
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold text-green-500">
              Question: {question.name}
            </h2>
            <div
              className="text-lg text-gray-300 whitespace-pre-wrap question-description"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(question.description, {
                  ADD_TAGS: ["a", "br"],
                  ADD_ATTR: ["href", "target", "rel"],
                }),
              }}
            ></div>
          </div>
        </ScrollArea>
      </CardContent>
      {/* Answer Input and Submit Button */}
      <CardContent className="pt-0 flex items-center justify-between relative z-10 gap-3 shrink-0">
        <Input
          type="text"
          placeholder="Answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyPress={handleKeyPress}
          className="text-green-500 w-full bg-gray-800"
          disabled={question.completed}
        />
        <Button
          onClick={handleSubmit}
          variant="primary"
          className="bg-green-600 hover:bg-green-700"
          disabled={question.completed || isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </CardContent>
    </Card>
  );
}
