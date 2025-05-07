import { Pitch } from '../api';

/**
 * Generates an extended list of pitches of the desired length.
 * Ensures no immediate repetitions and a highly randomized order.
 * 
 * @param pitches - The original list of pitches.
 * @param length - The desired length of the extended pitch list.
 * @returns An extended and randomized list of pitches.
 */
export const extendPitchList = (pitches: Pitch[], length: number): Pitch[] => {
  if (pitches.length === 0) return []; // Handle edge case where no pitches are provided

  const extendedList: Pitch[] = [];
  let lastPitch: Pitch | null = null;

  while (extendedList.length < length) {
    // Shuffle the pitches to randomize the order
    const shuffledPitches = [...pitches].sort(() => Math.random() - 0.5);

    for (const pitch of shuffledPitches) {
      // Ensure no immediate repetition
      if (extendedList.length > 0 && pitch.id === lastPitch?.id) continue;

      extendedList.push(pitch);
      lastPitch = pitch;

      // Stop if we've reached the desired length
      if (extendedList.length === length) break;
    }
  }

  return extendedList;
};