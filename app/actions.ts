"use server";

import { Track } from "@/src/types";

export async function sendSuggestion({
  performer,
  album: { artist, ...album },
  ...track
}: Track) {
  if (!process.env.DISCORD_WEBHOOK) {
    return;
  }

  let title = track.title;
  if (track.version) {
    title += ` (${track.version})`;
  }

  const authorName = performer.name || artist.name;
  const minutes = `${Math.floor(track.duration / 60)}`.padStart(2, "0");
  const seconds = `${track.duration % 60}`.padStart(2, "0");

  await fetch(process.env.DISCORD_WEBHOOK, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: "Track Request",
      avatar_url: "https://jandc.vercel.app/heart.png",
      content: `Nouvelle suggestion: **${track.title}** de **${authorName}**`,

      embeds: [
        {
          title,
          url: `https://open.qobuz.com/track/${track.id}`,
          author: {
            name: authorName,
          },
          thumbnail: {
            url: album.image.large,
          },
          fields: [
            {
              name: "Album",
              value: album.title,
              inline: true,
            },
            {
              name: "Genre",
              value: album.genre.name,
              inline: true,
            },
            {
              name: "Durée",
              value: `${minutes}:${seconds}`,
              inline: true,
            },
          ],
        },
      ],
    }),
  });

  await new Promise((resolve) => setTimeout(resolve, 1000));
}
