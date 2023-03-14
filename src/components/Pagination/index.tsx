import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

interface IPagination {
  totalItems?: number;
  itemsPerPage: number;
  currentPage: number;
  changePage: (e: React.MouseEvent, idx?: number) => void;
}

export const Pagination: React.FC<IPagination> = ({
  totalItems = 0,
  itemsPerPage,
  currentPage,
  changePage,
}): JSX.Element => {
  const [pages, setPages] = useState(Math.ceil(totalItems / itemsPerPage));

  const handlePageChange = (e: React.MouseEvent, idx: number) => {
    if (idx >= 0 && idx < pages) {
      changePage(e, idx);
    }
  };

  useEffect(() => {
    setPages(Math.ceil(totalItems / itemsPerPage));
  }, [totalItems]);

  return (
    <div className="w-fit h-14">
      <div className="flex flex-row justify-between place-items-center space-x-1">
        <button
          className="flex justify-center place-items-center w-14 h-12 rounded-l-lg bg-white text-black"
          onClick={(e) => handlePageChange(e, currentPage - 1)}
        >
          <FontAwesomeIcon className="text-xl" icon={faArrowLeft} />
        </button>{" "}
        {totalItems === 0 ? (
          <div className="flex justify-center place-items-center w-14 h-12 bg-white text-black font-bold">
            1
          </div>
        ) : (
          Array.apply(null, Array(pages)).map((ele, idx) => {
            return (
              <button
                key={`project-item-${idx}`}
                onClick={(e) => handlePageChange(e, idx)}
                className="flex justify-center place-items-center w-14 h-12 bg-white text-black font-bold"
              >
                {idx + 1}
              </button>
            );
          })
        )}
        <button
          className="flex justify-center place-items-center w-14 h-12 rounded-r-lg bg-white text-black"
          onClick={(e) => handlePageChange(e, currentPage + 1)}
        >
          <FontAwesomeIcon className="text-xl" icon={faArrowRight} />
        </button>
      </div>
    </div>
  );
};
