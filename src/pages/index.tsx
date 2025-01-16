import React from 'react';
import Range from '../components/Range/Range';  // Importa el componente Range

const Home = () => {
  return (
    <div>
      <h1>¡Proyecto Next.js desde cero con TypeScript!</h1>
      <Range min={1} max={100} />  {/* Aquí renderizamos el componente Range */}
    </div>
  );
};

export default Home;
