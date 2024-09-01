import classNames from 'classnames';

type TagTypes = {
  text: string;
  pfpUrl: string | undefined;
  twitterText: string;
  address: string;
  bg?: string;
  variant: 'blue' | 'green' | 'orange' | 'purple' | 'secondary' | 'null';
  width?: string | number;
  height?: string | number;
  textClass?: string;
};

export const AccountTag = ({
  text,
  pfpUrl,
  twitterText,
  address,
  bg,
  variant = 'blue',
  width,
  height,
  textClass,
  ...alt
}: TagTypes) => {
  const textClasses = classNames(
    'text-white font-electrolize py-2 px-3 rounded-xl whitespace-nowrap flex flex-row leading-none',
    textClass, {
      'bg-gradient-to-r to-neon-blue from-[#057977]': variant === 'blue',
      'bg-gradient-to-r to-neon-green from-[#144F33]': variant === 'green',
      'bg-gradient-to-r to-neon-orange from-[#663C15]': variant === 'orange',
      'bg-gradient-to-r to-neon-purple from-[#30006C]': variant === 'purple',
      'bg-[#023340] bg-opacity-80': variant === 'secondary',
      'bg-gradient-to-r from-[#7A4A2E] to-[#5A2F1D] opacity-60': variant === 'null',
    }
  );

  return (
    <h1 className={textClasses} {...alt}>
      {pfpUrl ? (
        <div className="flex items-center">
          {pfpUrl && (
            <img
              src={pfpUrl}
              className="rounded-full w-1/3 h-full pr-3 object-cover"
              alt="profile image"
            />
          )}
          <div className="pl-2 pt-1 flex flex-col align-middle justify-center">
            <p className="hidden sm:block text-xs md:text-sm xl:text-2xl truncate">
              {text}
            </p>
            <p className="text-xs lg:text-sm truncate">@{twitterText}</p>
          </div>
        </div>
      ) : (
        <p className="text-base lg:text-base xl:text-2xl truncate">{address}</p>
      )}
    </h1>
  );
  
};
