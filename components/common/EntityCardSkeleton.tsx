import classNames from 'classnames';
import ContentLoader, { IContentLoaderProps } from 'react-content-loader';

export const EntityCardSkeleton = (props: IContentLoaderProps) => {
  const classes = classNames('w-full', props?.className);
  return (
    <ContentLoader
      speed={2}
      width="full"
      height={400}
      viewBox="0 0 350 410"
      backgroundColor="#1B1A19"
      foregroundColor="#2A2A29"
      {...props}
      className={classes}
    >
      <rect
        x="0"
        y="0"
        width="350"
        height="410"
        rx="20"  
        ry="20"
        fill="#2A2A29"
        stroke="#1B1A19" 
        strokeWidth="2" 
      />
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fill="white"
        fontSize="18"
        fontFamily="Arial"
      >
        Entity Card
      </text>
    </ContentLoader>
  );
};
