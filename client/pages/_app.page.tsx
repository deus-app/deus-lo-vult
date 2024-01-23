import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import type { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import 'styles/chat-ui-kit,css';
import 'styles/globals.css';
import { gaPageview } from 'utils/gtag';

function MyApp({ Component, pageProps }: AppProps) {
  const SafeHydrate = dynamic(() => import('components/SafeHydrate'), { ssr: false });
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: string, { shallow }: { shallow: boolean }) => {
      if (!shallow) gaPageview(url);
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <SafeHydrate>
        <Component {...pageProps} />
      </SafeHydrate>
      {/* <Auth.UserContextProvider supabaseClient={supabase}>
        <AuthLoader />
      </Auth.UserContextProvider> */}
    </>
  );
}

export default MyApp;
