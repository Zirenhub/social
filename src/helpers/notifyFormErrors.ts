import { FieldErrors } from 'react-hook-form';
import { toast } from 'react-toastify';

export default function notifyFormErrors(errors: FieldErrors<any>): void {
  Object.values(errors).forEach((error) => {
    if (error?.message) {
      toast.error(String(error.message));
    }
  });
}
