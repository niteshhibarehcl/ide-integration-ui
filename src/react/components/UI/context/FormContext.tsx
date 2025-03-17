// FormContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

/**
 * Interface representing the structure of the form data.
 *
 * @interface FormData
 * @typedef {FormData}
 */
interface FormData {
  [feature: string]: {
    [key: string]: any;
  };
}

/**
 * Interface representing the structure of the form context.
 *
 * @interface FormContextType
 * @typedef {FormContextType}
 */
interface FormContextType {
  /** The current state of the form data. */
  formData: FormData;

  /**
   * Updates a specific key-value pair within a feature's form data.
   * @param {string} feature - The feature name (e.g., "featureA").
   * @param {string} key - The key to update within the feature's form data.
   * @param {any} value - The value to set for the specified key.
   */
  updateFeatureFormData: (feature: string, key: string, value: any) => void;

  /**
   * Resets all key-value pairs for a specific feature's form data.
   * @param {string} feature - The feature name to reset.
   */
  resetFeatureFormData: (feature: string) => void;

  /**
   * Retrieves the form data for a specific feature.
   * @param {string} feature - The feature name to retrieve.
   * @returns {{ [key: string]: any }} The form data for the specified feature.
   */
  getFeatureFormData: (feature: string) => { [key: string]: any };
}

/**
 * Create a React Context for form data management.
 * Default value is undefined to enforce provider usage.
 */
const FormContext = createContext<FormContextType | undefined>(undefined);

/**
 * FormProvider component to manage and provide form data state to child components.
 * @param {ReactNode} children - The child components that require access to the form context.
 * @returns {JSX.Element} The context provider.
 */
export const FormProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [formData, setFormData] = useState<FormData>({});

  const updateFeatureFormData = (feature: string, key: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [feature]: {
        ...prev[feature],
        [key]: value,
      },
    }));
  };

  const resetFeatureFormData = (feature: string) => {
    setFormData((prev) => ({
      ...prev,
      [feature]: {},
    }));
  };

  const getFeatureFormData = (feature: string) => {
    return formData[feature] || {};
  };

  return (
    <FormContext.Provider
      value={{
        formData,
        updateFeatureFormData,
        resetFeatureFormData,
        getFeatureFormData,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

/**
 * Custom hook to access the form context.
 * Must be used within a `FormProvider`.
 * @throws Will throw an error if used outside the `FormProvider`.
 * @returns {FormContextType} The form context.
 */
export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context)
    throw new Error("useFormContext must be used within a FormProvider");
  return context;
};
