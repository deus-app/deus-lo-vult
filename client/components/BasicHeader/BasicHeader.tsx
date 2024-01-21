import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useState } from 'react';
import type { User } from '../../api/@types';
import { Modal, ModalBody } from '../../components/Modal/Modal';
import { APP_NAME } from '../../utils/constants';
import { supabase } from '../../utils/supabase';
import styles from './BasicHeader.module.css';

const Hamburger = () => {
  return (
    <div className={styles.hamburgerIcon}>
      <div className={styles.hamburgerBar} />
    </div>
  );
};

export const BasicHeader = (props: { user: User | null }) => {
  const [opened, setOpened] = useState<boolean>(false);
  const onLogout = async () => {
    setOpened(false);
    if (confirm('Logout?')) await supabase.auth.signOut();
  };

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <div className={styles.title}>{APP_NAME}</div>
        {props.user === null ? (
          <div onClick={() => setOpened(true)}>
            <div className={styles.loginBtn}>
              <span className={styles.loginText}>Login with Email</span>
            </div>
            <Hamburger />
          </div>
        ) : (
          <div onClick={onLogout}>
            <div className={styles.userBtn}>
              <span className={styles.userName}>{props.user.name}</span>
            </div>
            <Hamburger />
          </div>
        )}
      </div>
      <Modal open={props.user === null && opened} onClose={() => setOpened(false)}>
        <ModalBody>
          <Auth
            supabaseClient={supabase}
            providers={[]}
            appearance={{ theme: ThemeSupa }}
            redirectTo={location.origin}
          />
        </ModalBody>
      </Modal>
    </div>
  );
};
