import type { ServiceModel } from '$/api/@types/models';
import styles from './statusIcon.module.css';

const CheckMark = () => {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="10" r="10" fill="#14b869" />
      <path d="M5 9L9 13L15 7" stroke="white" strokeWidth="2" />
    </svg>
  );
};

const CrossMark = () => {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="10" r="10" fill="#ec0000" />
      <path d="M14.1355 6.46454L7.06445 13.5356" stroke="white" strokeWidth="2" />
      <path d="M14.1355 13.5356L7.06445 6.46452" stroke="white" strokeWidth="2" />
    </svg>
  );
};

export const StatusIcon = (props: { status: ServiceModel['status'] }) => {
  return {
    finished: <div className={styles.loader} />,
    unfinished: <CheckMark />,
  }[props.status];
};
