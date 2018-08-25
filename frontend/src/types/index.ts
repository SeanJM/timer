export interface SwatchAttributes {
  value: string;
  created: number;
  id: string;
}

export interface Keys {
  control: boolean;
}

export interface ColorPicker {
  id: string;
  value: string;
  isOpen: boolean;
}

export interface Color {
  items?: ColorPicker[];
  palette?: SwatchAttributes[];
}