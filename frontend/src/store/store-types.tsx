export interface StoreDropdownElement {
  isOpen?: boolean;
  type?: string;
  value?: { [key: string]: any };
  selectedIndex?: number;
}

export interface StoreDropdown {
  [key: string]: StoreDropdownElement;
}

export interface StoreForm {
  input: {
    [key: string]: StoreFormInput
  };
  id: string;
  isValid: boolean;
  showValidation: boolean;
}

export interface StoreFormInput {
  name: string;
  value: any;
  type?: string;
  isValid?: boolean;
  errorMessage?: string | null;
}

export interface StoreAlert {
  id: string;
  type: string;
  value: any;
}