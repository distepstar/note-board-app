interface IPopupWrapper {
  children: React.ReactNode;
}
export const PopupWrapper: React.FC<IPopupWrapper> = ({
  children,
}): JSX.Element => {
  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 w-full h-full overflow-y-hidden `}
    >
      {children}
    </div>
  );
};
