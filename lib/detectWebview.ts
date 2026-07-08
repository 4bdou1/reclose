export const isWebview = () => {
  if (typeof window === 'undefined') return false;
  
  const userAgent = window.navigator.userAgent || window.navigator.vendor || (window as any).opera;
  
  // Rules to detect in-app browsers
  const rules = [
    'WebView',
    '(iPhone|iPod|iPad)(?!.*Safari/)', // iOS webview
    'Android.*(wv|.0.0.0)', // Android webview
    'FBAV', // Facebook
    'FBAN', // Facebook
    'Instagram', // Instagram
    'WhatsApp', // WhatsApp
    'LinkedInApp', // LinkedIn
    'Snapchat', // Snapchat
    'Twitter', // Twitter
  ];
  
  const regex = new RegExp(`(${rules.join('|')})`, 'ig');
  return !!userAgent.match(regex);
};
