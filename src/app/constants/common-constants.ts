export const ResponseTypeColor = {
  SUCCESS: 1,
  WARNING: 2,
  INFO: 3,
  ERROR: 4
}

export class Dropdown {
  id: string | undefined;
  text: string | undefined;

  constructor(id: string | undefined, text: string | undefined) {
    this.id = id;
    this.text = text;
  }
}


export type ResponseTypeColor = typeof ResponseTypeColor[keyof typeof ResponseTypeColor];