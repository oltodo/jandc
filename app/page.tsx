"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";

type Response = {
  tracks: {
    items: {
      id: string;
      title: string;
      album: {
        title: string;
        artist: {
          name: string;
        };
        image: {
          small: string;
          thumbnail: string;
          large: string;
        };
      };
    }[];
  };
};

export default function Home() {
  const [search, setSearch] = useState("");

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<{ search: string }>();

  const { data, isValidating } = useSWR<Response>(
    search ? search : null,
    (search) =>
      fetch(
        `https://www.qobuz.com/api.json/0.2/catalog/search?app_id=764492234&query=${search}&type=tracks&limit=200`
      ).then((r) => r.json()),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const loading = isValidating || isSubmitting;

  return (
    <main className="">
      <form
        onSubmit={handleSubmit((data) => {
          setSearch(data.search);
        })}
        className="p-4 flex gap-4 border-b-neutral border-b bg-base-100 sticky top-0 z-50"
      >
        <input
          type="text"
          placeholder="Titre, artiste, album, ..."
          className="input input-bordered input-primary w-full"
          disabled={loading}
          {...register("search", { required: true })}
        />
        <button className="btn btn-primary btn-circle" disabled={loading}>
          {loading ? (
            <span className="loading loading-spinner"></span>
          ) : (
            <MagnifyingGlassIcon className="h-6 w-6" />
          )}
        </button>
      </form>

      {data ? (
        <div className="flex flex-col gap-2 p-2">
          {data.tracks.items.map(({ album, ...track }) => (
            <button
              className="bg-neutral rounded-md p-2 flex gap-4 text-left"
              key={track.id}
            >
              <div className="avatar">
                <div className="relative h-12 rounded">
                  {album && (
                    <Image
                      src={album.image.small}
                      alt={album.title}
                      fill
                      loading="lazy"
                    />
                  )}
                </div>
              </div>
              <div>
                <div className="line-clamp-1">{track.title}</div>
                <div className="text-sm line-clamp-1 opacity-60">
                  {album.artist.name} • {album.title}
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : !loading ? (
        <div className="m-8 flex items-center">
          <div className="hero bg-secondary text-secondary-content p-4 rounded-xl">
            <div className="hero-content text-center">
              <div className="max-w-md">
                <h1 className="text-4xl font-bold">Hey!</h1>
                <p className="mt-6">
                  Pour faire une suggestion c'est simple : fais une recherche
                  dans la barre en haut et choisis sur un des morceaux proposés.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
