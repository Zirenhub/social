"use client";

import { useEffect, useState } from "react";
import { Upload, X } from "lucide-react";

import { useModal } from "@/context/ModalProvider";
import showFormErrors from "@/helpers/showFormErrors";
import { useAdditionalProfileInfoForm } from "@/hooks/profile/useAdditionalProfileInfoForm";
import { GetProfileType, ImageFileSchema } from "@/types/profile";
import Avatar from "../ui/Avatar";
import OnlineIndicator from "../ui/OnlineIndicator";
import Textarea from "../ui/Textarea";

type Props = {
  profile: GetProfileType;
};

export default function NewProfileModal({ profile }: Props) {
  const [imagePreview, setImagePreview] = useState<string | null>(profile.avatarUrl || null);

  const { register, submit, hasErrors, formMethods, avatarImageWatch, charProps } = useAdditionalProfileInfoForm();
  const { closeModal } = useModal();

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validateResult = await ImageFileSchema.spa(file);

      if (validateResult.success) {
        formMethods.setValue("avatarImageFile", e.target.files[0]);
      } else {
        formMethods.setError("avatarImageFile", {
          type: "validation",
          message: validateResult.error.issues[0].message || "Invalid file",
        });
      }
      // in case of error, error is set but if there was a pic before the error
      // pic is still the value of avatarImage
    }
  }

  useEffect(() => {
    if (avatarImageWatch) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(avatarImageWatch);
    }
  }, [avatarImageWatch]);

  useEffect(() => {
    if (formMethods.formState.isSubmitSuccessful && !hasErrors) {
      closeModal();
    }
  }, [formMethods.formState.isSubmitSuccessful, hasErrors]);

  useEffect(() => {
    showFormErrors(formMethods.formState.errors);
  }, [hasErrors, formMethods.formState.errors]);

  const removeImage = () => {
    setImagePreview(null);
    formMethods.resetField("avatarImageFile", {});
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
          Complete Your Profile
        </h2>
        <div className="relative">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Profile"
              className="w-12 h-12 rounded-full ring-2 ring-purple-500 p-0.5 object-cover"
            />
          ) : (
            <Avatar profile={profile} />
          )}
          <OnlineIndicator />
        </div>
      </div>

      {/* Content box - keep as is */}
      <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg backdrop-blur-sm mt-6">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Providing additional profile information will help us personalize your experience.
        </p>
      </div>

      {/* Form - completely wrap all form elements */}
      <form onSubmit={submit} className="mt-6 space-y-6">
        {/* Profile Image Upload - Restyled */}
        <div className="space-y-2">
          <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Profile Image
          </label>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-shrink-0">
              {imagePreview ? (
                <div className="relative w-24 h-24 rounded-full overflow-hidden group">
                  <img src={imagePreview} alt="Profile Preview" className="w-full h-full object-cover" />
                  <button
                    onClick={removeImage}
                    className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    type="button"
                  >
                    <X className="w-8 h-8 text-white" />
                  </button>
                </div>
              ) : (
                <Avatar profile={profile} className="w-24 h-24" />
              )}
            </div>
            <div className="flex flex-col justify-center">
              <label
                htmlFor="profileImage"
                className="px-4 py-2 bg-gradient-to-r from-magenta-500 to-purple-500 text-white rounded-lg cursor-pointer inline-flex items-center space-x-2 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-200 w-fit"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Image</span>
                <input
                  id="profileImage"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">JPG, PNG or GIF. Max size 2MB.</p>
            </div>
          </div>
        </div>

        {/* Bio Field - Restyled */}
        <div className="space-y-2">
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Bio
          </label>
          <Textarea
            register={register}
            name="bio"
            placeholder="Tell us something about yourself."
            charProps={charProps}
          />
        </div>

        {/* Actions - Restyled */}
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={() => closeModal()}
            className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Skip for now
          </button>
          <button
            type="submit"
            disabled={
              formMethods.formState.isSubmitting || charProps.charCount > charProps.maxChars || charProps.charCount <= 0
            }
            className="primary-button"
          >
            {formMethods.formState.isSubmitting ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}
