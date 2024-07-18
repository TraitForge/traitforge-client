import classNames from 'classnames';
import ContentLoader, { IContentLoaderProps } from 'react-content-loader';

export const EntityCardSkeleton = (props: IContentLoaderProps) => {
  const classes = classNames('w-full', props?.className);
  return (
    <ContentLoader
      speed={2}
      width={233}
      height={459}
      viewBox="0 0 233 349"
      backgroundColor="#1B1A19"
      foregroundColor="#2A2A29"
      {...props}
      className={classes}
    >
      <path d="M 73 343 H 17.5 l -13 -15.5 v -20 l -4.5 -5 v -51 l 4.5 -6 V 229 l 4.5 -8.5 v -94 l -4.5 -8 v -17 l -4.5 -5 v -52 l 4.5 -5 v -18 L 17 5.5 h 55.5 l 4 -5.5 h 79 l 4.5 5.5 h 54.5 l 13.5 16 v 18 l 4.5 5 v 52 l -4.5 5 v 17 l -5 8 v 94 l 5 8.5 v 16.5 l 4.5 6 v 51 l -4.5 5 v 20 L 215 343 h -55.5 l -3.5 5.5 H 76 l -3 -5.5 z" />
      <path d="M 217.97 215.871 l 4.753 8.129 H 10.277 l 4.278 -8.129 v -89.895 l -4.278 -7.651 v -16.257 L 6 97.286 v -49.73 l 4.277 -4.78 V 25.56 L 22.16 10.26 h 52.755 L 78.716 5 h 75.093 l 4.277 5.26 h 51.804 l 12.833 15.301 v 17.214 L 227 47.557 v 49.729 l -4.277 4.782 v 16.257 l -4.753 7.651 v 89.895 z" />
      <rect x="12" y="238" rx="9" ry="9" width="144" height="18" />
      <rect x="12" y="270" rx="9" ry="9" width="111" height="18" />
    </ContentLoader>
  );
};
