import { convertPitchInstrumentIdToImageId } from './convertPitchInstrumentIdToImageId';

export const createImageUrlFromPitchId = (pitchId: string): string => {
    const imageId = convertPitchInstrumentIdToImageId(pitchId);
    return `https://valvio-data-bucket.s3.us-east-2.amazonaws.com/valvio_pitches/${imageId}_treble.png`;
};