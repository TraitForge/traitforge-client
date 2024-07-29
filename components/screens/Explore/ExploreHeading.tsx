import { icons } from '~/components/icons';

interface Props {
  searchQuery: string;
  handleSearch(text: string): void;
}

export const ExploreHeading = ({ searchQuery, handleSearch }: Props) => {
  return (
    <div className="flex flex-col md:flex-row justify-center relative items-center container mt-16 gap-y-5">
      <h1 className=" text-[36px] md:text-extra-large">Explore</h1>
      <div className="relative md:absolute md:top-1/2 md:translate-y-[-50%] md:right-0 xl:right-20 w-full md:w-[25%]">
        <input
          type="text"
          className="text-base rounded-md px-3 py-4 border-2 bg-transparent border-neon-green-yellow  text-white placeholder:text-white outline-none w-full z-10"
          value={searchQuery}
          onChange={e => handleSearch(e.target.value)}
          placeholder="Search"
        />
        {icons.search({
          className: 'absolute right-4 top-1/2 -translate-y-1/2 z-0',
        })}
      </div>
    </div>
  );
};
