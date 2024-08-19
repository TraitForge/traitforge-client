export type IconProps = React.SVGProps<SVGSVGElement>;

export const icons = {
  search: (props?: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        stroke="#A7A7A7"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M10.875 18.75a7.875 7.875 0 100-15.75 7.875 7.875 0 000 15.75zM16.443 16.444L21 21"
      ></path>
    </svg>
  ),
  wallet: (props?: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="26"
      fill="none"
      viewBox="0 0 28 26"
      {...props}
    >
      <g
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        filter="url(#filter0_d_2191_58)"
      >
        <path d="M5.75 12.5h16.5M5.75 6.5h16.5M5.75 18.5h16.5"></path>
      </g>
      <defs>
        <filter
          id="filter0_d_2191_58"
          width="26.5"
          height="22"
          x="0.75"
          y="5.5"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
          <feColorMatrix
            in="SourceAlpha"
            result="hardAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          ></feColorMatrix>
          <feOffset dy="4"></feOffset>
          <feGaussianBlur stdDeviation="2"></feGaussianBlur>
          <feComposite in2="hardAlpha" operator="out"></feComposite>
          <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"></feColorMatrix>
          <feBlend
            in2="BackgroundImageFix"
            result="effect1_dropShadow_2191_58"
          ></feBlend>
          <feBlend
            in="SourceGraphic"
            in2="effect1_dropShadow_2191_58"
            result="shape"
          ></feBlend>
        </filter>
      </defs>
    </svg>
  ),
  menu: (props?: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="26"
      fill="none"
      viewBox="0 0 28 26"
      {...props}
    >
      <g
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        filter="url(#filter0_d_2191_58)"
      >
        <path d="M5.75 12.5h16.5M5.75 6.5h16.5M5.75 18.5h16.5"></path>
      </g>
      <defs>
        <filter
          id="filter0_d_2191_58"
          width="26.5"
          height="22"
          x="0.75"
          y="5.5"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
          <feColorMatrix
            in="SourceAlpha"
            result="hardAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          ></feColorMatrix>
          <feOffset dy="4"></feOffset>
          <feGaussianBlur stdDeviation="2"></feGaussianBlur>
          <feComposite in2="hardAlpha" operator="out"></feComposite>
          <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"></feColorMatrix>
          <feBlend
            in2="BackgroundImageFix"
            result="effect1_dropShadow_2191_58"
          ></feBlend>
          <feBlend
            in="SourceGraphic"
            in2="effect1_dropShadow_2191_58"
            result="shape"
          ></feBlend>
        </filter>
      </defs>
    </svg>
  ),
  arrow: (props?: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="21"
      fill="none"
      viewBox="0 0 12 21"
      {...props}
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.519"
        d="M9.795 18.833l-8.398-8.397 8.398-8.397"
      ></path>
    </svg>
  ),
  plus: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="89"
      height="88"
      fill="none"
      viewBox="0 0 89 88"
    >
      <g filter="url(#filter0_d_965_8421)">
        <path
          stroke="#fff"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3"
          d="M24.563 44h39.874"
        ></path>
      </g>
      <g filter="url(#filter1_d_965_8421)">
        <path
          stroke="#fff"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3"
          d="M44.5 24.063v39.874"
        ></path>
      </g>
      <defs>
        <filter
          id="filter0_d_965_8421"
          width="87.475"
          height="47.6"
          x="0.763"
          y="20.2"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
          <feColorMatrix
            in="SourceAlpha"
            result="hardAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          ></feColorMatrix>
          <feOffset></feOffset>
          <feGaussianBlur stdDeviation="11.15"></feGaussianBlur>
          <feComposite in2="hardAlpha" operator="out"></feComposite>
          <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.62 0"></feColorMatrix>
          <feBlend
            in2="BackgroundImageFix"
            result="effect1_dropShadow_965_8421"
          ></feBlend>
          <feBlend
            in="SourceGraphic"
            in2="effect1_dropShadow_965_8421"
            result="shape"
          ></feBlend>
        </filter>
        <filter
          id="filter1_d_965_8421"
          width="47.6"
          height="87.475"
          x="20.7"
          y="0.263"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
          <feColorMatrix
            in="SourceAlpha"
            result="hardAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          ></feColorMatrix>
          <feOffset></feOffset>
          <feGaussianBlur stdDeviation="11.15"></feGaussianBlur>
          <feComposite in2="hardAlpha" operator="out"></feComposite>
          <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.62 0"></feColorMatrix>
          <feBlend
            in2="BackgroundImageFix"
            result="effect1_dropShadow_965_8421"
          ></feBlend>
          <feBlend
            in="SourceGraphic"
            in2="effect1_dropShadow_965_8421"
            result="shape"
          ></feBlend>
        </filter>
      </defs>
    </svg>
  ),
  user: (props?: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="68"
      height="68"
      fill="none"
      viewBox="0 0 68 68"
      {...props}
    >
      <path
        fill="currentColor"
        d="M3.536 26.28L26.28 3.536c4.256-4.259 11.184-4.259 15.44 0L64.464 26.28c4.258 4.257 4.258 11.183 0 15.44L41.72 64.464A10.88 10.88 0 0134 67.656a10.881 10.881 0 01-7.72-3.192L3.536 41.72c-4.257-4.257-4.257-11.183 0-15.44zm25.926 35.002a6.425 6.425 0 009.077 0L49.75 50.071v-2.356A4.72 4.72 0 0045.035 43h-22.07a4.72 4.72 0 00-4.715 4.715v2.356l11.212 11.211zM6.718 38.538l7.244 7.245c.892-4.156 4.586-7.283 9.003-7.283h22.07c4.417 0 8.112 3.127 9.003 7.283l7.245-7.245a6.425 6.425 0 000-9.077L38.539 6.718A6.398 6.398 0 0034 4.84a6.398 6.398 0 00-4.538 1.877L6.718 29.46a6.425 6.425 0 000 9.077z"
      ></path>
      <path
        fill="currentColor"
        d="M34 16c4.963 0 9 4.037 9 9s-4.037 9-9 9-9-4.037-9-9 4.037-9 9-9zm0 13.5c2.482 0 4.5-2.018 4.5-4.5s-2.018-4.5-4.5-4.5a4.504 4.504 0 00-4.5 4.5c0 2.482 2.018 4.5 4.5 4.5z"
      ></path>
    </svg>
  ),
  pen: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      fill="none"
      viewBox="0 0 22 22"
    >
      <path
        stroke="#35FFE7"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M8.25 18.563H4.125a.688.688 0 01-.688-.688v-3.84a.687.687 0 01.202-.486L13.95 3.236a.687.687 0 01.973 0l3.84 3.84a.688.688 0 010 .973L8.25 18.563zM11.688 5.5l4.812 4.813"
      ></path>
    </svg>
  ),
  x: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        fill="#35FFE7"
        fillOpacity="0.96"
        d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z"
      ></path>
      <path
        fill="#000"
        d="M13.312 10.914l5.137-5.972h-1.217l-4.46 5.185-3.563-5.185h-4.11l5.388 7.84L5.1 19.046h1.217l4.71-5.476 3.763 5.476h4.109l-5.587-8.131zM6.756 5.859h1.87l8.606 12.311h-1.87L6.757 5.859z"
      ></path>
    </svg>
  ),
};
