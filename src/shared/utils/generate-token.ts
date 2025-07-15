export const generateToken = () => {
  let token = '';
  for (let i = 0; i < 6; i++) {
    token += Math.floor(Math.random() * 10);
  }
  return token.padStart(6, '0'); // Adiciona zeros à esquerda se necessário
};
