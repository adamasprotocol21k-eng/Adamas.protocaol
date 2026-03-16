// Assets Preloader for ADAMAS Games
const gameAssets = {
    images: [
        'assets/card-back.png',
        'assets/chip-100.png',
        'assets/mine-bomb.png',
        'assets/diamond-icon.png'
    ],
    sounds: [
        'assets/win.mp3',
        'assets/click.mp3'
    ]
};

window.preloadAssets = () => {
    console.log("ADAMAS: Preloading tactical assets...");
    gameAssets.images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
};

// Site load hote hi background mein assets load honge
window.addEventListener('load', preloadAssets);
