'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface CancelState {
  status: 'confirm' | 'loading' | 'success' | 'error';
  error?: string;
}

export default function CancelClient({ token }: { token: string }) {
  const [state, setState] = useState<CancelState>({ status: 'confirm' });

  const handleCancel = async () => {
    setState({ status: 'loading' });

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;
      const res = await fetch(`${apiBase}/reservations/cancel/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{}',
      });

      const json = await res.json();

      if (!res.ok) {
        setState({
          status: 'error',
          error: json?.error?.message || 'Cancellation failed. Please try again.',
        });
        return;
      }

      setState({ status: 'success' });
    } catch {
      setState({
        status: 'error',
        error: 'Unable to process cancellation. Please try again.',
      });
    }
  };

  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-lg"
      >
        {state.status === 'confirm' && (
          <>
            <div className="w-16 h-16 mx-auto mb-6 border border-gold/30 flex items-center justify-center">
              <svg className="w-8 h-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <h1 className="font-playfair text-3xl text-cream mb-3 tracking-wider">Cancel Reservation?</h1>
            <p className="font-playfair text-cream/70 text-sm mb-8">
              Are you sure you want to cancel your table reservation? This action cannot be undone.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleCancel}
                className="px-8 py-3 bg-red-600 text-white font-playfair text-sm uppercase tracking-[0.15em] hover:bg-red-700 transition-colors"
              >
                Yes, Cancel Reservation
              </button>
              <a
                href="/"
                className="px-8 py-3 border border-gold/50 text-gold font-playfair text-sm uppercase tracking-[0.15em] hover:border-gold hover:bg-gold/10 transition-all duration-300"
              >
                Keep My Reservation
              </a>
            </div>
          </>
        )}

        {state.status === 'loading' && (
          <>
            <div className="w-16 h-16 mx-auto mb-6 border border-gold/30 flex items-center justify-center animate-pulse">
              <svg className="w-8 h-8 text-gold animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182M2.985 19.644l3.181-3.182" />
              </svg>
            </div>
            <p className="font-playfair text-cream/70 text-sm">Cancelling your reservation...</p>
          </>
        )}

        {state.status === 'success' && (
          <>
            <div className="w-16 h-16 mx-auto mb-6 border border-gold/30 flex items-center justify-center">
              <svg className="w-8 h-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h1 className="font-playfair text-3xl text-cream mb-3 tracking-wider">Reservation Cancelled</h1>
            <p className="font-playfair text-cream/70 text-sm mb-6">
              Your table reservation has been cancelled successfully.
            </p>
            <p className="font-playfair text-cream/50 text-xs mb-8">
              A confirmation email has been sent to your inbox.
            </p>
            <a
              href="/"
              className="inline-flex items-center px-8 py-3 border border-gold/50 text-gold font-playfair text-sm uppercase tracking-[0.15em] hover:border-gold hover:bg-gold/10 transition-all duration-300"
            >
              Back to Home
            </a>
          </>
        )}

        {state.status === 'error' && (
          <>
            <div className="w-16 h-16 mx-auto mb-6 border border-red-500/30 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="font-playfair text-3xl text-cream mb-3 tracking-wider">Cancellation Failed</h1>
            <p className="font-playfair text-cream/70 text-sm mb-8">{state.error}</p>
            <a
              href="/"
              className="inline-flex items-center px-8 py-3 border border-gold/50 text-gold font-playfair text-sm uppercase tracking-[0.15em] hover:border-gold hover:bg-gold/10 transition-all duration-300"
            >
              Back to Home
            </a>
          </>
        )}
      </motion.div>
    </main>
  );
}
