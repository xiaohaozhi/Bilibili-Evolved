(() =>
{
    return (settings, _) =>
    {
        const playerModes = [
            {
                name: "常规"
            },
            {
                name: "宽屏",
                action: () =>
                {
                    $(".bilibili-player-video-btn-widescreen").click();
                },
            },
            {
                name: "网页全屏",
                action: () =>
                {
                    $(".bilibili-player-video-web-fullscreen").click();
                },
            },
            {
                name: "全屏",
                action: () =>
                {
                    $(".bilibili-player-video-btn-fullscreen").click();

                },
            },
        ];
        SpinQuery.any(
            () => $(".gui-settings-dropdown:has(input[key=defaultPlayerMode])"),
            dropdown =>
            {
                const list = dropdown.find("ul");
                const input = dropdown.find("input");
                Object.values(playerModes).forEach(value =>
                {
                    $(`<li>${value.name}</li>`).appendTo(list)
                        .on("click", () =>
                        {
                            input.val(value.name).trigger("input").change();
                        });
                });
            }
        );
        new SpinQuery(
            () => $(".bilibili-player-video,.bilibili-player-video-btn-start,.bilibili-player-area"),
            it => it.length === 3 && $("video").length > 0 && $("video").prop("duration"),
            () =>
            {
                const video = document.querySelector("video");
                const info = playerModes.find(it => it.name === settings.defaultPlayerMode);
                if (info.name === "常规")
                {
                    return;
                }

                const onplay = () =>
                {
                    if (info && $("#bilibiliPlayer[class*=mode-]").length === 0)
                    {
                        info.action();
                    }
                    video.removeEventListener("play", onplay);
                };
                video.addEventListener("play", onplay);

                if (info.name === "全屏")
                {
                    const playButton = document.querySelector(".bilibili-player-video-btn-start");
                    const playerArea = document.querySelector(".bilibili-player-area");

                    const onclick = () =>
                    {
                        document.documentElement.requestFullscreen();
                        playButton.removeEventListener("click", onclick);
                        if (playerAreaClick.unbind)
                        {
                            playerAreaClick.unbind(playerArea);
                        }
                        else
                        {
                            playerArea.removeEventListener("click", playerAreaClick);
                        }
                    };
                    let playerAreaClick = onclick;

                    playButton.addEventListener("click", onclick);
                    if (settings.touchVideoPlayerDoubleTapControl)
                    {
                        playerAreaClick = new DoubleClickEvent(onclick);
                        playerAreaClick.bind(playerArea);
                    }
                    else
                    {
                        playerArea.addEventListener("click", playerAreaClick);
                    }
                }
            }
        ).start();
    };
})();