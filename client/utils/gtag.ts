export const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? '';

export const gaPageview = (url: string): void => {
  window.gtag('config', GA_ID, { page_path: url });
};
