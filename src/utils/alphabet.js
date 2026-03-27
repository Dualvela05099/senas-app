/**
 * Alphabet data for the dictionary tab.
 * imageUrl uses Wikimedia ASL fingerspelling images (public domain).
 * Replace with your own images if desired.
 */
export const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(letter => ({
  letter,
  // Free ASL images from Wikimedia Commons
  imageUrl: `https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Sign_language_${letter}.svg/120px-Sign_language_${letter}.svg.png`,
  description: getDescription(letter),
}));

function getDescription(letter) {
  const desc = {
    A: 'Puño cerrado con pulgar al lado',
    B: 'Cuatro dedos extendidos hacia arriba, pulgar doblado',
    C: 'Mano en forma de C',
    D: 'Índice arriba, otros dedos forman círculo con pulgar',
    E: 'Dedos doblados hacia abajo',
    F: 'Pulgar e índice forman círculo',
    G: 'Índice y pulgar apuntan a un lado',
    H: 'Índice y medio extendidos horizontalmente',
    I: 'Meñique extendido hacia arriba',
    J: 'Meñique traza una J',
    K: 'Índice y medio apuntan hacia arriba, pulgar entre ellos',
    L: 'Índice arriba, pulgar extendido (forma L)',
    M: 'Tres dedos sobre el pulgar doblado',
    N: 'Dos dedos sobre el pulgar',
    O: 'Todos los dedos forman una O',
    P: 'Como K pero apuntando hacia abajo',
    Q: 'Como G pero apuntando hacia abajo',
    R: 'Dedos índice y medio cruzados',
    S: 'Puño cerrado con pulgar sobre los dedos',
    T: 'Pulgar entre índice y medio doblados',
    U: 'Índice y medio juntos apuntando arriba',
    V: 'Índice y medio formando V',
    W: 'Índice, medio y anular extendidos',
    X: 'Índice doblado en gancho',
    Y: 'Pulgar y meñique extendidos',
    Z: 'Índice traza una Z en el aire',
  };
  return desc[letter] || '';
}
