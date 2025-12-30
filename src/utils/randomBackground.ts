import boat from '../assets/boat.svg';
import fishing from '../assets/fishing.svg';
import ocean from '../assets/ocean.svg';
import yacht from '../assets/yacht.svg';

const backgrounds = [boat, fishing, ocean, yacht];

export const getRandomBackground = (): string => {
  const randomIndex = Math.floor(Math.random() * backgrounds.length);
  return backgrounds[randomIndex];
};
