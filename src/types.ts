export namespace Qobuz {
  export interface Performer {
    id: number;
    name: string;
  }

  export interface AlbumArtist {
    id: number;
    name: string;
    slug: string;
    image: string | null;
    picture: string | null;
    albums_count: number;
    maximum_bit_depth?: number;
  }

  export interface AlbumImage {
    small: string;
    thumbnail: string;
    large: string;
  }

  export interface AlbumGenre {
    id: number;
    name: string;
    slug: string;
    color: string;
    path: number[];
  }

  export interface Album {
    title: string;
    artist: AlbumArtist;
    image: AlbumImage;
    genre: AlbumGenre;
    maximum_bit_depth?: number;
    media_count?: number;
    upc?: string;
    released_at?: number;
  }

  export interface Track {
    id: number;
    title: string;
    version: string;
    duration: number;
    performer: Performer;
    album: Album;
  }

  export type SearchResponse = {
    tracks: {
      items: Track[];
    };
  };
}
