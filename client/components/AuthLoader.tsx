import { userAtom } from 'atoms/user';
import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { apiClient } from 'utils/apiClient';
import { returnNull } from 'utils/returnNull';
import { supabase } from 'utils/supabase';

export const AuthLoader = () => {
  const [user, setUser] = useAtom(userAtom);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      // eslint-disable-next-line complexity
      async (event, session) => {
        switch (event) {
          case 'SIGNED_OUT':
            await apiClient.session.$delete().catch(returnNull);
            setUser(null);
            break;
          case 'INITIAL_SESSION':
          case 'SIGNED_IN':
          case 'TOKEN_REFRESHED':
            if (session !== null) {
              await apiClient.session
                .$post({ body: { jwt: session.access_token } })
                .catch(returnNull);
              await apiClient.me.$post().catch(returnNull).then(setUser);
            }
            break;
          default:
            break;
        }
      }
    );

    return subscription.unsubscribe;
  }, [user?.id, setUser]);

  return <></>;
};
