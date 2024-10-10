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

        <div className="flex">
          {Array.from({ length: Math.min(numOfPages, 10) }, (_, idx) => {
            const start = Math.max(0, page - 5);
            const end = Math.min(numOfPages, start + 10);
            console.log(numOfPages)
            const pageIndex = start + idx;

            return (
              pageIndex < end && (
                <li
                  key={pageIndex}
                  onClick={() => handlePage(pageIndex)}
                  className={`flex items-center justify-center px-3 h-8 leading-tight cursor-pointer ${
                    pageIndex === page ? 'bg-neon-green rounded-sm' : ''
                  }`}
                >
                  {pageIndex + 1}
                </li>
              )
            );
          })}
        </div>
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
