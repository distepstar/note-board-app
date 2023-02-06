import React from "react";
import "./style.css"

// components
import { IntroCard } from "../../../components/IntroCard";
import { faHotTubPerson } from "@fortawesome/free-solid-svg-icons";

interface IProps {

}

const loremPara = "Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet. Nisi anim cupidatat excepteur officia. Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate voluptate dolor minim nulla est proident. Nostrud officia pariatur ut officia. Sit irure elit esse ea nulla sunt ex occaecat reprehenderit commodo officia dolor Lorem duis laboris cupidatat officia voluptate. Culpa proident adipisicing id nulla nisi laboris ex in Lorem sunt duis officia eiusmod. Aliqua reprehenderit commodo ex non excepteur duis sunt velit enim. Voluptate laboris sint cupidatat ullamco ut ea consectetur et est culpa et culpa duis.";
const testingTexts = ["texting", "texting", "texting", "texting", "texting", "texting", "texting", "texting", "texting", "texting", "texting", "texting", "texting",];

export const Home: React.FC<IProps> = (): JSX.Element => {

  return (
    <div className="flex flex-col justify-start place-items-center w-full h-full pb-4 bg-zinc-800 text-white overflow-y-scroll no-scrollbar space-y-8 min-h-screen">
      <div className="home-header flex flex-col space-y-4 place-self-start pt-4 w-full h-[32em] bg-zinc-700">
        <div className="ml-4 mr-4 font-bold text-left text-4xl border-b-slate-500 border-b-2 h-14">
          Note Board is your time saver!
        </div>
        <div className="home-highlight flex flex-row w-full overflow-x-hidden ">
          <div className="highlight-list flex-row flex-none space-x-4 ml-4 mr-4 overflow-x-hidden no-scrollbar">
            {/* TODO EMPTY LIST */}
            <IntroCard title={"Header"} date={"01/04/2023"} status={"Pending"} body={loremPara} icon={faHotTubPerson} footnotes={testingTexts} />
            <IntroCard title={"Header"} date={"01/04/2023"} status={"TODO"} body={loremPara} icon={faHotTubPerson} footnotes={testingTexts} />
            <IntroCard title={"Header"} date={"01/04/2023"} status={"In Progress"} body={loremPara} icon={faHotTubPerson} footnotes={testingTexts} />
            <IntroCard title={"Header"} date={"01/04/2023"} status={"Done"} body={loremPara} icon={faHotTubPerson} footnotes={testingTexts} />
            <IntroCard title={"Header"} date={"01/04/2023"} status={"Pending"} body={loremPara} icon={faHotTubPerson} footnotes={testingTexts} />
            <IntroCard title={"Header"} date={"01/04/2023"} status={"Pending"} body={loremPara} icon={faHotTubPerson} footnotes={testingTexts} />
          </div>
        </div>
      </div>
      <div>Testing</div>
    </div>
  )
}

