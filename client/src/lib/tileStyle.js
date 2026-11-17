const tileStyle = (sprite, scale) => ({
  backgroundImage: `url(${sprite.url})`,
  backgroundSize: `${sprite.width * scale}px ${sprite.height * scale}px`,
});

export { tileStyle };
