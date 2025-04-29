import { useEffect } from "react";

import showFormErrors from "@/helpers/showFormErrors";
import { useSignUpForm } from "@/hooks/auth/useSignUpForm";
import { MONTHS } from "@/types/constants";
import LoaderPlaceholder from "../ui/LoaderPlaceholder";

interface SignUpProps {
  setLoading: (loading: boolean) => void;
}

export default function SignUp({ setLoading }: SignUpProps) {
  const { submit, register, getDayOptions, hasErrors, formMethods, isSubmitting } = useSignUpForm();

  const yearsRange = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);

  useEffect(() => {
    setLoading(isSubmitting);
  }, [isSubmitting, setLoading]);

  useEffect(() => {
    if (hasErrors) {
      showFormErrors(formMethods.formState.errors);
    }
  }, [hasErrors, formMethods]);

  return (
    <form onSubmit={submit} className="h-full flex flex-col">
      <h2 className="text-4xl font-bold text-center text-gray-900 tracking-wide mb-8">Create Account</h2>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              {...register("firstName")}
              placeholder="John"
              className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-300 bg-white/80 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              {...register("lastName")}
              placeholder="Doe"
              className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-300 bg-white/80 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            />
          </div>
        </div>

        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700">Username</label>
          <input
            {...register("username")}
            placeholder="Your username"
            className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-300 bg-white/80 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            {...register("email")}
            type="email"
            placeholder="you@example.com"
            className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-300 bg-white/80 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              {...register("password")}
              type="password"
              autoComplete="new-password"
              placeholder="********"
              className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-300 bg-white/80 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              {...register("confirmPassword")}
              type="password"
              autoComplete="new-password"
              placeholder="********"
              className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-300 bg-white/80 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Gender</label>
          <select
            {...register("gender")}
            className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-300 bg-white/80 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          >
            <option value="FEMALE">Female</option>
            <option value="MALE">Male</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
      </div>

      <p className="mt-[24px] text-sm font-medium text-gray-700">Birthday</p>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <select
            {...register("day", { setValueAs: (value) => Number(value) })}
            className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-300 bg-white/80 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          >
            {getDayOptions().map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
          <label className="block text-sm font-medium text-gray-700 text-center">Day</label>
        </div>
        <div>
          <select
            {...register("month", { setValueAs: (value) => Number(value) })}
            className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-300 bg-white/80 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          >
            {MONTHS.map((month, index) => (
              <option key={month} value={index}>
                {month}
              </option>
            ))}
          </select>
          <label className="block text-sm font-medium text-gray-700 text-center">Month</label>
        </div>
        <div>
          <select
            {...register("year", { setValueAs: (value) => Number(value) })}
            className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-300 bg-white/80 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          >
            {yearsRange.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <label className="block text-sm font-medium text-gray-700 text-center">Year</label>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full mt-auto py-3 px-6 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold rounded-xl shadow-xl transition transform hover:scale-105 flex items-center justify-center cursor-pointer"
      >
        {isSubmitting ? <LoaderPlaceholder text="Creating..." /> : "Create Account"}
      </button>
    </form>
  );
}
