import { Spacer } from 'features/Spacer';
import { formatTimestamp } from 'utils/dayjs';
import styles from './nameLabel.module.css';

export const NameLabel = (props: { name: string; createdTime: number }) => {
  return (
    <>
      <span className={styles.nameLabel}>{props.name}</span>
      <Spacer axis="x" size={8} />
      <span className={styles.sentTime}>{formatTimestamp(props.createdTime)}</span>
    </>
  );
};
