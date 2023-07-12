"use client";

import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import { sendSuggestion } from "./actions";
import { Track } from "@/src/types";
import { ToastContainer, toast } from "react-toastify";

type Response = {
  tracks: {
    items: Track[];
  };
};

export default function Home() {
  const [search, setSearch] = useState("");
  const [currentTrack, setCurrentTrack] = useState<Track>();
  const [sending, setSending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<{ search: string }>();

  const { data, isValidating } = useSWR<Response>(
    search ? search : null,
    (search) =>
      fetch(
        `https://www.qobuz.com/api.json/0.2/catalog/search?app_id=${process.env.NEXT_PUBLIC_QUOBUZ_APP_ID}&query=${search}&type=tracks&limit=200`
      ).then((r) => r.json()),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const loading = isValidating || isSubmitting;

  return (
    <>
      <main className="max-w-3xl mx-auto">
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
            {data.tracks.items.map((track) => (
              <button
                className="bg-base-200/30 rounded-md p-3 flex gap-4 text-left"
                key={track.id}
                onClick={() => {
                  setCurrentTrack(track);
                  toast.dismiss();
                }}
              >
                <div className="avatar">
                  <div className="relative h-12 rounded">
                    <Image
                      src={track.album.image.small}
                      alt={track.album.title}
                      fill
                      loading="lazy"
                    />
                  </div>
                </div>
                <div>
                  <div className="line-clamp-1">{track.title}</div>
                  <div className="text-sm line-clamp-1 opacity-60">
                    {track.album.artist.name} • {track.album.title}
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : !loading ? (
          <div className="m-8 flex items-center max-w-lg mx-auto">
            <div className="hero bg-secondary text-secondary-content p-4 rounded-xl">
              <div className="hero-content text-center">
                <div className="max-w-md">
                  <h1 className="text-4xl font-bold">Hey!</h1>
                  <p className="mt-6">
                    Pour faire une suggestion c&apos;est simple : fais une
                    recherche dans la barre en haut et choisis sur un des
                    morceaux proposés.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </main>

      <dialog
        id="modal"
        className={clsx(
          "modal modal-bottom !bg-base-100/80",
          currentTrack && "modal-open"
        )}
      >
        <div className="modal-box bg-secondary text-secondary-content">
          <form
            method="dialog"
            onSubmit={() => {
              setCurrentTrack(undefined);
              setSending(false);
            }}
          >
            <button className="btn btn-circle btn-ghost absolute right-2 top-2">
              <XMarkIcon className="w-8 h-8" />
            </button>
          </form>
          {currentTrack && (
            <div className="mt-4 flex flex-col justify-center items-center gap-8 max-w-3xl mx-auto">
              <Image
                src={currentTrack.album.image.large}
                alt={currentTrack.album.title}
                width={250}
                height={250}
                className="rounded-md shadow-xl"
              />
              <div className="text-center">
                <div className="text-2xl font-bold line-clamp-2">
                  {currentTrack.title}
                </div>
                <div className="text-xl mt-2 line-clamp-2 opacity-60">
                  {currentTrack.album.artist.name} • {currentTrack.album.title}
                </div>
              </div>

              <input
                type="hidden"
                name="track"
                value={JSON.stringify(currentTrack)}
              />
              <button
                className="btn btn-lg"
                disabled={sending}
                onClick={async () => {
                  setSending(true);
                  await sendSuggestion(currentTrack);
                  setSending(false);
                  setCurrentTrack(undefined);

                  toast("C'est fait, merci !", {
                    type: "success",
                    position: toast.POSITION.BOTTOM_CENTER,
                  });
                }}
              >
                {sending ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  "Suggérer ce morceau"
                )}
              </button>
            </div>
          )}
        </div>
        <form
          method="dialog"
          className="modal-backdrop"
          onSubmit={() => {
            setCurrentTrack(undefined);
            setSending(false);
          }}
        >
          <button>close</button>
        </form>
      </dialog>
      <ToastContainer
        closeButton={
          <button className="btn btn-circle btn-ghost self-center">
            <XMarkIcon className="w-6 h-6" />
          </button>
        }
      />
    </>
  );
}
