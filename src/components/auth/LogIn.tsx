'use client';
import notifyFormErrors from '@/helpers/notifyFormErrors';
import { useLogInForm } from '@/hooks/useLogInForm';
import { useEffect } from 'react';

export default function LogIn() {
  const { register, submit, formErrors } = useLogInForm();

  useEffect(() => {
    notifyFormErrors(formErrors);
  }, [formErrors]);

  return (
    <form onSubmit={submit} className="max-w-md mx-auto">
      <h2 className="text-4xl font-bold text-center text-gray-900 tracking-wide mb-8">
        Log In
      </h2>

      <div className="space-y-6 grid grid-gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            {...register('email')}
            placeholder="you@example.com"
            className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-300 bg-white/80 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            {...register('password')}
            placeholder="********"
            autoComplete="new-password"
            className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-300 bg-white/80 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full mt-4 py-3 px-6 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold rounded-xl shadow-xl transition transform hover:scale-105 cursor-pointer"
      >
        Log In
      </button>
    </form>
  );
}
