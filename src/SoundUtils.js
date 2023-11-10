const distanceMusa = new Audio("distancemusic.mp3");

export const distanceMusicPlay = (horizontalVelocityRef, mute) => {
if (!mute) {
    // Pause the music if the velocity is less than 1
    if (horizontalVelocityRef.current < 1) {
        distanceMusa.pause();
        distanceMusa.currentTime = 0;

    } else {
       
        // Only play the music if the velocity is greater than 1


        // Set the volume based on horizontalVelocityRef.current
        if (horizontalVelocityRef.current < 15) {
            distanceMusa.volume = 0;
        } else if (horizontalVelocityRef.current > 27) {
            distanceMusa.volume = 1;
        } else {
            // Linearly interpolate the volume between 10 and 25
            distanceMusa.volume = (horizontalVelocityRef.current - 15) / 27;
        }

        distanceMusa.play();
    }
} else {
    distanceMusa.volume = 0;
    distanceMusa.currentTime = 0;
    distanceMusa.pause();
}
} 