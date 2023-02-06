
interface IProps {
  text: string;

}

export const IntroCardNote: React.FC<IProps> = ({text}): JSX.Element => {
  return (
    <div className="h-5 text-sm font-bold rounded-md bg-gray-300 pl-2 pr-2">
      {text}
    </div>
  );
}
