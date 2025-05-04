import '../styles/globals.css';
import Head from 'next/head';
import { useEffect } from 'react';
import { TaskProvider } from '../context/TaskContext';

export default function App({ Component, pageProps }) {
  // Log when the app is mounted (useful for debugging)
  useEffect(() => {
    console.log('Todo App initialized');
  }, []);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="description" content="A powerful todo app with recurring tasks" />
      </Head>
      <TaskProvider>
        <Component {...pageProps} />
      </TaskProvider>
    </>
  );
}
