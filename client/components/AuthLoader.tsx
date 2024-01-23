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
    } = supabase.auth.onAuthStateChange(async (_, session) => {
      if (session === null && user?.id !== null) {
        await apiClient.session.$delete().catch(returnNull);
        setUser(null);
      } else if (session !== null && user?.id !== session.user.id) {
        await apiClient.session.$post({ body: { jwt: session?.access_token } }).catch(returnNull);
        await apiClient.me.$post().catch(returnNull).then(setUser);
      }
    });

    return subscription.unsubscribe;
  }, [user?.id, setUser]);

  return <></>;
};
