// import showFormErrors from '@/helpers/showFormErrors';
// import { useLogInForm } from '@/hooks/auth/useLogInForm';
// import { useEffect } from 'react';
// import LoaderPlaceholder from '../ui/LoaderPlaceholder';

// interface LogInProps {
//   setLoading: (loading: boolean) => void;
// }

// export default function LogIn({ setLoading }: LogInProps) {
//   const { register, submit, formMethods, hasErrors, isSubmitting } =
//     useLogInForm();

//   useEffect(() => {
//     setLoading(isSubmitting);
//   }, [isSubmitting, setLoading]);

//   useEffect(() => {
//     if (hasErrors) {
//       showFormErrors(formMethods.formState.errors);
//     }
//   }, [hasErrors, formMethods]);

//   return (
//     <form onSubmit={submit} className="max-w-md mx-auto">
//       <h2 className="text-4xl font-bold text-center text-gray-900 tracking-wide mb-8">
//         Log In
//       </h2>

//       <div className="space-y-6 grid grid-gap-6">
//         <div>
//           <label className="block text-sm font-medium text-gray-700">
//             Email
//           </label>
//           <input
//             {...register('email')}
//             placeholder="you@example.com"
//             className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-300 bg-white/80 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700">
//             Password
//           </label>
//           <input
//             type="password"
//             {...register('password')}
//             placeholder="********"
//             autoComplete="new-password"
//             className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-300 bg-white/80 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
//           />
//         </div>
//       </div>

//       <button
//         type="submit"
//         disabled={isSubmitting}
//         className="w-full mt-4 py-3 px-6 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold rounded-xl shadow-xl transition transform hover:scale-105 cursor-pointer flex items-center justify-center"
//       >
//         {isSubmitting ? <LoaderPlaceholder text="Logging in..." /> : 'Log In'}
//       </button>
//     </form>
//   );
// }

import { useEffect } from "react";

import showFormErrors from "@/helpers/showFormErrors";
import { useLogInForm } from "@/hooks/auth/useLogInForm";
import LoaderPlaceholder from "../ui/LoaderPlaceholder";

interface LogInProps {
  setLoading: (loading: boolean) => void;
}

export default function LogIn({ setLoading }: LogInProps) {
  const { register, submit, formMethods, hasErrors, isSubmitting } = useLogInForm();

  useEffect(() => {
    setLoading(isSubmitting);
  }, [isSubmitting, setLoading]);

  useEffect(() => {
    if (hasErrors) {
      showFormErrors(formMethods.formState.errors);
    }
  }, [hasErrors, formMethods]);

  return (
    <form onSubmit={submit} className="flex flex-col h-full">
      <h2 className="text-4xl font-bold text-center text-gray-900 tracking-wide mb-8">Log In</h2>

      <div className="space-y-6 grid grid-gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            {...register("email")}
            placeholder="you@example.com"
            className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-300 bg-white/80 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            {...register("password")}
            placeholder="********"
            autoComplete="new-password"
            className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-300 bg-white/80 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full mt-4 py-3 px-6 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold rounded-xl shadow-xl transition transform hover:scale-105 cursor-pointer flex items-center justify-center"
      >
        {isSubmitting ? <LoaderPlaceholder text="Logging in..." /> : "Log In"}
      </button>
    </form>
  );
}
