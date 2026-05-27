"use client"; // This directive is crucial

import { AuthProvider } from '../context/AuthProvider';
// import { SseProvider } from '../sse/SseProvider';

export function Providers({ children }) {
  return (
    <AuthProvider>
      {/* <SseProvider> */}
        {children}
      {/* </SseProvider> */}
    </AuthProvider>
  );
}