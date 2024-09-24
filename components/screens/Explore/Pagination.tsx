interface Props {
  numOfPages: number;
  page: number;
  handlePage(page: number): void;
}
export const Pagination = ({ numOfPages, page, handlePage }: Props) => {
  return (
    <nav aria-label="Page navigation example" className="py-5">
      <ul className="flex items-center justify-center -space-x-px h-8 text-sm">
        <li
          onClick={() => page > 0 && handlePage(page - 1)}
          className="flex items-center justify-center px-3 h-8 ms-0 leading-tight"
        >
          <span className="sr-only">Previous</span>
          <svg
            className="w-2.5 h-2.5 rtl:rotate-180"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 1 1 5l4 4"
            />
          </svg>
        </li>
        {[...Array(numOfPages)].map((item, idx) => (
          <li
            key={idx}
            onClick={() => handlePage(idx)}
            className="flex items-center justify-center px-3 h-8 leading-tight cursor-pointer"
          >
            {idx + 1}
          </li>
        ))}
        <li
          onClick={() => page < numOfPages - 1 && handlePage(page + 1)}
          className="flex items-center justify-center px-3 h-8 leading-tight"
        >
          <span className="sr-only">Next</span>
          <svg
            className="w-2.5 h-2.5 rtl:rotate-180"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 9 4-4-4-4"
            />
          </svg>
        </li>
      </ul>
    </nav>
  );
};
