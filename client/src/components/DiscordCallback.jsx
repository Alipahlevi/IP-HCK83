import React, { useEffect } from "react";

const DiscordCallback = () => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const error = urlParams.get("error");

    if (error) {
      window.opener?.postMessage(
        {
          type: "DISCORD_AUTH_ERROR",
          error: error,
        },
        window.location.origin
      );
      window.close();
      return;
    }

    if (code) {
      // Exchange code for access token
      fetch("/api/users/discord-exchange", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.access_token) {
            window.opener?.postMessage(
              {
                type: "DISCORD_AUTH_SUCCESS",
                accessToken: data.access_token,
              },
              window.location.origin
            );
          } else {
            window.opener?.postMessage(
              {
                type: "DISCORD_AUTH_ERROR",
                error: "Failed to get access token",
              },
              window.location.origin
            );
          }
          window.close();
        })
        .catch((error) => {
          window.opener?.postMessage(
            {
              type: "DISCORD_AUTH_ERROR",
              error: error.message,
            },
            window.location.origin
          );
          window.close();
        });
    }
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5865F2] mx-auto"></div>
        <p className="mt-4 text-gray-600">Memproses login Discord...</p>
      </div>
    </div>
  );
};

export default DiscordCallback;
