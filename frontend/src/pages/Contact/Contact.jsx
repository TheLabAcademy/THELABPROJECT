import React from "react";
import TopMain from "../../components/TopMain/TopMain";
import { questions } from "../../data/constants/index";
import Form from "../../components/formulaire/form";

export default function Contact() {
  return (
    <div className="w-full">
      <TopMain title="Contact" description="Une question ?" />
      <div className="flex flex-col justify-center items-center">
        <div className="xl:w-[900px] m-8">
          <Form />
        </div>
        <div className="flex justify-center mb-[200px]">
          <div className="w-full">
            <h2 className="text-white font-bold text-center text-6xl font-secondary-font mb-[80px]">
              FAQ - Questions fréquentes :
            </h2>
            <ul className="flex flex-col gap-4 justify-center">
              {questions.map((question) => (
                <li key={question.id} className="flex flex-col gap-2 m-2">
                  <h3 className="text-white font-bold text-3xl font-secondary-font m-4 p-2">
                    {question.question}
                  </h3>
                  <p className="border-b-4 text-xl font-normal text-gray-400 text-end font-secondary-font">
                    {question.answer}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
