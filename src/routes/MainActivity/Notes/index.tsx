import React from "react";


interface IProps {

}

export const Notes: React.FC<IProps> = (): JSX.Element => {

  return (
    <div className="flex flex-col justify-start place-items-center w-full pt-4 pb-4 bg-zinc-800 text-white">
      <h1>Notes</h1>
    </div>
  )
}

