import type { AppProps } from 'next/app'
import { ErrorBoundary } from 'react-error-boundary'

function ErrorFallback({error}: {error: Error}) {
  return (
    <div role="alert">
      <p>出现了一些问题：</p>
      <pre>{error.message}</pre>
    </div>
  )
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Component {...pageProps} />
    </ErrorBoundary>
  )
}

export default MyApp