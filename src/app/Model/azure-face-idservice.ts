export class PersonGroupPersonList {
  personId: string;
  persistedFaceIds: Array<string>;
  name: string;
  userData: string;
}

export class Persons {
  faceAttributes:faceAttributes;
  faceId: string;
  faceRectangle: faceRectangle;
}

export class IdentifyFaceResult{
  candidates :candidates[];
  faceId : string;
}

export class candidates{
  confidence:number;
  personId:string;
}
export class faceAttributes {
  age: number;
  emotion: emotion;
  gender: string;
}

export class emotion {
  anger: number;
  contempt: number;
  disgust: number;
  fear: number;
  happiness: number;
  neutral: number;
  sadness: number;
  surprise: number;
}

export class faceRectangle {
  height: number;
  left: number;
  top: number;
  width: number;
}
