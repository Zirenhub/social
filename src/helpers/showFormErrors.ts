import { FieldErrors } from "react-hook-form";
import { toast } from "react-toastify";

export default function showFormErrors<T extends Record<string, any>>(formErrors: FieldErrors<T>) {
  Object.values(formErrors).forEach((error) => {
    if (error?.message) {
      toast.error(String(error.message));
    }
  });
}
