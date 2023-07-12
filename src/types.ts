export type Track = {
  id: number;
  title: string;
  version: string;
  duration: number;
  performer: {
    id: number;
    name: string;
  };
  album: {
    title: string;
    artist: {
      id: number;
      name: string;
    };
    image: {
      small: string;
      thumbnail: string;
      large: string;
    };
    genre: {
      name: string;
    };
  };
};
