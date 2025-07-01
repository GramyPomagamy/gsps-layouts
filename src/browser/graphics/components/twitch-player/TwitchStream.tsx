export const TwitchStream = ({
  width,
  height,
  channel,
}: {
  width: string;
  height: string;
  channel: string;
}) => {
  return (
    <iframe
      width={width}
      height={height}
      style={{ border: 'none' }}
      src={`https://player.twitch.tv/?channel=${channel}&enableExtensions=false&muted=false&player=popout&volume=1&parent=${window.location.hostname}`}
    />
  );
};
