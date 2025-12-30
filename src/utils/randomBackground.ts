import boat from '../assets/boat.svg';
import boat1 from '../assets/boat1.svg';
import boat2 from '../assets/boat2.svg';
import fishing from '../assets/fishing.svg';
import ocean from '../assets/ocean.svg';
import yacht from '../assets/yacht.svg';
import surfing from '../assets/surfing.svg';
import surfing2 from '../assets/surfing2.svg';

const backgrounds = [boat, fishing, ocean, yacht,surfing,surfing2,boat2,boat1];

export const getRandomBackground = (): string => {
  const randomIndex = Math.floor(Math.random() * backgrounds.length);
  return backgrounds[randomIndex];
};
